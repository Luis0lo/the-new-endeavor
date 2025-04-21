import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, startOfWeek, addDays, getYear } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import DashboardLayout from '@/components/DashboardLayout';
import ActivityList from '@/components/dashboard/ActivityList';
import ActivityFormDialog from '@/components/dashboard/ActivityFormDialog';
import PastWeekActivities from '@/components/dashboard/PastWeekActivities';

interface GardenActivity {
  id: string;
  title: string;
  description: string | null;
  scheduled_date: string;
  completed: boolean | null;
}

const Dashboard = () => {
  const [activities, setActivities] = useState<GardenActivity[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pastWeekActivities, setPastWeekActivities] = useState<GardenActivity[]>([]);
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
        const typedActivities: GardenActivity[] = activities.map(activity => ({
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

      // Create array of 'MM-dd'
      const weekDaysKeys = days.map(day => format(day, 'MM-dd'));

      // Query for all past activities matching any MM-dd in the week (from previous years)
      // Get all records for the user except for the current year!
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
      });
      setPastWeekActivities(past);
    } catch (error: any) {
      setPastWeekActivities([]);
    }
  };
  
  // Create a new activity
  const createActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get user session
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
      
      // Refresh activities
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
      
      // Update local state
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
  
  // Handle date change
  useEffect(() => {
    if (supabase.auth.getSession) {
      fetchActivities();
      fetchPastWeekActivities();
    }
  }, [date]);

  // Group past activities by MM-dd for rendering
  const getPastActivitiesByDay = () => {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const days: Date[] = Array.from({ length: 7 }).map((_, i) => addDays(start, i));
    const group: { [mmdd: string]: GardenActivity[] } = {};
    for (const day of days) {
      group[format(day, "MM-dd")] = [];
    }
    for (const activity of pastWeekActivities) {
      const key = format(new Date(activity.scheduled_date), "MM-dd");
      if (!group[key]) group[key] = [];
      group[key].push(activity);
    }
    return { days, activitiesByDay: group };
  };

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
          <PastWeekActivities {...getPastActivitiesByDay()} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
