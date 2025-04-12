
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { GardenActivity } from '@/types/garden';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface DayViewProps {
  date: Date;
  activities: GardenActivity[];
  onAddActivity: (date: Date) => void;
  onEditActivity: (activity: GardenActivity) => void;
  onDeleteActivity: (activityId: string) => void;
  onToggleComplete?: (activity: GardenActivity) => void;
}

const DayView: React.FC<DayViewProps> = ({
  date,
  activities,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  onToggleComplete
}) => {
  // Filter activities for the selected day
  const dayActivities = activities.filter(activity => {
    const activityDate = new Date(activity.date);
    return (
      activityDate.getDate() === date.getDate() &&
      activityDate.getMonth() === date.getMonth() &&
      activityDate.getFullYear() === date.getFullYear()
    );
  });

  // Sort activities by time if available
  const sortedActivities = [...dayActivities].sort((a, b) => {
    if (!a.activity_time) return 1;
    if (!b.activity_time) return -1;
    return a.activity_time.localeCompare(b.activity_time);
  });

  const formattedDate = format(date, 'EEEE, MMMM d, yyyy');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{formattedDate}</h2>
        <Button 
          size="sm" 
          onClick={() => onAddActivity(date)}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Activity
        </Button>
      </div>

      {sortedActivities.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border rounded-lg">
          <p>No garden activities recorded for this day</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedActivities.map((activity) => (
            <div 
              key={activity.id} 
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-lg">{activity.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {activity.description}
                  </p>
                  {activity.activity_time && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(`2000-01-01T${activity.activity_time}`).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEditActivity(activity)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDeleteActivity(activity.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DayView;
