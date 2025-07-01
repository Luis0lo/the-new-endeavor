
import React from 'react';
import { GardenActivity } from '@/types/garden';
import { Button } from '@/components/ui/button';
import { 
  Edit2, 
  Trash2, 
  Plus,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ActivityDropdownMenuProps {
  activity: GardenActivity;
  isChild: boolean;
  isStandaloneSubtask: boolean;
  onEditActivity: (activity: GardenActivity) => void;
  onDeleteActivity: (activityId: string) => void;
  onAddChildActivity: (parentActivity: GardenActivity) => void;
}

const ActivityDropdownMenu: React.FC<ActivityDropdownMenuProps> = ({
  activity,
  isChild,
  isStandaloneSubtask,
  onEditActivity,
  onDeleteActivity,
  onAddChildActivity
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEditActivity(activity)}>
          <Edit2 className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        {!isChild && !isStandaloneSubtask && (
          <DropdownMenuItem onClick={() => onAddChildActivity(activity)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Subtask
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={() => onDeleteActivity(activity.id)}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActivityDropdownMenu;
