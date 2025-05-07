
import React from 'react';
import { Button } from '@/components/ui/button';

interface CustomShapeToolbarProps {
  onFinishShape: () => void;
  onClearCanvas: () => void;
  onDeleteShape: () => void;
  onChangeColor: (color: string) => void;
  onSaveShapes: () => void;
  selectedShape: number | null;
  shapesCount: number;
  pointsCount: number;
}

const CustomShapeToolbar: React.FC<CustomShapeToolbarProps> = ({
  onFinishShape,
  onClearCanvas,
  onDeleteShape,
  onChangeColor,
  onSaveShapes,
  selectedShape,
  shapesCount,
  pointsCount
}) => {
  return (
    <div className="mb-4 flex flex-wrap gap-4">
      <Button 
        variant="outline"
        onClick={onClearCanvas}
      >
        Clear All
      </Button>
      
      <Button 
        onClick={onFinishShape}
        disabled={pointsCount < 3}
      >
        Complete Shape
      </Button>
      
      {selectedShape !== null && (
        <Button 
          variant="destructive"
          onClick={onDeleteShape}
        >
          Delete Shape
        </Button>
      )}
      
      <div className="flex items-center gap-2">
        <span>Color:</span>
        <button 
          onClick={() => onChangeColor('#4CAF50')} 
          className="w-6 h-6 bg-green-500 rounded-full border-2 border-gray-300"
        />
        <button 
          onClick={() => onChangeColor('#FF5722')} 
          className="w-6 h-6 bg-orange-500 rounded-full border-2 border-gray-300"
        />
        <button 
          onClick={() => onChangeColor('#2196F3')} 
          className="w-6 h-6 bg-blue-500 rounded-full border-2 border-gray-300"
        />
        <button 
          onClick={() => onChangeColor('#9C27B0')} 
          className="w-6 h-6 bg-purple-500 rounded-full border-2 border-gray-300"
        />
      </div>
      
      <Button 
        className="ml-auto" 
        onClick={onSaveShapes}
        disabled={shapesCount === 0}
      >
        Save & Use Shapes
      </Button>
    </div>
  );
};

export default CustomShapeToolbar;
