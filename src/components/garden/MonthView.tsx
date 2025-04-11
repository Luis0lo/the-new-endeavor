
import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { GardenActivity } from '@/types/garden';
import { Plus } from 'lucide-react';

interface MonthViewProps {
  date: Date;
  activities: GardenActivity[];
  onAddActivity: (date: Date) => void;
  onSelectDay: (date: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  date,
  activities,
  onAddActivity,
  onSelectDay
}) => {
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
      
      <div className="grid grid-cols-7 gap-1 h-[calc(100%-2rem)]">
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
              onClick={() => onSelectDay(day)}
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
                        className="truncate px-1 py-0.5 rounded bg-primary/10 text-primary-foreground"
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
                  className="absolute bottom-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddActivity(day);
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

export default MonthView;
