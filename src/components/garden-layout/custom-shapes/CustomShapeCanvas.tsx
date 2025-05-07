import React from 'react';
import { useCustomShapeDrawer, CustomShapePoint } from './useCustomShapeDrawer';

interface CustomShapeCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  shapes: any[];
  points: CustomShapePoint[];
  onAddPoint: (point: CustomShapePoint) => void;
  selectedShape: number | null;
  setSelectedShape: (index: number | null) => void;
  isHoveringFirstPoint: boolean;
  setIsHoveringFirstPoint: (isHovering: boolean) => void;
  isHoveringLine: boolean;
  setIsHoveringLine: (isHovering: boolean) => void;
  selectedLine: {startIndex: number, endIndex: number} | null;
  setSelectedLine: (line: {startIndex: number, endIndex: number} | null) => void;
  isDraggingCurve: boolean;
  setIsDraggingCurve: (isDragging: boolean) => void;
  isMovingShape: boolean;
  setIsMovingShape: (isMoving: boolean) => void;
  moveStartPos: CustomShapePoint;
  setMoveStartPos: (pos: CustomShapePoint) => void;
  curvePoint: CustomShapePoint;
  setCurvePoint: (point: CustomShapePoint) => void;
  isNearFirstPoint: (x: number, y: number) => boolean;
  findHoveredLine: (x: number, y: number) => {startIndex: number, endIndex: number} | null;
  isPointInShape: (x: number, y: number, shape: any) => boolean;
  completeShape: () => void;
  onUpdateShapes: (shapes: any[]) => void;
}

const CustomShapeCanvas: React.FC<CustomShapeCanvasProps> = ({
  canvasRef,
  shapes,
  points,
  onAddPoint,
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
  onUpdateShapes
}) => {
  // Handle mouse move - update hover states and handle dragging
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // If moving the entire shape
    if (isMovingShape && selectedShape !== null) {
      const deltaX = x - moveStartPos.x;
      const deltaY = y - moveStartPos.y;
      
      // Update shape points
      const updatedShapes = [...shapes];
      const shape = updatedShapes[selectedShape];
      
      // Move all points
      shape.points = shape.points.map((point: {x: number, y: number}) => ({
        x: point.x + deltaX,
        y: point.y + deltaY
      }));
      
      // Move all curve control points
      if (shape.curves) {
        shape.curves = shape.curves.map((curve: any) => ({
          ...curve,
          controlPoint: {
            x: curve.controlPoint.x + deltaX,
            y: curve.controlPoint.y + deltaY
          }
        }));
      }
      
      onUpdateShapes(updatedShapes);
      setMoveStartPos({ x, y });
      return;
    }
    
    // If dragging a curve, update the control point
    if (isDraggingCurve && selectedShape !== null && selectedLine !== null) {
      setCurvePoint({ x, y });
      
      // Update the curve in the selected shape
      const updatedShapes = [...shapes];
      const shape = updatedShapes[selectedShape];
      
      // Find if there's already a curve for this line
      const existingCurveIndex = shape.curves ? 
        shape.curves.findIndex((c: any) => 
          (c.startIndex === selectedLine.startIndex && c.endIndex === selectedLine.endIndex) ||
          (c.startIndex === selectedLine.endIndex && c.endIndex === selectedLine.startIndex)
        ) : -1;
      
      if (existingCurveIndex >= 0) {
        // Update existing curve
        shape.curves[existingCurveIndex].controlPoint = { x, y };
      } else {
        // Create new curve
        if (!shape.curves) shape.curves = [];
        shape.curves.push({
          startIndex: selectedLine.startIndex,
          endIndex: selectedLine.endIndex,
          controlPoint: { x, y }
        });
      }
      
      onUpdateShapes(updatedShapes);
      return;
    }
    
    // Check if hovering near first point (when creating a shape)
    if (points.length > 0) {
      setIsHoveringFirstPoint(isNearFirstPoint(x, y));
    }
    
    // Check if hovering near a line segment (when a shape is selected)
    const hoveredLine = findHoveredLine(x, y);
    setIsHoveringLine(hoveredLine !== null);
    
    // Update cursor style
    if (canvas) {
      if (isHoveringFirstPoint) {
        canvas.style.cursor = 'pointer';
      } else if (isHoveringLine) {
        canvas.style.cursor = 'grab';
      } else if (selectedShape !== null && isPointInShape(x, y, shapes[selectedShape])) {
        canvas.style.cursor = 'move';
      } else {
        canvas.style.cursor = 'crosshair';
      }
    }
  };

  // Handle context menu (right-click)
  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent default context menu
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Find if right-clicking on an existing shape
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      if (isPointInShape(x, y, shape)) {
        setSelectedShape(i);
        setIsMovingShape(true);
        setMoveStartPos({ x, y });
        break;
      }
    }
  };

  // Handle mouse down - start dragging curve or select shape
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Only handle left button clicks (button 0)
    if (e.button !== 0) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // If a shape is selected, check if clicking on a line segment
    if (selectedShape !== null) {
      const hoveredLine = findHoveredLine(x, y);
      
      if (hoveredLine) {
        setSelectedLine(hoveredLine);
        setIsDraggingCurve(true);
        setCurvePoint({ x, y });
        return;
      }
    }
    
    // Find if clicking on an existing shape
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      if (isPointInShape(x, y, shape)) {
        setSelectedShape(i);
        return;
      }
    }
    
    // Deselect if clicking outside
    setSelectedShape(null);
  };

  // Handle mouse up - stop dragging
  const handleMouseUp = () => {
    setIsDraggingCurve(false);
    setIsMovingShape(false);
    setSelectedLine(null);
  };

  // Handle click - add point or complete shape
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // If dragging, ignore click
    if (isDraggingCurve || isMovingShape) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // If a shape is selected, ignore clicks for adding points
    if (selectedShape !== null) return;
    
    // If we're near the first point and have at least 3 points, close the shape
    if (points.length >= 3 && isNearFirstPoint(x, y)) {
      completeShape();
      return;
    }
    
    // Otherwise add a new point
    onAddPoint({ x, y });
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={handleContextMenu}
      className="bg-gray-50"
    />
  );
};

export default CustomShapeCanvas;
