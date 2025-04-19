
import React from 'react';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, addYears, subYears } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ViewType } from '@/types/garden';

interface CalendarHeaderProps {
  date: Date;
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  onDateChange: (date: Date) => void;
  onAddActivity?: (date: Date) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  date,
  view,
  onViewChange,
  onDateChange,
  onAddActivity
}) => {
  const handlePrevious = () => {
    switch (view) {
      case 'day':
        onDateChange(subDays(date, 1));
        break;
      case 'week':
        onDateChange(subWeeks(date, 1));
        break;
      case 'month':
        onDateChange(subMonths(date, 1));
        break;
      case 'year':
        onDateChange(subYears(date, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (view) {
      case 'day':
        onDateChange(addDays(date, 1));
        break;
      case 'week':
        onDateChange(addWeeks(date, 1));
        break;
      case 'month':
        onDateChange(addMonths(date, 1));
        break;
      case 'year':
        onDateChange(addYears(date, 1));
        break;
    }
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const getTitle = () => {
    switch (view) {
      case 'day':
        return format(date, 'MMMM d, yyyy');
      case 'week': {
        const start = date;
        const end = addDays(start, 6);
        return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
      }
      case 'month':
        return format(date, 'MMMM yyyy');
      case 'year':
        return format(date, 'yyyy');
      default:
        return '';
    }
  };

  return (
    <div className="bg-background border-b p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Garden Calendar</h1>
        
        <div className="flex items-center">
          <Tabs value={view} onValueChange={(value) => onViewChange(value as ViewType)}>
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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={handleToday}>Today</Button>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <h2 className="text-xl font-medium">{getTitle()}</h2>
        
    
      </div>
    </div>
  );
};

export default CalendarHeader;
