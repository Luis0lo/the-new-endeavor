
import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, parseISO, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { GardenActivity } from '@/types/garden';

interface WeekViewProps {
  date: Date;
  activities: GardenActivity[];
  onAddActivity: (date: Date) => void;
  onSelectDay: (date: Date) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  date,
  activities,
  onAddActivity,
  onSelectDay
}) => {
  const startDate = startOfWeek(date, { weekStartsOn: 1 });
  const endDate = endOfWeek(date, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="grid grid-cols-7 gap-4">
      {days.map((day) => {
        const dayActivities = activities.filter(activity => {
          const activityDate = new Date(activity.date);
          return isSameDay(activityDate, day);
        });

        const isToday = isSameDay(day, new Date());

        return (
          <div 
            key={day.toString()} 
            className={`min-h-[120px] border rounded-md p-2 ${isToday ? 'border-primary' : ''}`}
          >
            <div 
              className={`text-center p-1 mb-2 rounded-md cursor-pointer hover:bg-muted ${
                isToday ? 'bg-primary text-primary-foreground' : ''
              }`}
              onClick={() => onSelectDay(day)}
            >
              <div className="text-xs">{format(day, 'EEE')}</div>
              <div className="font-bold">{format(day, 'd')}</div>
            </div>
            
            <div className="space-y-1">
              {dayActivities.slice(0, 3).map((activity) => (
                <div 
                  key={activity.id}
                  className="text-xs p-1 rounded-md truncate cursor-pointer hover:bg-muted"
                  onClick={() => onSelectDay(day)}
                >
                  <span className={activity.completed ? "line-through opacity-50" : ""}>
                    {activity.title}
                  </span>
                </div>
              ))}
              
              {dayActivities.length > 3 && (
                <div 
                  className="text-xs text-center text-muted-foreground cursor-pointer hover:bg-muted p-1"
                  onClick={() => onSelectDay(day)}
                >
                  + {dayActivities.length - 3} more
                </div>
              )}
              
              {dayActivities.length === 0 && (
                <div 
                  className="text-xs text-center text-muted-foreground cursor-pointer hover:bg-muted p-1"
                  onClick={() => onAddActivity(day)}
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

export default WeekView;
