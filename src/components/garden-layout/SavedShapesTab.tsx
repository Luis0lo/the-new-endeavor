
import React from 'react';
import { Button } from '@/components/ui/button';
import { SavedShape } from './utils/canvasUtils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface SavedShapesTabProps {
  savedShapes: SavedShape[];
  loadSavedShape: (shape: SavedShape) => void;
  deleteSavedShape: (id: string) => void;
  loadAllShapes: () => void;
}

const SavedShapesTab: React.FC<SavedShapesTabProps> = ({
  savedShapes,
  loadSavedShape,
  deleteSavedShape,
  loadAllShapes
}) => {
  return (
    <>
      {savedShapes.length > 0 ? (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Your Saved Shapes</h3>
            <Button onClick={loadAllShapes} variant="outline" size="sm">
              <span>Load All Shapes</span>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {savedShapes.map((shape) => (
              <div 
                key={shape.id} 
                className="p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <div className="flex flex-col items-center gap-2">
                  {shape.preview && (
                    <div className="w-20 h-20 border mb-2 rounded flex items-center justify-center bg-white">
                      <img 
                        src={shape.preview} 
                        alt={shape.name} 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  )}
                  <h4 className="font-semibold">{shape.name}</h4>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      onClick={() => loadSavedShape(shape)}
                      size="sm" 
                      variant="secondary"
                    >
                      Load
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <span className="sr-only">Open menu</span>
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                          >
                            <path
                              d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => deleteSavedShape(shape.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-muted/50">
          <h3 className="text-lg font-medium">No Saved Shapes Yet</h3>
          <p className="text-muted-foreground mt-2">
            Select a shape on the canvas and save it to add it to your collection.
          </p>
        </div>
      )}
    </>
  );
};

export default SavedShapesTab;
