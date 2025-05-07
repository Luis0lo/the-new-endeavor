
import { useEffect } from 'react';
import { fabric } from 'fabric';
import { GardenUnit, updateShapeSizeLabel } from '../utils/canvasUtils';
import { toast } from '@/hooks/use-toast';

interface UseShapeAdderProps {
  canvas: fabric.Canvas | null;
  unit: GardenUnit;
}

export const useShapeAdder = ({ canvas, unit }: UseShapeAdderProps) => {
  // Check for custom shapes in localStorage
  useEffect(() => {
    if (!canvas) return;

    const customShapesJson = localStorage.getItem('customShapes');
    if (!customShapesJson) return;

    try {
      const customShapesData = JSON.parse(customShapesJson);
      const shapes = Array.isArray(customShapesData) ? customShapesData : customShapesData.shapes;
      const shapesName = customShapesData.name || 'Custom Shapes';
      
      if (shapes && shapes.length > 0) {
        let offsetX = 0;
        let offsetY = 0;
        
        shapes.forEach((shapeData: any, index: number) => {
          const points = shapeData.points;
          const color = shapeData.color;
          const curves = shapeData.curves || [];
          
          if (points && points.length >= 3) {
            // Create a polygon from the points
            const polygonPoints: fabric.Point[] = points.map((p: any) => new fabric.Point(p.x, p.y));
            
            const polygon = new fabric.Polygon(polygonPoints, {
              left: 100 + offsetX,
              top: 100 + offsetY,
              fill: color + '40', // Add transparency
              stroke: color,
              strokeWidth: 2,
              objectCaching: true,
              selectable: true,
              data: {
                id: `custom-${Date.now()}-${index}`,
                type: 'customShape',
                shapeName: shapesName
              }
            });
            
            // Add to canvas
            canvas.add(polygon);
            
            // Add a size label
            updateShapeSizeLabel(polygon, canvas, unit, shapesName);
            
            // Update offset for next shape
            offsetX += 30;
            offsetY += 30;
            
            // Wrap to next "row" after a few shapes
            if (index % 3 === 2) {
              offsetX = 0;
              offsetY += 30;
            }
          }
        });
        
        canvas.renderAll();
        
        // Clear localStorage after adding
        localStorage.removeItem('customShapes');
        
        toast({
          title: "Custom shapes added",
          description: `Added ${shapes.length} custom shape${shapes.length > 1 ? 's' : ''} to your garden layout`,
        });
      }
    } catch (error) {
      console.error("Error loading custom shapes:", error);
    }
  }, [canvas, unit]);
};
