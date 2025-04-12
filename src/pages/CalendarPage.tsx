
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import DashboardLayout from '@/components/DashboardLayout';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GardenActivity } from '@/types/garden';

const CalendarPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [activities, setActivities] = useState<GardenActivity[]>([]);
  
  // Check if user is logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch activities from Supabase
  useEffect(() => {
    const fetchActivities = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('garden_activities')
          .select('*')
          .eq('user_id', user.id);
          
        if (!error && data) {
          setActivities(data as GardenActivity[]);
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

  const handleAddActivity = () => {
    // Implementation for adding an activity
  };

  // Create calendar grid
  const renderCalendarGrid = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Day of week of the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Total days in the month
    const daysInMonth = lastDay.getDate();
    
    // Previous month's last days to display
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Days from previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      days.push({
        date: new Date(year, month - 1, dayNum),
        isCurrentMonth: false,
        dayNum
      });
    }
    
    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      const hasActivities = activities.some(activity => {
        const activityDate = new Date(activity.date);
        return activityDate.getDate() === i && 
               activityDate.getMonth() === month && 
               activityDate.getFullYear() === year;
      });
      
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        dayNum: i,
        hasActivities
      });
    }
    
    // Fill remaining spaces with days from next month
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        dayNum: i
      });
    }
    
    // Group days into weeks
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    
    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="py-2 text-center font-semibold text-sm">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {weeks.flat().map((day, index) => {
          const isToday = day.isCurrentMonth && 
            day.date.getDate() === new Date().getDate() &&
            day.date.getMonth() === new Date().getMonth() &&
            day.date.getFullYear() === new Date().getFullYear();
            
          return (
            <div 
              key={index}
              className={`p-2 min-h-[80px] border ${
                day.isCurrentMonth 
                  ? 'bg-white' 
                  : 'bg-gray-50 text-gray-400'
              } ${
                isToday 
                  ? 'border-primary' 
                  : 'border-gray-100'
              } ${
                day.hasActivities && day.isCurrentMonth
                  ? 'font-medium'
                  : ''
              } hover:bg-gray-50 cursor-pointer transition-colors`}
              onClick={() => {
                setDate(day.date);
                setView('day');
              }}
            >
              <div className="text-right">{day.dayNum}</div>
              
              {/* Show activity indicators */}
              {day.hasActivities && day.isCurrentMonth && (
                <div className="mt-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mx-auto"></div>
                </div>
              )}
            </div>
          );
        })}
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
            <Button variant="outline" size="sm" onClick={() => {}}>
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
            
            <Button onClick={handleAddActivity}>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </div>
        </div>
        
        {/* Calendar content */}
        <div className="flex-1 p-4 overflow-auto">
          {view === 'month' && renderCalendarGrid()}
          {/* Add day and week views as needed */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;
