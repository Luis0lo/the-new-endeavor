import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { CheckCircle, Circle, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import DashboardLayout from '@/components/DashboardLayout';
import { Database } from '@/integrations/supabase/types';

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
      
      // Type assertion with safety checks
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
      
      // Use type assertion with an object that matches the expected schema
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
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                <span>Add Activity</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Garden Activity</DialogTitle>
              </DialogHeader>
              <form onSubmit={createActivity} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Activity Title</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="E.g., Water tomatoes" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Add notes or instructions..." 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Scheduled Date</Label>
                  <div className="border rounded-md p-2">
                    <Calendar 
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)} 
                      className="mx-auto"
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">Schedule Activity</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar 
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                className="mx-auto"
              />
            </CardContent>
          </Card>
          
          <Card className="col-span-1 md:col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle>
                Activities for {format(date, 'MMMM d, yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading activities...</div>
              ) : activities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No activities scheduled for this day.</p>
                  <p className="text-sm mt-2">Click "Add Activity" to schedule something.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => toggleActivityStatus(activity.id, activity.completed)}
                        className="h-8 w-8 shrink-0"
                      >
                        {activity.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </Button>
                      <div className="flex-1">
                        <h4 className={`font-medium ${activity.completed ? 'line-through text-muted-foreground' : ''}`}>
                          {activity.title}
                        </h4>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
