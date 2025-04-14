
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ArrowDownWideNarrow, ChevronDown, Loader2 } from 'lucide-react';
import { Plant } from '@/hooks/usePlants';

interface PlantDropdownListProps {
  plants: Plant[];
  loading: boolean;
  onSelectPlant: (plant: Plant) => void;
}

export function PlantDropdownList({ plants, loading, onSelectPlant }: PlantDropdownListProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
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
                  setOpen(false);
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
  );
}
