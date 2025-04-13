
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { GardenActivity } from '@/types/garden';
import { Plus, Pencil, Trash2, CheckCircle2 } from 'lucide-react';

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
              className={`border rounded-lg p-4 hover:bg-gray-50 ${
                activity.completed || activity.status === 'done' ? 'bg-green-50 border-green-200' : ''
              }`}
            >
              <div className="flex justify-between">
                <div className="flex gap-2">
                  {(activity.completed || activity.status === 'done') && (
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h3 className={`font-medium text-lg ${
                      activity.completed || activity.status === 'done' ? 'text-green-700' : ''
                    }`}>{activity.title}</h3>
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
                    {activity.priority === 'high' && (
                      <span className="inline-block mt-1 text-xs font-medium bg-red-100 text-red-800 rounded-full px-2 py-0.5">
                        High Priority
                      </span>
                    )}
                    {activity.status && activity.status !== 'done' && (
                      <span className={`inline-block mt-1 ml-1 text-xs font-medium rounded-full px-2 py-0.5 ${
                        activity.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {activity.status === 'in_progress' ? 'In Progress' : 'Pending'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  {onToggleComplete && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onToggleComplete(activity)}
                      className="h-8 w-8"
                      title={activity.completed || activity.status === 'done' ? "Mark as incomplete" : "Mark as complete"}
                    >
                      <CheckCircle2 className={`h-4 w-4 ${
                        activity.completed || activity.status === 'done' ? 'text-green-500' : 'text-muted-foreground'
                      }`} />
                    </Button>
                  )}
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
