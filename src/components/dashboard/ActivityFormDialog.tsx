
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Plus } from 'lucide-react';

interface ActivityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  setDate: (date: Date) => void;
}

const ActivityFormDialog: React.FC<ActivityFormDialogProps> = ({
  open,
  onOpenChange,
  date,
  onSubmit,
  title,
  setTitle,
  description,
  setDescription,
  setDate
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          <span>Add Activity</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Garden Activity</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Activity Title</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="E.g., Water tomatoes" 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Add notes or instructions..." 
            />
          </div>
          <div className="space-y-2">
            <Label>Scheduled Date</Label>
            <div className="border rounded-md p-2">
              <Calendar 
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)} 
                className="mx-auto"
              />
            </div>
          </div>
          <Button type="submit" className="w-full">Schedule Activity</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityFormDialog;
