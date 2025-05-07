
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { fabric } from 'fabric';
import { SavedShape } from '../utils/canvasUtils';

interface UseSaveShapeDialogProps {
  canvas: fabric.Canvas | null;
  savedShapes: SavedShape[];
  setSavedShapes: React.Dispatch<React.SetStateAction<SavedShape[]>>;
}

export const useSaveShapeDialog = ({ 
  canvas, 
  savedShapes, 
  setSavedShapes 
}: UseSaveShapeDialogProps) => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [shapeName, setShapeName] = useState('');

  // Save the selected object as a named shape
  const handleSaveSelectedShape = () => {
    if (!canvas) return;

    const selectedObjects = canvas.getActiveObjects();
    
    if (selectedObjects.length === 0) {
      toast({
        title: "No shape selected",
        description: "Please select a shape to save.",
        variant: "destructive"
      });
      return;
    }

    setSaveDialogOpen(true);
  };

  // Complete saving shape with name
  const completeSaveShape = () => {
    if (!canvas || !shapeName.trim()) return;

    try {
      // Get selected objects
      const selectedObjects = canvas.getActiveObjects();
      
      if (selectedObjects.length === 0) return;

      // Create a temporary canvas to store just this object
      const tempCanvas = new fabric.Canvas(document.createElement('canvas'), {
        width: canvas.width,
        height: canvas.height
      });

      // Clone the selected objects to the temp canvas
      const clonedGroup: fabric.Object[] = [];
      
      selectedObjects.forEach(obj => {
        obj.clone((clone: fabric.Object) => {
          tempCanvas.add(clone);
          clonedGroup.push(clone);
        });
      });
      
      // Create a group if multiple objects
      const group = selectedObjects.length > 1 ? 
        new fabric.Group(clonedGroup, {
          left: 0, 
          top: 0,
          objectCaching: false
        }) : clonedGroup[0];
      
      // Store the JSON of just this object/group
      const shapeJson = JSON.stringify(group.toJSON(['data']));
      
      // Generate a thumbnail preview (base64)
      const dataUrl = tempCanvas.toDataURL({
        format: 'png',
        quality: 0.5,
        width: 100,
        height: 100
      });
      
      // Create new saved shape
      const newShape: SavedShape = {
        id: Date.now().toString(),
        name: shapeName,
        data: shapeJson,
        createdAt: Date.now(),
        preview: dataUrl
      };
      
      // Update saved shapes
      const updatedShapes = [...savedShapes, newShape];
      setSavedShapes(updatedShapes);
      localStorage.setItem('savedShapes', JSON.stringify(updatedShapes));
      
      // Clean up
      tempCanvas.dispose();
      setShapeName('');
      setSaveDialogOpen(false);
      
      // Remove the selected shape(s) from the canvas after saving
      selectedObjects.forEach(obj => {
        // Also remove any associated labels
        if (obj.data?.id) {
          const labels = canvas.getObjects().filter(item => 
            item instanceof fabric.Text && item.data?.parentId === obj.data.id
          );
          
          labels.forEach(label => canvas.remove(label));
        }
        canvas.remove(obj);
      });
      
      canvas.discardActiveObject();
      canvas.renderAll();
      
      toast({
        title: "Shape saved",
        description: `"${shapeName}" has been saved to your collection.`,
      });
    } catch (error) {
      console.error("Error saving shape:", error);
      toast({
        title: "Save failed",
        description: "There was a problem saving your shape.",
        variant: "destructive"
      });
    }
  };

  return {
    saveDialogOpen,
    setSaveDialogOpen,
    shapeName,
    setShapeName,
    handleSaveSelectedShape,
    completeSaveShape
  };
};
