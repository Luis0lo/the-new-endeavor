
import React from 'react';

interface CustomShapeInstructionsProps {
  shapesCount: number;
  selectedShapeIndex: number | null;
  pointsCount: number;
}

const CustomShapeInstructions: React.FC<CustomShapeInstructionsProps> = ({
  shapesCount,
  selectedShapeIndex,
  pointsCount
}) => {
  return (
    <>
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
        <p>Shapes drawn: {shapesCount}</p>
        {selectedShapeIndex !== null && <p>Shape {selectedShapeIndex + 1} selected</p>}
        {pointsCount > 0 && <p>Current shape: {pointsCount} points placed</p>}
      </div>
    </>
  );
};

export default CustomShapeInstructions;
