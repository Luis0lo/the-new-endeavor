import React, { useState, useEffect } from "react";
import { format, parseISO } from 'date-fns';
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GardenActivity, ViewType } from "@/types/garden";
import { User } from '@supabase/supabase-js';
import { ChevronLeft, ChevronRight, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DayView from "./DayView";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import YearView from "./YearView";
import ActivityForm from "./activity-form/ActivityForm";

interface GardenCalendarProps {
  sampleData?: GardenActivity[] | null;
  readOnly?: boolean;
}

// Sample garden activities for guest users
const sampleGuestActivities: GardenActivity[] = [
  {
    id: "g-1",
    title: "Plant Spring Vegetables",
    description: "Plant lettuce, spinach, and radishes in the raised bed.",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 5).toISOString(),
  },
  {
    id: "g-2",
    title: "Fertilize Roses",
    description: "Apply organic rose fertilizer to all rose bushes.",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 8).toISOString(),
  },
  {
    id: "g-3",
    title: "Prune Fruit Trees",
    description: "Remove dead branches and shape apple and pear trees.",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 12).toISOString(),
  },
  {
    id: "g-4",
    title: "Start Tomato Seeds",
    description: "Plant tomato seeds indoors for summer garden.",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString(),
  },
  {
    id: "g-5",
    title: "Mulch Garden Beds",
    description: "Add 2 inches of organic mulch to all garden beds.",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 18).toISOString(),
  },
  {
    id: "g-6",
    title: "Divide Perennials",
    description: "Divide and replant overcrowded perennial flowers.",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 22).toISOString(),
  },
  {
    id: "g-7", 
    title: "Garden Planning",
    description: "Review garden layout and plan summer vegetable rotation.",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 25).toISOString(),
  },
  {
    id: "g-8",
    title: "Water New Plants",
    description: "Deep water all newly planted shrubs and flowers.",
    date: new Date(new Date().getFullYear(), new Date().getMonth(), 28).toISOString(),
  }
];

