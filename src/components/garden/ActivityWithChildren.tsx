
import React, { useState } from 'react';
import { GardenActivity } from '@/types/garden';
import ActivityItem from './activity/ActivityItem';

interface ActivityWithChildrenProps {
  activity: GardenActivity;
  onEditActivity: (activity: GardenActivity) => void;
  onDeleteActivity: (activityId: string) => void;
  onToggleComplete: (activity: GardenActivity) => void;
  onAddChildActivity: (parentActivity: GardenActivity) => void;
}

const ActivityWithChildren: React.FC<ActivityWithChildrenProps> = ({
  activity,
  onEditActivity,
  onDeleteActivity,
  onToggleComplete,
  onAddChildActivity
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpanded = () => {
    if (activity.has_children) {
      setIsExpanded(!isExpanded);
    }
  };

  // Validate main activity
  if (!activity || !activity.id || !activity.title) {
    console.warn('Invalid main activity data:', activity);
    return null;
  }

  return (
    <div className="space-y-2">
      <ActivityItem
        activity={activity}
        onEditActivity={onEditActivity}
        onDeleteActivity={onDeleteActivity}
        onToggleComplete={onToggleComplete}
        onAddChildActivity={onAddChildActivity}
        isExpanded={isExpanded}
        onToggleExpanded={handleToggleExpanded}
      />
      
      {activity.has_children && isExpanded && activity.children && (
        <div className="space-y-2">
          {activity.children
            .filter(child => child && child.id && child.title) // Filter out invalid children
            .sort((a, b) => (a.activity_order || 0) - (b.activity_order || 0))
            .map(child => (
              <ActivityItem
                key={child.id}
                activity={child}
                isChild={true}
                onEditActivity={onEditActivity}
                onDeleteActivity={onDeleteActivity}
                onToggleComplete={onToggleComplete}
                onAddChildActivity={onAddChildActivity}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default ActivityWithChildren;
