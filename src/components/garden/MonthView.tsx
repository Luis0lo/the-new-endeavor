
import React from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';
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
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Group days into weeks
  const weeks: Date[][] = [];
  let week: Date[] = [];
  days.forEach((day) => {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });

  return (
    <div className="border rounded-md">
      <div className="grid grid-cols-7 text-center py-2 border-b bg-muted">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="text-sm font-medium">
            {day}
          </div>
        ))}
      </div>
      
      <div>
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-b last:border-b-0">
            {week.map((day) => {
              const isCurrentMonth = isSameMonth(day, date);
              const isToday = isSameDay(day, new Date());
              
              // Filter activities for this day
              const dayActivities = activities.filter(activity => {
                const activityDate = new Date(activity.date);
                return isSameDay(activityDate, day);
              });
              
              return (
                <div 
                  key={day.toString()}
                  className={`min-h-[80px] p-1 border-r last:border-r-0 ${
                    !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                  } ${isToday ? 'bg-blue-50' : ''}`}
                  onClick={() => onSelectDay(day)}
                >
                  <div className={`text-right p-1 ${
                    isToday ? 'bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center ml-auto' : ''
                  }`}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="mt-1">
                    {dayActivities.slice(0, 2).map((activity) => (
                      <div 
                        key={activity.id}
                        className="text-xs p-1 mb-1 bg-background rounded truncate"
                        title={activity.title}
                      >
                        {activity.title}
                      </div>
                    ))}
                    
                    {dayActivities.length > 2 && (
                      <div className="text-xs text-center text-muted-foreground">
                        + {dayActivities.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView;
