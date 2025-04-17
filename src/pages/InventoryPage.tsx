
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Plus, Archive, Leaf, Wrench, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import CreateShelfDialog from '@/components/inventory/CreateShelfDialog';
import EditShelfDialog from '@/components/inventory/EditShelfDialog';
import DeleteConfirmDialog from '@/components/inventory/DeleteConfirmDialog';

// DND Kit imports
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

interface InventoryShelf {
  id: string;
  name: string;
  type: 'seeds' | 'plants' | 'tools';
  description: string | null;
  created_at: string;
  position?: number;
}

const SortableShelfCard = ({ shelf, onEdit, onDelete }: { 
  shelf: InventoryShelf; 
  onEdit: (shelf: InventoryShelf) => void;
  onDelete: (shelf: InventoryShelf) => void;
}) => {
  const navigate = useNavigate();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: shelf.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    cursor: 'grab',
  };

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

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
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
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(shelf);
                }}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(shelf);
                }}
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
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/dashboard/inventory/${shelf.id}`);
            }}
          >
            View Items
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const InventoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [shelves, setShelves] = useState<InventoryShelf[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedShelf, setSelectedShelf] = useState<InventoryShelf | null>(null);
  const navigate = useNavigate();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  useEffect(() => {
    fetchShelves();
  }, []);
  
  const fetchShelves = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('inventory_shelves')
        .select('*')
        .order('position', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setShelves(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch inventory shelves",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setShelves((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
      
      // Update positions in the database
      const updatedShelves = shelves.map((shelf, index) => ({
        id: shelf.id,
        position: index
      }));
      
      try {
        // Update each shelf's position in the database
        for (const shelf of updatedShelves) {
          const { error } = await supabase
            .from('inventory_shelves')
            .update({ position: shelf.position })
            .eq('id', shelf.id);
            
          if (error) throw error;
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to update shelf positions",
          variant: "destructive"
        });
        // Refetch shelves to ensure UI is in sync with database
        fetchShelves();
      }
    }
  };
  
  const handleEditShelf = (shelf: InventoryShelf) => {
    setSelectedShelf(shelf);
    setEditDialogOpen(true);
  };
  
  const handleDeleteShelf = (shelf: InventoryShelf) => {
    setSelectedShelf(shelf);
    setDeleteDialogOpen(true);
  };
  
  const confirmDeleteShelf = async () => {
    if (!selectedShelf) return;
    
    try {
      const { error } = await supabase
        .from('inventory_shelves')
        .delete()
        .eq('id', selectedShelf.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Shelf deleted successfully",
      });
      
      fetchShelves();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete shelf",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedShelf(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Shelf
          </Button>
        </div>
        
        <p className="text-muted-foreground">
          Manage your garden inventory by creating different types of shelves for seeds, plants, and tools. Drag to reorder shelves.
        </p>
        
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : shelves.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent className="pt-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Archive className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">No shelves found</h3>
                <p className="text-muted-foreground">
                  Start by creating a shelf to organize your garden inventory.
                </p>
                <Button onClick={() => setCreateDialogOpen(true)} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Shelf
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={shelves.map(shelf => shelf.id)} strategy={verticalListSortingStrategy}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {shelves.map((shelf) => (
                  <SortableShelfCard
                    key={shelf.id}
                    shelf={shelf}
                    onEdit={handleEditShelf}
                    onDelete={handleDeleteShelf}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
      
      <CreateShelfDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen} 
        onShelfCreated={fetchShelves} 
      />
      
      {selectedShelf && (
        <EditShelfDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          shelf={selectedShelf}
          onShelfUpdated={fetchShelves}
        />
      )}
      
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Shelf"
        description={`Are you sure you want to delete the shelf "${selectedShelf?.name}"? This action cannot be undone and will remove all items in this shelf.`}
        onConfirm={confirmDeleteShelf}
      />
    </DashboardLayout>
  );
};

export default InventoryPage;
