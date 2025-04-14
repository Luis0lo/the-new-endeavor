
import React from 'react';
import { PlantDropdownList } from './PlantDropdownList';
import { PlantSearchBox } from './PlantSearchBox';
import { usePlants, Plant } from '@/hooks/usePlants';

interface PlantSelectorProps {
  onSelectPlant: (plant: Plant) => void;
}

export function PlantSelector({ onSelectPlant }: PlantSelectorProps) {
  const { plants, loading } = usePlants();

  return (
    <div className="space-y-4">
      {/* Dropdown List Selection */}
      <PlantDropdownList 
        plants={plants}
        loading={loading}
        onSelectPlant={onSelectPlant}
      />
      
      {/* Search Selection */}
      <PlantSearchBox 
        plants={plants}
        loading={loading}
        onSelectPlant={onSelectPlant}
      />
    </div>
  );
}
