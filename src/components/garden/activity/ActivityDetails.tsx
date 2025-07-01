
import React from 'react';
import { format } from 'date-fns';
import { GardenActivity } from '@/types/garden';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { getPriorityColor, getStatusColor } from './activityUtils';

interface ActivityDetailsProps {
  activity: GardenActivity;
}

const ActivityDetails: React.FC<ActivityDetailsProps> = ({ activity }) => {
  return (
    <>
      {activity.description && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {activity.description}
        </p>
      )}
      
      <div className="flex items-center space-x-2 text-sm">
        {activity.activity_time && (
          <div className="flex items-center space-x-1 text-gray-500">
            <Clock className="h-3 w-3" />
            <span>{format(new Date(`2000-01-01T${activity.activity_time}`), 'h:mm a')}</span>
          </div>
        )}
        
        {activity.priority && (
          <Badge variant="outline" className={getPriorityColor(activity.priority)}>
            {activity.priority}
          </Badge>
        )}
        
        {activity.status && (
          <Badge variant="outline" className={getStatusColor(activity.status)}>
            {activity.status}
          </Badge>
        )}
        
        {activity.action && activity.action !== 'other' && (
          <Badge variant="outline">
            {activity.action}
          </Badge>
        )}
      </div>
    </>
  );
};

export default ActivityDetails;
