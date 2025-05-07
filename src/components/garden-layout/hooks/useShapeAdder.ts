
import { fabric } from 'fabric';
import { updateShapeSizeLabel } from '../utils/canvasUtils';
import { GardenUnit, ShapeType } from '../utils/canvasUtils';

interface UseShapeAdderProps {
  canvas: fabric.Canvas | null;
  unit: GardenUnit;
}

export const useShapeAdder = ({ canvas, unit }: UseShapeAdderProps) => {
  // Function to add a shape to the canvas
  const addShape = (
    shapeType: ShapeType,
    color: string = '#4CAF50',
    strokeWidth: number = 2,
    opacity: number = 1,
    textValue: string = 'Your Text',
    fontSize: number = 20
  ) => {
    if (!canvas) return;

    let newShape: fabric.Object | null = null;

    switch (shapeType) {
      case 'rect':
        newShape = new fabric.Rect({
          left: 100,
          top: 100,
          fill: color,
          stroke: color.replace(/[^#\d]/g, ''),
          width: 50,
          height: 50,
          strokeWidth,
          opacity,
          objectCaching: false,
          transparentCorners: false,
          cornerColor: 'black',
          data: {
            id: Date.now(),
            type: 'rect',
            shapeName: 'Rectangle'
          }
        });
        break;
      case 'circle':
        newShape = new fabric.Circle({
          left: 100,
          top: 100,
          radius: 25,
          fill: color,
          stroke: color.replace(/[^#\d]/g, ''),
          strokeWidth,
          opacity,
          objectCaching: false,
          transparentCorners: false,
          cornerColor: 'black',
          data: {
            id: Date.now(),
            type: 'circle',
            shapeName: 'Circle'
          }
        });
        break;
      case 'line':
        newShape = new fabric.Line([50, 100, 150, 100], {
          stroke: color,
          strokeWidth,
          opacity,
          objectCaching: false,
          transparentCorners: false,
          cornerColor: 'black',
          data: {
            id: Date.now(),
            type: 'line',
            shapeName: 'Line'
          }
        });
        break;
      case 'text':
        newShape = new fabric.Textbox(textValue, {
          left: 100,
          top: 100,
          fill: color,
          fontSize,
          opacity,
          width: 150,
          objectCaching: false,
          transparentCorners: false,
          cornerColor: 'black',
          data: {
            id: Date.now(),
            type: 'text',
            shapeName: 'Text'
          }
        });
        break;
    }

    if (newShape) {
      canvas.add(newShape);
      canvas.setActiveObject(newShape);
      updateShapeSizeLabel(newShape, canvas, unit);
      canvas.renderAll();
    }
  };

  return { addShape };
};
