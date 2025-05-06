
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface MonthRange {
  start: number;
  end: number;
}

interface AddVegetableDialogProps {
  onVegetableAdded: () => void;
}

const AddVegetableDialog: React.FC<AddVegetableDialogProps> = ({ onVegetableAdded }) => {
  const [open, setOpen] = useState(false);
  const [vegetable, setVegetable] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Month selections for each activity
  const [sowIndoors, setSowIndoors] = useState<number[]>([]);
  const [sowOutdoors, setSowOutdoors] = useState<number[]>([]);
  const [transplantOutdoors, setTransplantOutdoors] = useState<number[]>([]);
  const [harvestPeriod, setHarvestPeriod] = useState<number[]>([]);

  // Convert selected months to ranges (e.g., "Jan-Mar")
  const monthsToRanges = (selectedMonths: number[]): string[] => {
    if (selectedMonths.length === 0) return [];
    
    const sorted = [...selectedMonths].sort((a, b) => a - b);
    const ranges: MonthRange[] = [];
    
    let currentRange: MonthRange = { start: sorted[0], end: sorted[0] };
    
    for (let i = 1; i < sorted.length; i++) {
      const month = sorted[i];
      const prevMonth = sorted[i - 1];
      
      if (month === prevMonth + 1) {
        // Continue the current range
        currentRange.end = month;
      } else {
        // Start a new range
        ranges.push(currentRange);
        currentRange = { start: month, end: month };
      }
    }
    
    // Add the last range
    ranges.push(currentRange);
    
    // Convert ranges to strings like "Jan-Mar" or just "Apr" for single months
    return ranges.map(range => {
      if (range.start === range.end) {
        return months[range.start];
      } else {
        return `${months[range.start]}-${months[range.end]}`;
      }
    });
  };

  const handleToggleMonth = (
    monthIndex: number, 
    selectedMonths: number[], 
    setSelectedMonths: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    if (selectedMonths.includes(monthIndex)) {
      setSelectedMonths(selectedMonths.filter(m => m !== monthIndex));
    } else {
      setSelectedMonths([...selectedMonths, monthIndex]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vegetable.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a vegetable name.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('seed_calendar_uk')
        .insert({
          vegetable,
          sow_indoors: monthsToRanges(sowIndoors),
          sow_outdoors: monthsToRanges(sowOutdoors),
          transplant_outdoors: monthsToRanges(transplantOutdoors),
          harvest_period: monthsToRanges(harvestPeriod)
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `${vegetable} has been added to the seed calendar.`
      });
      
      // Reset form
      setVegetable('');
      setSowIndoors([]);
      setSowOutdoors([]);
      setTransplantOutdoors([]);
      setHarvestPeriod([]);
      
      // Close dialog
      setOpen(false);
      
      // Refresh data
      onVegetableAdded();

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add vegetable",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          <span>Add Vegetable</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Add New Vegetable to Seed Calendar</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="vegetable">Vegetable Name</Label>
            <Input 
              id="vegetable" 
              value={vegetable} 
              onChange={(e) => setVegetable(e.target.value)} 
              placeholder="e.g., Tomatoes" 
              required 
            />
          </div>

          <div className="space-y-6">
            {/* Sow Indoors */}
            <div className="space-y-2">
              <Label className="text-purple-600">Sow Indoors</Label>
              <div className="flex flex-row flex-wrap gap-3">
                {months.map((month, idx) => (
                  <div key={`indoor-${idx}`} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`indoor-${idx}`} 
                      checked={sowIndoors.includes(idx)} 
                      onCheckedChange={() => handleToggleMonth(idx, sowIndoors, setSowIndoors)}
                    />
                    <label 
                      htmlFor={`indoor-${idx}`} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {month}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sow Outdoors */}
            <div className="space-y-2">
              <Label className="text-yellow-500">Sow Outdoors</Label>
              <div className="flex flex-row flex-wrap gap-3">
                {months.map((month, idx) => (
                  <div key={`outdoor-${idx}`} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`outdoor-${idx}`} 
                      checked={sowOutdoors.includes(idx)} 
                      onCheckedChange={() => handleToggleMonth(idx, sowOutdoors, setSowOutdoors)}
                    />
                    <label 
                      htmlFor={`outdoor-${idx}`} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {month}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Plant Outdoors */}
            <div className="space-y-2">
              <Label className="text-green-500">Plant Outdoors</Label>
              <div className="flex flex-row flex-wrap gap-3">
                {months.map((month, idx) => (
                  <div key={`transplant-${idx}`} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`transplant-${idx}`} 
                      checked={transplantOutdoors.includes(idx)} 
                      onCheckedChange={() => handleToggleMonth(idx, transplantOutdoors, setTransplantOutdoors)}
                    />
                    <label 
                      htmlFor={`transplant-${idx}`} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {month}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Harvest Period */}
            <div className="space-y-2">
              <Label className="text-red-500">Harvest</Label>
              <div className="flex flex-row flex-wrap gap-3">
                {months.map((month, idx) => (
                  <div key={`harvest-${idx}`} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`harvest-${idx}`} 
                      checked={harvestPeriod.includes(idx)} 
                      onCheckedChange={() => handleToggleMonth(idx, harvestPeriod, setHarvestPeriod)}
                    />
                    <label 
                      htmlFor={`harvest-${idx}`} 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {month}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || !vegetable.trim()}
          >
            {isSubmitting ? "Adding..." : "Add to Calendar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVegetableDialog;
