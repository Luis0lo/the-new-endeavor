
import { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { toast } from '@/hooks/use-toast';
import { GardenUnit, BackgroundPattern, ShapeType } from '../utils/canvasUtils';

interface UseGardenCanvasProps {
  unit: GardenUnit;
}

export const useGardenCanvas = ({ unit }: UseGardenCanvasProps) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);
  const [objectsCount, setObjectsCount] = useState(0);

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
    
    // Update objects count when objects are added or removed
    newCanvas.on('object:added', () => {
      setObjectsCount(newCanvas.getObjects().filter(obj => !obj.data?.isGrid && !obj.data?.isLabel).length);
    });
    
    newCanvas.on('object:removed', () => {
      setObjectsCount(newCanvas.getObjects().filter(obj => !obj.data?.isGrid && !obj.data?.isLabel).length);
    });
    
    // Selection events
    newCanvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });
    
    newCanvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0] || null);
    });
    
    newCanvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

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
      canvas.loadFromJSON(json, () => {
        canvas.renderAll();
        setHistoryIndex(index);
        setObjectsCount(canvas.getObjects().filter(obj => !obj.data?.isGrid && !obj.data?.isLabel).length);
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
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        originX: 'left',
        originY: 'top',
        scaleX: 0.5,
        scaleY: 0.5,
        repeat: 'repeat'
      });
    });
  };

  // Functions for adding shapes
  const addShapeToCanvas = () => {
    if (!canvas) return;

    // Function to add a rectangle
    const addRectangle = () => {
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: '#4CAF5040',
        stroke: '#4CAF50',
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
      canvas.setActiveObject(rect);
      saveState(canvas, history, historyIndex);
      return rect;
    };

    // Function to add a circle
    const addCircle = () => {
      const circle = new fabric.Circle({
        left: 100,
        top: 100,
        radius: 25,
        fill: '#2196F340',
        stroke: '#2196F3',
        objectCaching: false,
        strokeWidth: 2,
        data: {
          id: Date.now(),
          type: 'circle',
          shapeName: 'Circle'
        }
      });
      canvas.add(circle);
      canvas.setActiveObject(circle);
      saveState(canvas, history, historyIndex);
      return circle;
    };

    // Function to add a line
    const addLine = () => {
      const line = new fabric.Line([50, 100, 150, 100], {
        stroke: '#9C27B0',
        strokeWidth: 3,
        objectCaching: false,
        data: {
          id: Date.now(),
          type: 'line',
          shapeName: 'Line'
        }
      });
      canvas.add(line);
      canvas.setActiveObject(line);
      saveState(canvas, history, historyIndex);
      return line;
    };

    // Function to add text
    const addText = (textValue: string) => {
      const text = new fabric.Textbox(textValue || 'Your Text', {
        left: 100,
        top: 100,
        fontSize: 20,
        fill: '#795548',
        objectCaching: false,
        width: 150,
        data: {
          id: Date.now(),
          type: 'text',
          shapeName: 'Text'
        }
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      saveState(canvas, history, historyIndex);
      return text;
    };

    return {
      addRectangle,
      addCircle,
      addLine,
      addText
    };
  };

  // Function to duplicate selected object
  const duplicateSelected = () => {
    if (!canvas || !canvas.getActiveObject()) return;
    
    const activeObject = canvas.getActiveObject();
    activeObject.clone((cloned: fabric.Object) => {
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20,
        evented: true,
      });
      
      if (!cloned.data) cloned.data = {};
      cloned.data.id = Date.now();
      
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.requestRenderAll();
      saveState(canvas, history, historyIndex);
    });
  };

  // Function to remove selected object
  const removeSelected = () => {
    if (!canvas || !canvas.getActiveObject()) return;
    
    // Also remove associated labels
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.data?.id) {
      const labels = canvas.getObjects().filter(
        obj => obj.data?.parentId === activeObject.data.id
      );
      
      labels.forEach(label => {
        canvas.remove(label);
      });
    }
    
    canvas.remove(canvas.getActiveObject());
    canvas.requestRenderAll();
    saveState(canvas, history, historyIndex);
  };

  // Function to bring selected object to front
  const bringToFront = () => {
    if (!canvas || !canvas.getActiveObject()) return;
    
    const activeObject = canvas.getActiveObject();
    activeObject.bringToFront();
    canvas.requestRenderAll();
  };

  // Function to send selected object to back
  const sendToBack = () => {
    if (!canvas || !canvas.getActiveObject()) return;
    
    const activeObject = canvas.getActiveObject();
    activeObject.sendToBack();
    
    // Make sure grid lines stay at the back
    const gridLines = canvas.getObjects().filter(obj => obj.data?.isGrid);
    gridLines.forEach(line => line.sendToBack());
    
    canvas.requestRenderAll();
  };

  // Function to clear the canvas
  const clearCanvas = () => {
    if (!canvas) return;
    
    const objects = canvas.getObjects().filter(obj => !obj.data?.isGrid);
    objects.forEach(obj => canvas.remove(obj));
    
    canvas.requestRenderAll();
    saveState(canvas, history, historyIndex);
  };

  // Function to get canvas JSON
  const getCanvasJson = () => {
    if (!canvas) return '';
    return JSON.stringify(canvas.toJSON(['id', 'type', 'shapeName', 'isGrid', 'isLabel']));
  };

  // Function to load from JSON
  const loadFromJson = (json: string) => {
    if (!canvas || !json) return;
    
    try {
      canvas.loadFromJSON(json, () => {
        canvas.renderAll();
        saveState(canvas, history, historyIndex);
        setObjectsCount(canvas.getObjects().filter(obj => !obj.data?.isGrid && !obj.data?.isLabel).length);
      });
    } catch (error) {
      console.error("Error loading JSON:", error);
      toast({
        title: "Error",
        description: "Could not load garden layout.",
        variant: "destructive"
      });
    }
  };

  // Function to save layout
  const saveLayout = () => {
    if (!canvas) return null;
    
    const json = canvas.toJSON(['id', 'type', 'shapeName', 'isGrid', 'isLabel']);
    return JSON.stringify(json);
  };

  // Function to load layout
  const loadLayout = (json: string) => {
    if (!canvas) return;
    
    try {
      canvas.loadFromJSON(json, () => {
        canvas.renderAll();
        saveState(canvas, history, historyIndex);
      });
    } catch (error) {
      console.error("Error loading layout:", error);
    }
  };

  // Check if there is a selection
  const hasSelection = !!selectedObject;

  return {
    canvas,
    canvasRef,
    setCanvas,
    addGrid,
    setBackground,
    addShape: addShapeToCanvas,
    history,
    historyIndex,
    undo,
    handleUndo: undo, // Alias for undo
    redo,
    handleRedo: redo, // Alias for redo
    saveState,
    selectedObject,
    setSelectedObject,
    objectsCount,
    hasSelection,
    duplicateSelected,
    removeSelected,
    bringToFront,
    sendToBack,
    clearCanvas,
    getCanvasJson,
    loadFromJson,
    saveLayout,
    loadLayout
  };
};
