import { useState, useEffect } from 'react';
import { fabric } from 'fabric';
import { toast } from '@/hooks/use-toast';
import { GardenUnit, BackgroundPattern } from '../utils/canvasUtils';

interface UseGardenCanvasProps {
  unit: GardenUnit;
}

export const useGardenCanvas = ({ unit }: UseGardenCanvasProps) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);

  useEffect(() => {
    const newCanvas = new fabric.Canvas('gardenCanvas', {
      height: 800,
      width: 1200,
      backgroundColor: '#f0f0f0',
      selection: true,
      preserveObjectStacking: true,
    });

    setCanvas(newCanvas);

    // Initial state to history
    saveState(newCanvas, [], -1);

    return () => {
      newCanvas.dispose();
    };
  }, []);

  // Save state to history
  const saveState = (
    currentCanvas: fabric.Canvas,
    currentHistory: string[],
    currentHistoryIndex: number
  ) => {
    const json = currentCanvas.toJSON(['id', 'type', 'shapeName', 'isGrid', 'isLabel']);
    const newHistory = [...currentHistory.slice(0, currentHistoryIndex + 1), JSON.stringify(json)];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Load state from history
  const loadState = (index: number) => {
    if (!canvas) return;

    try {
      const json = history[index];
      const newCanvas = new fabric.Canvas('gardenCanvas');
      newCanvas.loadFromJSON(json, () => {
        newCanvas.renderAll();
        setCanvas(newCanvas);
        setHistoryIndex(index);
      });
    } catch (error) {
      console.error("Error loading state:", error);
      toast({
        title: "Error",
        description: "Could not load state.",
        variant: "destructive"
      });
    }
  };

  // Undo operation
  const undo = () => {
    if (historyIndex > 0 && canvas) {
      loadState(historyIndex - 1);
    }
  };

  // Redo operation
  const redo = () => {
    if (historyIndex < history.length - 1 && canvas) {
      loadState(historyIndex + 1);
    }
  };

  // Add a grid to the canvas
  const addGrid = (gridSpacing: number) => {
    if (!canvas) return;

    const width = canvas.getWidth() || 1200;
    const height = canvas.getHeight() || 800;

    const gridColor = '#cccccc';

    // Vertical lines
    for (let i = gridSpacing; i < width; i += gridSpacing) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: gridColor,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        id: `gridline-v-${i}`,
        data: {
          isGrid: true
        }
      });
      canvas.add(line);
    }

    // Horizontal lines
    for (let i = gridSpacing; i < height; i += gridSpacing) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: gridColor,
        strokeWidth: 1,
        selectable: false,
        evented: false,
        id: `gridline-h-${i}`,
        data: {
          isGrid: true
        }
      });
      canvas.add(line);
    }

    canvas.renderAll();
  };

  // Set background pattern
  const setBackground = (pattern: BackgroundPattern) => {
    if (!canvas) return;

    let imageUrl = '';

    switch (pattern) {
      case 'soil':
        imageUrl = '/patterns/soil.png';
        break;
      case 'grass':
        imageUrl = '/patterns/grass.png';
        break;
      case 'concrete':
        imageUrl = '/patterns/concrete.png';
        break;
      case 'wood':
        imageUrl = '/patterns/wood.png';
        break;
      default:
        canvas.setBackgroundColor('#f0f0f0', canvas.renderAll.bind(canvas));
        return;
    }

    fabric.Image.fromURL(imageUrl, (img) => {
      canvas वोsetBackgroundImage(img, canvas.renderAll.bind(canvas), {
        originX: 'left',
        originY: 'top',
        scaleX: 0.5,
        scaleY: 0.5,
        repeat: 'repeat'
      });
    });
  };

  const addShape = () => {
    if (!canvas) return;

    // Function to add a rectangle
    const addRectangle = () => {
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: '#4CAF5040', // Transparent green
        stroke: '#4CAF50', // Green border
        width: 50,
        height: 50,
        objectCaching: false,
        strokeWidth: 2,
        data: {
          id: Date.now(),
          type: 'rect',
          shapeName: 'Rectangle'
        }
      });
      canvas.add(rect);
      return rect;
    };

    // Function to add a circle
    const addCircle = () => {
      const circle = new fabric.Circle({
        left: 100,
        top: 100,
        radius: 25,
        fill: '#2196F340', // Transparent blue
        stroke: '#2196F3', // Blue border
        objectCaching: false,
        strokeWidth: 2,
        data: {
          id: Date.now(),
          type: 'circle',
          shapeName: 'Circle'
        }
      });
      canvas.add(circle);
      return circle;
    };

    // Function to add a line
    const addLine = () => {
      const line = new fabric.Line([50, 100, 150, 100], {
        stroke: '#9C27B0', // Purple
        strokeWidth: 3,
        objectCaching: false,
        data: {
          id: Date.now(),
          type: 'line',
          shapeName: 'Line'
        }
      });
      canvas.add(line);
      return line;
    };

    // Function to add text
    const addText = (textValue: string) => {
      const text = new fabric.Textbox(textValue || 'Your Text', {
        left: 100,
        top: 100,
        fontSize: 20,
        fill: '#795548', // Brown
        objectCaching: false,
        width: 150,
        data: {
          id: Date.now(),
          type: 'text',
          shapeName: 'Text'
        }
      });
      canvas.add(text);
      return text;
    };

    return {
      addRectangle,
      addCircle,
      addLine,
      addText
    };
  };

  return {
    canvas,
    setCanvas,
    addGrid,
    setBackground,
    addShape,
    history,
    historyIndex,
    undo,
    redo,
    saveState,
    selectedObject,
    setSelectedObject
  };
};
