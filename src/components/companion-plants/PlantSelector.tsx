
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PlantSelectorProps {
  onSelectPlant: (plant: any) => void;
}

export function PlantSelector({ onSelectPlant }: PlantSelectorProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('plants')
          .select('*')
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

  return (
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
            "Loading plants..."
          ) : (
            <>
              <span>Select a plant to add...</span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </>
          )}
        </Button>
      </PopoverTrigger>
      
      {/* Only render PopoverContent when not loading and plants is an array */}
      {!loading && Array.isArray(plants) && (
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search plants..." />
            <CommandList>
              <CommandEmpty>No plant found.</CommandEmpty>
              <CommandGroup>
                {plants.map((plant) => (
                  <CommandItem
                    key={plant.id}
                    value={plant.id}
                    onSelect={handleSelectPlant}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === plant.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {plant.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
}
