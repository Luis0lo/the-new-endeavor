
import React from 'react';
import { Flower2 } from 'lucide-react';

export function EmptyPlantSelection() {
  return (
    <div className="flex flex-col items-center justify-center h-40 bg-muted/50 rounded-md p-4">
      <Flower2 className="h-10 w-10 text-muted-foreground mb-2" />
      <p className="text-muted-foreground text-center">
        Select at least two plants to see compatibility information
      </p>
    </div>
  );
}
