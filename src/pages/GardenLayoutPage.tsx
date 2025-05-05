
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
import { toast } from '@/hooks/use-toast';

type ShapeType = 'rect' | 'circle' | 'line';
type GardenUnit = 'cm' | 'in' | 'ft' | 'm';

const GardenLayoutPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedShape, setSelectedShape] = useState<ShapeType>('rect');
  const [color, setColor] = useState('#4CAF50');
  const [unit, setUnit] = useState<GardenUnit>('cm');
  const [gridSize, setGridSize] = useState(10);
  const [objectsCount, setObjectsCount] = useState(0);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#E6EFC8',
    });

    fabricCanvas.on('object:added', () => {
      setObjectsCount(prev => prev + 1);
    });

    fabricCanvas.on('object:removed', () => {
      setObjectsCount(prev => Math.max(0, prev - 1));
    });

    setCanvas(fabricCanvas);
    drawGrid(fabricCanvas, gridSize, unit);
    toast({
      title: "Garden Layout Designer",
      description: "Start designing your garden layout!",
    });

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

    switch (selectedShape) {
      case 'rect':
        shape = new fabric.Rect({
          left: 100,
          top: 100,
          width: 100,
          height: 150,
          fill: color,
          strokeWidth: 2,
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
          fill: color,
          strokeWidth: 2,
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
          strokeWidth: 5,
          cornerColor: 'black',
          transparentCorners: false
        });
        break;
      default:
        return;
    }

    canvas.add(shape);
    canvas.setActiveObject(shape);
    
    // Add a label to the shape indicating its size
    updateShapeSizeLabel(shape);
    
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
        width = shape.width || 0;
        height = shape.height || 0;
      } else if (shape instanceof fabric.Circle) {
        width = (shape.radius || 0) * 2;
        height = (shape.radius || 0) * 2;
      } else if (shape instanceof fabric.Line) {
        const x1 = shape.x1 || 0;
        const y1 = shape.y1 || 0;
        const x2 = shape.x2 || 0;
        const y2 = shape.y2 || 0;
        
        width = Math.abs(x2 - x1);
        height = Math.abs(y2 - y1);
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

  return (
    <DashboardLayout>
      <div className="flex-1 p-4 md:p-8 space-y-4">
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold">Garden Layout Designer</h1>
          <p className="text-muted-foreground">
            Design your garden beds, plots, and containers with accurate measurements.
          </p>
          
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="shape-select">Shape</Label>
              <Select value={selectedShape} onValueChange={(value: ShapeType) => setSelectedShape(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select shape" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rect">Rectangle/Bed</SelectItem>
                  <SelectItem value="circle">Circle/Container</SelectItem>
                  <SelectItem value="line">Line/Path</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="color-input">Color</Label>
              <Input
                id="color-input"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-[100px] h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit-select">Unit</Label>
              <Select value={unit} onValueChange={(value: GardenUnit) => setUnit(value as GardenUnit)}>
                <SelectTrigger className="w-[180px]">
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
            
            <div className="space-y-2 flex-1 max-w-xs">
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
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={addShape}>Add Shape</Button>
            <Button onClick={removeSelected} variant="destructive">Remove Selected</Button>
            <Button onClick={saveLayout} variant="outline">Save Layout</Button>
            <Button onClick={loadLayout} variant="outline">Load Layout</Button>
            <Button onClick={clearCanvas} variant="outline">Clear All</Button>
            <div className="flex-1 text-right flex items-center justify-end">
              <span className="text-sm text-muted-foreground">
                {objectsCount} {objectsCount === 1 ? 'item' : 'items'} in layout
              </span>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden bg-white">
            <canvas ref={canvasRef} className="w-full" />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Tip: Click and drag to move objects. Use the corner handles to resize.</p>
            <p>Objects are sized according to the grid measurement: {gridSize} {unit} per grid square.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GardenLayoutPage;
