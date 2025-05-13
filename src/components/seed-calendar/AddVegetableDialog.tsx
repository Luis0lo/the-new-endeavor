
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import DeleteConfirmDialog from '@/components/inventory/DeleteConfirmDialog';
import { normalizeString } from '@/lib/utils';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface MonthRange {
  start: number;
  end: number;
}

interface AddVegetableDialogProps {
  onVegetableAdded: () => void;
  userId: string | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialVegetableName?: string;
}

const AddVegetableDialog: React.FC<AddVegetableDialogProps> = ({ 
  onVegetableAdded, 
  userId,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  initialVegetableName = ""
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [vegetable, setVegetable] = useState(initialVegetableName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDuplicateConfirm, setShowDuplicateConfirm] = useState(false);
  const [duplicateEntry, setDuplicateEntry] = useState<{ id: string, isUserEntry: boolean } | null>(null);
  
  // Determine if this is a controlled or uncontrolled component
  const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const setOpen = isControlled ? setControlledOpen : setUncontrolledOpen;
  
  // Update vegetable state when initialVegetableName changes
  useEffect(() => {
    if (initialVegetableName) {
      setVegetable(initialVegetableName);
    }
  }, [initialVegetableName]);
  
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

  // Check if a vegetable with the same name already exists
  const checkForDuplicate = async (): Promise<boolean> => {
    if (!vegetable.trim()) return false;
    
    try {
      // Check user's own entries first (case insensitive)
      if (userId) {
        const { data: userData, error: userError } = await supabase
          .from('user_seed_calendar')
          .select('id')
          .eq('user_id', userId)
          .ilike('vegetable', vegetable.trim());
          
        if (userError) throw userError;
        
        if (userData && userData.length > 0) {
          setDuplicateEntry({ id: userData[0].id, isUserEntry: true });
          return true;
        }
      }
      
      // Check default entries (if no user entry was found)
      const { data: defaultData, error: defaultError } = await supabase
        .from('seed_calendar_uk')
        .select('id')
        .ilike('vegetable', vegetable.trim());
        
      if (defaultError) throw defaultError;
      
      if (defaultData && defaultData.length > 0) {
        setDuplicateEntry({ id: defaultData[0].id, isUserEntry: false });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error checking for duplicate vegetable:", error);
      return false;
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

    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to add vegetables to your calendar.",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicates before proceeding
    const hasDuplicate = await checkForDuplicate();
    if (hasDuplicate) {
      setShowDuplicateConfirm(true);
      return;
    }

    // If no duplicate, proceed with submission
    await submitVegetable();
  };

  const submitVegetable = async () => {
    if (!userId || !vegetable.trim()) return;
    
    setIsSubmitting(true);

    try {
      // If there's a duplicate that is a user entry, delete it first
      if (duplicateEntry && duplicateEntry.isUserEntry) {
        const { error: deleteError } = await supabase
          .from('user_seed_calendar')
          .delete()
          .eq('id', duplicateEntry.id);

        if (deleteError) throw deleteError;
      }
      
      const tableName = 'user_seed_calendar';
      
      const { error } = await supabase
        .from(tableName)
        .insert({
          vegetable,
          user_id: userId,
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
        description: duplicateEntry 
          ? `${vegetable} has been updated in the seed calendar.`
          : `${vegetable} has been added to the seed calendar.`
      });
      
      // Reset form
      setVegetable('');
      setSowIndoors([]);
      setSowOutdoors([]);
      setTransplantOutdoors([]);
      setHarvestPeriod([]);
      setDuplicateEntry(null);
      
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
      setShowDuplicateConfirm(false);
    }
  };

  const handleCancelDuplicate = () => {
    setShowDuplicateConfirm(false);
    setDuplicateEntry(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {!isControlled && (
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              <span>Add Vegetable</span>
            </Button>
          </DialogTrigger>
        )}
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
              disabled={isSubmitting || !vegetable.trim() || !userId}
            >
              {isSubmitting ? "Adding..." : (!userId ? "Login to Add" : "Add to Calendar")}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Duplicate Vegetable Confirmation Dialog */}
      <DeleteConfirmDialog
        open={showDuplicateConfirm}
        onOpenChange={setShowDuplicateConfirm}
        title="Vegetable Already Exists"
        description={`"${vegetable}" already exists in the seed calendar. Adding a new entry will replace the existing one.`}
        onConfirm={submitVegetable}
        showWarning={duplicateEntry?.isUserEntry === false}
        warningMessage={duplicateEntry?.isUserEntry === false 
          ? "This will create a personal copy and override the default calendar entry." 
          : undefined}
      />
    </>
  );
};

export default AddVegetableDialog;
