
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import SaveCustomShapesDialog from '@/components/garden-layout/SaveCustomShapesDialog';
import CustomShapeCanvas from '@/components/garden-layout/custom-shapes/CustomShapeCanvas';
import CustomShapeToolbar from '@/components/garden-layout/custom-shapes/CustomShapeToolbar';
import CustomShapeInstructions from '@/components/garden-layout/custom-shapes/CustomShapeInstructions';
import { useCustomShapeDrawer, CustomShapePoint } from '@/components/garden-layout/custom-shapes/useCustomShapeDrawer';

export default function CustomShapeDrawerPage() {
  const navigate = useNavigate();
  
  // Custom shape drawer hook
  const {
    canvasRef,
    shapes,
    setShapes,
    points,
    setPoints,
    currentColor,
    selectedShape,
    setSelectedShape,
    isHoveringFirstPoint,
    setIsHoveringFirstPoint,
    isHoveringLine,
    setIsHoveringLine,
    selectedLine,
    setSelectedLine,
    isDraggingCurve,
    setIsDraggingCurve,
    isMovingShape,
    setIsMovingShape,
    moveStartPos,
    setMoveStartPos,
    curvePoint,
    setCurvePoint,
    isNearFirstPoint,
    findHoveredLine,
    isPointInShape,
    completeShape,
    finishShape,
    clearCanvas,
    changeColor,
    deleteSelectedShape,
  } = useCustomShapeDrawer();
  
  // State for save dialog
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [shapesName, setShapesName] = useState('');
  const [shapesDescription, setShapesDescription] = useState('');

  const handleAddPoint = (point: CustomShapePoint) => {
    setPoints([...points, point]);
  };

  const handleUpdateShapes = (updatedShapes: any[]) => {
    setShapes(updatedShapes);
  };

  // Add shape to garden layout and return to the layout designer
  const addShapeToLayout = () => {
    // If there are shapes to save, open the save dialog
    if (shapes.length > 0) {
      setSaveDialogOpen(true);
    } else {
      toast({
        title: "No shapes to add",
        description: "Draw at least one shape before saving",
        variant: "destructive"
      });
    }
  };
  
  // Complete the save and use action after dialog
  const completeSaveAndUse = () => {
    if (!shapesName.trim()) return;
    
    // Save shape data to localStorage to pass between pages
    const shapesData = {
      shapes: shapes,
      name: shapesName,
      description: shapesDescription,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('customShapes', JSON.stringify(shapesData));
    
    toast({
      title: "Custom shapes saved",
      description: `${shapes.length} shape(s) added to layout as "${shapesName}"`,
    });
    
    // Close dialog and navigate back
    setSaveDialogOpen(false);
    navigate('/dashboard/garden-layout');
  };

  return (
    <DashboardLayout>
      <div className="flex-1 p-4 md:p-8 space-y-4">
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold">Custom Shape Designer</h1>
          <p className="text-muted-foreground">
            Draw complex shapes with curves for your garden layout.
          </p>
          
          <div className="flex justify-between">
            <Button onClick={() => navigate('/dashboard/garden-layout')} variant="outline">
              Back to Layout Designer
            </Button>
          </div>
          
          {/* Toolbar component */}
          <CustomShapeToolbar
            onFinishShape={finishShape}
            onClearCanvas={clearCanvas}
            onDeleteShape={deleteSelectedShape}
            onChangeColor={changeColor}
            onSaveShapes={addShapeToLayout}
            selectedShape={selectedShape}
            shapesCount={shapes.length}
            pointsCount={points.length}
          />
          
          {/* Canvas container */}
          <div className="border-2 border-border rounded overflow-hidden bg-white">
            <CustomShapeCanvas
              canvasRef={canvasRef}
              shapes={shapes}
              points={points}
              onAddPoint={handleAddPoint}
              selectedShape={selectedShape}
              setSelectedShape={setSelectedShape}
              isHoveringFirstPoint={isHoveringFirstPoint}
              setIsHoveringFirstPoint={setIsHoveringFirstPoint}
              isHoveringLine={isHoveringLine}
              setIsHoveringLine={setIsHoveringLine}
              selectedLine={selectedLine}
              setSelectedLine={setSelectedLine}
              isDraggingCurve={isDraggingCurve}
              setIsDraggingCurve={setIsDraggingCurve}
              isMovingShape={isMovingShape}
              setIsMovingShape={setIsMovingShape}
              moveStartPos={moveStartPos}
              setMoveStartPos={setMoveStartPos}
              curvePoint={curvePoint}
              setCurvePoint={setCurvePoint}
              isNearFirstPoint={isNearFirstPoint}
              findHoveredLine={findHoveredLine}
              isPointInShape={isPointInShape}
              completeShape={completeShape}
              onUpdateShapes={handleUpdateShapes}
            />
          </div>
          
          {/* Instructions component */}
          <CustomShapeInstructions 
            shapesCount={shapes.length}
            selectedShapeIndex={selectedShape}
            pointsCount={points.length}
          />
        </div>
      </div>
      
      {/* Add the save dialog */}
      <SaveCustomShapesDialog
        open={saveDialogOpen}
        setOpen={setSaveDialogOpen}
        shapesName={shapesName}
        setShapesName={setShapesName}
        shapesDescription={shapesDescription}
        setShapesDescription={setShapesDescription}
        onSave={completeSaveAndUse}
        shapeCount={shapes.length}
      />
    </DashboardLayout>
  );
}
