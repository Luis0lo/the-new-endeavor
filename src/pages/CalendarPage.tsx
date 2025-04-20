import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import DashboardLayout from '@/components/DashboardLayout';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { GardenActivity } from '@/types/garden';
import ActivityForm from '@/components/garden/activity-form/ActivityForm';
import { runSeedData } from '@/seed';
import WeekView from '@/components/garden/WeekView';
import DayView from '@/components/garden/DayView';
import MonthView from '@/components/garden/MonthView';

const CalendarPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('week');
  const [activities, setActivities] = useState<GardenActivity[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<GardenActivity | null>(null);
  const [formDate, setFormDate] = useState<Date>(new Date());
  const [dataSeeded, setDataSeeded] = useState(false);
  
  // Check if user is logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
        
        // Run seed data if not already done
        if (!dataSeeded) {
          await runSeedData();
          setDataSeeded(true);
        }
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && !dataSeeded) {
          runSeedData().then(() => setDataSeeded(true));
        }
        setUser(session?.user ?? null);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [dataSeeded]);

  // Fetch activities from Supabase
  useEffect(() => {
    const fetchActivities = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('garden_activities')
          .select('*')
          .eq('user_id', user.id);
          
        if (!error && data) {
          // Map the Supabase data to match our GardenActivity type with proper type handling
          const mappedActivities: GardenActivity[] = data.map(activity => ({
            id: activity.id,
            title: activity.title,
            description: activity.description || "",
            date: activity.scheduled_date, // Map scheduled_date to date
            activity_time: activity.activity_time,
            completed: activity.completed || false,
            category_id: activity.category_id,
            priority: (activity.priority as "high" | "normal" | "low") || "normal",
            status: (activity.status as "pending" | "in_progress" | "done") || "pending",
            outcome_rating: activity.outcome_rating,
            outcome_log: activity.outcome_log
          }));
          
          setActivities(mappedActivities);
        }
      }
    };
    
    fetchActivities();
  }, [user]);

  const handlePrevious = () => {
    if (view === 'month') {
      setDate(subMonths(date, 1));
    } else if (view === 'week') {
      setDate(subWeeks(date, 1));
    } else {
      setDate(subDays(date, 1));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setDate(addMonths(date, 1));
    } else if (view === 'week') {
      setDate(addWeeks(date, 1));
    } else {
      setDate(addDays(date, 1));
    }
  };

  const goToToday = () => {
    setDate(new Date());
  };

  const handleAddActivity = (selectedDate: Date = date) => {
    setFormDate(selectedDate);
    setCurrentActivity(null);
    setIsFormOpen(true);
  };

  const handleEditActivity = (activity: GardenActivity) => {
    setCurrentActivity(activity);
    setFormDate(new Date(activity.date));
    setIsFormOpen(true);
  };

  const handleDeleteActivity = async (activityId: string) => {
    try {
      const { error } = await supabase
        .from('garden_activities')
        .delete()
        .eq('id', activityId);

      if (error) throw error;
      
      setActivities(activities.filter(activity => activity.id !== activityId));
      
      toast({
        title: "Activity Deleted",
        description: "The garden activity has been removed from your calendar."
      });
    } catch (error: any) {
      toast({
        title: "Failed to delete activity",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSaveActivity = async (formData: any) => {
    if (currentActivity) {
      // Update existing activity
      try {
        const { error } = await supabase
          .from('garden_activities')
          .update({
            title: formData.title,
            description: formData.description || "",
            scheduled_date: format(formData.date, 'yyyy-MM-dd'),
            activity_time: formData.time || null,
            priority: formData.priority as "high" | "normal" | "low" || "normal",
            status: formData.status as "pending" | "in_progress" | "done" || "pending",
            track: formData.track,
            outcome_rating: formData.status === "done" ? formData.outcome_rating : null,
            outcome_log: formData.status === "done" ? formData.outcome_log : null
          })
          .eq('id', currentActivity.id);

        if (error) throw error;
        
        // Update local state with proper type casting
        const updatedActivities = activities.map(activity => 
          activity.id === currentActivity.id 
            ? {
                ...activity, 
                title: formData.title, 
                description: formData.description || "", 
                date: format(formData.date, 'yyyy-MM-dd'),
                activity_time: formData.time || null,
                priority: formData.priority as "high" | "normal" | "low" || "normal",
                status: formData.status as "pending" | "in_progress" | "done" || "pending",
                track: formData.track,
                outcome_rating: formData.status === "done" ? formData.outcome_rating : null,
                outcome_log: formData.status === "done" ? formData.outcome_log : null
              } 
            : activity
        );
        
        setActivities(updatedActivities);
        
        toast({
          title: "Activity Updated",
          description: `"${formData.title}" has been updated in your garden calendar.`
        });
        
        // Close the form after saving
        setIsFormOpen(false);
      } catch (error: any) {
        toast({
          title: "Failed to update activity",
          description: error.message,
          variant: "destructive"
        });
      }
    } else {
      // Create new activity
      try {
        const { data, error } = await supabase
          .from('garden_activities')
          .insert({
            title: formData.title,
            description: formData.description || "",
            scheduled_date: format(formData.date, 'yyyy-MM-dd'),
            activity_time: formData.time || null,
            user_id: user?.id,
            completed: false,
            priority: formData.priority as "high" | "normal" | "low" || "normal",
            status: formData.status as "pending" | "in_progress" | "done" || "pending",
            outcome_rating: formData.status === "done" ? formData.outcome_rating : null,
            outcome_log: formData.status === "done" ? formData.outcome_log : null,
            track: formData.track
          })
          .select();

        if (error) throw error;

        const newActivity: GardenActivity = {
          id: data[0].id,
          title: data[0].title,
          description: data[0].description || "",
          date: data[0].scheduled_date,
          activity_time: data[0].activity_time,
          completed: false,
          priority: data[0].priority as "high" | "normal" | "low",
          status: data[0].status as "pending" | "in_progress" | "done",
          outcome_rating: data[0].outcome_rating,
          outcome_log: data[0].outcome_log,
          track: data[0].track
        };
        
        setActivities([...activities, newActivity]);
        
        toast({
          title: "Activity Added",
          description: `"${newActivity.title}" has been added to your garden calendar.`
        });
        
        // Close the form after saving
        setIsFormOpen(false);
      } catch (error: any) {
        toast({
          title: "Failed to add activity",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const handleToggleComplete = async (activity: GardenActivity) => {
    try {
      // Update the status to "done" when completed, or back to "pending" when marked incomplete
      const newStatus = !activity.completed ? "done" as const : "pending" as const;
      
      const { error } = await supabase
        .from('garden_activities')
        .update({
          completed: !activity.completed,
          status: newStatus
        })
        .eq('id', activity.id);

      if (error) throw error;
      
      // Update local state
      const updatedActivities = activities.map(act => 
        act.id === activity.id 
          ? {...act, completed: !activity.completed, status: newStatus} 
          : act
      );
      
      setActivities(updatedActivities);
      
      toast({
        title: activity.completed ? "Activity Marked Incomplete" : "Activity Completed",
        description: `"${activity.title}" has been updated.`
      });
    } catch (error: any) {
      toast({
        title: "Failed to update activity",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDayClick = (selectedDate: Date) => {
    setDate(selectedDate);
    setView('day');
  };

  // Render the current view
  const renderView = () => {
    switch (view) {
      case 'month':
        return (
          <MonthView
            date={date}
            activities={activities}
            onAddActivity={handleAddActivity}
            onSelectDay={handleDayClick}
          />
        );
      case 'week':
        return (
          <WeekView
            date={date}
            activities={activities}
            onAddActivity={handleAddActivity}
            onSelectDay={handleDayClick}
          />
        );
      case 'day':
        return (
          <DayView
            date={date}
            activities={activities}
            onAddActivity={handleAddActivity}
            onEditActivity={handleEditActivity}
            onDeleteActivity={handleDeleteActivity}
            onToggleComplete={handleToggleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen">
        {/* Calendar header */}
        <div className="flex flex-col p-4 border-b space-y-2">
          <div>
            <h1 className="text-2xl font-bold">Garden Calendar</h1>
            <p className="text-muted-foreground">Track your garden activities and events</p>
          </div>
        </div>
        
        {/* Calendar toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-b">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button onClick={goToToday} variant="outline" size="sm">
              Today
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold ml-2">
              {format(date, view === 'day' ? 'MMMM d, yyyy' : 'MMMM yyyy')}
            </h2>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select value={view} onValueChange={(v: 'month' | 'week' | 'day') => setView(v)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Calendar content */}
        <div className="flex-1 p-4 overflow-auto">
          {renderView()}
        </div>
      </div>

      <ActivityForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveActivity}
        initialDate={formDate}
        initialActivity={currentActivity}
      />
    </DashboardLayout>
  );
};

export default CalendarPage;
