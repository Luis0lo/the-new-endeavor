
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Check, ChevronsUpDown, Loader2, ChevronDown, ArrowDownWideNarrow, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Plant {
  id: string;
  name: string;
  scientific_name?: string;
  description?: string;
  image_url?: string;
  growing_zones?: string[];
  planting_season?: string[];
}

interface PlantSelectorProps {
  onSelectPlant: (plant: Plant) => void;
}

export function PlantSelector({ onSelectPlant }: PlantSelectorProps) {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [value, setValue] = useState("");
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('plants')
          .select('id, name, scientific_name, description, image_url, growing_zones, planting_season')
          .order('name');
        
        if (error) {
          throw error;
        }
        
        setPlants(Array.isArray(data) ? data : []);
      } catch (error: any) {
        console.error('Error fetching plants:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load plants",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlants();
  }, []);
  
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
    <div className="space-y-4">
      {/* Dropdown List Selection */}
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
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
                <div className="flex items-center">
                  <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
                  <span>Select from dropdown list</span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full max-h-80 overflow-auto" align="start">
          <DropdownMenuGroup>
            {plants.length > 0 ? (
              plants.slice(0, 200).map((plant) => (
                <DropdownMenuItem 
                  key={plant.id}
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    onSelectPlant(plant);
                    setDropdownOpen(false);
                  }}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{plant.name}</span>
                    {plant.scientific_name && (
                      <span className="text-xs text-muted-foreground italic">
                        {plant.scientific_name}
                      </span>
                    )}
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No plants found</DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Search Selection - Existing Component */}
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
    </div>
  );
}
