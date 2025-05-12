
import { useState, useEffect, useCallback } from 'react';
import { format, startOfWeek, addDays, getYear } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { GardenActivity as GlobalGardenActivity } from "@/types/garden";
import { ActivityFormValues } from '@/components/garden/activity-form/activity-form-schema';

type GardenActivity = Omit<GlobalGardenActivity, "date"> & { date: string };
interface Activity {
  id: string;
  title: string;
  description: string | null;
  scheduled_date: string;
  completed: boolean | null;
  status: string | null;
}

// Handles all fetching, mutation, edit logic for dashboard activities.
export function useDashboardActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [pastWeekActivities, setPastWeekActivities] = useState<GardenActivity[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editActivity, setEditActivity] = useState<GardenActivity | null>(null);
  const [addActivityModalOpen, setAddActivityModalOpen] = useState(false);

  // Session/initial load
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;
      fetchActivities();
      fetchPastWeekActivities();
    };
    checkSession();
    // eslint-disable-next-line
  }, []);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const { data: actRes, error } = await supabase
        .from('garden_activities')
        .select('*')
        .eq('scheduled_date', format(date, 'yyyy-MM-dd'))
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (actRes) {
        // Process activities to ensure status and completed fields are synchronized
        const processedActivities = actRes.map((activity: any) => {
          let completed = activity.completed;
          let status = activity.status;
          
          // Ensure completed and status are consistent
          if (status === 'done' && !completed) {
            completed = true;
          } else if (completed && status !== 'done') {
            status = 'done';
          }
          
          return {
            id: activity.id,
            title: activity.title,
            description: activity.description,
            scheduled_date: activity.scheduled_date,
            completed: completed,
            status: status
          };
        });
        
        setActivities(processedActivities);
      } else setActivities([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch activities",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [date]);

  // Past week activities for week-in-years
  const fetchPastWeekActivities = useCallback(async () => {
    try {
      const start = startOfWeek(date, { weekStartsOn: 1 });
      const days: Date[] = Array.from({ length: 7 }).map((_, i) => addDays(start, i));
      const weekDaysKeys = days.map(day => format(day, 'MM-dd'));

      const { data: userSession } = await supabase.auth.getSession();
      if (!userSession?.session) return;

      const { data, error } = await supabase
        .from('garden_activities')
        .select('*')
        .eq('user_id', userSession.session.user.id)
        .order('scheduled_date', { ascending: false });

      if (error) throw error;

      const past = (data || []).filter((activity: any) => {
        const activityDate = new Date(activity.scheduled_date);
        return (
          weekDaysKeys.includes(format(activityDate, 'MM-dd')) &&
          getYear(activityDate) !== getYear(date)
        );
      }).map((activity: any) => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        date: activity.scheduled_date,
        activity_time: activity.activity_time,
        completed: activity.completed,
        category_id: activity.category_id,
        priority: activity.priority as GlobalGardenActivity["priority"],
        status: activity.status as GlobalGardenActivity["status"],
        outcome_rating: activity.outcome_rating,
        outcome_log: activity.outcome_log,
        track: activity.track
      }));
      setPastWeekActivities(past);
    } catch {
      setPastWeekActivities([]);
    }
  }, [date]);

  // Handle add activity with new modal
  const handleAddActivity = () => {
    setAddActivityModalOpen(true);
  };

  const handleCloseAddActivity = () => {
    setAddActivityModalOpen(false);
  };

  // Handle save of new activity
  const handleSaveActivity = async (values: ActivityFormValues) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to create activities",
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await supabase
        .from('garden_activities')
        .insert({
          title: values.title,
          description: values.description,
          scheduled_date: format(values.date, 'yyyy-MM-dd'),
          activity_time: values.time,
          priority: values.priority,
          status: values.status,
          outcome_rating: values.status === "done" ? values.outcome_rating : null,
          outcome_log: values.status === "done" ? values.outcome_log : null,
          user_id: session.user.id,
          track: values.track,
          completed: values.status === "done"
        });
        
      if (error) throw error;
      
      // Handle inventory items if any
      if (values.inventory_items && values.inventory_items.length > 0) {
        // We need the ID of the newly created activity
        const { data: newActivity } = await supabase
          .from('garden_activities')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('title', values.title)
          .eq('scheduled_date', format(values.date, 'yyyy-MM-dd'))
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (newActivity && newActivity.length > 0) {
          const activityId = newActivity[0].id;
          
          // Insert inventory items
          const inventoryItems = values.inventory_items.map(item => ({
            activity_id: activityId,
            inventory_item_id: item.item_id,
            quantity: item.quantity
          }));
          
          await supabase
            .from('activity_inventory_items')
            .insert(inventoryItems);
        }
      }
      
      toast({
        title: "Activity created",
        description: "Your garden activity has been scheduled.",
      });
      
      setAddActivityModalOpen(false);
      fetchActivities();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create activity",
        variant: "destructive"
      });
    }
  };

  // Toggle activity complete/incomplete
  const toggleActivityStatus = async (id: string, currentStatus: boolean | null) => {
    try {
      // Get the current status value
      const newCompletedStatus = !currentStatus;
      
      // Update the status field to match the completed field - "done" when completed, "pending" when not
      const newStatusValue = newCompletedStatus ? "done" : "pending";
      
      const { error } = await supabase
        .from('garden_activities')
        .update({
          completed: newCompletedStatus,
          status: newStatusValue
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state to reflect the change
      setActivities(activities.map(activity =>
        activity.id === id ? { 
          ...activity, 
          completed: newCompletedStatus,
          status: newStatusValue
        } : activity
      ));
      
      toast({
        title: !currentStatus ? "Activity completed" : "Activity marked incomplete",
        description: "Activity status updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update activity",
        variant: "destructive"
      });
    }
  };

  // On date change: update activities and past week block
  useEffect(() => {
    fetchActivities();
    fetchPastWeekActivities();
  }, [date, fetchActivities, fetchPastWeekActivities]);

  // Utility for grouping past week activities
  const getPastActivitiesByDay = () => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const days: Date[] = Array.from({ length: 7 }).map((_, i) => addDays(start, i));
    const group: { [mmdd: string]: GardenActivity[] } = {};
    for (const day of days) {
      group[format(day, "MM-dd")] = [];
    }
    for (const activity of pastWeekActivities) {
      const key = format(new Date(activity.date), "MM-dd");
      if (!group[key]) group[key] = [];
      group[key].push(activity);
    }
    return { days, activitiesByDay: group };
  };

  const handlePastActivityClick = (activity: GardenActivity) => {
    setEditActivity(activity);
    setEditModalOpen(true);
  };

  const handleEditActivitySave = async (updated: ActivityFormValues) => {
    if (!editActivity) return;
    
    try {
      const { error } = await supabase
        .from('garden_activities')
        .update({
          title: updated.title,
          description: updated.description || "",
          scheduled_date: format(updated.date, 'yyyy-MM-dd'),
          activity_time: updated.time || null,
          priority: updated.priority,
          status: updated.status,
          outcome_rating: updated.status === "done" ? updated.outcome_rating : null,
          outcome_log: updated.status === "done" ? updated.outcome_log : null,
          track: updated.track,
          completed: updated.status === "done"
        })
        .eq('id', editActivity.id);
        
      if (error) throw error;
      
      // First delete existing inventory items
      await supabase
        .from('activity_inventory_items')
        .delete()
        .eq('activity_id', editActivity.id);
        
      // Then add new inventory items if any
      if (updated.inventory_items && updated.inventory_items.length > 0) {
        const inventoryItems = updated.inventory_items.map(item => ({
          activity_id: editActivity.id,
          inventory_item_id: item.item_id,
          quantity: item.quantity
        }));
        
        await supabase
          .from('activity_inventory_items')
          .insert(inventoryItems);
      }
      
      toast({
        title: "Activity updated",
        description: "Your garden activity has been updated.",
      });
      
      setEditModalOpen(false);
      setEditActivity(null);
      fetchActivities();
      fetchPastWeekActivities();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update activity",
        variant: "destructive"
      });
    }
  };

  // Edit modal props
  const editModalProps = editActivity
    ? {
        isOpen: editModalOpen,
        onClose: () => { setEditModalOpen(false); setEditActivity(null); },
        onSave: handleEditActivitySave,
        initialDate: new Date(editActivity.date),
        initialActivity: {
          ...editActivity,
          date: editActivity.date,
          description: editActivity.description || "",
        },
      }
    : null;
    
  // Add activity modal props
  const addActivityModalProps = {
    isOpen: addActivityModalOpen,
    onClose: handleCloseAddActivity,
    onSave: handleSaveActivity,
    initialDate: date
  };

  return {
    activities,
    date,
    setDate,
    loading,
    toggleActivityStatus,
    getPastActivitiesByDay,
    handlePastActivityClick,
    editModalProps,
    addActivityModalProps,
    handleAddActivity,
    handleCloseAddActivity
  };
}
