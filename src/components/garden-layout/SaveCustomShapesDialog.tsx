
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SaveCustomShapesDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  shapesName: string;
  setShapesName: (name: string) => void;
  shapesDescription: string;
  setShapesDescription: (description: string) => void;
  onSave: () => void;
  shapeCount: number;
}

const SaveCustomShapesDialog: React.FC<SaveCustomShapesDialogProps> = ({
  open,
  setOpen,
  shapesName,
  setShapesName,
  shapesDescription,
  setShapesDescription,
  onSave,
  shapeCount
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Custom Shapes</DialogTitle>
          <DialogDescription>
            Give your {shapeCount > 1 ? `${shapeCount} shapes` : 'shape'} a name before adding to your garden layout.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="shapes-name">Name</Label>
            <Input
              id="shapes-name"
              placeholder="My Custom Landscape"
              value={shapesName}
              onChange={(e) => setShapesName(e.target.value)}
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="shapes-description">Description (optional)</Label>
            <Textarea
              id="shapes-description"
              placeholder="Description of these shapes"
              value={shapesDescription}
              onChange={(e) => setShapesDescription(e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={!shapesName.trim()}>
            Save & Use Shapes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveCustomShapesDialog;
