
import React from 'react';
import { GardenActivity } from '@/types/garden';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronRight,
  Calendar
} from 'lucide-react';

interface ActivityHeaderProps {
  activity: GardenActivity;
  isChild: boolean;
  isStandaloneSubtask: boolean;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onOpenInDayView: (activity: GardenActivity) => void;
}

const ActivityHeader: React.FC<ActivityHeaderProps> = ({
  activity,
  isChild,
  isStandaloneSubtask,
  isExpanded,
  onToggleExpanded,
  onOpenInDayView
}) => {
  return (
    <div className="flex items-center space-x-2 mb-2">
      {activity.has_children && !isChild && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleExpanded}
          className="p-0 h-6 w-6"
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      )}
      
      <h3 className={`font-medium ${activity.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
        {activity.title}
      </h3>
      
      {/* Show day view button for child activities */}
      {isChild && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onOpenInDayView(activity)}
          className="p-0 h-6 w-6 text-gray-500 hover:text-gray-700"
          title="Open in day view"
        >
          <Calendar className="h-4 w-4" />
        </Button>
      )}
      
      {/* Show subtask indicator when displayed as standalone */}
      {isStandaloneSubtask && !isChild && (
        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
          Subtask
        </Badge>
      )}
      
      {activity.has_children && !isChild && (
        <Badge variant="secondary" className="text-xs">
          {activity.children?.length || 0} subtasks
        </Badge>
      )}
    </div>
  );
};

export default ActivityHeader;
