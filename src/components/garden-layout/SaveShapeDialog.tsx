
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface SaveShapeDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  shapeName: string;
  setShapeName: (name: string) => void;
  onSave: () => void;
}

const SaveShapeDialog: React.FC<SaveShapeDialogProps> = ({
  open,
  setOpen,
  shapeName,
  setShapeName,
  onSave
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Shape</DialogTitle>
          <DialogDescription>
            Give your shape a name so you can reuse it in other garden layouts.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="shape-name">Shape Name</Label>
            <Input 
              id="shape-name" 
              value={shapeName} 
              onChange={(e) => setShapeName(e.target.value)} 
              placeholder="Enter a name for this shape"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={onSave} disabled={!shapeName.trim()}>Save Shape</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveShapeDialog;
