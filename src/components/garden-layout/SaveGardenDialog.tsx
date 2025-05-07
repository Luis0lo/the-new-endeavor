
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SaveGardenDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  gardenName: string;
  setGardenName: (name: string) => void;
  gardenDescription: string;
  setGardenDescription: (description: string) => void;
  onSave: () => void;
}

const SaveGardenDialog: React.FC<SaveGardenDialogProps> = ({
  open,
  setOpen,
  gardenName,
  setGardenName,
  gardenDescription,
  setGardenDescription,
  onSave
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            Save Garden
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveGardenDialog;
