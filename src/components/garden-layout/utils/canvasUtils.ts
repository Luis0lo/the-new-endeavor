
import { fabric } from 'fabric';

export type ShapeType = 'rect' | 'circle' | 'line' | 'text';
export type GardenUnit = 'cm' | 'm' | 'inch' | 'ft';
export type BackgroundPattern = 'none' | 'grid' | 'dots';

// Interface for saved shapes
export interface SavedShape {
  id: string;
  name: string;
  data: string;
  createdAt: number;
  preview?: string;
}

// Draw a grid on the canvas
export const drawGrid = (canvas: fabric.Canvas, gridSize: number, unit: GardenUnit) => {
  // Remove existing grid
  const existingGrids = canvas.getObjects().filter(obj => obj.data?.isGrid);
  existingGrids.forEach(grid => canvas.remove(grid));
  
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  
  // Create grid
  for (let i = 0; i < (width || 0) / gridSize; i++) {
    const xLine = new fabric.Line(
      [i * gridSize, 0, i * gridSize, height],
      { 
        stroke: '#e0e0e0', 
        selectable: false,
        strokeWidth: i % 5 === 0 ? 1 : 0.5,
        evented: false
      }
    );
    
    // Mark this as a grid line so we can easily identify it
    if (!xLine.data) xLine.data = {};
    xLine.data.isGrid = true;
    
    canvas.add(xLine);
    xLine.sendToBack();
  }
  
  for (let i = 0; i < (height || 0) / gridSize; i++) {
    const yLine = new fabric.Line(
      [0, i * gridSize, width, i * gridSize],
      { 
        stroke: '#e0e0e0', 
        selectable: false,
        strokeWidth: i % 5 === 0 ? 1 : 0.5,
        evented: false
      }
    );
    
    // Mark this as a grid line
    if (!yLine.data) yLine.data = {};
    yLine.data.isGrid = true;
    
    canvas.add(yLine);
    yLine.sendToBack();
  }
  
  // Add unit labels at the corner
  const unitLabel = new fabric.Text(`Grid: ${gridSize} ${unit}`, {
    left: 10,
    top: 10,
    fontSize: 12,
    fill: '#666',
    selectable: false,
    evented: false
  });
  
  // Mark this as a grid element
  if (!unitLabel.data) unitLabel.data = {};
  unitLabel.data.isGrid = true;
  
  canvas.add(unitLabel);
  canvas.renderAll();
};

