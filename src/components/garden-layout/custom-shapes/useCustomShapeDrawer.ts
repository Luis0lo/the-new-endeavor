
import { useState, useRef, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface CustomShapePoint {
  x: number;
  y: number;
}

export interface CustomShape {
  points: CustomShapePoint[];
  color: string;
  curves?: CustomShapeCurve[];
}

export interface CustomShapeCurve {
  startIndex: number;
  endIndex: number;
  controlPoint: CustomShapePoint;
}

export const useCustomShapeDrawer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [points, setPoints] = useState<CustomShapePoint[]>([]);
  const [shapes, setShapes] = useState<CustomShape[]>([]);
  const [currentColor, setCurrentColor] = useState('#4CAF50');
  const [isHoveringFirstPoint, setIsHoveringFirstPoint] = useState(false);
  const [isHoveringLine, setIsHoveringLine] = useState(false);
  const [selectedShape, setSelectedShape] = useState<number | null>(null);
  const [selectedLine, setSelectedLine] = useState<{startIndex: number, endIndex: number} | null>(null);
  const [isDraggingCurve, setIsDraggingCurve] = useState(false);
  const [isMovingShape, setIsMovingShape] = useState(false);
  const [moveStartPos, setMoveStartPos] = useState({ x: 0, y: 0 });
  const [curvePoint, setCurvePoint] = useState({ x: 0, y: 0 });

  // Draw all shapes on the canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all saved shapes
    shapes.forEach((shape, shapeIndex) => {
      drawClosedShape(ctx, shape, shapeIndex === selectedShape);
    });
    
    // Draw current shape being created
    if (points.length > 0) {
      // Draw lines between all points
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      
      // Always connect back to the first point to show the closed shape
      if (points.length > 1) {
        ctx.lineTo(points[0].x, points[0].y);
      }
      
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw points
      points.forEach((point, index) => {
        ctx.beginPath();
        // Make the first point larger when hovering to show it can be clicked to close
        const radius = index === 0 && isHoveringFirstPoint ? 8 : 4;
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = index === 0 ? '#ffcc00' : currentColor;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    }
  }, [points, shapes, currentColor, isHoveringFirstPoint, selectedShape, selectedLine]);

  // Check if a point is near the first point (to close the shape)
  const isNearFirstPoint = (x: number, y: number) => {
    if (points.length < 3) return false;
    
    const firstPoint = points[0];
    const distance = Math.sqrt(
      Math.pow(x - firstPoint.x, 2) + Math.pow(y - firstPoint.y, 2)
    );
    
    return distance < 20; // Within 20px
  };

  // Check if a point is near a line segment
  const isNearLine = (x: number, y: number, p1: CustomShapePoint, p2: CustomShapePoint) => {
    // Calculate distance from point to line segment
    const A = x - p1.x;
    const B = y - p1.y;
    const C = p2.x - p1.x;
    const D = p2.y - p1.y;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) param = dot / lenSq;
    
    let xx, yy;
    
    if (param < 0) {
      xx = p1.x;
      yy = p1.y;
    } else if (param > 1) {
      xx = p2.x;
      yy = p2.y;
    } else {
      xx = p1.x + param * C;
      yy = p1.y + param * D;
    }
    
    const dx = x - xx;
    const dy = y - yy;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < 10; // Within 10px
  };

  // Find line segment that mouse is hovering over
  const findHoveredLine = (x: number, y: number) => {
    if (selectedShape === null) return null;
    
    const shapePoints = shapes[selectedShape].points;
    
    for (let i = 0; i < shapePoints.length; i++) {
      const p1 = shapePoints[i];
      const p2 = shapePoints[(i + 1) % shapePoints.length];
      
      if (isNearLine(x, y, p1, p2)) {
        return { startIndex: i, endIndex: (i + 1) % shapePoints.length };
      }
    }
    
    return null;
  };

  // Draw a closed shape with curved lines
  const drawClosedShape = (ctx: CanvasRenderingContext2D, shape: CustomShape, isSelected: boolean) => {
    const shapePoints = shape.points;
    const curvesData = shape.curves || [];
    const color = shape.color;
    
    if (shapePoints.length < 3) return;
    
    ctx.beginPath();
    ctx.moveTo(shapePoints[0].x, shapePoints[0].y);
    
    // Draw lines between points (with curves if defined)
    for (let i = 1; i <= shapePoints.length; i++) {
      const nextIndex = i % shapePoints.length;
      const prevIndex = i - 1;
      const curveData = curvesData.find((c) => 
        (c.startIndex === prevIndex && c.endIndex === nextIndex) || 
        (c.startIndex === nextIndex && c.endIndex === prevIndex)
      );
      
      if (curveData) {
        // Draw a quadratic curve
        ctx.quadraticCurveTo(
          curveData.controlPoint.x,
          curveData.controlPoint.y,
          shapePoints[nextIndex].x,
          shapePoints[nextIndex].y
        );
      } else {
        // Draw a straight line
        ctx.lineTo(shapePoints[nextIndex].x, shapePoints[nextIndex].y);
      }
    }
    
    // Fill and stroke
    ctx.fillStyle = color + '40'; // Add transparency
    ctx.fill();
    ctx.strokeStyle = isSelected ? '#00AAFF' : color;
    ctx.lineWidth = isSelected ? 3 : 2;
    ctx.stroke();
    
    // Draw points
    shapePoints.forEach((point: any, index: number) => {
      ctx.beginPath();
      const radius = isSelected ? 5 : 4;
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? '#00AAFF' : color;
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    
    // Draw control points for curves if selected
    if (isSelected) {
      curvesData.forEach((curve) => {
        ctx.beginPath();
        ctx.arc(curve.controlPoint.x, curve.controlPoint.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#FF00FF';
        ctx.fill();
        
        // Draw lines to control point
        ctx.beginPath();
        ctx.moveTo(shapePoints[curve.startIndex].x, shapePoints[curve.startIndex].y);
        ctx.lineTo(curve.controlPoint.x, curve.controlPoint.y);
        ctx.lineTo(shapePoints[curve.endIndex].x, shapePoints[curve.endIndex].y);
        ctx.strokeStyle = '#FF00FF';
        ctx.setLineDash([3, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      });
    }
  };

  // Check if a point is inside a shape
  const isPointInShape = (x: number, y: number, shape: CustomShape) => {
    const points = shape.points;
    let inside = false;
    
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const xi = points[i].x;
      const yi = points[i].y;
      const xj = points[j].x;
      const yj = points[j].y;
      
      const intersect = ((yi > y) !== (yj > y)) && 
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        
      if (intersect) inside = !inside;
    }
    
    return inside;
  };

  // Complete the current shape
  const completeShape = () => {
    if (points.length >= 3) {
      setShapes([...shapes, { 
        points: [...points], 
        color: currentColor,
        curves: []
      }]);
      setPoints([]);
      setIsHoveringFirstPoint(false);
    }
  };

  // Finish current shape and start a new one
  const finishShape = () => {
    if (points.length >= 3) {
      completeShape();
    } else {
      toast({
        title: "Not enough points",
        description: "You need at least 3 points to create a shape.",
        variant: "destructive"
      });
    }
  };

  // Clear all shapes
  const clearCanvas = () => {
    setPoints([]);
    setShapes([]);
    setIsHoveringFirstPoint(false);
    setSelectedShape(null);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Change drawing color
  const changeColor = (color: string) => {
    setCurrentColor(color);
    
    // If a shape is selected, update its color
    if (selectedShape !== null) {
      const updatedShapes = [...shapes];
      updatedShapes[selectedShape].color = color;
      setShapes(updatedShapes);
    }
  };

  // Delete selected shape
  const deleteSelectedShape = () => {
    if (selectedShape !== null) {
      const updatedShapes = shapes.filter((_, index) => index !== selectedShape);
      setShapes(updatedShapes);
      setSelectedShape(null);
    }
  };

  return {
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
  };
};
