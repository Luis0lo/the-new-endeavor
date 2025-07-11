import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import DashboardLayout from '@/components/DashboardLayout';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, parseISO } from 'date-fns';
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
import { useDefaultCalendarView, DefaultCalendarView } from '@/hooks/use-default-calendar-view';

const CalendarPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const { defaultCalendarView } = useDefaultCalendarView();
  const [view, setView] = useState<DefaultCalendarView>(defaultCalendarView);
  const [activities, setActivities] = useState<GardenActivity[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<GardenActivity | null>(null);
  const [formDate, setFormDate] = useState<Date>(new Date());
  const [dataSeeded, setDataSeeded] = useState(false);
  
  // Initialize date and view from URL parameters
  useEffect(() => {
    const urlDate = searchParams.get('date');
    const urlView = searchParams.get('view') as DefaultCalendarView;
    
    if (urlDate) {
      try {
        const parsedDate = parseISO(urlDate);
        if (!isNaN(parsedDate.getTime())) {
          setDate(parsedDate);
        }
      } catch (error) {
        console.error('Error parsing date from URL:', error);
      }
    }
    
    if (urlView && ['month', 'week', 'day'].includes(urlView)) {
      setView(urlView);
    } else {
      setView(defaultCalendarView);
    }
  }, [searchParams, defaultCalendarView]);
  
  // Use the default calendar view when it loads (only if no URL view is specified)
  useEffect(() => {
    if (!searchParams.get('view')) {
      setView(defaultCalendarView);
    }
  }, [defaultCalendarView, searchParams]);
  
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
            outcome_log: activity.outcome_log,
            track: activity.track,
            action: (activity.action as "plant" | "transplant" | "seed" | "harvest" | "water" | "fertilize" | "prune" | "other") || "other",
            parent_activity_id: activity.parent_activity_id,
            has_children: activity.has_children,
            activity_order: activity.activity_order,
            depth_level: activity.depth_level
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
      // First delete any associated inventory items
      await supabase
        .from('activity_inventory_items')
        .delete()
        .eq('activity_id', activityId);
      
      // Then delete the activity
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
    try {
      if (currentActivity) {
        // Update existing activity
        const { error } = await supabase
          .from("garden_activities")
          .update({
            title: formData.title,
            description: formData.description || "",
            scheduled_date: format(formData.date, 'yyyy-MM-dd'),
            activity_time: formData.time || null,
            priority: formData.priority as "high" | "normal" | "low" || "normal",
            status: formData.status as "pending" | "in_progress" | "done" || "pending",
            track: formData.track,
            action: formData.action as "plant" | "transplant" | "seed" | "harvest" | "water" | "fertilize" | "prune" | "other",
            outcome_rating: formData.status === "done" ? formData.outcome_rating : null,
            outcome_log: formData.status === "done" ? formData.outcome_log : null
            // Keep existing hierarchy fields unchanged when editing
          })
          .eq('id', currentActivity.id);

        if (error) throw error;
        
        // First, delete existing inventory items for this activity
        await supabase
          .from('activity_inventory_items')
          .delete()
          .eq('activity_id', currentActivity.id);
        
        // Then add new inventory items
        if (formData.inventory_items && formData.inventory_items.length > 0) {
          const inventoryItemsToInsert = formData.inventory_items.map((item: any) => ({
            activity_id: currentActivity.id,
            inventory_item_id: item.item_id,
            quantity: item.quantity
          }));
          
          const { error: insertError } = await supabase
            .from('activity_inventory_items')
            .insert(inventoryItemsToInsert);
            
          if (insertError) {
            console.error("Error inserting inventory items:", insertError);
          }
        }
        
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
                action: formData.action as "plant" | "transplant" | "seed" | "harvest" | "water" | "fertilize" | "prune" | "other",
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
      } else {
        // Create new activity
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
            action: formData.action as "plant" | "transplant" | "seed" | "harvest" | "water" | "fertilize" | "prune" | "other",
            outcome_rating: formData.status === "done" ? formData.outcome_rating : null,
            outcome_log: formData.status === "done" ? formData.outcome_log : null,
            track: formData.track,
            // Initialize hierarchy fields for new root activities
            parent_activity_id: null,
            has_children: false,
            activity_order: 0,
            depth_level: 0
          })
          .select();

        if (error) throw error;

        if (data && data[0]) {
          const newActivityId = data[0].id;
          
          // Add inventory items if any
          if (formData.inventory_items && formData.inventory_items.length > 0) {
            const inventoryItemsToInsert = formData.inventory_items.map((item: any) => ({
              activity_id: newActivityId,
              inventory_item_id: item.item_id,
              quantity: item.quantity
            }));
            
            const { error: insertError } = await supabase
              .from('activity_inventory_items')
              .insert(inventoryItemsToInsert);
              
            if (insertError) {
              console.error("Error inserting inventory items:", insertError);
            }
          }
          
          const newActivity: GardenActivity = {
            id: newActivityId,
            title: data[0].title,
            description: data[0].description || "",
            date: data[0].scheduled_date,
            activity_time: data[0].activity_time,
            completed: false,
            priority: data[0].priority as "high" | "normal" | "low",
            status: data[0].status as "pending" | "in_progress" | "done",
            action: data[0].action as "plant" | "transplant" | "seed" | "harvest" | "water" | "fertilize" | "prune" | "other",
            outcome_rating: data[0].outcome_rating,
            outcome_log: data[0].outcome_log,
            track: data[0].track,
            parent_activity_id: data[0].parent_activity_id,
            has_children: data[0].has_children,
            activity_order: data[0].activity_order,
            depth_level: data[0].depth_level
          };
          
          setActivities([...activities, newActivity]);
          
          toast({
            title: "Activity Added",
            description: `"${newActivity.title}" has been added to your garden calendar.`
          });
        }
      }
      
      // Close the form after saving
      setIsFormOpen(false);
    } catch (error: any) {
      toast({
        title: "Failed to save activity",
        description: error.message,
        variant: "destructive"
      });
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
        <div className="p-4">
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">Track your garden activities and events</p>
        </div>
        
        {/* Calendar toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4">
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
            <Select value={view} onValueChange={(v: DefaultCalendarView) => setView(v)}>
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
