
import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Check } from 'lucide-react';
import { SeedCalendarEntry } from '@/hooks/useSeedCalendar';
import AddVegetableDialog from './AddVegetableDialog';
import VegetableDetailsDialog from './VegetableDetailsDialog';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Search logic
  useEffect(() => {
    if (!searchTerm.trim() || searchTerm.length < 3) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }
    
    const term = searchTerm.toLowerCase().trim();
    const results = seedData.filter(vegetable => 
      vegetable.vegetable.toLowerCase().includes(term)
    );
    
    setSearchResults(results);
    setShowSuggestions(true);
  }, [searchTerm, seedData]);

  const handleSuggestionClick = (vegetable: SeedCalendarEntry) => {
    setSelectedVegetable(vegetable);
    setSearchTerm(vegetable.vegetable);
    setShowSuggestions(false);
    setDetailsDialogOpen(true);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      return;
    }
    
    // If we have results, show the first one
    if (searchResults.length > 0) {
      setSelectedVegetable(searchResults[0]);
      setDetailsDialogOpen(true);
      setShowSuggestions(false);
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
      <div ref={searchContainerRef} className="relative">
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
              onFocus={() => {
                if (searchResults.length > 0 && searchTerm.length >= 3) {
                  setShowSuggestions(true);
                }
              }}
            />
          </div>
          <Button type="submit" className="gap-2">
            <Search size={16} />
            <span>Search</span>
          </Button>
        </form>

        {/* Autocomplete suggestions dropdown */}
        {showSuggestions && searchResults.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-md max-h-60 overflow-y-auto">
            <ul className="py-1">
              {searchResults.map((vegetable) => (
                <li 
                  key={vegetable.id} 
                  className="px-3 py-2 hover:bg-muted cursor-pointer flex items-center justify-between"
                  onClick={() => handleSuggestionClick(vegetable)}
                >
                  <span>{vegetable.vegetable}</span>
                  {selectedVegetable?.id === vegetable.id && (
                    <Check size={16} className="text-primary" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <AddVegetableDialog 
        onVegetableAdded={onVegetableAdded} 
        userId={userId} 
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        initialVegetableName={searchResults.length === 0 ? searchTerm : ""}
      />
      
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
