
import React from 'react';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import ShapesToolbar from '@/components/garden-layout/ShapesToolbar';
import StylingControls from '@/components/garden-layout/StylingControls';
import SettingsControls from '@/components/garden-layout/SettingsControls';
import SavedShapesTab from '@/components/garden-layout/SavedShapesTab';
import GardenLayouts from '@/components/garden-layout/GardenLayouts';
import { ShapeType, GardenUnit, BackgroundPattern } from '@/components/garden-layout/utils/canvasUtils';
import { fabric } from 'fabric';

interface GardenLayoutTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  selectedShape: ShapeType;
  setSelectedShape: (shape: ShapeType) => void;
  color: string;
  setColor: (color: string) => void;
  unit: GardenUnit;
  setUnit: (unit: GardenUnit) => void;
  gridSize: number;
  setGridSize: (size: number) => void;
  snapToGrid: boolean;
  setSnapToGrid: (snap: boolean) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  backgroundPattern: BackgroundPattern;
  setBackgroundPattern: (pattern: BackgroundPattern) => void;
  textValue: string;
  setTextValue: (text: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  objectsCount: number;
  handleUndo: () => void;
  handleRedo: () => void;
  removeSelected: () => void;
  duplicateSelected: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  historyIndex: number;
  history: string[];
  hasSelection: boolean;
  addShape: () => void;
  handleSaveSelectedShape: () => void;
  saveLayout: () => void;
  loadLayout: () => void;
  clearCanvas: () => void;
  savedShapes: any[];
  loadSavedShape: (shape: any) => void;
  deleteSavedShape: (id: string) => void;
  loadAllShapes: () => void;
  canvasJson: string;
  loadGardenLayout: (json: string) => void;
  generatePreview: () => string;
}

const GardenLayoutTabs: React.FC<GardenLayoutTabsProps> = ({
  activeTab,
  setActiveTab,
  selectedShape,
  setSelectedShape,
  color,
  setColor,
  unit,
  setUnit,
  gridSize,
  setGridSize,
  snapToGrid,
  setSnapToGrid,
  strokeWidth,
  setStrokeWidth,
  opacity,
  setOpacity,
  backgroundPattern,
  setBackgroundPattern,
  textValue,
  setTextValue,
  fontSize,
  setFontSize,
  objectsCount,
  handleUndo,
  handleRedo,
  removeSelected,
  duplicateSelected,
  bringToFront,
  sendToBack,
  historyIndex,
  history,
  hasSelection,
  addShape,
  handleSaveSelectedShape,
  saveLayout,
  loadLayout,
  clearCanvas,
  savedShapes,
  loadSavedShape,
  deleteSavedShape,
  loadAllShapes,
  canvasJson,
  loadGardenLayout,
  generatePreview
}) => {
  return (
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
          canvasJson={canvasJson}
          loadGardenLayout={loadGardenLayout}
          generatePreview={generatePreview}
        />
      </TabsContent>
    </Tabs>
  );
};

export default GardenLayoutTabs;
