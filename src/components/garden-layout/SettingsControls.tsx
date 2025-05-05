
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GardenUnit } from './utils/canvasUtils';

interface SettingsControlsProps {
  unit: GardenUnit;
  setUnit: (unit: GardenUnit) => void;
  gridSize: number;
  setGridSize: (size: number) => void;
  snapToGrid: boolean;
  setSnapToGrid: (snap: boolean) => void;
  objectsCount: number;
}

const SettingsControls: React.FC<SettingsControlsProps> = ({
  unit,
  setUnit,
  gridSize,
  setGridSize,
  snapToGrid,
  setSnapToGrid,
  objectsCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="unit-select">Unit</Label>
          <Select value={unit} onValueChange={(value: GardenUnit) => setUnit(value as GardenUnit)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cm">Centimeters (cm)</SelectItem>
              <SelectItem value="in">Inches (in)</SelectItem>
              <SelectItem value="ft">Feet (ft)</SelectItem>
              <SelectItem value="m">Meters (m)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="grid-size">Grid Size: {gridSize} {unit}</Label>
          </div>
          <Slider
            id="grid-size"
            min={5}
            max={50}
            step={5}
            value={[gridSize]}
            onValueChange={(value) => setGridSize(value[0])}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="snap-to-grid"
            checked={snapToGrid}
            onCheckedChange={setSnapToGrid}
          />
          <Label htmlFor="snap-to-grid">Snap to grid</Label>
        </div>
        
        <div className="pt-4">
          <div className="text-sm text-muted-foreground">
            <p>Objects in layout: {objectsCount}</p>
            <p>Canvas size: 800 × 600 pixels</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsControls;
