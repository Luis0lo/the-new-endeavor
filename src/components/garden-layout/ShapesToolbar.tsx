
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShapeType } from './utils/canvasUtils';
import { 
  Undo2, 
  Redo2, 
  Square, 
  Circle, 
  Minus, 
  Type, 
  Trash,
  Copy, 
  Save, 
  Layers,
  PenTool,
  FolderOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ShapesToolbarProps {
  selectedShape: ShapeType;
  setSelectedShape: (shape: ShapeType) => void;
  textValue: string;
  setTextValue: (value: string) => void;
  addShape: () => void;
  handleUndo: () => void;
  handleRedo: () => void;
  removeSelected: () => void;
  duplicateSelected: () => void;
  bringToFront: () => void;
  handleSaveSelectedShape: () => void;
  saveLayout: () => void;
  loadLayout: () => void;
  clearCanvas: () => void;
  historyIndex: number;
  history: string[];
  hasSelection: boolean;
}

const ShapesToolbar: React.FC<ShapesToolbarProps> = ({
  selectedShape,
  setSelectedShape,
  textValue,
  setTextValue,
  addShape,
  handleUndo,
  handleRedo,
  removeSelected,
  duplicateSelected,
  bringToFront,
  handleSaveSelectedShape,
  saveLayout,
  loadLayout,
  clearCanvas,
  historyIndex,
  history,
  hasSelection
}) => {
  const navigate = useNavigate();

  const openCustomShapeDrawer = () => {
    navigate('/dashboard/custom-shape');
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor="shape-select">Shape</Label>
          <Select value={selectedShape} onValueChange={(value: ShapeType) => setSelectedShape(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select shape" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rect">
                <div className="flex items-center gap-2">
                  <Square size={16} />
                  <span>Rectangle/Bed</span>
                </div>
              </SelectItem>
              <SelectItem value="circle">
                <div className="flex items-center gap-2">
                  <Circle size={16} />
                  <span>Circle/Container</span>
                </div>
              </SelectItem>
              <SelectItem value="line">
                <div className="flex items-center gap-2">
                  <Minus size={16} />
                  <span>Line/Path</span>
                </div>
              </SelectItem>
              <SelectItem value="text">
                <div className="flex items-center gap-2">
                  <Type size={16} />
                  <span>Text/Label</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {selectedShape === 'text' && (
          <div className="space-y-2">
            <Label htmlFor="text-input">Text</Label>
            <Input
              id="text-input"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              className="w-[180px]"
              placeholder="Enter text"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <Button onClick={addShape}>Add Shape</Button>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={openCustomShapeDrawer}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <PenTool size={16} />
            <span>Custom Shape</span>
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleUndo} 
            variant="outline" 
            disabled={historyIndex <= 0}
            title="Undo"
          >
            <Undo2 size={16} />
          </Button>
          <Button 
            onClick={handleRedo} 
            variant="outline" 
            disabled={historyIndex >= history.length - 1}
            title="Redo"
          >
            <Redo2 size={16} />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={removeSelected} 
            variant="destructive"
            disabled={!hasSelection}
            title="Delete"
          >
            <Trash size={16} />
          </Button>
          <Button 
            onClick={duplicateSelected} 
            variant="outline"
            disabled={!hasSelection}
            title="Duplicate"
          >
            <Copy size={16} />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={bringToFront} 
            variant="outline"
            disabled={!hasSelection}
            title="Bring to front"
          >
            <Layers size={16} />
          </Button>
          <Button
            onClick={handleSaveSelectedShape}
            variant="outline"
            disabled={!hasSelection}
            title="Save selected shape"
          >
            <Save size={16} />
            <span className="ml-1">Save Shape</span>
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button onClick={saveLayout} variant="outline" title="Save layout">
          <Save size={16} className="mr-1" />
          <span>Save Layout</span>
        </Button>
        <Button onClick={loadLayout} variant="outline" title="Load layout">
          <FolderOpen size={16} className="mr-1" />
          <span>Load Layout</span>
        </Button>
        <Button onClick={clearCanvas} variant="outline" title="Clear canvas">
          <span>Clear All</span>
        </Button>
      </div>
    </>
  );
};

export default ShapesToolbar;
