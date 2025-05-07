
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
    loadFromJson
  } = useGardenCanvas({ unit });

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
  const addShape = (
    selectedShape: ShapeType, 
    color: string, 
    strokeWidth: number, 
    opacity: number, 
    textValue: string, 
    fontSize: number
  ) => {
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
