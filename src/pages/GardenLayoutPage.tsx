
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { ShapeType, GardenUnit, BackgroundPattern } from '@/components/garden-layout/utils/canvasUtils';
import ShapesToolbar from '@/components/garden-layout/ShapesToolbar';
import StylingControls from '@/components/garden-layout/StylingControls';
import SettingsControls from '@/components/garden-layout/SettingsControls';
import SavedShapesTab from '@/components/garden-layout/SavedShapesTab';
import SaveShapeDialog from '@/components/garden-layout/SaveShapeDialog';
import GardenLayouts from '@/components/garden-layout/GardenLayouts';
import GardenCanvas from '@/components/garden-layout/GardenCanvas';
import { useGardenCanvas } from '@/components/garden-layout/hooks/useGardenCanvas';
import { useSaveShapeDialog } from '@/components/garden-layout/hooks/useSaveShapeDialog';
import { useSavedShapes } from '@/components/garden-layout/hooks/useSavedShapes';
import { useShapeAdder } from '@/components/garden-layout/hooks/useShapeAdder';

const GardenLayoutPage = () => {
  // State for shape properties
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
  const [activeTab, setActiveTab] = useState('shapes');

  // Initialize the canvas with hooks
  const { 
    canvasRef, 
    canvas, 
    objectsCount, 
    hasSelection, 
    historyIndex, 
    history, 
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

  // Hook for saved shapes management
  const {
    savedShapes,
    setSavedShapes,
    loadSavedShape,
    deleteSavedShape,
    loadAllShapes
  } = useSavedShapes({ canvas, unit });

  // Hook for save dialog management
  const {
    saveDialogOpen,
    setSaveDialogOpen,
    shapeName,
    setShapeName,
    handleSaveSelectedShape,
    completeSaveShape
  } = useSaveShapeDialog({
    canvas,
    savedShapes,
    setSavedShapes
  });

  // Hook for adding shapes
  const { addShape: addShapeToCanvas } = useShapeAdder({ canvas, unit });

  // Handler for adding a shape
  const addShape = () => {
    addShapeToCanvas(selectedShape, color, strokeWidth, opacity, textValue, fontSize);
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
          
          <GardenCanvas 
            canvasRef={canvasRef} 
            canvas={canvas}
            activeTab={activeTab}
          />
          
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
