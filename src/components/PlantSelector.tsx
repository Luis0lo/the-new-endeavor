
import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { companionPlantsData } from '@/data/companionPlants';

interface PlantSelectorProps {
  onPlantSelected: (plant: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const PlantSelector = ({ 
  onPlantSelected, 
  placeholder = "Select a plant...",
  disabled = false
}: PlantSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [availablePlants, setAvailablePlants] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Extract all plant names from the companionPlantsData
  useEffect(() => {
    try {
      // Make sure companionPlantsData is defined and is an array
      if (Array.isArray(companionPlantsData)) {
        const plants = companionPlantsData.map(item => item.plant);
        setAvailablePlants(plants);
      } else {
        console.error("companionPlantsData is not an array:", companionPlantsData);
        setAvailablePlants([]);
      }
    } catch (error) {
      console.error("Error loading plant data:", error);
      setAvailablePlants([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // If we're still loading, show a loading state
  if (isLoading) {
    return (
      <Button variant="outline" className="w-full justify-between" disabled>
        Loading plants...
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value ? value : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {availablePlants.length > 0 && (
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search plants..." />
            <CommandEmpty>No plant found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-y-auto">
              {availablePlants.map((plant) => (
                <CommandItem
                  key={plant}
                  value={plant}
                  onSelect={() => {
                    setValue(plant);
                    onPlantSelected(plant);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === plant ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {plant}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default PlantSelector;
