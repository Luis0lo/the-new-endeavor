
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from 'lucide-react';
import { SeedCalendarEntry } from '@/hooks/useSeedCalendar';
import AddVegetableDialog from './AddVegetableDialog';
import VegetableDetailsDialog from './VegetableDetailsDialog';
import { toast } from '@/hooks/use-toast';

interface SeedSearchProps {
  seedData: SeedCalendarEntry[];
  months: string[];
  legendItems: { label: string; color: string }[];
  isMonthInPeriods: (periods: string[], monthIndex: number) => boolean;
  userId: string | null;
  onVegetableAdded: () => void;
}

const SeedSearch: React.FC<SeedSearchProps> = ({
  seedData,
  months,
  legendItems,
  isMonthInPeriods,
  userId,
  onVegetableAdded
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SeedCalendarEntry[]>([]);
  const [selectedVegetable, setSelectedVegetable] = useState<SeedCalendarEntry | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  // Search logic
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    const term = searchTerm.toLowerCase().trim();
    const results = seedData.filter(vegetable => 
      vegetable.vegetable.toLowerCase().includes(term)
    );
    
    setSearchResults(results);
  }, [searchTerm, seedData]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      return;
    }
    
    // If we have results, show the first one
    if (searchResults.length > 0) {
      setSelectedVegetable(searchResults[0]);
      setDetailsDialogOpen(true);
    } else {
      toast({
        title: "Vegetable not found",
        description: "Would you like to add this vegetable to your calendar?",
        action: (
          <Button 
            variant="default" 
            onClick={() => setAddDialogOpen(true)}
            className="gap-1"
          >
            <Plus size={14} />
            Add
          </Button>
        )
      });
    }
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search 
            className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" 
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="Search vegetables..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button type="submit" className="gap-2">
          <Search size={16} />
          <span>Search</span>
        </Button>
        <AddVegetableDialog 
          onVegetableAdded={onVegetableAdded} 
          userId={userId} 
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          initialVegetableName={searchResults.length === 0 ? searchTerm : ""}
        />
      </form>
      
      {/* Details dialog for the selected vegetable */}
      {selectedVegetable && (
        <VegetableDetailsDialog
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          vegetable={selectedVegetable}
          months={months}
          legendItems={legendItems}
          isMonthInPeriods={isMonthInPeriods}
        />
      )}
    </div>
  );
};

export default SeedSearch;
