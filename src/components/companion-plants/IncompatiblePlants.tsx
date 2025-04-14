
import React from 'react';
import { ThumbsDown, X } from 'lucide-react';

interface IncompatiblePlantsProps {
  plants: string[];
  reasons: string[];
}

export function IncompatiblePlants({ plants, reasons }: IncompatiblePlantsProps) {
  if (plants.length === 0) return null;
  
  return (
    <div className="bg-red-100 dark:bg-red-950/30 p-3 rounded-md">
      <h4 className="font-medium text-red-700 dark:text-red-400 flex items-center">
        <ThumbsDown className="h-4 w-4 mr-2" />
        Incompatible Combinations
      </h4>
      <ul className="mt-2 space-y-1 text-sm">
        {plants.map((pair, idx) => (
          <li key={idx} className="flex items-start">
            <X className="h-4 w-4 text-red-500 mr-1 mt-0.5 flex-shrink-0" />
            <span>{pair}</span>
          </li>
        ))}
      </ul>
      
      <h5 className="font-medium mt-3 mb-1 text-sm text-red-700 dark:text-red-400">
        Considerations
      </h5>
      <ul className="list-disc list-inside text-sm space-y-1">
        {reasons.map((reason, idx) => (
          <li key={idx}>{reason}</li>
        ))}
      </ul>
    </div>
  );
}
