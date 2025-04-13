
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InventoryShelf {
  id: string;
  name: string;
  type: 'seeds' | 'plants' | 'tools';
  description: string | null;
}

interface EditShelfDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShelfUpdated: () => void;
  shelf: InventoryShelf | null;
}

const EditShelfDialog: React.FC<EditShelfDialogProps> = ({ open, onOpenChange, onShelfUpdated, shelf }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<'seeds' | 'plants' | 'tools'>('seeds');
  const [description, setDescription] = useState('');
  
  useEffect(() => {
    if (shelf) {
      setName(shelf.name);
      setType(shelf.type);
      setDescription(shelf.description || '');
    }
  }, [shelf]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for your shelf",
        variant: "destructive"
      });
      return;
    }
    
    if (!shelf) {
      toast({
        title: "Error",
        description: "No shelf selected for editing",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('inventory_shelves')
        .update({
          name: name.trim(),
          type,
          description: description.trim() || null,
        })
        .eq('id', shelf.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: `${name} shelf has been updated successfully.`
      });
      
      onOpenChange(false);
      onShelfUpdated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update shelf",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Shelf</DialogTitle>
          <DialogDescription>
            Update your inventory shelf information.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                placeholder="My Seeds Collection"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select value={type} onValueChange={(value: 'seeds' | 'plants' | 'tools') => setType(value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select shelf type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seeds">Seeds</SelectItem>
                  <SelectItem value="plants">Plants</SelectItem>
                  <SelectItem value="tools">Tools</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Optional description of this shelf"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Shelf'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditShelfDialog;
