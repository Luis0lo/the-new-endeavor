
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Plus, Archive, Leaf, Tool } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import CreateShelfDialog from '@/components/inventory/CreateShelfDialog';

interface InventoryShelf {
  id: string;
  name: string;
  type: 'seeds' | 'plants' | 'tools';
  description: string | null;
  created_at: string;
}

const InventoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [shelves, setShelves] = useState<InventoryShelf[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchShelves();
  }, []);
  
  const fetchShelves = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('inventory_shelves')
        .select('*')
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
  
  const getShelfIcon = (type: 'seeds' | 'plants' | 'tools') => {
    switch (type) {
      case 'seeds':
        return <Archive className="h-5 w-5 text-yellow-500" />;
      case 'plants':
        return <Leaf className="h-5 w-5 text-green-500" />;
      case 'tools':
        return <Tool className="h-5 w-5 text-blue-500" />;
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
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Inventory Management</h2>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Shelf
          </Button>
        </div>
        
        <p className="text-muted-foreground">
          Manage your garden inventory by creating different types of shelves for seeds, plants, and tools.
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
                <Button onClick={() => setDialogOpen(true)} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Shelf
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shelves.map((shelf) => (
              <Card key={shelf.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    {getShelfIcon(shelf.type)}
                    <div>
                      <CardTitle>{shelf.name}</CardTitle>
                      <CardDescription>{getShelfTypeText(shelf.type)}</CardDescription>
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
                    onClick={() => navigate(`/dashboard/inventory/${shelf.id}`)}
                  >
                    View Items
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <CreateShelfDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        onShelfCreated={fetchShelves} 
      />
    </DashboardLayout>
  );
};

export default InventoryPage;
