
import React from 'react';
import { Flower2 } from 'lucide-react';
import { CompatibilityData } from './types';

interface CompatibilitySummaryProps {
  compatibilityData: CompatibilityData;
}

export function CompatibilitySummary({ compatibilityData }: CompatibilitySummaryProps) {
  return (
    <div className="bg-primary/10 p-4 rounded-md">
      <h3 className="font-medium mb-2 flex items-center">
        <Flower2 className="h-4 w-4 mr-2" />
        Compatibility Summary
      </h3>
      <p>
        {compatibilityData.compatible.plants.length > 0 
          ? "These plants have beneficial companion relationships! Consider planting them together."
          : compatibilityData.incompatible.plants.length > 0
            ? "Some of these plants may not grow well together. Check the details below."
            : "These plants neither help nor hinder each other significantly."
        }
      </p>
    </div>
  );
}
