
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SeedCalendarEntry } from '@/hooks/useSeedCalendar';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface MonthRange {
  start: number;
  end: number;
}

interface EditVegetableDialogProps {
  vegetable: SeedCalendarEntry;
  onVegetableUpdated: () => void;
}

const EditVegetableDialog: React.FC<EditVegetableDialogProps> = ({ vegetable, onVegetableUpdated }) => {
  const [open, setOpen] = useState(false);
  const [vegetableName, setVegetableName] = useState(vegetable.vegetable);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Month selections for each activity
  const [sowIndoors, setSowIndoors] = useState<number[]>([]);
  const [sowOutdoors, setSowOutdoors] = useState<number[]>([]);
  const [transplantOutdoors, setTransplantOutdoors] = useState<number[]>([]);
  const [harvestPeriod, setHarvestPeriod] = useState<number[]>([]);

  // Convert month ranges back to month indices
  const getMonthIndicesFromRanges = (ranges: string[] = []) => {
    const indices: number[] = [];
    
    ranges.forEach(range => {
      const pattern = /([A-Za-z]{3})-?([A-Za-z]{3})?/g;
      const match = pattern.exec(range);
      
      if (match) {
        const startMonthIndex = months.findIndex(m => m === match[1]);
        const endMonthIndex = match[2] 
          ? months.findIndex(m => m === match[2])
          : startMonthIndex;
        
        if (startMonthIndex >= 0 && endMonthIndex >= 0) {
          // Handle case where period crosses year boundary (e.g., Nov-Feb)
          if (startMonthIndex > endMonthIndex) {
            // Add months from start to December
            for (let i = startMonthIndex; i < 12; i++) {
              indices.push(i);
            }
            // Add months from January to end
            for (let i = 0; i <= endMonthIndex; i++) {
              indices.push(i);
            }
          } else {
            // Regular case
            for (let i = startMonthIndex; i <= endMonthIndex; i++) {
              indices.push(i);
            }
          }
        }
      } else if (range.length === 3) {
        // Single month (e.g. "Jan")
        const monthIndex = months.findIndex(m => m === range);
        if (monthIndex >= 0) {
          indices.push(monthIndex);
        }
      }
    });
    
    return [...new Set(indices)]; // Remove duplicates
  };

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

  useEffect(() => {
    if (open) {
      // Initialize month selections from vegetable data
      setSowIndoors(getMonthIndicesFromRanges(vegetable.sow_indoors));
      setSowOutdoors(getMonthIndicesFromRanges(vegetable.sow_outdoors));
      setTransplantOutdoors(getMonthIndicesFromRanges(vegetable.transplant_outdoors));
      setHarvestPeriod(getMonthIndicesFromRanges(vegetable.harvest_period));
    }
  }, [open, vegetable]);

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
    
    if (!vegetableName.trim()) {
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
        .from('user_seed_calendar')
        .update({
          vegetable: vegetableName,
          sow_indoors: monthsToRanges(sowIndoors),
          sow_outdoors: monthsToRanges(sowOutdoors),
          transplant_outdoors: monthsToRanges(transplantOutdoors),
          harvest_period: monthsToRanges(harvestPeriod)
        })
        .eq('id', vegetable.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `${vegetableName} has been updated in the seed calendar.`
      });
      
      // Close dialog
      setOpen(false);
      
      // Refresh data
      onVegetableUpdated();

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update vegetable",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 ml-1">
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Edit Vegetable in Seed Calendar</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="vegetable">Vegetable Name</Label>
            <Input 
              id="vegetable" 
              value={vegetableName} 
              onChange={(e) => setVegetableName(e.target.value)} 
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
            disabled={isSubmitting || !vegetableName.trim()}
          >
            {isSubmitting ? "Updating..." : "Update Calendar Entry"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditVegetableDialog;