// Update the size label for a shape
export const updateShapeSizeLabel = (
  obj: fabric.Object, 
  canvas: fabric.Canvas, 
  unit: GardenUnit,
  name?: string
) => {
  // Remove any existing labels for this object
  if (obj.data?.id) {
    const existingLabels = canvas.getObjects().filter(
      item => item instanceof fabric.Text && item.data?.parentId === obj.data?.id
    );
    
    existingLabels.forEach(label => canvas.remove(label));
  }
  
  // Ensure the object has an ID
  if (!obj.data) obj.data = {};
  if (!obj.data.id) obj.data.id = Date.now().toString();
  
  // Calculate dimensions based on object type
  let width: number | undefined;
  let height: number | undefined;
  let displayName = name || '';
  
  // Get dimensions for different object types
  if (obj instanceof fabric.Rect) {
    width = obj.width! * obj.scaleX!;
    height = obj.height! * obj.scaleY!;
    displayName = displayName || 'Rectangle';
  } else if (obj instanceof fabric.Circle) {
    width = obj.radius! * 2 * obj.scaleX!;
    height = width;
    displayName = displayName || 'Circle';
  } else if (obj instanceof fabric.Line) {
    const dx = (obj.x2! - obj.x1!) * obj.scaleX!;
    const dy = (obj.y2! - obj.y1!) * obj.scaleY!;
    width = Math.sqrt(dx * dx + dy * dy);
    displayName = displayName || 'Line';
  }
  
  if (width !== undefined) {
    let dimensionText = '';
    
    if (height !== undefined && obj instanceof fabric.Rect) {
      dimensionText = `${Math.round(width)}×${Math.round(height)} ${unit}`;
    } else {
      dimensionText = `${Math.round(width)} ${unit}`;
    }
    
    // Create the size label that shows ONLY the dimensions (at the top)
    const sizeLabel = new fabric.Text(dimensionText, {
      left: obj.left,
      top: (obj.top || 0) - 20, // Position ABOVE the object
      fontSize: 12,
      fill: '#333',
      textAlign: 'center',
      selectable: false,
      evented: false,
      originX: 'center'
    });
    
    // Mark as a label and connect to parent object
    if (!sizeLabel.data) sizeLabel.data = {};
    sizeLabel.data.isLabel = true;
    sizeLabel.data.parentId = obj.data.id;
    
    canvas.add(sizeLabel);
    
    // Create a separate label for the name (at the bottom)
    const nameLabel = new fabric.Text(displayName, {
      left: obj.left,
      top: (obj.top || 0) + (obj.getScaledHeight ? obj.getScaledHeight() : 0) + 5, // Position BELOW the object
      fontSize: 12,
      fill: '#333',
      textAlign: 'center',
      selectable: false,
      evented: false,
      originX: 'center'
    });
    
    // Mark as a label and connect to parent object
    if (!nameLabel.data) nameLabel.data = {};
    nameLabel.data.isLabel = true;
    nameLabel.data.parentId = obj.data.id;
    
    canvas.add(nameLabel);
    
    // Update label positions when object is modified or moved
    obj.on('moving', () => {
      sizeLabel.set({
        left: obj.left,
        top: (obj.top || 0) - 20 // Keep ABOVE the object
      });
      
      nameLabel.set({
        left: obj.left,
        top: (obj.top || 0) + (obj.getScaledHeight ? obj.getScaledHeight() : 0) + 5 // Keep BELOW the object
      });
    });
    
    obj.on('scaling', () => {
      // Update dimensions text when object is scaled
      if (obj instanceof fabric.Rect) {
        width = obj.width! * obj.scaleX!;
        height = obj.height! * obj.scaleY!;
        dimensionText = `${Math.round(width)}×${Math.round(height)} ${unit}`;
      } else if (obj instanceof fabric.Circle) {
        width = obj.radius! * 2 * obj.scaleX!;
        dimensionText = `${Math.round(width)} ${unit}`;
      } else if (obj instanceof fabric.Line) {
        const dx = (obj.x2! - obj.x1!) * obj.scaleX!;
        const dy = (obj.y2! - obj.y1!) * obj.scaleY!;
        width = Math.sqrt(dx * dx + dy * dy);
        dimensionText = `${Math.round(width)} ${unit}`;
      }
      
      sizeLabel.set({
        text: dimensionText,
        left: obj.left,
        top: (obj.top || 0) - 20 // Keep ABOVE the object
      });
      
      nameLabel.set({
        left: obj.left,
        top: (obj.top || 0) + (obj.getScaledHeight ? obj.getScaledHeight() : 0) + 5 // Keep BELOW the object
      });
    });
  }
  
  canvas.renderAll();
};

// Apply background pattern to the canvas
export const applyBackgroundPattern = (canvas: fabric.Canvas, pattern: BackgroundPattern) => {
  switch (pattern) {
    case 'grid':
      canvas.setBackgroundColor('#E6EFC8', canvas.renderAll.bind(canvas));
      break;
    case 'dots':
      // Create a pattern with dots
      const patternCanvas = document.createElement('canvas');
      patternCanvas.width = 20;
      patternCanvas.height = 20;
      const patternCtx = patternCanvas.getContext('2d');
      
      if (patternCtx) {
        patternCtx.fillStyle = '#E6EFC8';
        patternCtx.fillRect(0, 0, 20, 20);
        patternCtx.beginPath();
        patternCtx.fillStyle = '#C9DCA2';
        patternCtx.arc(10, 10, 1.5, 0, Math.PI * 2);
        patternCtx.fill();
      }
      
      const dotPattern = new fabric.Pattern({
        source: patternCanvas,
        repeat: 'repeat'
      });
      
      canvas.setBackgroundColor(dotPattern, canvas.renderAll.bind(canvas));
      break;
    case 'none':
    default:
      canvas.setBackgroundColor('#F8F9FD', canvas.renderAll.bind(canvas));
      break;
  }
};

// Create a path from custom shape data
export const createCustomShapePath = (
  shapeData: {
    type: string;
    pathData: string;
    width: number;
    height: number;
    stroke: string;
    fill: string;
  }, 
  canvas: fabric.Canvas
) => {
  const path = new fabric.Path(shapeData.pathData, {
    width: shapeData.width,
    height: shapeData.height,
    stroke: shapeData.stroke || '#000',
    fill: shapeData.fill || '#4CAF50',
    strokeWidth: 2,
    objectCaching: false,
    transparentCorners: false,
    cornerColor: 'black'
  });
  
  return path;
};
