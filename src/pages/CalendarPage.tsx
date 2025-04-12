
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import DashboardLayout from '@/components/DashboardLayout';
import { format, isSameMonth, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { GardenActivity } from '@/types/garden';
import ActivityForm from '@/components/garden/ActivityForm';
import { runSeedData } from '@/seed';

const CalendarPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
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
          // Map the Supabase data to match our GardenActivity type
          const mappedActivities: GardenActivity[] = data.map(activity => ({
            id: activity.id,
            title: activity.title,
            description: activity.description,
            date: activity.scheduled_date, // Map scheduled_date to date
            activity_time: activity.activity_time,
            completed: activity.completed,
            category_id: activity.category_id
          }));
          
          setActivities(mappedActivities);
        }
      }
    };
    
    fetchActivities();
  }, [user]);

  const handlePreviousMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
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
            activity_time: formData.time || null
          })
          .eq('id', currentActivity.id);

        if (error) throw error;
        
        // Update local state
        const updatedActivities = activities.map(activity => 
          activity.id === currentActivity.id 
            ? {
                ...activity, 
                title: formData.title, 
                description: formData.description || "", 
                date: format(formData.date, 'yyyy-MM-dd'),
                activity_time: formData.time || null
              } 
            : activity
        );
        
        setActivities(updatedActivities);
        
        toast({
          title: "Activity Updated",
          description: `"${formData.title}" has been updated in your garden calendar.`
        });
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
          description: `"${newActivity.title}" has been added to your garden calendar.`
        });
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
      const { error } = await supabase
        .from('garden_activities')
        .update({
          completed: !activity.completed
        })
        .eq('id', activity.id);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Create calendar grid
  const renderCalendarGrid = () => {
    // Get days of month for the calendar grid
    const getDaysInMonth = () => {
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      const startDate = new Date(monthStart);
      startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday
      
      const endDate = new Date(monthEnd);
      const daysToAdd = 6 - endDate.getDay(); // End on Saturday
      endDate.setDate(endDate.getDate() + daysToAdd);
      
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      
      // Group days into weeks
      const weeks = [];
      for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
      }
      
      return weeks;
    };

    const getActivitiesForDay = (day: Date) => {
      return activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return isSameDay(activityDate, day);
      });
    };

    const weeks = getDaysInMonth();
    const today = new Date();

    return (
      <div className="w-full h-full">
        <div className="grid grid-cols-7 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-2 font-semibold text-sm">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {weeks.flat().map((day, index) => {
            const isCurrentMonth = isSameMonth(day, date);
            const isToday = isSameDay(day, today);
            const dayActivities = getActivitiesForDay(day);
            const hasActivities = dayActivities.length > 0;
            
            return (
              <div 
                key={index}
                className={`relative flex flex-col p-1 min-h-[80px] border rounded-md ${
                  isCurrentMonth 
                    ? 'bg-card' 
                    : 'bg-muted/20 text-muted-foreground'
                } ${
                  isToday 
                    ? 'border-primary' 
                    : 'border-border'
                } hover:bg-accent/10 cursor-pointer transition-colors`}
                onClick={() => handleDayClick(day)}
              >
                <div className={`text-right p-1 ${
                  isToday ? 'font-bold text-primary' : ''
                }`}>
                  {format(day, 'd')}
                </div>
                
                <div className="flex-1 overflow-hidden">
                  {hasActivities && isCurrentMonth && (
                    <div className="space-y-1 text-xs">
                      {dayActivities.slice(0, 2).map(activity => (
                        <div 
                          key={activity.id}
                          className={`truncate px-1 py-0.5 rounded bg-primary/10 text-primary-foreground ${
                            activity.completed ? 'line-through opacity-50' : ''
                          }`}
                          title={activity.title}
                        >
                          {activity.title}
                        </div>
                      ))}
                      {dayActivities.length > 2 && (
                        <div className="text-xs text-muted-foreground pl-1">
                          +{dayActivities.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {isCurrentMonth && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-1 right-1 h-6 w-6 opacity-0 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddActivity(day);
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    // Filter activities for the selected day
    const dayActivities = activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return (
        activityDate.getDate() === date.getDate() &&
        activityDate.getMonth() === date.getMonth() &&
        activityDate.getFullYear() === date.getFullYear()
      );
    });

    // Sort activities by time if available
    const sortedActivities = [...dayActivities].sort((a, b) => {
      if (!a.activity_time) return 1;
      if (!b.activity_time) return -1;
      return a.activity_time.localeCompare(b.activity_time);
    });

    return (
      <div className="space-y-4">
        <div className="text-center p-2 bg-muted rounded-md">
          <h3 className="text-lg font-medium">{format(date, 'EEEE')}</h3>
          <p className="text-2xl font-bold">{format(date, 'd MMMM yyyy')}</p>
        </div>

        {sortedActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No activities scheduled for this day.</p>
            <Button 
              onClick={() => handleAddActivity(date)}
              className="mt-4"
            >
              Add Activity
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedActivities.map((activity) => (
              <div 
                key={activity.id} 
                className="p-4 border rounded-md hover:bg-accent/10"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 h-auto"
                        onClick={() => handleToggleComplete(activity)}
                      >
                        <input 
                          type="checkbox" 
                          checked={activity.completed} 
                          readOnly 
                          className="h-4 w-4"
                        />
                      </Button>
                      <h3 className={`font-medium ${activity.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {activity.title}
                      </h3>
                    </div>
                    
                    {activity.activity_time && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.activity_time}
                      </p>
                    )}
                    
                    {activity.description && (
                      <p className="mt-2 text-sm">{activity.description}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditActivity(activity)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteActivity(activity.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderWeekView = () => {
    // Implementation for week view...
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Week view coming soon...</p>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen">
        {/* Calendar header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h1 className="text-2xl font-bold">Garden Calendar</h1>
            <p className="text-muted-foreground">Track your garden activities and events</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              Logged in as: {user?.email}
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
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
            
            <Button onClick={() => handleAddActivity()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </div>
        </div>
        
        {/* Calendar content */}
        <div className="flex-1 p-4 overflow-auto">
          {view === 'month' && renderCalendarGrid()}
          {view === 'day' && renderDayView()}
          {view === 'week' && renderWeekView()}
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
