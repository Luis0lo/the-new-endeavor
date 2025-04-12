
import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { GardenActivity } from '@/types/garden';

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
  // Create calendar grid
  const getDaysInMonth = () => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Start from Sunday
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 }); // End on Saturday
    
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{format(date, 'MMMM yyyy')}</h2>
        <Button 
          size="sm" 
          onClick={() => onAddActivity(date)}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Activity
        </Button>
      </div>
      
      <div className="grid grid-cols-7 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="py-2 font-semibold text-sm">
            {day}
          </div>
        ))}
        
        {weeks.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((day) => {
              const isCurrentMonth = isSameMonth(day, date);
              const isToday = isSameDay(day, today);
              const dayActivities = getActivitiesForDay(day);
              const hasActivities = dayActivities.length > 0;
              
              return (
                <div 
                  key={day.toString()}
                  className={`relative flex flex-col p-1 min-h-[100px] ${
                    isCurrentMonth 
                      ? 'bg-transparent' 
                      : 'bg-muted/20 text-muted-foreground'
                  } ${
                    isToday 
                      ? 'ring-2 ring-primary rounded-md' 
                      : ''
                  } hover:bg-muted/10 hover:ring-1 hover:ring-primary hover:rounded-md hover:shadow-sm cursor-pointer transition-all`}
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
                        onAddActivity(day);
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MonthView;
