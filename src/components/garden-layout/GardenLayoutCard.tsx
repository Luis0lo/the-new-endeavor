
import React from 'react';
import { Button } from '@/components/ui/button';
import { FolderOpen, Trash } from 'lucide-react';

interface GardenLayout {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  layout_data: string;
  description?: string;
  preview?: string;
  user_id: string;
}

interface GardenLayoutCardProps {
  layout: GardenLayout;
  onLoad: (layout: GardenLayout) => void;
  onDelete: (id: string) => void;
}

const GardenLayoutCard: React.FC<GardenLayoutCardProps> = ({ 
  layout,
  onLoad,
  onDelete
}) => {
  return (
    <div className="border rounded-md overflow-hidden flex flex-col">
      <div className="p-3 border-b bg-muted/50">
        <h4 className="font-medium truncate">{layout.name}</h4>
        <p className="text-xs text-muted-foreground">
          {new Date(layout.updated_at).toLocaleDateString()}
        </p>
      </div>

      <div className="flex-grow p-2 bg-white">
        {layout.preview ? (
          <div 
            className="w-full h-[120px] bg-contain bg-center bg-no-repeat" 
            style={{ backgroundImage: `url(${layout.preview})` }}
          />
        ) : (
          <div className="w-full h-[120px] bg-muted/30 flex items-center justify-center">
            <span className="text-muted-foreground text-xs">No preview</span>
          </div>
        )}
      </div>

      <div className="p-2 flex justify-between border-t">
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={() => onLoad(layout)}
        >
          <FolderOpen size={14} />
          <span>Load</span>
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={() => onDelete(layout.id)}
        >
          <Trash size={14} />
          <span>Delete</span>
        </Button>
      </div>
    </div>
  );
};

export default GardenLayoutCard;
