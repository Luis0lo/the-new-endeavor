
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import CreateShelfDialog from '@/components/inventory/CreateShelfDialog';
import SortableShelves, { Shelf } from '@/components/inventory/SortableShelves';

const InventoryPage = () => {
  const [shelves, setShelves] = useState<Shelf[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Helper function to fetch item counts for each shelf
  const fetchItemCounts = async (shelfIds: string[]) => {
    try {
      const counts: Record<string, number> = {};
      
      const { data, error } = await supabase
        .from('inventory_items')
        .select('shelf_id, count')
        .in('shelf_id', shelfIds)
        .group('shelf_id');
      
      if (error) throw error;
      
      // Set the counts
      data.forEach(item => {
        counts[item.shelf_id] = item.count;
      });
      
      return counts;
    } catch (error: any) {
      console.error('Error fetching item counts:', error);
      return {};
    }
  };

  // Fetch all shelves
  const fetchShelves = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('inventory_shelves')
        .select('*')
        .order('position', { ascending: true });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Fetch item counts for each shelf
        const shelfIds = data.map(shelf => shelf.id);
        const itemCounts = await fetchItemCounts(shelfIds);
        
        // Add item counts to the shelves
        const shelvesWithCounts = data.map(shelf => ({
          ...shelf,
          itemCount: itemCounts[shelf.id] || 0
        }));
        
        setShelves(shelvesWithCounts);
      } else {
        setShelves([]);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load inventory shelves',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle shelf reordering
  const handleShelvesReorder = async (reorderedShelves: Shelf[]) => {
    try {
      // Update local state immediately for responsive UI
      setShelves(reorderedShelves);
      
      // For each shelf, update its position in the database
      for (const shelf of reorderedShelves) {
        const { error } = await supabase
          .from('inventory_shelves')
          .update({ position: shelf.position })
          .eq('id', shelf.id);
        
        if (error) throw error;
      }
      
      toast({
        title: 'Shelves reordered',
        description: 'Shelf order has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update shelf order',
        variant: 'destructive',
      });
      
      // Revert back to original order if there's an error
      fetchShelves();
    }
  };

  // Handle shelf deletion
  const handleShelfDeleted = async () => {
    if (!shelves.length) return;
    
    try {
      const { error } = await supabase
        .from('inventory_shelves')
        .delete()
        .eq('id', shelves[shelves.length - 1].id);
      
      if (error) throw error;
      
      toast({
        title: 'Shelf deleted',
        description: 'The shelf has been deleted successfully.',
      });
      
      // Refresh shelves after deletion
      fetchShelves();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete shelf',
        variant: 'destructive',
      });
    }
  };

  // Navigate to shelf detail page
  const handleShelfClick = (shelfId: string) => {
    navigate(`/dashboard/inventory/${shelfId}`);
  };

  // Initial load
  useEffect(() => {
    fetchShelves();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Inventory</h1>
            <p className="text-muted-foreground">
              Manage your garden inventory across different shelves
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Shelf
          </Button>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="flex justify-center">
              <p>Loading shelves...</p>
            </div>
          ) : shelves.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <h3 className="font-medium text-lg">No shelves yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first inventory shelf to start organizing your garden supplies
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Shelf
              </Button>
            </div>
          ) : (
            <SortableShelves 
              shelves={shelves}
              onShelvesReorder={handleShelvesReorder}
              onShelfClick={handleShelfClick}
              onShelfUpdated={fetchShelves}
              onShelfDeleted={handleShelfDeleted}
            />
          )}
        </div>
      </div>

      <CreateShelfDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onShelfCreated={fetchShelves}
      />
    </DashboardLayout>
  );
};

export default InventoryPage;
