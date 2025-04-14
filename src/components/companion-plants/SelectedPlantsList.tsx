
import React from 'react';
import { Leaf } from 'lucide-react';
import { Plant } from './types';

interface SelectedPlantsListProps {
  plants: Plant[];
}

export function SelectedPlantsList({ plants }: SelectedPlantsListProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {plants.map(plant => (
        <div 
          key={plant.id} 
          className="bg-primary/10 text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center"
        >
          <Leaf className="h-3 w-3 mr-1" />
          {plant.name}
        </div>
      ))}
    </div>
  );
}
