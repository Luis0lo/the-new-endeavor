
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface NoLayoutsProps {
  onSave: () => void;
}

export const NoLayouts: React.FC<NoLayoutsProps> = ({ onSave }) => {
  return (
    <div className="text-center p-6 border border-dashed rounded-md">
      <h4 className="font-medium mb-2">No garden layouts saved yet</h4>
      <p className="text-muted-foreground mb-4">
        Create and save your first garden layout to see it here.
      </p>
      <Button 
        onClick={onSave}
        variant="default"
        className="flex items-center gap-2 mx-auto"
      >
        <PlusCircle size={16} />
        <span>Save Current Layout</span>
      </Button>
    </div>
  );
};

export const SignInPrompt: React.FC = () => {
  return (
    <div className="text-center p-8 border border-dashed rounded-md">
      <h3 className="text-lg font-medium mb-2">Sign in to save garden layouts</h3>
      <p className="text-muted-foreground mb-4">
        Create an account to save and manage your garden designs.
      </p>
      <Button variant="default">Sign In</Button>
    </div>
  );
};
