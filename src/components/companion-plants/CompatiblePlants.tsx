
import React from 'react';
import { ThumbsUp, Check } from 'lucide-react';

interface CompatiblePlantsProps {
  plants: string[];
  reasons: string[];
}

export function CompatiblePlants({ plants, reasons }: CompatiblePlantsProps) {
  if (plants.length === 0) return null;
  
  return (
    <div className="bg-green-100 dark:bg-green-950/30 p-3 rounded-md">
      <h4 className="font-medium text-green-700 dark:text-green-400 flex items-center">
        <ThumbsUp className="h-4 w-4 mr-2" />
        Compatible Combinations
      </h4>
      <ul className="mt-2 space-y-1 text-sm">
        {plants.map((pair, idx) => (
          <li key={idx} className="flex items-start">
            <Check className="h-4 w-4 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
            <span>{pair}</span>
          </li>
        ))}
      </ul>
      
      <h5 className="font-medium mt-3 mb-1 text-sm text-green-700 dark:text-green-400">
        Benefits
      </h5>
      <ul className="list-disc list-inside text-sm space-y-1">
        {reasons.length > 0 
          ? reasons.map((reason, idx) => (
              <li key={idx}>{reason}</li>
            ))
          : <li>Enhanced growth and health</li>
        }
      </ul>
    </div>
  );
}
