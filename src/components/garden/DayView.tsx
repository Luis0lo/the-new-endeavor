
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GardenActivity } from '@/types/garden';
import { CheckCircle, Circle, Edit, Trash2 } from 'lucide-react';

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

  return (
    <div className="space-y-4">
      <div className="text-center p-2 bg-muted rounded-md">
        <h3 className="text-lg font-medium">{format(date, 'EEEE')}</h3>
        <p className="text-2xl font-bold">{format(date, 'd')}</p>
      </div>

      {sortedActivities.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No activities scheduled for this day.</p>
          <Button 
            onClick={() => onAddActivity(date)}
            className="mt-4"
          >
            Add Activity
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedActivities.map((activity) => (
            <Card 
              key={activity.id} 
              className="p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    {onToggleComplete && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 h-auto"
                        onClick={() => onToggleComplete(activity)}
                      >
                        {activity.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </Button>
                    )}
                    <h3 className={`font-medium ${activity.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {activity.title}
                    </h3>
                  </div>
                  
                  {activity.activity_time && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(`2000-01-01T${activity.activity_time}`).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  )}
                  
                  {activity.description && (
                    <p className="mt-2 text-sm">{activity.description}</p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEditActivity(activity)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDeleteActivity(activity.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DayView;
