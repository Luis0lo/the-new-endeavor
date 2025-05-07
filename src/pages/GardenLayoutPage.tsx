
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import GardenCanvas from '@/components/garden-layout/GardenCanvas';
import GardenLayoutTabs from '@/components/garden-layout/GardenLayoutTabs';
import SaveShapeDialog from '@/components/garden-layout/SaveShapeDialog';
import { useGardenLayoutState } from '@/components/garden-layout/hooks/useGardenLayoutState';
import { useGardenLayoutCanvas } from '@/components/garden-layout/hooks/useGardenLayoutCanvas';

const GardenLayoutPage = () => {
  // Get state from hooks
  const {
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
    activeTab,
    setActiveTab
  } = useGardenLayoutState();

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
    loadFromJson,
    savedShapes,
    loadSavedShape,
    deleteSavedShape,
    loadAllShapes,
    saveDialogOpen,
    setSaveDialogOpen,
    shapeName,
    setShapeName,
    handleSaveSelectedShape,
    completeSaveShape,
    addShape,
    generatePreview
  } = useGardenLayoutCanvas({
    gridSize,
    unit,
    snapToGrid,
    backgroundPattern
  });

  // Handler for adding a shape
  const handleAddShape = () => {
    addShape(selectedShape, color, strokeWidth, opacity, textValue, fontSize);
  };

  // Wrapper for loadLayout to match the expected function signature (no arguments)
  const handleLoadLayout = () => {
    // Fix: Call loadLayout with an empty string as a fallback value
    // This ensures we're passing an argument as expected by the function signature
    loadLayout('');
  };

  return (
    <DashboardLayout>
      <div className="flex-1 p-4 md:p-8 space-y-4">
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold">Garden Layout Designer</h1>
          <p className="text-muted-foreground">
            Design your garden beds, plots, and containers with accurate measurements.
          </p>
          
          <GardenLayoutTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedShape={selectedShape}
            setSelectedShape={setSelectedShape}
            color={color}
            setColor={setColor}
            unit={unit}
            setUnit={setUnit}
            gridSize={gridSize}
            setGridSize={setGridSize}
            snapToGrid={snapToGrid}
            setSnapToGrid={setSnapToGrid}
            strokeWidth={strokeWidth}
            setStrokeWidth={setStrokeWidth}
            opacity={opacity}
            setOpacity={setOpacity}
            backgroundPattern={backgroundPattern}
            setBackgroundPattern={setBackgroundPattern}
            textValue={textValue}
            setTextValue={setTextValue}
            fontSize={fontSize}
            setFontSize={setFontSize}
            objectsCount={objectsCount}
            handleUndo={handleUndo}
            handleRedo={handleRedo}
            removeSelected={removeSelected}
            duplicateSelected={duplicateSelected}
            bringToFront={bringToFront}
            sendToBack={sendToBack}
            historyIndex={historyIndex}
            history={history}
            hasSelection={hasSelection}
            addShape={handleAddShape}
            handleSaveSelectedShape={handleSaveSelectedShape}
            saveLayout={saveLayout}
            loadLayout={handleLoadLayout}
            clearCanvas={clearCanvas}
            savedShapes={savedShapes}
            loadSavedShape={loadSavedShape}
            deleteSavedShape={deleteSavedShape}
            loadAllShapes={loadAllShapes}
            canvasJson={getCanvasJson()}
            loadGardenLayout={loadFromJson}
            generatePreview={generatePreview}
          />
          
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
