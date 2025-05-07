
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

interface UseGardenLayoutsProps {
  canvasJson: string;
  loadGardenLayout: (layoutJson: string) => void;
  generatePreview: () => string;
}

export const useGardenLayouts = ({ 
  canvasJson, 
  loadGardenLayout,
  generatePreview 
}: UseGardenLayoutsProps) => {
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

  return {
    layouts,
    loading,
    saveDialogOpen,
    setSaveDialogOpen,
    gardenName,
    setGardenName,
    gardenDescription,
    setGardenDescription,
    deleteDialogOpen,
    setDeleteDialogOpen,
    userId,
    handleSaveGarden,
    confirmDeleteGarden,
    handleDeleteGarden,
    loadLayout
  };
};
