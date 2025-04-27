
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import WeekView from '@/components/garden/WeekView';
import DayView from '@/components/garden/DayView';
import MonthView from '@/components/garden/MonthView';
import { getMonthEvents } from '@/data/uk-seeding-data';

const SeedCalendarPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('week');

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

  const handleDayClick = (selectedDate: Date) => {
    setDate(selectedDate);
    setView('day');
  };

  // Define empty callback functions to satisfy the component props
  const noopCallback = () => {};
  
  // Get events for the current month
  const events = getMonthEvents(date);

  // Render the current view
  const renderView = () => {
    switch (view) {
      case 'month':
        return (
          <MonthView
            date={date}
            activities={[]}
            onSelectDay={handleDayClick}
            onAddActivity={noopCallback}
          />
        );
      case 'week':
        return (
          <WeekView
            date={date}
            activities={[]}
            onSelectDay={handleDayClick}
            onAddActivity={noopCallback}
          />
        );
      case 'day':
        return (
          <DayView
            date={date}
            activities={[]}
            onAddActivity={noopCallback}
            onEditActivity={noopCallback}
            onDeleteActivity={noopCallback}
            onToggleComplete={noopCallback}
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
          <h1 className="text-3xl font-bold tracking-tight">Seed Calendar</h1>
          <p className="text-muted-foreground">UK Seeding Guide: What to plant and when</p>
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
        
        {/* Current month events */}
        <div className="px-4 mb-4">
          <h3 className="text-lg font-semibold mb-2">What to Plant This Month:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {events.map((event, index) => (
              <div key={index} className="p-3 rounded-lg bg-card border">
                <div className="font-medium">{event.name}</div>
                <div className="text-sm text-muted-foreground capitalize">{event.type}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar content */}
        <div className="flex-1 p-4 overflow-auto">
          {renderView()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SeedCalendarPage;
