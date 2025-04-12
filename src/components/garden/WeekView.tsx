
import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
  // Get the week range (Monday to Sunday)
  const startDate = startOfWeek(date, { weekStartsOn: 1 });
  const endDate = endOfWeek(date, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Format the date range for display
  const dateRangeText = `${format(startDate, 'MMMM d')} - ${format(endDate, 'MMMM d, yyyy')}`;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{dateRangeText}</h2>
        <Button 
          size="sm" 
          onClick={() => onAddActivity(date)}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Activity
        </Button>
      </div>

      <div className="grid grid-cols-7 border rounded-lg overflow-hidden">
        {/* Header row with day names */}
        <div className="col-span-7 grid grid-cols-7">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, index) => (
            <div 
              key={dayName} 
              className={`p-2 text-center font-medium ${
                index === 6 ? 'bg-gray-100' : index === 0 ? 'bg-gray-100' : ''
              }`}
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Date numbers row */}
        <div className="col-span-7 grid grid-cols-7 border-t">
          {days.map((day, i) => {
            const isToday = isSameDay(day, new Date());
            
            return (
              <button
                key={day.toString()}
                className={`p-4 text-center hover:bg-gray-50 ${
                  i === 6 || i === 0 ? 'bg-gray-50' : ''
                }`}
                onClick={() => onSelectDay(day)}
              >
                <div className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${
                  isToday ? 'bg-primary text-primary-foreground' : ''
                }`}>
                  {format(day, 'd')}
                </div>
              </button>
            );
          })}
        </div>

        {/* Activities row */}
        <div className="col-span-7 grid grid-cols-7 border-t">
          {days.map((day) => {
            const dayActivities = activities.filter(activity => 
              isSameDay(new Date(activity.date), day)
            );
            
            return (
              <div 
                key={day.toString()} 
                className="p-4 min-h-[100px] hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelectDay(day)}
              >
                {dayActivities.length > 0 ? (
                  <div className="space-y-1">
                    {dayActivities.slice(0, 3).map(activity => (
                      <div key={activity.id} className="text-sm p-1 truncate">
                        {activity.title}
                      </div>
                    ))}
                    {dayActivities.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        + {dayActivities.length - 3} more
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground text-center">
                    No activities
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeekView;
