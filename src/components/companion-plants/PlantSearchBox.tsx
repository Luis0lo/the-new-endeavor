
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, Loader2, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Plant } from '@/hooks/usePlants';

interface PlantSearchBoxProps {
  plants: Plant[];
  loading: boolean;
  onSelectPlant: (plant: Plant) => void;
}

export function PlantSearchBox({ plants, loading, onSelectPlant }: PlantSearchBoxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleSelectPlant = (currentValue: string) => {
    const selectedPlant = plants.find(plant => plant.id === currentValue);
    if (selectedPlant) {
      onSelectPlant(selectedPlant);
      setValue("");
      setOpen(false);
    }
  };
  
  // Filter plants based on searchTerm
  const filteredPlants = searchTerm
    ? plants.filter(plant => 
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (plant.scientific_name && plant.scientific_name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : plants;

  return (
    <div className="relative">
      <div className="flex items-center mb-2">
        <Search className="h-4 w-4 mr-2 text-muted-foreground" />
        <span className="text-sm font-medium">Or search for a plant</span>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span>Loading plants...</span>
              </div>
            ) : (
              <>
                <span>Search for a plant...</span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </>
            )}
          </Button>
        </PopoverTrigger>
        
        {!loading && (
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput 
                placeholder="Search plants..." 
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandList>
                <CommandEmpty>No plant found.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-auto">
                  {filteredPlants.map((plant) => (
                    <CommandItem
                      key={plant.id}
                      value={plant.id}
                      onSelect={handleSelectPlant}
                      className="flex items-center gap-2"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === plant.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{plant.name}</span>
                        {plant.scientific_name && (
                          <span className="text-xs text-muted-foreground italic">
                            {plant.scientific_name}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}
