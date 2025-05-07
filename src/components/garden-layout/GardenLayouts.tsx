
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Save, Trash, FolderOpen, PlusCircle } from 'lucide-react';

interface GardenLayout {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  layout_data: string;
  description?: string;
  preview?: string;
  user_id: string;
}

interface GardenLayoutsProps {
  canvasJson: string;
  loadGardenLayout: (layoutJson: string) => void;
  generatePreview: () => string;
}

const GardenLayouts: React.FC<GardenLayoutsProps> = ({ 
  canvasJson, 
  loadGardenLayout,
  generatePreview
}) => {
  const [layouts, setLayouts] = useState<GardenLayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [gardenName, setGardenName] = useState('');
  const [gardenDescription, setGardenDescription] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setUserId(data.session?.user.id || null);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user.id || null);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch garden layouts when user is logged in
  useEffect(() => {
    if (userId) {
      fetchGardenLayouts();
    } else {
      setLayouts([]);
      setLoading(false);
    }
  }, [userId]);

  const fetchGardenLayouts = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access your saved garden layouts.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Use a type assertion to work around TypeScript limitation
      // until the types are updated to include the new garden_layouts table
      const { data, error } = await supabase
        .from('garden_layouts')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false }) as any;
      
      if (error) throw error;
      
      setLayouts(data || []);
    } catch (error: any) {
      console.error('Error fetching garden layouts:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load garden layouts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGarden = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save garden layouts.",
        variant: "destructive"
      });
      return;
    }

    if (!gardenName.trim()) {
      toast({
        title: "Name required",
        description: "Please provide a name for your garden layout.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate preview
      const preview = generatePreview();
      
      // Use a type assertion to work around TypeScript limitation
      const { data, error } = await supabase
        .from('garden_layouts')
        .insert({
          user_id: userId,
          name: gardenName,
          description: gardenDescription || null,
          layout_data: canvasJson,
          preview
        })
        .select() as any;
      
      if (error) throw error;
      
      toast({
        title: "Garden saved",
        description: `"${gardenName}" has been saved to your garden layouts.`
      });
      
      // Reset form and close dialog
      setGardenName('');
      setGardenDescription('');
      setSaveDialogOpen(false);
      
      // Refresh the list
      fetchGardenLayouts();
      
    } catch (error: any) {
      console.error('Error saving garden layout:', error);
      toast({
        title: "Save failed",
        description: error.message || "There was a problem saving your garden layout.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteGarden = async () => {
    if (!selectedLayoutId) return;
    
    try {
      // Use a type assertion to work around TypeScript limitation
      const { error } = await supabase
        .from('garden_layouts')
        .delete()
        .eq('id', selectedLayoutId) as any;
      
      if (error) throw error;
      
      toast({
        title: "Garden deleted",
        description: "Your garden layout has been deleted."
      });
      
      setDeleteDialogOpen(false);
      fetchGardenLayouts();
      
    } catch (error: any) {
      console.error('Error deleting garden layout:', error);
      toast({
        title: "Delete failed",
        description: error.message || "There was a problem deleting your garden layout.",
        variant: "destructive"
      });
    }
  };

  const confirmDeleteGarden = (id: string) => {
    setSelectedLayoutId(id);
    setDeleteDialogOpen(true);
  };

  const loadLayout = (layout: GardenLayout) => {
    try {
      loadGardenLayout(layout.layout_data);
      
      toast({
        title: "Garden loaded",
        description: `"${layout.name}" has been loaded successfully.`
      });
    } catch (error: any) {
      console.error('Error loading garden layout:', error);
      toast({
        title: "Load failed",
        description: error.message || "There was a problem loading your garden layout.",
        variant: "destructive"
      });
    }
  };

  if (!userId) {
    return (
      <div className="space-y-4 p-4">
        <div className="text-center p-8 border border-dashed rounded-md">
          <h3 className="text-lg font-medium mb-2">Sign in to save garden layouts</h3>
          <p className="text-muted-foreground mb-4">
            Create an account to save and manage your garden designs.
          </p>
          <Button variant="default">Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Garden Layouts</h3>
        <Button
          onClick={() => setSaveDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Save size={16} />
          <span>Save Current Layout</span>
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p>Loading your garden layouts...</p>
        </div>
      ) : layouts.length === 0 ? (
        <div className="text-center p-6 border border-dashed rounded-md">
          <h4 className="font-medium mb-2">No garden layouts saved yet</h4>
          <p className="text-muted-foreground mb-4">
            Create and save your first garden layout to see it here.
          </p>
          <Button 
            onClick={() => setSaveDialogOpen(true)}
            variant="default"
            className="flex items-center gap-2 mx-auto"
          >
            <PlusCircle size={16} />
            <span>Save Current Layout</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {layouts.map((layout) => (
            <div 
              key={layout.id} 
              className="border rounded-md overflow-hidden flex flex-col"
            >
              <div className="p-3 border-b bg-muted/50">
                <h4 className="font-medium truncate">{layout.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {new Date(layout.updated_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex-grow p-2 bg-white">
                {layout.preview ? (
                  <div 
                    className="w-full h-[120px] bg-contain bg-center bg-no-repeat" 
                    style={{ backgroundImage: `url(${layout.preview})` }}
                  />
                ) : (
                  <div className="w-full h-[120px] bg-muted/30 flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">No preview</span>
                  </div>
                )}
              </div>

              <div className="p-2 flex justify-between border-t">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={() => loadLayout(layout)}
                >
                  <FolderOpen size={14} />
                  <span>Load</span>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={() => confirmDeleteGarden(layout.id)}
                >
                  <Trash size={14} />
                  <span>Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Garden Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Garden Layout</DialogTitle>
            <DialogDescription>
              Give your garden layout a name and optional description.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="garden-name">Garden Name</Label>
              <Input
                id="garden-name"
                placeholder="My Garden Design"
                value={gardenName}
                onChange={(e) => setGardenName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="garden-description">Description (optional)</Label>
              <Input
                id="garden-description"
                placeholder="Front yard vegetable garden"
                value={gardenDescription}
                onChange={(e) => setGardenDescription(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveGarden}>
              Save Garden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Garden Layout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this garden layout? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteGarden}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GardenLayouts;
