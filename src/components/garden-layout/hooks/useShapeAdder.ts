
import { fabric } from 'fabric';
import { toast } from '@/hooks/use-toast';
import { ShapeType, updateShapeSizeLabel, GardenUnit } from '../utils/canvasUtils';

interface UseShapeAdderProps {
  canvas: fabric.Canvas | null;
  unit: GardenUnit;
}

export const useShapeAdder = ({ canvas, unit }: UseShapeAdderProps) => {
  // Add shape to canvas
  const addShape = (
    selectedShape: ShapeType, 
    color: string, 
    strokeWidth: number, 
    opacity: number, 
    textValue: string,
    fontSize: number
  ) => {
    if (!canvas) return;

    let shape: fabric.Object;
    const adjustedColor = color + Math.floor(opacity * 255 / 100).toString(16).padStart(2, '0');

    switch (selectedShape) {
      case 'rect':
        shape = new fabric.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 150,
          fill: adjustedColor,
          strokeWidth,
          stroke: 'black',
          cornerColor: 'black',
          transparentCorners: false
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          left: 100,
          top: 100,
          radius: 50,
          fill: adjustedColor,
          strokeWidth,
          stroke: 'black',
          cornerColor: 'black',
          transparentCorners: false
        });
        break;
      case 'line':
        shape = new fabric.Line([50, 50, 150, 150], {
          left: 100,
          top: 100,
          stroke: color,
          strokeWidth: strokeWidth + 3,
          cornerColor: 'black',
          transparentCorners: false
        });
        break;
      case 'text':
        shape = new fabric.IText(textValue, {
          left: 100,
          top: 100,
          fontSize,
          fontFamily: 'Arial',
          fill: color,
          strokeWidth: 0,
          cornerColor: 'black',
          transparentCorners: false,
          editingBorderColor: 'rgba(0,0,0,0.3)',
        });
        break;
      default:
        return;
    }

    canvas.add(shape);
    canvas.setActiveObject(shape);
    
    // Add a label to shapes except for text
    if (selectedShape !== 'text') {
      updateShapeSizeLabel(shape, canvas, unit);
    }
    
    canvas.renderAll();
    
    toast({
      title: "Shape added",
      description: `Added a new ${selectedShape} to your garden layout.`,
    });
  };

  return { addShape };
};
