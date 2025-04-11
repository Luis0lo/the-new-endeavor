import React, { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addDays, subDays, parse, parseISO, addMonths, subMonths, addYears, subYears } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from '@/components/DashboardLayout';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface GardenActivity {
  id: string;
  title: string;
  description: string | null;
  scheduled_date: string;
  activity_time: string | null;
  completed: boolean | null;
  category_id: string | null;
}

interface ActivityCategory {
  id: string;
  name: string;
  color: string | null;
}

function sortActivitiesByTime(activities: GardenActivity[]): GardenActivity[] {
  return [...activities].sort((a, b) => {
    if (!a.activity_time) return 1;
    if (!b.activity_time) return -1;
    return a.activity_time.localeCompare(b.activity_time);
  });
}

const CalendarPage = () => {
  const [activeView, setActiveView] = useState<"day" | "week" | "month" | "year">("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [activities, setActivities] = useState<GardenActivity[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityTime, setActivityTime] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [categories, setCategories] = useState<ActivityCategory[]>([]);
  const [user, setUser] = useState<User | null>(null);
  
  // Load user and set default view
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
        
        // Get user's calendar default view
        const { data: userData } = await supabase
          .from('profiles')
          .select('calendar_default_view')
          .eq('id', data.session.user.id)
          .single();
          
        if (userData && userData.calendar_default_view) {
          setActiveView(userData.calendar_default_view as "day" | "week" | "month" | "year");
        }
      }
    };
    
    checkSession();
  }, []);
  
  // Fetch activity categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('activity_categories')
          .select('*')
          .order('name');
          
        if (error) throw error;
        
        if (data) {
          setCategories(data as ActivityCategory[]);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch activity categories",
          variant: "destructive"
        });
      }
    };
    
    fetchCategories();
  }, []);
  
  // Fetch activities for the current view
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      
      try {
        let startDate: Date, endDate: Date;
        
        if (activeView === 'day') {
          startDate = new Date(currentDate);
          endDate = new Date(currentDate);
        } else if (activeView === 'week') {
          startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
          endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
        } else if (activeView === 'month') {
          startDate = startOfMonth(currentDate);
          endDate = endOfMonth(currentDate);
        } else { // year
          startDate = new Date(currentDate.getFullYear(), 0, 1);
          endDate = new Date(currentDate.getFullYear(), 11, 31);
        }
        
        const formattedStartDate = format(startDate, 'yyyy-MM-dd');
        const formattedEndDate = format(endDate, 'yyyy-MM-dd');
        
        const { data, error } = await supabase
          .from('garden_activities')
          .select('*, activity_categories(*)')
          .gte('scheduled_date', formattedStartDate)
          .lte('scheduled_date', formattedEndDate)
          .order('scheduled_date');
          
        if (error) throw error;
        
        if (data) {
          setActivities(data as any);
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
    
    if (user) {
      fetchActivities();
    }
  }, [activeView, currentDate, user]);
  
  // Save user's preferred calendar view
  const saveUserViewPreference = async (view: string) => {
    if (!user) return;
    
    try {
      await supabase
        .from('profiles')
        .update({ calendar_default_view: view })
        .eq('id', user.id);
    } catch (error) {
      // Fail silently, not critical
      console.error('Failed to save view preference:', error);
    }
  };
  
  // Create a new activity
  const createActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create activities",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('garden_activities')
        .insert({
          title,
          description,
          scheduled_date: format(selectedDay, 'yyyy-MM-dd'),
          activity_time: activityTime || null,
          category_id: selectedCategory || null,
          user_id: user.id,
          completed: false
        } as any);
        
      if (error) throw error;
      
      toast({
        title: "Activity created",
        description: "Your garden activity has been scheduled.",
      });
      
      setTitle('');
      setDescription('');
      setActivityTime('');
      setSelectedCategory(undefined);
      setDialogOpen(false);
      
      // Refresh activities
      const { data, error: fetchError } = await supabase
        .from('garden_activities')
        .select('*')
        .eq('scheduled_date', format(selectedDay, 'yyyy-MM-dd'))
        .order('activity_time');
        
      if (fetchError) throw fetchError;
      
      if (data) {
        // Update activities if we're still on the same view
        const isSameView = activeView === 'day' ? 
          isSameDay(selectedDay, currentDate) :
          activeView === 'week' ? 
            isSameMonth(selectedDay, currentDate) :
            activeView === 'month' ?
              isSameMonth(selectedDay, currentDate) : 
              selectedDay.getFullYear() === currentDate.getFullYear();
              
        if (isSameView) {
          setActivities(prevActivities => {
            const filtered = prevActivities.filter(act => 
              act.scheduled_date !== format(selectedDay, 'yyyy-MM-dd')
            );
            return [...filtered, ...data as any];
          });
        }
      }
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
  
  // Navigate between periods based on current view
  const navigatePrevious = () => {
    if (activeView === 'day') {
      setCurrentDate(subDays(currentDate, 1));
    } else if (activeView === 'week') {
      setCurrentDate(subDays(currentDate, 7));
    } else if (activeView === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else { // year
      setCurrentDate(subYears(currentDate, 1));
    }
  };
  
  const navigateNext = () => {
    if (activeView === 'day') {
      setCurrentDate(addDays(currentDate, 1));
    } else if (activeView === 'week') {
      setCurrentDate(addDays(currentDate, 7));
    } else if (activeView === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else { // year
      setCurrentDate(addYears(currentDate, 1));
    }
  };
  
  const getCurrentViewTitle = () => {
    if (activeView === 'day') {
      return format(currentDate, 'EEEE, MMMM d, yyyy');
    } else if (activeView === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 });
      const end = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    } else if (activeView === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else { // year
      return format(currentDate, 'yyyy');
    }
  };
  
  // Handle view change
  const handleViewChange = (view: string) => {
    setActiveView(view as "day" | "week" | "month" | "year");
    saveUserViewPreference(view);
  };
  
  // Render day view
  const renderDayView = () => {
    const dayActivities = activities.filter(activity => 
      activity.scheduled_date === format(currentDate, 'yyyy-MM-dd')
    );
    
    const sortedActivities = sortActivitiesByTime(dayActivities);
    
    return (
      <div className="space-y-4">
        {sortedActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No activities scheduled for this day.</p>
            <Button 
              onClick={() => {
                setSelectedDay(currentDate);
                setDialogOpen(true);
              }}
              className="mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Activity
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedActivities.map((activity) => (
              <div 
                key={activity.id} 
                className="p-4 border rounded-md hover:bg-accent/10 transition-colors"
                style={{
                  borderLeftWidth: '4px',
                  borderLeftColor: activity.category_id ? 
                    categories.find(c => c.id === activity.category_id)?.color || '#888' : 
                    '#888'
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{activity.title}</h3>
                    {activity.activity_time && (
                      <p className="text-sm text-muted-foreground">
                        {new Date(`2000-01-01T${activity.activity_time}`).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    )}
                    {activity.description && (
                      <p className="mt-2 text-sm">{activity.description}</p>
                    )}
                  </div>
                  <Button 
                    variant={activity.completed ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleActivityStatus(activity.id, activity.completed)}
                  >
                    {activity.completed ? "Completed" : "Mark Complete"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Render week view
  const renderWeekView = () => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
    const endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    return (
      <div className="grid grid-cols-7 gap-4">
        {days.map((day) => {
          const dayActivities = activities.filter(
            activity => activity.scheduled_date === format(day, 'yyyy-MM-dd')
          );
          
          return (
            <div key={day.toString()} className="min-h-[100px] border rounded-md p-2">
              <div 
                className={`text-center p-1 mb-2 rounded-md ${
                  isSameDay(day, new Date()) ? 'bg-primary text-primary-foreground' : ''
                }`}
              >
                <div className="text-xs">{format(day, 'EEE')}</div>
                <div className="font-bold">{format(day, 'd')}</div>
              </div>
              
              <div className="space-y-1">
                {dayActivities.length > 0 ? (
                  sortActivitiesByTime(dayActivities).map((activity) => (
                    <div 
                      key={activity.id}
                      className="text-xs p-1 rounded-md cursor-pointer hover:bg-muted truncate"
                      style={{
                        backgroundColor: activity.category_id ? 
                          `${categories.find(c => c.id === activity.category_id)?.color}20` : 
                          undefined
                      }}
                      onClick={() => {
                        setCurrentDate(day);
                        setActiveView('day');
                      }}
                    >
                      {activity.activity_time && (
                        <span className="font-medium">
                          {new Date(`2000-01-01T${activity.activity_time}`).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                          {' '}
                        </span>
                      )}
                      <span className={activity.completed ? "line-through opacity-50" : ""}>
                        {activity.title}
                      </span>
                    </div>
                  ))
                ) : (
                  <div 
                    className="text-xs text-center p-1 text-muted-foreground cursor-pointer hover:bg-muted"
                    onClick={() => {
                      setSelectedDay(day);
                      setDialogOpen(true);
                    }}
                  >
                    + Add
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Render month view
  const renderMonthView = () => {
    return (
      <Card>
        <CardContent className="p-4">
          <Calendar
            mode="single"
            selected={currentDate}
            onSelect={(date) => {
              if (date) {
                setSelectedDay(date);
                setDialogOpen(true);
              }
            }}
            month={currentDate}
            onMonthChange={setCurrentDate}
            className="mx-auto pointer-events-auto"
            components={{
              Day: ({ date, ...props }: any) => {
                // Check if the day has activities
                const formattedDate = format(date, 'yyyy-MM-dd');
                const hasActivities = activities.some(a => a.scheduled_date === formattedDate);
                
                return (
                  <div
                    {...props}
                    className={`${props.className} relative`}
                  >
                    {props.children}
                    {hasActivities && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                    )}
                  </div>
                );
              }
            }}
          />
        </CardContent>
      </Card>
    );
  };
  
  // Render year view
  const renderYearView = () => {
    const months = Array.from({ length: 12 }, (_, i) => new Date(currentDate.getFullYear(), i, 1));
    
    return (
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {months.map((month) => {
          // Check if the month has activities
          const monthStart = startOfMonth(month);
          const monthEnd = endOfMonth(month);
          const hasActivities = activities.some(a => {
            const activityDate = parseISO(a.scheduled_date);
            return activityDate >= monthStart && activityDate <= monthEnd;
          });
          
          return (
            <div 
              key={month.toString()}
              className={`border rounded-md p-2 text-center cursor-pointer hover:bg-accent/10 ${
                new Date().getMonth() === month.getMonth() && 
                new Date().getFullYear() === month.getFullYear() ? 
                'border-primary' : ''
              }`}
              onClick={() => {
                setCurrentDate(month);
                setActiveView('month');
              }}
            >
              <div className="font-medium">{format(month, 'MMMM')}</div>
              {hasActivities && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Has activities
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  // Render the current view
  const renderCurrentView = () => {
    if (loading) {
      return (
        <div className="text-center py-12">Loading calendar...</div>
      );
    }
    
    switch (activeView) {
      case 'day':
        return renderDayView();
      case 'week':
        return renderWeekView();
      case 'month':
        return renderMonthView();
      case 'year':
        return renderYearView();
      default:
        return renderMonthView();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold">Calendar</h1>
          
          <div className="flex items-center mt-4 sm:mt-0">
            <Tabs defaultValue={activeView} onValueChange={(value) => handleViewChange(value)}>
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Button variant="outline" size="icon" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <h2 className="text-xl font-medium">{getCurrentViewTitle()}</h2>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={navigateNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button variant="default" size="sm" onClick={() => {
              setSelectedDay(new Date());
              setDialogOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
        
        {renderCurrentView()}
        
        {/* Activity creation dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Garden Activity</DialogTitle>
            </DialogHeader>
            <form onSubmit={createActivity} className="space-y-4 pt-2">
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
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.color || '#888' }} 
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Time (Optional)</Label>
                <Input 
                  id="time" 
                  type="time"
                  value={activityTime} 
                  onChange={(e) => setActivityTime(e.target.value)} 
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
                    selected={selectedDay}
                    onSelect={(date) => date && setSelectedDay(date)} 
                    className="mx-auto pointer-events-auto"
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full">Schedule Activity</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;
