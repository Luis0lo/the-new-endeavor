
import React from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Archive, Leaf, Wrench, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import EditShelfDialog from './EditShelfDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';

export interface Shelf {
  id: string;
  name: string;
  type: 'seeds' | 'plants' | 'tools';
  description: string | null;
  position: number;
  itemCount?: number;
}

interface SortableShelfItemProps {
  shelf: Shelf;
  onEdit: (shelf: Shelf) => void;
  onDelete: (shelfId: string) => void;
  onClick: (shelfId: string) => void;
}

function SortableShelfItem({ shelf, onEdit, onDelete, onClick }: SortableShelfItemProps) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
    isDragging
  } = useSortable({ id: shelf.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
    cursor: 'grab'
  };

  const getShelfIcon = () => {
    switch (shelf.type) {
      case 'seeds':
        return <Archive className="h-5 w-5 text-yellow-500" />;
      case 'plants':
        return <Leaf className="h-5 w-5 text-green-500" />;
      case 'tools':
        return <Wrench className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="mb-4">
      <Card className={`border ${isDragging ? 'shadow-lg bg-muted' : ''}`}>
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2 cursor-pointer" onClick={() => onClick(shelf.id)}>
            {getShelfIcon()}
            {shelf.name}
          </CardTitle>
          <Badge variant="outline">{shelf.type}</Badge>
        </CardHeader>
        
        <CardContent className="p-4 pt-2 cursor-pointer" onClick={() => onClick(shelf.id)}>
          {shelf.description && <p className="text-muted-foreground">{shelf.description}</p>}
          <p className="text-sm mt-2">
            {shelf.itemCount !== undefined
              ? `${shelf.itemCount} ${shelf.itemCount === 1 ? 'item' : 'items'}`
              : 'Loading items...'}
          </p>
        </CardContent>
        
        <CardFooter className="p-4 pt-2 flex justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={(e) => {
            e.stopPropagation();
            onEdit(shelf);
          }}>
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={(e) => {
            e.stopPropagation();
            onDelete(shelf.id);
          }}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

interface SortableShelvesProps {
  shelves: Shelf[];
  onShelvesReorder: (shelves: Shelf[]) => void;
  onShelfClick: (shelfId: string) => void;
  onShelfUpdated: () => void;
  onShelfDeleted: () => void;
}

export default function SortableShelves({ 
  shelves, 
  onShelvesReorder, 
  onShelfClick, 
  onShelfUpdated,
  onShelfDeleted
}: SortableShelvesProps) {
  const [editingShelf, setEditingShelf] = useState<Shelf | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingShelfId, setDeletingShelfId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = shelves.findIndex(shelf => shelf.id === active.id);
      const newIndex = shelves.findIndex(shelf => shelf.id === over.id);
      
      const newShelves = [...shelves];
      const [removed] = newShelves.splice(oldIndex, 1);
      newShelves.splice(newIndex, 0, removed);
      
      // Update positions
      const reorderedShelves = newShelves.map((shelf, index) => ({
        ...shelf,
        position: index
      }));
      
      onShelvesReorder(reorderedShelves);
    }
  }

  const handleEditShelf = (shelf: Shelf) => {
    setEditingShelf(shelf);
    setIsEditDialogOpen(true);
  };

  const handleDeleteShelf = (shelfId: string) => {
    setDeletingShelfId(shelfId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteShelf = async () => {
    if (deletingShelfId) {
      onShelfDeleted();
      setIsDeleteDialogOpen(false);
      setDeletingShelfId(null);
    }
  };

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={shelves.map(shelf => shelf.id)}
          strategy={verticalListSortingStrategy}
        >
          {shelves.map(shelf => (
            <SortableShelfItem
              key={shelf.id}
              shelf={shelf}
              onEdit={handleEditShelf}
              onDelete={handleDeleteShelf}
              onClick={onShelfClick}
            />
          ))}
        </SortableContext>
      </DndContext>
      
      {editingShelf && (
        <EditShelfDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          shelf={editingShelf}
          onShelfUpdated={onShelfUpdated}
        />
      )}
      
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Shelf"
        description="Are you sure you want to delete this shelf? This action cannot be undone, and all items in this shelf will also be deleted."
        onConfirm={confirmDeleteShelf}
      />
    </div>
  );
}
