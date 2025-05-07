
import { useState } from 'react';
import { ShapeType, GardenUnit, BackgroundPattern } from '../utils/canvasUtils';

export const useGardenLayoutState = () => {
  // State for shape properties
  const [selectedShape, setSelectedShape] = useState<ShapeType>('rect');
  const [color, setColor] = useState('#4CAF50');
  const [unit, setUnit] = useState<GardenUnit>('cm');
  const [gridSize, setGridSize] = useState(10);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [opacity, setOpacity] = useState(100);
  const [backgroundPattern, setBackgroundPattern] = useState<BackgroundPattern>('none');
  const [textValue, setTextValue] = useState('Label');
  const [fontSize, setFontSize] = useState(16);
  const [activeTab, setActiveTab] = useState('shapes');

  return {
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
  };
};
