
import React, { useRef, useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { fabric } from 'fabric';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { 
  Undo2, 
  Redo2, 
  Square, 
  Circle, 
  Minus, 
  Type, 
  Trash,
  Copy, 
  Save, 
  Layers,
  PenTool,
  FolderOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ShapeType = 'rect' | 'circle' | 'line' | 'text';
type GardenUnit = 'cm' | 'in' | 'ft' | 'm';
type BackgroundPattern = 'none' | 'soil' | 'grass' | 'concrete' | 'wood';

interface SavedShape {
  id: string;
  name: string;
  data: string; // JSON string of the shape
  createdAt: number;
  preview?: string; // Optional base64 thumbnail
}

const GardenLayoutPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedShape, setSelectedShape] = useState<ShapeType>('rect');
  const [color, setColor] = useState('#4CAF50');
  const [unit, setUnit] = useState<GardenUnit>('cm');
  const [gridSize, setGridSize] = useState(10);
  const [objectsCount, setObjectsCount] = useState(0);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [opacity, setOpacity] = useState(100);
  const [backgroundPattern, setBackgroundPattern] = useState<BackgroundPattern>('none');
  const [textValue, setTextValue] = useState('Label');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [hasSelection, setHasSelection] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [savedShapes, setSavedShapes] = useState<SavedShape[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [shapeName, setShapeName] = useState('');

  const navigate = useNavigate();

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

  // Apply background pattern to canvas
  const applyBackgroundPattern = (canvas: fabric.Canvas, pattern: BackgroundPattern) => {
    if (pattern === 'none') {
      canvas.setBackgroundColor('#E6EFC8', canvas.renderAll.bind(canvas));
      return;
    }
    
    let fillPattern;
    
    switch (pattern) {
      case 'soil':
        fillPattern = '#8B4513';
        break;
      case 'grass':
        fillPattern = '#7CFC00';
        break;
      case 'concrete':
        fillPattern = '#C0C0C0';
        break;
      case 'wood':
        fillPattern = '#DEB887';
        break;
      default:
        fillPattern = '#E6EFC8';
    }
    
    canvas.setBackgroundColor(fillPattern, canvas.renderAll.bind(canvas));
  };

  // Draw grid on canvas
  const drawGrid = (canvas: fabric.Canvas, size: number, unit: GardenUnit) => {
    // Clear existing grid lines
    canvas.getObjects().forEach(obj => {
      if (obj.data?.isGrid) {
        canvas.remove(obj);
      }
    });

    // Draw new grid lines
    const width = canvas.width || 800;
    const height = canvas.height || 600;
    const gridColor = '#cccccc';

    // Draw vertical lines
    for (let i = 0; i <= width; i += size) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: gridColor,
        selectable: false,
        evented: false,
        strokeWidth: 0.5
      });
      line.data = { isGrid: true };
      canvas.add(line);
      canvas.sendToBack(line);
    }

    // Draw horizontal lines
    for (let i = 0; i <= height; i += size) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: gridColor,
        selectable: false,
        evented: false,
        strokeWidth: 0.5
      });
      line.data = { isGrid: true };
      canvas.add(line);
      canvas.sendToBack(line);
    }

    // Add scale indicators
    const scaleText = new fabric.Text(`Grid: ${size} ${unit}`, {
      left: 10,
      top: height - 20,
      fontSize: 14,
      fontFamily: 'Arial',
      fill: '#333333',
      selectable: false,
      evented: false
    });
    scaleText.data = { isGrid: true };
    canvas.add(scaleText);
    
    canvas.renderAll();
  };

  // Add shape to canvas
  const addShape = () => {
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
      updateShapeSizeLabel(shape);
    }
    
    canvas.renderAll();
    
    toast({
      title: "Shape added",
      description: `Added a new ${selectedShape} to your garden layout.`,
    });
  };

  // Update size label on shape movement or resize
  const updateShapeSizeLabel = (shape: fabric.Object) => {
    const updateLabel = () => {
      let width = 0;
      let height = 0;
      
      if (shape instanceof fabric.Rect) {
        width = (shape.width || 0) * (shape.scaleX || 1);
        height = (shape.height || 0) * (shape.scaleY || 1);
      } else if (shape instanceof fabric.Circle) {
        width = (shape.radius || 0) * 2 * (shape.scaleX || 1);
        height = (shape.radius || 0) * 2 * (shape.scaleY || 1);
      } else if (shape instanceof fabric.Line) {
        const x1 = shape.x1 || 0;
        const y1 = shape.y1 || 0;
        const x2 = shape.x2 || 0;
        const y2 = shape.y2 || 0;
        
        width = Math.abs(x2 - x1) * (shape.scaleX || 1);
        height = Math.abs(y2 - y1) * (shape.scaleY || 1);
      }
      
      // Round dimensions for display
      width = Math.round(width);
      height = Math.round(height);
      
      // Find existing label or create new one
      let label = canvas?.getObjects().find(obj => 
        obj instanceof fabric.Text && obj.data?.parentId === shape.data?.id
      );
      
      if (label) {
        canvas?.remove(label);
      }
      
      let dimensionText = '';
      if (shape instanceof fabric.Rect) {
        dimensionText = `${width} × ${height} ${unit}`;
      } else if (shape instanceof fabric.Circle) {
        dimensionText = `⌀ ${width} ${unit}`;
      } else {
        dimensionText = `${width} ${unit}`;
      }
      
      const newLabel = new fabric.Text(dimensionText, {
        fontSize: 12,
        fontFamily: 'Arial',
        fill: '#000000',
        left: (shape.left || 0) + 5,
        top: (shape.top || 0) - 15,
        selectable: false,
        evented: false
      });
      
      if (!shape.data) shape.data = {};
      if (!shape.data.id) shape.data.id = Date.now().toString();
      newLabel.data = { parentId: shape.data.id, isLabel: true };
      
      canvas?.add(newLabel);
      canvas?.renderAll();
    };
    
    shape.on('moving', updateLabel);
    shape.on('scaling', updateLabel);
    shape.on('modified', updateLabel);
    
    // Initial label
    updateLabel();
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
            updateShapeSizeLabel(clone);
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

  // Create a fabric.js path from custom shape data
  const createCustomShapePath = (shapeData: any, canvas: fabric.Canvas) => {
    try {
      const points = shapeData.points;
      const curves = shapeData.curves || [];
      const color = shapeData.color;
      
      if (!points || points.length < 3) return null;
      
      // Generate SVG path data
      let pathData = `M ${points[0].x} ${points[0].y}`;
      
      for (let i = 1; i <= points.length; i++) {
        const nextIndex = i % points.length;
        const prevIndex = i - 1;
        
        const curveData = curves.find((c: any) => 
          (c.startIndex === prevIndex && c.endIndex === nextIndex) || 
          (c.startIndex === nextIndex && c.endIndex === prevIndex)
        );
        
        if (curveData) {
          // Quadratic curve
          pathData += ` Q ${curveData.controlPoint.x},${curveData.controlPoint.y} ${points[nextIndex].x},${points[nextIndex].y}`;
        } else {
          // Straight line
          pathData += ` L ${points[nextIndex].x} ${points[nextIndex].y}`;
        }
      }
      
      pathData += ' Z'; // Close path
      
      // Create the fabric path
      const path = new fabric.Path(pathData, {
        fill: color + '40',
        stroke: color,
        strokeWidth: 2,
        opacity: 0.9,
        objectCaching: false,
        transparentCorners: false,
        cornerColor: 'rgba(102,153,255,0.8)',
      });
      
      // Add data attribute to identify this as a custom shape
      path.data = { isCustomShape: true };
      
      return path;
    } catch (error) {
      console.error("Error creating custom shape path:", error);
      return null;
    }
  };

  // Open custom shape drawer
  const openCustomShapeDrawer = () => {
    navigate('/dashboard/custom-shape');
  };

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
          updateShapeSizeLabel(obj);
        }
        
        canvas.renderAll();
        
        toast({
          title: "Shape loaded",
          description: `"${shape.name}" has been added to your layout.`,
        });
      });
    } catch (error) {
      console.error("Error loading shape:", error);
      toast({
        title: "Load failed",
        description: "There was a problem loading your shape.",
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
            updateShapeSizeLabel(obj);
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

  return (
    <DashboardLayout>
      <div className="flex-1 p-4 md:p-8 space-y-4">
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold">Garden Layout Designer</h1>
          <p className="text-muted-foreground">
            Design your garden beds, plots, and containers with accurate measurements.
          </p>
          
          <Tabs defaultValue="shapes" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="shapes">Shapes & Tools</TabsTrigger>
              <TabsTrigger value="styling">Styling</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="saved">Saved Shapes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="shapes" className="space-y-4">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="shape-select">Shape</Label>
                  <Select value={selectedShape} onValueChange={(value: ShapeType) => setSelectedShape(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rect">
                        <div className="flex items-center gap-2">
                          <Square size={16} />
                          <span>Rectangle/Bed</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="circle">
                        <div className="flex items-center gap-2">
                          <Circle size={16} />
                          <span>Circle/Container</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="line">
                        <div className="flex items-center gap-2">
                          <Minus size={16} />
                          <span>Line/Path</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="text">
                        <div className="flex items-center gap-2">
                          <Type size={16} />
                          <span>Text/Label</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedShape === 'text' && (
                  <div className="space-y-2">
                    <Label htmlFor="text-input">Text</Label>
                    <Input
                      id="text-input"
                      value={textValue}
                      onChange={(e) => setTextValue(e.target.value)}
                      className="w-[180px]"
                      placeholder="Enter text"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Button onClick={addShape}>Add Shape</Button>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={openCustomShapeDrawer}
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    <PenTool size={16} />
                    <span>Custom Shape</span>
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleUndo} 
                    variant="outline" 
                    disabled={historyIndex <= 0}
                    title="Undo"
                  >
                    <Undo2 size={16} />
                  </Button>
                  <Button 
                    onClick={handleRedo} 
                    variant="outline" 
                    disabled={historyIndex >= history.length - 1}
                    title="Redo"
                  >
                    <Redo2 size={16} />
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={removeSelected} 
                    variant="destructive"
                    disabled={!hasSelection}
                    title="Delete"
                  >
                    <Trash size={16} />
                  </Button>
                  <Button 
                    onClick={duplicateSelected} 
                    variant="outline"
                    disabled={!hasSelection}
                    title="Duplicate"
                  >
                    <Copy size={16} />
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={bringToFront} 
                    variant="outline"
                    disabled={!hasSelection}
                    title="Bring to front"
                  >
                    <Layers size={16} />
                  </Button>
                  <Button
                    onClick={handleSaveSelectedShape}
                    variant="outline"
                    disabled={!hasSelection}
                    title="Save selected shape"
                  >
                    <Save size={16} />
                    <span className="ml-1">Save Shape</span>
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button onClick={saveLayout} variant="outline" title="Save layout">
                  <Save size={16} className="mr-1" />
                  <span>Save Layout</span>
                </Button>
                <Button onClick={loadLayout} variant="outline" title="Load layout">
                  <FolderOpen size={16} className="mr-1" />
                  <span>Load Layout</span>
                </Button>
                <Button onClick={clearCanvas} variant="outline" title="Clear canvas">
                  <span>Clear All</span>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="styling" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="color-input">Color</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        id="color-input"
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-[100px] h-10"
                      />
                      <div 
                        className="w-10 h-10 rounded-md border" 
                        style={{ backgroundColor: color }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="opacity">Opacity: {opacity}%</Label>
                    </div>
                    <Slider
                      id="opacity"
                      min={10}
                      max={100}
                      step={5}
                      value={[opacity]}
                      onValueChange={(value) => setOpacity(value[0])}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="stroke-width">Border width: {strokeWidth}px</Label>
                    </div>
                    <Slider
                      id="stroke-width"
                      min={0}
                      max={10}
                      step={1}
                      value={[strokeWidth]}
                      onValueChange={(value) => setStrokeWidth(value[0])}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="background-select">Background</Label>
                    <Select 
                      value={backgroundPattern} 
                      onValueChange={(value: BackgroundPattern) => setBackgroundPattern(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select background" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Default</SelectItem>
                        <SelectItem value="soil">Soil</SelectItem>
                        <SelectItem value="grass">Grass</SelectItem>
                        <SelectItem value="concrete">Concrete</SelectItem>
                        <SelectItem value="wood">Wood</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedShape === 'text' && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
                      </div>
                      <Slider
                        id="font-size"
                        min={10}
                        max={72}
                        step={2}
                        value={[fontSize]}
                        onValueChange={(value) => setFontSize(value[0])}
                      />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="unit-select">Unit</Label>
                    <Select value={unit} onValueChange={(value: GardenUnit) => setUnit(value as GardenUnit)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cm">Centimeters (cm)</SelectItem>
                        <SelectItem value="in">Inches (in)</SelectItem>
                        <SelectItem value="ft">Feet (ft)</SelectItem>
                        <SelectItem value="m">Meters (m)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="grid-size">Grid Size: {gridSize} {unit}</Label>
                    </div>
                    <Slider
                      id="grid-size"
                      min={5}
                      max={50}
                      step={5}
                      value={[gridSize]}
                      onValueChange={(value) => setGridSize(value[0])}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="snap-to-grid"
                      checked={snapToGrid}
                      onCheckedChange={setSnapToGrid}
                    />
                    <Label htmlFor="snap-to-grid">Snap to grid</Label>
                  </div>
                  
                  <div className="pt-4">
                    <div className="text-sm text-muted-foreground">
                      <p>Objects in layout: {objectsCount}</p>
                      <p>Canvas size: 800 × 600 pixels</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="saved" className="space-y-4">
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
            </TabsContent>
          </Tabs>
          
          <div className="border rounded-lg overflow-hidden bg-white">
            <canvas ref={canvasRef} className="w-full" />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Tip: Click to add shapes, then drag to position them. Use the Custom Shape tool for complex garden boundaries.</p>
          </div>
        </div>
      </div>
      
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Shape</DialogTitle>
            <DialogDescription>
              Give your shape a name so you can reuse it in other garden layouts.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="shape-name">Shape Name</Label>
              <Input 
                id="shape-name" 
                value={shapeName} 
                onChange={(e) => setShapeName(e.target.value)} 
                placeholder="Enter a name for this shape"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={completeSaveShape} disabled={!shapeName.trim()}>Save Shape</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default GardenLayoutPage;
