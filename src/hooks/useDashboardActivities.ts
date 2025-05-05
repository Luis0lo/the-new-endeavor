import { useState, useEffect, useCallback } from 'react';
import { format, startOfWeek, addDays, getYear } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { GardenActivity as GlobalGardenActivity } from "@/types/garden";

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
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pastWeekActivities, setPastWeekActivities] = useState<GardenActivity[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editActivity, setEditActivity] = useState<GardenActivity | null>(null);

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

  // Create activity
  const createActivity = async (e: React.FormEvent) => {
    e.preventDefault();
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
          title,
          description,
          scheduled_date: format(date, 'yyyy-MM-dd'),
          user_id: session.user.id,
          completed: false
        } as any);
      if (error) throw error;
      toast({
        title: "Activity created",
        description: "Your garden activity has been scheduled.",
      });
      setTitle('');
      setDescription('');
      setDialogOpen(false);
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

  const handleEditActivitySave = async (updated: any) => {
    setEditModalOpen(false);
    setEditActivity(null);
    toast({
      title: "Edit saved",
      description: "Activity updated. Please refresh to see changes.",
    });
    fetchPastWeekActivities();
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

  return {
    activities,
    date,
    setDate,
    title,
    setTitle,
    description,
    setDescription,
    loading,
    dialogOpen,
    setDialogOpen,
    createActivity,
    toggleActivityStatus,
    getPastActivitiesByDay,
    handlePastActivityClick,
    editModalProps,
  };
}
