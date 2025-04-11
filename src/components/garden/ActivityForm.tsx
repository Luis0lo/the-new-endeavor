
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { GardenActivity } from '@/types/garden';

interface ActivityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any) => void;
  initialDate: Date;
  initialActivity: GardenActivity | null;
}

const ActivityForm: React.FC<ActivityFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDate,
  initialActivity
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState('');
  
  // Reset form when opened or when initialActivity changes
  useEffect(() => {
    if (isOpen) {
      setDate(initialDate);
      
      if (initialActivity) {
        setTitle(initialActivity.title);
        setDescription(initialActivity.description || '');
        
        if (initialActivity.activity_time) {
          setTime(initialActivity.activity_time);
        } else {
          setTime('');
        }
      } else {
        setTitle('');
        setDescription('');
        setTime('');
      }
    }
  }, [isOpen, initialActivity, initialDate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      title,
      description,
      date: format(date, 'yyyy-MM-dd'),
      time
    });
    
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialActivity ? 'Edit Garden Activity' : 'Add Garden Activity'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
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
            <Label htmlFor="time">Time (Optional)</Label>
            <Input 
              id="time" 
              type="time"
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
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
            <Label>Date</Label>
            <div className="border rounded-md p-2">
              <Calendar 
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)} 
                className="mx-auto"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialActivity ? 'Update' : 'Create'} Activity
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityForm;
