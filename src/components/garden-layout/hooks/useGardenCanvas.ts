
import { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { toast } from '@/hooks/use-toast';
import { 
  drawGrid, 
  applyBackgroundPattern, 
  updateShapeSizeLabel,
  createCustomShapePath,
  ShapeType, 
  GardenUnit, 
  BackgroundPattern
} from '../utils/canvasUtils';

export const useGardenCanvas = (
  gridSize: number, 
  unit: GardenUnit, 
  snapToGrid: boolean, 
  backgroundPattern: BackgroundPattern
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [objectsCount, setObjectsCount] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [hasSelection, setHasSelection] = useState(false);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#E6EFC8',
      preserveObjectStacking: true,
    });

    fabricCanvas.on('object:added', () => {
      setObjectsCount(prev => prev + 1);
      saveCanvasState(fabricCanvas);
    });

    fabricCanvas.on('object:removed', () => {
      setObjectsCount(prev => Math.max(0, prev - 1));
      saveCanvasState(fabricCanvas);
    });

    fabricCanvas.on('object:modified', () => {
      saveCanvasState(fabricCanvas);
    });

    fabricCanvas.on('selection:created', () => {
      setHasSelection(true);
    });

    fabricCanvas.on('selection:cleared', () => {
      setHasSelection(false);
    });

    // Object moving with snap to grid
    fabricCanvas.on('object:moving', (e) => {
      if (!snapToGrid || !e.target) return;
      
      const t = e.target;
      const grid = gridSize;
      
      // Snap position to grid
      t.set({
        left: Math.round(t.left! / grid) * grid,
        top: Math.round(t.top! / grid) * grid
      });
    });
    
    // Object scaling with snap
    fabricCanvas.on('object:scaling', (e) => {
      if (!snapToGrid || !e.target) return;
      
      const t = e.target;
      const w = t.getScaledWidth();
      const h = t.getScaledHeight();
      const grid = gridSize;
      
      // Snap size to grid
      if (t.scaleX && t.width) {
        t.scaleX = Math.round(w / grid) * grid / t.width!;
      }
      
      if (t.scaleY && t.height) {
        t.scaleY = Math.round(h / grid) * grid / t.height!;
      }
    });

    setCanvas(fabricCanvas);
    drawGrid(fabricCanvas, gridSize, unit);
    toast({
      title: "Garden Layout Designer",
      description: "Start designing your garden layout!",
    });

    // Set initial history state
    saveCanvasState(fabricCanvas);

    // Check for custom shapes from the custom shape drawer
    const customShapesJson = localStorage.getItem('customShapes');
    if (customShapesJson && fabricCanvas) {
      try {
        const customShapes = JSON.parse(customShapesJson);
        
        customShapes.forEach((shapeData: any) => {
          // Create a fabric.js path from the custom shape data
          const path = createCustomShapePath(shapeData, fabricCanvas);
          if (path) {
            fabricCanvas.add(path);
            path.center();
            fabricCanvas.setActiveObject(path);
            fabricCanvas.renderAll();
          }
        });
        
        // Clear the localStorage after importing
        localStorage.removeItem('customShapes');
        
        toast({
          title: "Custom shapes imported",
          description: "Your custom shapes have been added to the layout."
        });
      } catch (error) {
        console.error("Error importing custom shapes:", error);
      }
    }

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // Update grid when size or unit changes
  useEffect(() => {
    if (canvas) {
      drawGrid(canvas, gridSize, unit);
    }
  }, [gridSize, unit]);
  
  // Update background pattern
  useEffect(() => {
    if (canvas) {
      applyBackgroundPattern(canvas, backgroundPattern);
    }
  }, [backgroundPattern]);

  // Save canvas state for undo/redo
  const saveCanvasState = (canvas: fabric.Canvas) => {
    if (!canvas) return;
    
    // If we're not at the end of the history array,
    // truncate the history to remove future states
    if (historyIndex < history.length - 1) {
      setHistory(history.slice(0, historyIndex + 1));
    }
    
    const json = JSON.stringify(canvas.toJSON(['data']));
    
    setHistory(prev => [...prev, json]);
    setHistoryIndex(prev => prev + 1);
  };

  // Get canvas JSON for saving to database
  const getCanvasJson = () => {
    if (!canvas) return '';
    
    return JSON.stringify(canvas.toJSON(['data']));
  };

  // Load canvas from JSON string
  const loadFromJson = (jsonString: string) => {
    if (!canvas || !jsonString) return;
    
    try {
      canvas.loadFromJSON(jsonString, () => {
        canvas.renderAll();
        setObjectsCount(
          canvas.getObjects().filter(obj => !obj.data?.isGrid && !obj.data?.isLabel).length
        );
        
        // Update history after loading
        saveCanvasState(canvas);
        
        toast({
          title: "Garden layout loaded",
          description: "Your garden layout has been loaded successfully.",
        });
      });
    } catch (error: any) {
      console.error('Error loading from JSON:', error);
      toast({
        title: "Load failed",
        description: error.message || "There was a problem loading your garden layout.",
        variant: "destructive"
      });
    }
  };

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

  // Duplicate selected objects
  const duplicateSelected = () => {
    if (!canvas) return;
    
    const activeObjects = canvas.getActiveObjects();
    
    if (activeObjects.length) {
      // Clone each object
      activeObjects.forEach(obj => {
        obj.clone((clone: fabric.Object) => {
          // Position clone slightly offset from original
          clone.set({
            left: (obj.left || 0) + 20,
            top: (obj.top || 0) + 20,
            evented: true,
          });
          
          // Set a new ID for the clone
          if (!clone.data) clone.data = {};
          clone.data.id = Date.now().toString();
          
          canvas.add(clone);
          
          // If it's not a text object, add size label
          if (!(obj instanceof fabric.IText)) {
            updateShapeSizeLabel(clone, canvas, unit);
          }
          
          canvas.renderAll();
        });
      });
      
      toast({
        title: "Duplicated",
        description: `Duplicated ${activeObjects.length} item(s) in your garden layout.`,
      });
    } else {
      toast({
        title: "No selection",
        description: "Please select an object to duplicate.",
        variant: "destructive"
      });
    }
  };

  // Undo last action
  const handleUndo = () => {
    if (historyIndex <= 0 || !canvas) return;
    
    const newIndex = historyIndex - 1;
    
    canvas.loadFromJSON(history[newIndex], () => {
      setHistoryIndex(newIndex);
      setObjectsCount(
        canvas.getObjects().filter(obj => 
          !obj.data?.isGrid && !obj.data?.isLabel
        ).length
      );
      
      canvas.renderAll();
      toast({
        title: "Undo",
        description: "Previous action undone.",
      });
    });
  };

  // Redo last undone action
  const handleRedo = () => {
    if (historyIndex >= history.length - 1 || !canvas) return;
    
    const newIndex = historyIndex + 1;
    
    canvas.loadFromJSON(history[newIndex], () => {
      setHistoryIndex(newIndex);
      setObjectsCount(
        canvas.getObjects().filter(obj => 
          !obj.data?.isGrid && !obj.data?.isLabel
        ).length
      );
      
      canvas.renderAll();
      toast({
        title: "Redo",
        description: "Action redone successfully.",
      });
    });
  };

  // Remove selected objects
  const removeSelected = () => {
    if (!canvas) return;
    
    const activeObjects = canvas.getActiveObjects();
    
    if (activeObjects.length) {
      activeObjects.forEach(obj => {
        // Remove associated labels
        if (obj.data?.id) {
          const labels = canvas.getObjects().filter(item => 
            item instanceof fabric.Text && item.data?.parentId === obj.data.id
          );
          
          labels.forEach(label => canvas.remove(label));
        }
        
        canvas.remove(obj);
      });
      
      toast({
        title: "Removed",
        description: `Removed ${activeObjects.length} item(s) from your garden layout.`,
      });
      
      canvas.discardActiveObject();
      canvas.renderAll();
    } else {
      toast({
        title: "No selection",
        description: "Please select an object to remove.",
        variant: "destructive"
      });
    }
  };

  // Save layout as JSON
  const saveLayout = () => {
    if (!canvas) return;
    
    try {
      const json = canvas.toJSON(['data']);
      const jsonString = JSON.stringify(json);
      
      localStorage.setItem('gardenLayout', jsonString);
      
      toast({
        title: "Layout saved",
        description: "Your garden layout has been saved locally.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "There was a problem saving your garden layout.",
        variant: "destructive"
      });
    }
  };

  // Load layout from JSON
  const loadLayout = () => {
    if (!canvas) return;
    
    try {
      const savedLayout = localStorage.getItem('gardenLayout');
      
      if (savedLayout) {
        canvas.loadFromJSON(savedLayout, () => {
          canvas.renderAll();
          setObjectsCount(
            canvas.getObjects().filter(obj => !obj.data?.isGrid && !obj.data?.isLabel).length
          );
          
          // Update history after loading
          saveCanvasState(canvas);
          
          toast({
            title: "Layout loaded",
            description: "Your saved garden layout has been loaded.",
          });
        });
      } else {
        toast({
          title: "No saved layout",
          description: "There is no saved layout to load.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Load failed",
        description: "There was a problem loading your garden layout.",
        variant: "destructive"
      });
    }
  };

  // Clear the canvas
  const clearCanvas = () => {
    if (!canvas) return;
    
    // Remove all non-grid objects
    canvas.getObjects().forEach(obj => {
      if (!obj.data?.isGrid) {
        canvas.remove(obj);
      }
    });
    
    canvas.renderAll();
    setObjectsCount(0);
    
    toast({
      title: "Canvas cleared",
      description: "Your garden layout has been cleared.",
    });
  };

  // Bring selected object to front
  const bringToFront = () => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.bringToFront();
      canvas.renderAll();
    }
  };

  // Send selected object to back
  const sendToBack = () => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.sendToBack();
      
      // Make sure grid stays at the very back
      canvas.getObjects().forEach(obj => {
        if (obj.data?.isGrid) {
          obj.sendToBack();
        }
      });
      
      canvas.renderAll();
    }
  };

  return { 
    canvasRef,
    canvas, 
    objectsCount,
    hasSelection,
    historyIndex,
    history,
    addShape,
    duplicateSelected,
    removeSelected,
    handleUndo,
    handleRedo,
    saveLayout,
    loadLayout,
    clearCanvas,
    bringToFront,
    sendToBack,
    getCanvasJson,
    loadFromJson
  };
};
