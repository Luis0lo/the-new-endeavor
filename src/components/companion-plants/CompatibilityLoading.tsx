
import React from 'react';
import { Leaf } from 'lucide-react';

export function CompatibilityLoading() {
  return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-pulse flex flex-col items-center">
        <Leaf className="h-8 w-8 text-primary animate-spin" />
        <p className="mt-2 text-muted-foreground">Analyzing compatibility...</p>
      </div>
    </div>
  );
}
