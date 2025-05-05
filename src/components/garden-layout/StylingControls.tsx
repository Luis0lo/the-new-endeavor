
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BackgroundPattern } from './utils/canvasUtils';

interface StylingControlsProps {
  color: string;
  setColor: (color: string) => void;
  opacity: number;
  setOpacity: (opacity: number) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  backgroundPattern: BackgroundPattern;
  setBackgroundPattern: (pattern: BackgroundPattern) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  selectedShape: string;
}

const StylingControls: React.FC<StylingControlsProps> = ({
  color,
  setColor,
  opacity,
  setOpacity,
  strokeWidth,
  setStrokeWidth,
  backgroundPattern,
  setBackgroundPattern,
  fontSize,
  setFontSize,
  selectedShape
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="color-input">Color</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="color-input"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-[100px] h-10"
            />
            <div 
              className="w-10 h-10 rounded-md border" 
              style={{ backgroundColor: color }}
            ></div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="opacity">Opacity: {opacity}%</Label>
          </div>
          <Slider
            id="opacity"
            min={10}
            max={100}
            step={5}
            value={[opacity]}
            onValueChange={(value) => setOpacity(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="stroke-width">Border width: {strokeWidth}px</Label>
          </div>
          <Slider
            id="stroke-width"
            min={0}
            max={10}
            step={1}
            value={[strokeWidth]}
            onValueChange={(value) => setStrokeWidth(value[0])}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="background-select">Background</Label>
          <Select 
            value={backgroundPattern} 
            onValueChange={(value: BackgroundPattern) => setBackgroundPattern(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select background" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Default</SelectItem>
              <SelectItem value="soil">Soil</SelectItem>
              <SelectItem value="grass">Grass</SelectItem>
              <SelectItem value="concrete">Concrete</SelectItem>
              <SelectItem value="wood">Wood</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {selectedShape === 'text' && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
            </div>
            <Slider
              id="font-size"
              min={10}
              max={72}
              step={2}
              value={[fontSize]}
              onValueChange={(value) => setFontSize(value[0])}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StylingControls;
