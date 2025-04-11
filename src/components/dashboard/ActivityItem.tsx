
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle } from 'lucide-react';

interface ActivityItemProps {
  id: string;
  title: string;
  description: string | null;
  completed: boolean | null;
  onToggleStatus: (id: string, currentStatus: boolean | null) => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  id,
  title,
  description,
  completed,
  onToggleStatus
}) => {
  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => onToggleStatus(id, completed)}
        className="h-8 w-8 shrink-0"
      >
        {completed ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </Button>
      <div className="flex-1">
        <h4 className={`font-medium ${completed ? 'line-through text-muted-foreground' : ''}`}>
          {title}
        </h4>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default ActivityItem;
