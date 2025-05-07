
import { useRef, useEffect } from 'react';
import { useGardenCanvas } from './useGardenCanvas';
import { useShapeAdder } from './useShapeAdder';
import { useSavedShapes } from './useSavedShapes';
import { useSaveShapeDialog } from './useSaveShapeDialog';
import { GardenUnit, BackgroundPattern, ShapeType } from '../utils/canvasUtils';

interface UseGardenLayoutCanvasProps {
  gridSize: number;
  unit: GardenUnit;
  snapToGrid: boolean;
  backgroundPattern: BackgroundPattern;
}

export const useGardenLayoutCanvas = ({
  gridSize,
  unit,
  snapToGrid,
  backgroundPattern
}: UseGardenLayoutCanvasProps) => {
  // Initialize the canvas with hooks
  const gardenCanvas = useGardenCanvas({ unit });
  
  // Get all properties from useGardenCanvas
  const { 
    canvas, 
    canvasRef,
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
    addGrid,
    setBackground
  } = gardenCanvas;

  // Debug effect to track canvas initialization
  useEffect(() => {
    console.log("useGardenLayoutCanvas: Canvas instance:", canvas ? "exists" : "null");
    console.log("useGardenLayoutCanvas: Canvas ref element:", canvasRef?.current ? "exists" : "null");
    
    if (canvas) {
      console.log("Canvas dimensions:", canvas.getWidth(), "x", canvas.getHeight());
    }
    
    // Apply grid and background on initial load
    if (canvas) {
      // Clear any existing grid first
      const gridObjects = canvas.getObjects().filter(obj => obj.data?.isGrid);
      gridObjects.forEach(obj => canvas.remove(obj));
      
      // Add new grid
      if (snapToGrid) {
        addGrid(gridSize);
      }
      
      // Set background pattern
      setBackground(backgroundPattern);
      
      canvas.renderAll();
    }
  }, [canvas, gridSize, snapToGrid, backgroundPattern]);

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

  // Hook for adding shapes - get the shapeAdder object first
  const shapeAdder = useShapeAdder({ canvas, unit });

  // Handler for adding a shape
  const addShape = (
    selectedShape: ShapeType, 
    color: string, 
    strokeWidth: number, 
    opacity: number, 
    textValue: string, 
    fontSize: number
  ) => {
    console.log("Adding shape:", selectedShape, "Canvas:", canvas ? "exists" : "null");
    // Use the addShape function from shapeAdder
    if (shapeAdder && typeof shapeAdder.addShape === 'function') {
      shapeAdder.addShape(selectedShape, color, strokeWidth, opacity, textValue, fontSize);
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

  return {
    canvas,
    canvasRef,
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
  };
};
