
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { fabric } from 'fabric';
import { SavedShape, GardenUnit, updateShapeSizeLabel } from '../utils/canvasUtils';

interface UseSavedShapesProps {
  canvas: fabric.Canvas | null;
  unit: GardenUnit;
}

export const useSavedShapes = ({ canvas, unit }: UseSavedShapesProps) => {
  const [savedShapes, setSavedShapes] = useState<SavedShape[]>([]);

  // Load saved shapes from localStorage on component mount
  useEffect(() => {
    const storedShapes = localStorage.getItem('savedShapes');
    if (storedShapes) {
      try {
        setSavedShapes(JSON.parse(storedShapes));
      } catch (error) {
        console.error("Error loading saved shapes:", error);
      }
    }
  }, []);

  // Load a saved shape to the canvas
  const loadSavedShape = (shape: SavedShape) => {
    if (!canvas) return;

    try {
      // Parse the shape JSON
      const shapeData = JSON.parse(shape.data);
      
      // Add it to the canvas
      fabric.util.enlivenObjects([shapeData], (objects: fabric.Object[]) => {
        const obj = objects[0];
        
        // Position in the center of the visible area
        obj.set({
          left: 200,
          top: 200
        });
        
        canvas.add(obj);
        canvas.setActiveObject(obj);
        
        // If it's not a text object, add size label
        if (!(obj instanceof fabric.IText)) {
          // Pass the saved shape name to the updateShapeSizeLabel function
          updateShapeSizeLabel(obj, canvas, unit, shape.name);
        }
        
        canvas.renderAll();
        
        toast({
          title: "Shape loaded",
          description: `"${shape.name}" has been added to your layout.`,
        });
      });
    } catch (error: any) {
      console.error("Error loading shape:", error);
      toast({
        title: "Load failed",
        description: error.message || "There was a problem loading your shape.",
        variant: "destructive"
      });
    }
  };

  // Delete a saved shape
  const deleteSavedShape = (id: string) => {
    try {
      const shapeIndex = savedShapes.findIndex(s => s.id === id);
      if (shapeIndex === -1) return;
      
      const shapeName = savedShapes[shapeIndex].name;
      const updatedShapes = [...savedShapes];
      updatedShapes.splice(shapeIndex, 1);
      
      setSavedShapes(updatedShapes);
      localStorage.setItem('savedShapes', JSON.stringify(updatedShapes));
      
      toast({
        title: "Shape deleted",
        description: `"${shapeName}" has been removed from your collection.`,
      });
    } catch (error) {
      console.error("Error deleting shape:", error);
    }
  };

  // Load all saved shapes
  const loadAllShapes = () => {
    if (!canvas || savedShapes.length === 0) return;

    try {
      // Clear existing selections
      canvas.discardActiveObject();
      
      // Load each shape with some offset to avoid overlap
      let offsetX = 20;
      let offsetY = 20;
      
      savedShapes.forEach((shape, index) => {
        const shapeData = JSON.parse(shape.data);
        
        fabric.util.enlivenObjects([shapeData], (objects: fabric.Object[]) => {
          const obj = objects[0];
          
          // Position with offset
          obj.set({
            left: 100 + (index % 3) * offsetX,
            top: 100 + Math.floor(index / 3) * offsetY
          });
          
          canvas.add(obj);
          
          // If it's not a text object, add size label
          if (!(obj instanceof fabric.IText)) {
            // Use the directly imported updateShapeSizeLabel
            updateShapeSizeLabel(obj, canvas, unit, shape.name);
          }
        });
      });
      
      canvas.renderAll();
      
      toast({
        title: "All shapes loaded",
        description: `Loaded ${savedShapes.length} shapes into your layout.`,
      });
    } catch (error) {
      console.error("Error loading all shapes:", error);
      toast({
        title: "Load failed",
        description: "There was a problem loading your shapes.",
        variant: "destructive"
      });
    }
  };

  return {
    savedShapes,
    setSavedShapes,
    loadSavedShape,
    deleteSavedShape,
    loadAllShapes
  };
};
