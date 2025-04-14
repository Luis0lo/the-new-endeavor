
import React from 'react';

interface NeutralPlantsProps {
  plants: string[];
  showTips?: boolean;
}

export function NeutralPlants({ plants, showTips = false }: NeutralPlantsProps) {
  return (
    <div className="bg-blue-100 dark:bg-blue-950/30 p-3 rounded-md">
      <h4 className="font-medium text-blue-700 dark:text-blue-400">
        {plants.length > 0 ? "Neutral Combinations" : "Companion Planting Tips"}
      </h4>
      
      {plants.length > 0 ? (
        <ul className="mt-2 space-y-1 text-sm">
          {plants.map((pair, idx) => (
            <li key={idx} className="flex items-start">
              <span className="mr-1">•</span>
              <span>{pair} - No known positive or negative interactions</span>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="list-disc list-inside text-sm mt-1">
          <li>Consider space requirements for each plant</li>
          <li>Match plants with similar water and sun needs</li>
          <li>Diverse plantings help reduce pest issues</li>
          <li>Observe and document what works in your garden</li>
        </ul>
      )}
    </div>
  );
}
