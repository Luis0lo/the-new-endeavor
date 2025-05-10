
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Archive, Leaf, Wrench, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface InventoryShelf {
  id: string;
  name: string;
  type: 'seeds' | 'plants' | 'tools';
  description: string | null;
  created_at: string;
  position?: number;
}

interface SortableShelfCardProps {
  shelf: InventoryShelf;
  onEdit: (shelf: InventoryShelf) => void;
  onDelete: (shelf: InventoryShelf) => void;
}

export const SortableShelfCard: React.FC<SortableShelfCardProps> = ({
  shelf,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: shelf.id,
    // Add required configurations with default values
    data: {
      type: 'shelf',
      shelf
    }
  });

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
    transition
  } : undefined;

  const getShelfIcon = (type: 'seeds' | 'plants' | 'tools') => {
    switch (type) {
      case 'seeds':
        return <Archive className="h-5 w-5 text-yellow-500" />;
      case 'plants':
        return <Leaf className="h-5 w-5 text-green-500" />;
      case 'tools':
        return <Wrench className="h-5 w-5 text-blue-500" />;
      default:
        return <Archive className="h-5 w-5" />;
    }
  };

  const getShelfTypeText = (type: 'seeds' | 'plants' | 'tools') => {
    switch (type) {
      case 'seeds':
        return 'Seeds';
      case 'plants':
        return 'Plants';
      case 'tools':
        return 'Tools';
      default:
        return type;
    }
  };

  const handleViewItems = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/dashboard/inventory/${shelf.id}`);
    console.log('Navigating to shelf:', shelf.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit(shelf);
    console.log('Edit shelf:', shelf.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete(shelf);
    console.log('Delete shelf:', shelf.id);
  };

  return (
    <div style={style}>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div 
              ref={setNodeRef} 
              {...attributes} 
              {...listeners}
              className="flex items-center space-x-2 cursor-grab"
            >
              {getShelfIcon(shelf.type)}
              <div>
                <CardTitle>{shelf.name}</CardTitle>
                <CardDescription>{getShelfTypeText(shelf.type)}</CardDescription>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleEdit}
                type="button"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleDelete}
                type="button"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {shelf.description || 'No description provided.'}
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleViewItems}
            type="button"
          >
            View Items
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
