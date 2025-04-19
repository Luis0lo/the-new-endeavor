import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import DashboardLayout from '@/components/DashboardLayout';
import ActivityList from '@/components/dashboard/ActivityList';
import ActivityFormDialog from '@/components/dashboard/ActivityFormDialog';

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
  const navigate = useNavigate();
  
  // Check if user is logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/auth');
        return;
      }
      
      // Fetch activities
      fetchActivities();
    };
    
    checkSession();
  }, [navigate]);
  
  // Fetch garden activities for the current date
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
        // Transform to match our interface
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
    }
  }, [date]);

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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
