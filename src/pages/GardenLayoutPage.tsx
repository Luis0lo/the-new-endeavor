
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { toast } from '@/hooks/use-toast';
import { fabric } from 'fabric';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useGardenCanvas } from '@/components/garden-layout/hooks/useGardenCanvas';
import { ShapeType, GardenUnit, BackgroundPattern, SavedShape } from '@/components/garden-layout/utils/canvasUtils';
import ShapesToolbar from '@/components/garden-layout/ShapesToolbar';
import StylingControls from '@/components/garden-layout/StylingControls';
import SettingsControls from '@/components/garden-layout/SettingsControls';
import SavedShapesTab from '@/components/garden-layout/SavedShapesTab';
import SaveShapeDialog from '@/components/garden-layout/SaveShapeDialog';
import GardenLayouts from '@/components/garden-layout/GardenLayouts';
// Import canvasUtils for direct access to updateShapeSizeLabel
import { updateShapeSizeLabel } from '@/components/garden-layout/utils/canvasUtils';

const GardenLayoutPage = () => {
  const [selectedShape, setSelectedShape] = useState<ShapeType>('rect');
  const [color, setColor] = useState('#4CAF50');
  const [unit, setUnit] = useState<GardenUnit>('cm');
  const [gridSize, setGridSize] = useState(10);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [opacity, setOpacity] = useState(100);
  const [backgroundPattern, setBackgroundPattern] = useState<BackgroundPattern>('none');
  const [textValue, setTextValue] = useState('Label');
  const [fontSize, setFontSize] = useState(16);
  const [savedShapes, setSavedShapes] = useState<SavedShape[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [shapeName, setShapeName] = useState('');
  const [activeTab, setActiveTab] = useState('shapes');

  const navigate = useNavigate();

  const { 
    canvasRef, 
    canvas, 
    objectsCount, 
    hasSelection, 
    historyIndex, 
    history, 
    addShape: addShapeToCanvas,
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
  } = useGardenCanvas(gridSize, unit, snapToGrid, backgroundPattern);

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

  // Control object resizability based on active tab
  useEffect(() => {
    if (!canvas) return;
    
    // Only allow resizing on the Shapes & Tools tab
    const canResize = activeTab === 'shapes';
    
    canvas.getObjects().forEach(obj => {
      if (!obj.data?.isGrid && !obj.data?.isLabel) {
        obj.set({
          lockScalingX: !canResize,
          lockScalingY: !canResize,
          hasControls: canResize,
        });
      }
    });
    
    canvas.renderAll();
  }, [canvas, activeTab]);

  const addShape = () => {
    addShapeToCanvas(selectedShape, color, strokeWidth, opacity, textValue, fontSize);
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
            // Use the directly imported updateShapeSizeLabel
            updateShapeSizeLabel(obj, canvas, unit);
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

  // Generate preview image for garden layout
  const generatePreview = () => {
    if (!canvas) return '';
    return canvas.toDataURL({
      format: 'png',
      quality: 0.5,
      width: 300,
      height: 200
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
          
          <Tabs 
            defaultValue="shapes" 
            className="w-full"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="shapes">Shapes & Tools</TabsTrigger>
              <TabsTrigger value="styling">Styling</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="saved">Saved Shapes</TabsTrigger>
              <TabsTrigger value="gardens">Gardens</TabsTrigger>
            </TabsList>
            
            <TabsContent value="shapes" className="space-y-4">
              <ShapesToolbar 
                selectedShape={selectedShape}
                setSelectedShape={setSelectedShape}
                textValue={textValue}
                setTextValue={setTextValue}
                addShape={addShape}
                handleUndo={handleUndo}
                handleRedo={handleRedo}
                removeSelected={removeSelected}
                duplicateSelected={duplicateSelected}
                bringToFront={bringToFront}
                handleSaveSelectedShape={handleSaveSelectedShape}
                saveLayout={saveLayout}
                loadLayout={loadLayout}
                clearCanvas={clearCanvas}
                historyIndex={historyIndex}
                history={history}
                hasSelection={hasSelection}
              />
            </TabsContent>
            
            <TabsContent value="styling" className="space-y-4">
              <StylingControls 
                color={color}
                setColor={setColor}
                opacity={opacity}
                setOpacity={setOpacity}
                strokeWidth={strokeWidth}
                setStrokeWidth={setStrokeWidth}
                backgroundPattern={backgroundPattern}
                setBackgroundPattern={setBackgroundPattern}
                fontSize={fontSize}
                setFontSize={setFontSize}
                selectedShape={selectedShape}
              />
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <SettingsControls 
                unit={unit}
                setUnit={setUnit}
                gridSize={gridSize}
                setGridSize={setGridSize}
                snapToGrid={snapToGrid}
                setSnapToGrid={setSnapToGrid}
                objectsCount={objectsCount}
              />
            </TabsContent>
            
            <TabsContent value="saved" className="space-y-4">
              <SavedShapesTab 
                savedShapes={savedShapes}
                loadSavedShape={loadSavedShape}
                deleteSavedShape={deleteSavedShape}
                loadAllShapes={loadAllShapes}
              />
            </TabsContent>

            <TabsContent value="gardens" className="space-y-4">
              <GardenLayouts 
                canvasJson={getCanvasJson()}
                loadGardenLayout={loadFromJson}
                generatePreview={generatePreview}
              />
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
      
      <SaveShapeDialog 
        open={saveDialogOpen}
        setOpen={setSaveDialogOpen}
        shapeName={shapeName}
        setShapeName={setShapeName}
        onSave={completeSaveShape}
      />
    </DashboardLayout>
  );
};

export default GardenLayoutPage;
