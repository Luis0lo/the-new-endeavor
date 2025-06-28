
import React, { useState } from 'react';
import { format } from 'date-fns';
import { GardenActivity } from '@/types/garden';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Edit2, 
  Trash2, 
  Clock, 
  ChevronDown, 
  ChevronRight,
  Plus,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleToggleExpanded = () => {
    if (activity.has_children) {
      setIsExpanded(!isExpanded);
    }
  };

  const renderActivity = (act: GardenActivity, isChild: boolean = false) => (
    <div 
      key={act.id}
      className={`${isChild ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''}`}
    >
      <Card className={`${act.completed ? 'opacity-60' : ''} ${isChild ? 'bg-gray-50' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <Checkbox
                checked={act.completed || false}
                onCheckedChange={() => onToggleComplete(act)}
                className="mt-1"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  {act.has_children && !isChild && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleToggleExpanded}
                      className="p-0 h-6 w-6"
                    >
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  )}
                  
                  <h3 className={`font-medium ${act.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {act.title}
                  </h3>
                  
                  {act.has_children && !isChild && (
                    <Badge variant="secondary" className="text-xs">
                      {act.children?.length || 0} subtasks
                    </Badge>
                  )}
                </div>
                
                {act.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {act.description}
                  </p>
                )}
                
                <div className="flex items-center space-x-2 text-sm">
                  {act.activity_time && (
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{format(new Date(`2000-01-01T${act.activity_time}`), 'h:mm a')}</span>
                    </div>
                  )}
                  
                  {act.priority && (
                    <Badge variant="outline" className={getPriorityColor(act.priority)}>
                      {act.priority}
                    </Badge>
                  )}
                  
                  {act.status && (
                    <Badge variant="outline" className={getStatusColor(act.status)}>
                      {act.status}
                    </Badge>
                  )}
                  
                  {act.action && act.action !== 'other' && (
                    <Badge variant="outline">
                      {act.action}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEditActivity(act)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                {!isChild && (
                  <DropdownMenuItem onClick={() => onAddChildActivity(act)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Subtask
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem 
                  onClick={() => onDeleteActivity(act.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-2">
      {renderActivity(activity)}
      
      {activity.has_children && isExpanded && activity.children && (
        <div className="space-y-2">
          {activity.children
            .sort((a, b) => (a.activity_order || 0) - (b.activity_order || 0))
            .map(child => renderActivity(child, true))}
        </div>
      )}
    </div>
  );
};

export default ActivityWithChildren;