const GardenCalendar: React.FC<GardenCalendarProps> = ({ sampleData = null, readOnly = false }) => {
  const [view, setView] = useState<ViewType>("month");
  const [date, setDate] = useState<Date>(new Date());
  const [activities, setActivities] = useState<GardenActivity[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formDate, setFormDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [currentActivity, setCurrentActivity] = useState<GardenActivity | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  // Check for user session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const hasGuestAccess = localStorage.getItem("guestAccessStart") !== null;
        
        if (data?.session) {
          setUserId(data.session.user.id);
          setUser(data.session.user);
          setIsGuest(false);
        } else if (hasGuestAccess) {
          setUserId(null);
          setUser(null);
          setIsGuest(true);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        toast({
          title: "Authentication Error",
          description: "There was a problem checking your login status.",
          variant: "destructive",
        });
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user.id || null);
      setUser(session?.user || null);
      setIsGuest(!session && localStorage.getItem("guestAccessStart") !== null);
    });
    
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Load activities from Supabase or use sample data for guests
  useEffect(() => {
    const fetchActivities = async () => {
      if (isGuest || readOnly) {
        // Use provided sample data or default sample data for guest users
        setActivities(sampleData || sampleGuestActivities);
        setIsLoading(false);
        return;
      }
      
      if (!userId) {
        // If no user is logged in and not a guest, use local storage for guest mode
        const storedActivities = localStorage.getItem("gardenActivities");
        if (storedActivities) {
          try {
            const parsedActivities = JSON.parse(storedActivities);
            setActivities(parsedActivities);
          } catch (error) {
            console.error("Error loading activities from localStorage", error);
          }
        } else {
          setActivities([]);
        }
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("garden_activities")
          .select("*")
          .eq("user_id", userId);

        if (error) throw error;

        // Format the data to match our GardenActivity type
        const formattedActivities: GardenActivity[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description || "",
          date: item.scheduled_date,
          activity_time: item.activity_time,
          completed: item.completed,
          category_id: item.category_id
        }));

        setActivities(formattedActivities);
      } catch (error: any) {
        console.error("Error fetching activities:", error);
        toast({
          title: "Failed to load activities",
          description: "There was a problem loading your garden activities.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [userId, isGuest, sampleData, readOnly]);

  // Save guest activities to local storage
  useEffect(() => {
    if (!userId && !isGuest && activities.length > 0) {
      localStorage.setItem("gardenActivities", JSON.stringify(activities));
    }
  }, [activities, userId, isGuest]);

  const handleAddActivity = (date: Date) => {
    if (isGuest || readOnly) {
      toast({
        title: "Guest Mode",
        description: "Create an account to add your own garden activities!",
        variant: "default",
      });
      return;
    }
    
    setFormDate(date);
    setCurrentActivity(null);
    setIsEditing(false);
    setIsFormOpen(true);
  };

  const handleEditActivity = (activity: GardenActivity) => {
    if (isGuest || readOnly) {
      toast({
        title: "Guest Mode",
        description: "Create an account to edit garden activities!",
        variant: "default",
      });
      return;
    }
    
    setCurrentActivity(activity);
    setFormDate(new Date(activity.date));
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (isGuest || readOnly) {
      toast({
        title: "Guest Mode",
        description: "Create an account to delete garden activities!",
        variant: "default",
      });
      return;
    }
    
    if (userId) {
      // Delete from Supabase
      try {
        const { error } = await supabase
          .from("garden_activities")
          .delete()
          .eq("id", activityId);

        if (error) throw error;
        
        setActivities(activities.filter(activity => activity.id !== activityId));
        
        toast({
          title: "Activity Deleted",
          description: "The garden activity has been removed from your calendar.",
        });
      } catch (error: any) {
        toast({
          title: "Failed to delete activity",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      // Guest mode - delete from local state
      setActivities(activities.filter(activity => activity.id !== activityId));
      
      toast({
        title: "Activity Deleted",
        description: "The garden activity has been removed from your calendar.",
      });
    }
  };

  const handleSaveActivity = async (formData: any) => {
    if (isGuest) {
      toast({
        title: "Guest Mode",
        description: "Create an account to save garden activities!",
        variant: "default",
      });
      return;
    }
    
    const dateTime = new Date(formData.date);
    
    if (formData.time) {
      const [hours, minutes] = formData.time.split(":");
      dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    }
    
    const activityDate = dateTime.toISOString();
    
    if (isEditing && currentActivity) {
      // Update existing activity
      if (userId) {
        // Update in Supabase
        try {
          const { error } = await supabase
            .from("garden_activities")
            .update({
              title: formData.title,
              description: formData.description || "",
              scheduled_date: formData.date,
              activity_time: formData.time || null
            })
            .eq("id", currentActivity.id);

          if (error) throw error;
          
          // Update local state
          const updatedActivities = activities.map(activity => 
            activity.id === currentActivity.id 
              ? {...activity, title: formData.title, description: formData.description || "", date: formData.date, activity_time: formData.time || null} 
              : activity
          );
          
          setActivities(updatedActivities);
          
          toast({
            title: "Activity Updated",
            description: `"${formData.title}" has been updated in your garden calendar.`,
          });
        } catch (error: any) {
          toast({
            title: "Failed to update activity",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        // Guest mode - update in local state
        const updatedActivities = activities.map(activity => 
          activity.id === currentActivity.id 
            ? {...activity, title: formData.title, description: formData.description || "", date: formData.date, activity_time: formData.time || null} 
            : activity
        );
        
        setActivities(updatedActivities);
        
        toast({
          title: "Activity Updated",
          description: `"${formData.title}" has been updated in your garden calendar.`,
        });
      }
    } else {
      // Create new activity
      if (userId) {
        // Save to Supabase
        try {
          const { data, error } = await supabase
            .from("garden_activities")
            .insert({
              title: formData.title,
              description: formData.description || "",
              scheduled_date: formData.date,
              activity_time: formData.time || null,
              user_id: userId,
              completed: false
            })
            .select();

          if (error) throw error;

          const newActivity: GardenActivity = {
            id: data[0].id,
            title: data[0].title,
            description: data[0].description || "",
            date: data[0].scheduled_date,
            activity_time: data[0].activity_time,
            completed: false
          };
          
          setActivities([...activities, newActivity]);
          
          toast({
            title: "Activity Added",
            description: `"${newActivity.title}" has been added to your garden calendar.`,
          });
        } catch (error: any) {
          toast({
            title: "Failed to add activity",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        // Guest mode - save to local state
        const newActivity: GardenActivity = {
          id: Date.now().toString(),
          title: formData.title,
          description: formData.description || "",
          date: formData.date,
          activity_time: formData.time || null,
          completed: false
        };
        
        setActivities([...activities, newActivity]);
        
        toast({
          title: "Activity Added",
          description: `"${newActivity.title}" has been added to your garden calendar.`,
        });
      }
    }
  };

  const handleToggleComplete = async (activity: GardenActivity) => {
    if (isGuest || readOnly) {
      toast({
        title: "Guest Mode",
        description: "Create an account to mark activities as completed!",
        variant: "default",
      });
      return;
    }
    
    if (userId) {
      // Update in Supabase
      try {
        const { error } = await supabase
          .from("garden_activities")
          .update({
            completed: !activity.completed
          })
          .eq("id", activity.id);

        if (error) throw error;
        
        // Update local state
        const updatedActivities = activities.map(act => 
          act.id === activity.id 
            ? {...act, completed: !activity.completed} 
            : act
        );
        
        setActivities(updatedActivities);
        
        toast({
          title: activity.completed ? "Activity Marked Incomplete" : "Activity Completed",
          description: `"${activity.title}" has been updated.`,
        });
      } catch (error: any) {
        toast({
          title: "Failed to update activity",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      // Guest mode - update in local state
      const updatedActivities = activities.map(act => 
        act.id === activity.id 
          ? {...act, completed: !activity.completed} 
          : act
      );
      
      setActivities(updatedActivities);
      
      toast({
        title: activity.completed ? "Activity Marked Incomplete" : "Activity Completed",
        description: `"${activity.title}" has been updated.`,
      });
    }
  };

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
  };

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
  };

  const handleSelectDay = (day: Date) => {
    setDate(day);
    setView("day");
  };

  const handleSelectMonth = (month: Date) => {
    setDate(month);
    setView("month");
  };

  const handlePreviousMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - 1);
    setDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);
    setDate(newDate);
  };

  const goToToday = () => {
    setDate(new Date());
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  const renderView = () => {
    switch (view) {
      case "day":
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
      case "week":
        return (
          <WeekView
            date={date}
            activities={activities}
            onAddActivity={handleAddActivity}
            onSelectDay={handleSelectDay}
          />
        );
      case "month":
        return (
          <MonthView
            date={date}
            activities={activities}
            onAddActivity={handleAddActivity}
            onSelectDay={handleSelectDay}
          />
        );
      case "year":
        return (
          <YearView
            date={date}
            activities={activities}
            onSelectMonth={handleSelectMonth}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Calendar header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold">Garden Calendar</h1>
          <p className="text-muted-foreground">Track your garden activities and events</p>
        </div>
        
        <div className="flex items-center gap-2">
          {user && (
            <>
              <div className="text-sm text-muted-foreground">
                Logged in as: {user.email}
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Calendar toolbar */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <Button onClick={goToToday} variant="outline" size="sm">
            Today
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold ml-2">
            {format(date, 'MMMM yyyy')}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={view} onValueChange={(v: ViewType) => handleViewChange(v)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="year">Year</SelectItem>
            </SelectContent>
          </Select>
          
          {!readOnly && (
            <Button onClick={() => handleAddActivity(date)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          )}
        </div>
      </div>
      
      {/* Calendar content */}
      <div className="flex-1 p-4 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p>Loading calendar activities...</p>
          </div>
        ) : (
          renderView()
        )}
      </div>
      
      <ActivityForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveActivity}
        initialDate={formDate}
        initialActivity={currentActivity}
      />
    </div>
  );
};

export default GardenCalendar;
