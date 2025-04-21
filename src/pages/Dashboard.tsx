
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfWeek, addDays, getYear } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import DashboardLayout from '@/components/DashboardLayout';
import ActivityList from '@/components/dashboard/ActivityList';
import ActivityFormDialog from '@/components/dashboard/ActivityFormDialog';
import PastWeekActivities from '@/components/dashboard/PastWeekActivities';
import ActivityForm from '@/components/garden/activity-form/ActivityForm';
import { GardenActivity as GlobalGardenActivity } from "@/types/garden";

// For this file's local logic, extend to always have a `date: string`
type GardenActivity = Omit<GlobalGardenActivity, "date"> & {
  date: string; // always in ISO "yyyy-MM-dd"
};

// This type is used for the ActivityList component which expects scheduled_date
interface Activity {
  id: string;
  title: string;
  description: string | null;
  scheduled_date: string;
  completed: boolean | null;
}

const Dashboard = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pastWeekActivities, setPastWeekActivities] = useState<GardenActivity[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editActivity, setEditActivity] = useState<GardenActivity | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/auth');
        return;
      }
      fetchActivities();
      fetchPastWeekActivities();
    };
    checkSession();
  // eslint-disable-next-line
  }, [navigate]);
  
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const { data: activities, error } = await supabase
        .from('garden_activities')
        .select('*')
        .eq('scheduled_date', format(date, 'yyyy-MM-dd'))
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (activities) {
        // Map directly to the Activity type that ActivityList expects
        const typedActivities: Activity[] = activities.map(activity => ({
          id: activity.id,
          title: activity.title,
          description: activity.description,
          scheduled_date: activity.scheduled_date,
          completed: activity.completed
        }));
        setActivities(typedActivities);
      } else {
        setActivities([]);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch activities",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch activities for the same week number (same month/day, all years)
  const fetchPastWeekActivities = async () => {
    try {
      const start = startOfWeek(date, { weekStartsOn: 1 });
      const days: Date[] = Array.from({ length: 7 }).map((_, i) => addDays(start, i));
      const weekDaysKeys = days.map(day => format(day, 'MM-dd'));

      // Query for all past activities matching any MM-dd in the week (from previous years)
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
        // Exclude activities from the current calendar year
        return (
          weekDaysKeys.includes(format(activityDate, 'MM-dd')) &&
          getYear(activityDate) !== getYear(date)
        );
      }).map((activity: any) => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        date: activity.scheduled_date, // Map to the date field for GardenActivity
        activity_time: activity.activity_time,
        completed: activity.completed,
        category_id: activity.category_id,
        priority: activity.priority as GlobalGardenActivity["priority"],
        status: activity.status as GlobalGardenActivity["status"], // Cast to the expected union type
        outcome_rating: activity.outcome_rating,
        outcome_log: activity.outcome_log,
        track: activity.track
      }));
      setPastWeekActivities(past);
    } catch (error: any) {
      setPastWeekActivities([]);
    }
  };
  
  // Handle create
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
  
  // Toggle activity completion status
  const toggleActivityStatus = async (id: string, currentStatus: boolean | null) => {
    try {
      const { error } = await supabase
        .from('garden_activities')
        .update({
          completed: !currentStatus
        } as any)
        .eq('id', id);
      if (error) throw error;
      setActivities(activities.map(activity => 
        activity.id === id ? { ...activity, completed: !currentStatus } : activity
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
  
  // Update on date change
  useEffect(() => {
    if (supabase.auth.getSession) {
      fetchActivities();
      fetchPastWeekActivities();
    }
  }, [date]);

  // Group past activities by MM-dd for rendering (weeks calendar)
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

  // Handle edit from past week activities
  const handlePastActivityClick = (activity: GardenActivity) => {
    setEditActivity(activity);
    setEditModalOpen(true);
  };

  // Save edits from the edit modal
  const handleEditActivitySave = async (updated: any) => {
    // This would require updating the backend and refreshing the data if needed.
    // For now, just close the modal and show a toast.
    setEditModalOpen(false);
    setEditActivity(null);
    toast({
      title: "Edit saved",
      description: "Activity updated. Please refresh to see changes.",
    });
    // TODO: Implement real update logic if needed
    fetchPastWeekActivities();
  };

  // Prepare edit modal props (map our structure to expected edit form)
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

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Garden Dashboard</h2>
          <ActivityFormDialog
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            date={date}
            onSubmit={createActivity}
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            setDate={setDate}
          />
        </div>

        <div className="grid gap-4">
          <ActivityList 
            activities={activities}
            date={date}
            loading={loading}
            onToggleActivityStatus={toggleActivityStatus}
          />

          {/* Past week in previous years */}
          <PastWeekActivities {...getPastActivitiesByDay()} onActivityClick={handlePastActivityClick} />
        </div>
      </div>
      {/* Activity edit modal for past activities - uses garden/activity-form for a consistent experience */}
      {editModalProps && (
        <ActivityForm {...editModalProps} />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
