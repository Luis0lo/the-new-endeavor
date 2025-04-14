
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface CompanionPlantsDisplayProps {
  selectedPlants: any[];
}

export function CompanionPlantsDisplay({ selectedPlants }: CompanionPlantsDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compatibility Results</CardTitle>
        <CardDescription>
          View compatibility between your selected plants
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedPlants.length < 2 ? (
          <div className="flex items-center justify-center h-40 bg-muted/50 rounded-md">
            <p className="text-muted-foreground text-center">
              Select at least two plants to see compatibility information
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p>Selected plants: {selectedPlants.map(p => p.name).join(', ')}</p>
            
            {/* This is a placeholder for actual compatibility logic */}
            <div className="bg-primary/10 p-4 rounded-md">
              <h3 className="font-medium mb-2">Compatibility Summary</h3>
              <p>These plants generally grow well together. Consider planting them in proximity for beneficial effects.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-100 dark:bg-green-950/30 p-3 rounded-md">
                <h4 className="font-medium text-green-700 dark:text-green-400">Benefits</h4>
                <ul className="list-disc list-inside text-sm mt-1">
                  <li>Pest deterrence</li>
                  <li>Soil enrichment</li>
                  <li>Improved growth</li>
                </ul>
              </div>
              
              <div className="bg-red-100 dark:bg-red-950/30 p-3 rounded-md">
                <h4 className="font-medium text-red-700 dark:text-red-400">Considerations</h4>
                <ul className="list-disc list-inside text-sm mt-1">
                  <li>Space requirements</li>
                  <li>Watering needs</li>
                  <li>Sunlight competition</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
