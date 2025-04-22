
import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Plus, CheckCircle2 } from 'lucide-react';
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
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, index) => (
            <div 
              key={dayName} 
              className={`p-2 text-center font-medium ${
                index >= 5 ? 'bg-gray-100 text-gray-600' : 'text-gray-500'
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
                className={`p-4 text-center hover:bg-gray-50 transition-colors duration-200 ${
                  i >= 5 ? 'bg-gray-100 hover:bg-gray-200' : ''
                }`}
                onClick={() => onSelectDay(day)}
              >
                <div className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${
                  isToday ? 'bg-primary text-primary-foreground' : ''
                } ${
                  i >= 5 ? 'text-gray-600' : 'text-gray-800'
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
                className={`p-4 min-h-[100px] hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                  days.indexOf(day) >= 5 ? 'bg-gray-100 hover:bg-gray-200' : ''
                }`}
                onClick={() => onSelectDay(day)}
              >
                {dayActivities.length > 0 ? (
                  <div className="space-y-1">
                    {dayActivities.slice(0, 3).map(activity => (
                      <div 
                        key={activity.id} 
                        className={`text-sm p-1 rounded-sm flex items-start gap-1 transition-colors duration-200 ${
                          activity.completed || activity.status === 'done' 
                            ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        {(activity.completed || activity.status === 'done') && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                        )}
                        <span className="truncate">{activity.title}</span>
                      </div>
                    ))}
                    {dayActivities.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        + {dayActivities.length - 3} more
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 text-center">
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

