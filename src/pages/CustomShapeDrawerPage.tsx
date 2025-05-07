import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import SaveCustomShapesDialog from '@/components/garden-layout/SaveCustomShapesDialog';

export default function CustomShapeDrawerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [points, setPoints] = useState<{x: number, y: number}[]>([]);
  const [shapes, setShapes] = useState<any[]>([]);
  const [currentColor, setCurrentColor] = useState('#4CAF50');
  const [isHoveringFirstPoint, setIsHoveringFirstPoint] = useState(false);
  const [isHoveringLine, setIsHoveringLine] = useState(false);
  const [selectedShape, setSelectedShape] = useState<number | null>(null);
  const [selectedLine, setSelectedLine] = useState<{startIndex: number, endIndex: number} | null>(null);
  const [isDraggingCurve, setIsDraggingCurve] = useState(false);
  const [isMovingShape, setIsMovingShape] = useState(false);
  const [moveStartPos, setMoveStartPos] = useState({ x: 0, y: 0 });
  const [curvePoint, setCurvePoint] = useState({ x: 0, y: 0 });
  
  // State for save dialog
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [shapesName, setShapesName] = useState('');
  const [shapesDescription, setShapesDescription] = useState('');

  // Initialize canvas context
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

  // Function to draw a closed shape with curved lines
  const drawClosedShape = (ctx: CanvasRenderingContext2D, shape: any, isSelected: boolean) => {
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
      const curveData = curvesData.find((c: any) => 
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
      curvesData.forEach((curve: any) => {
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
  const isNearLine = (x: number, y: number, p1: {x: number, y: number}, p2: {x: number, y: number}) => {
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
      
      setShapes(updatedShapes);
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
      
      setShapes(updatedShapes);
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

  // Check if a point is inside a shape
  const isPointInShape = (x: number, y: number, shape: any) => {
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
    setPoints([...points, { x, y }]);
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

  // Delete selected shape
  const deleteSelectedShape = () => {
    if (selectedShape !== null) {
      const updatedShapes = shapes.filter((_, index) => index !== selectedShape);
      setShapes(updatedShapes);
      setSelectedShape(null);
    }
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
          
          <div className="mb-4 flex flex-wrap gap-4">
            <Button 
              variant="outline"
              onClick={clearCanvas}
            >
              Clear All
            </Button>
            
            <Button 
              onClick={finishShape}
              disabled={points.length < 3}
            >
              Complete Shape
            </Button>
            
            {selectedShape !== null && (
              <Button 
                variant="destructive"
                onClick={deleteSelectedShape}
              >
                Delete Shape
              </Button>
            )}
            
            <div className="flex items-center gap-2">
              <span>Color:</span>
              <button 
                onClick={() => changeColor('#4CAF50')} 
                className="w-6 h-6 bg-green-500 rounded-full border-2 border-gray-300"
              />
              <button 
                onClick={() => changeColor('#FF5722')} 
                className="w-6 h-6 bg-orange-500 rounded-full border-2 border-gray-300"
              />
              <button 
                onClick={() => changeColor('#2196F3')} 
                className="w-6 h-6 bg-blue-500 rounded-full border-2 border-gray-300"
              />
              <button 
                onClick={() => changeColor('#9C27B0')} 
                className="w-6 h-6 bg-purple-500 rounded-full border-2 border-gray-300"
              />
            </div>
            
            <Button 
              className="ml-auto" 
              onClick={addShapeToLayout}
              disabled={shapes.length === 0}
            >
              Save & Use Shapes
            </Button>
          </div>
          
          <div className="border-2 border-border rounded overflow-hidden bg-white">
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
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p className="font-medium">Instructions:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Click to place points for your custom shape</li>
              <li>Click on the first point (highlighted in yellow when hovering) to complete your shape</li>
              <li>Click on a completed shape to select it</li>
              <li>To create curved edges, select a shape and drag any line segment</li>
              <li><strong>Right-click and drag</strong> to move an entire shape</li>
              <li>Use the color buttons to change colors</li>
              <li>Click "Save & Use Shapes" when you're done to add these shapes to your garden layout</li>
            </ul>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Shapes drawn: {shapes.length}</p>
            {selectedShape !== null && <p>Shape {selectedShape + 1} selected</p>}
            {points.length > 0 && <p>Current shape: {points.length} points placed</p>}
          </div>
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
