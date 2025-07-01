
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GardenActivity } from '@/types/garden';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import ActivityHeader from './ActivityHeader';
import ActivityDetails from './ActivityDetails';
import ActivityDropdownMenu from './ActivityDropdownMenu';

interface ActivityItemProps {
  activity: GardenActivity;
  isChild?: boolean;
  onEditActivity: (activity: GardenActivity) => void;
  onDeleteActivity: (activityId: string) => void;
  onToggleComplete: (activity: GardenActivity) => void;
  onAddChildActivity: (parentActivity: GardenActivity) => void;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  activity,
  isChild = false,
  onEditActivity,
  onDeleteActivity,
  onToggleComplete,
  onAddChildActivity,
  isExpanded = false,
  onToggleExpanded
}) => {
  const navigate = useNavigate();

  // Validate activity data
  if (!activity || !activity.id || !activity.title) {
    console.warn('Invalid activity data:', activity);
    return null;
  }

  const handleOpenInDayView = (act: GardenActivity) => {
    console.log('Opening day view for activity:', act);
    console.log('Activity date:', act.date);
    
    // Ensure we have a valid date
    if (!act.date) {
      console.error('Activity has no date:', act);
      return;
    }
    
    // Navigate to the calendar page with the specific date and day view
    navigate(`/dashboard/calendar?date=${act.date}&view=day`);
  };

  const handleToggleExpanded = () => {
    if (activity.has_children && onToggleExpanded) {
      onToggleExpanded();
    }
  };

  // Check if this is a subtask being displayed as standalone (parent on different date)
  const isStandaloneSubtask = activity.parent_activity_id && !activity.has_children;

  return (
    <div className={`${isChild ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''}`}>
      <Card className={`${activity.completed ? 'opacity-60' : ''} ${isChild ? 'bg-gray-50' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <Checkbox
                checked={Boolean(activity.completed)}
                onCheckedChange={() => onToggleComplete(activity)}
                className="mt-1"
              />
              
              <div className="flex-1 min-w-0">
                <ActivityHeader
                  activity={activity}
                  isChild={isChild}
                  isStandaloneSubtask={isStandaloneSubtask}
                  isExpanded={isExpanded}
                  onToggleExpanded={handleToggleExpanded}
                  onOpenInDayView={handleOpenInDayView}
                />
                
                <ActivityDetails activity={activity} />
              </div>
            </div>
            
            <ActivityDropdownMenu
              activity={activity}
              isChild={isChild}
              isStandaloneSubtask={isStandaloneSubtask}
              onEditActivity={onEditActivity}
              onDeleteActivity={onDeleteActivity}
              onAddChildActivity={onAddChildActivity}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityItem;
