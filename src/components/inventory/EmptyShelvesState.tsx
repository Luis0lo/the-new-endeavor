
import React from 'react';
import { Archive, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

interface EmptyShelvesStateProps {
  onCreateShelf: () => void;
}

export const EmptyShelvesState: React.FC<EmptyShelvesStateProps> = ({ onCreateShelf }) => {
  return (
    <Card className="text-center p-8">
      <CardContent className="pt-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Archive className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-lg font-medium">No shelves found</h3>
          <p className="text-muted-foreground">
            Start by creating a shelf to organize your garden inventory.
          </p>
          <Button onClick={onCreateShelf} className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Create First Shelf
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
