
import { fabric } from 'fabric';

export type ShapeType = 'rect' | 'circle' | 'line' | 'text';
export type GardenUnit = 'cm' | 'in' | 'ft' | 'm';
export type BackgroundPattern = 'none' | 'soil' | 'grass' | 'concrete' | 'wood';

export interface SavedShape {
  id: string;
  name: string;
  data: string; // JSON string of the shape
  createdAt: number;
  preview?: string; // Optional base64 thumbnail
}

// Draw grid on canvas
export const drawGrid = (canvas: fabric.Canvas, size: number, unit: GardenUnit) => {
  // Clear existing grid lines
  canvas.getObjects().forEach(obj => {
    if (obj.data?.isGrid) {
      canvas.remove(obj);
    }
  });

  // Draw new grid lines
  const width = canvas.width || 800;
  const height = canvas.height || 600;
  const gridColor = '#cccccc';

  // Draw vertical lines
  for (let i = 0; i <= width; i += size) {
    const line = new fabric.Line([i, 0, i, height], {
      stroke: gridColor,
      selectable: false,
      evented: false,
      strokeWidth: 0.5
    });
    line.data = { isGrid: true };
    canvas.add(line);
    canvas.sendToBack(line);
  }

  // Draw horizontal lines
  for (let i = 0; i <= height; i += size) {
    const line = new fabric.Line([0, i, width, i], {
      stroke: gridColor,
      selectable: false,
      evented: false,
      strokeWidth: 0.5
    });
    line.data = { isGrid: true };
    canvas.add(line);
    canvas.sendToBack(line);
  }

  // Add scale indicators
  const scaleText = new fabric.Text(`Grid: ${size} ${unit}`, {
    left: 10,
    top: height - 20,
    fontSize: 14,
    fontFamily: 'Arial',
    fill: '#333333',
    selectable: false,
    evented: false
  });
  scaleText.data = { isGrid: true };
  canvas.add(scaleText);
  
  canvas.renderAll();
};

// Apply background pattern to canvas
export const applyBackgroundPattern = (canvas: fabric.Canvas, pattern: BackgroundPattern) => {
  if (pattern === 'none') {
    canvas.setBackgroundColor('#E6EFC8', canvas.renderAll.bind(canvas));
    return;
  }
  
  let fillPattern;
  
  switch (pattern) {
    case 'soil':
      fillPattern = '#8B4513';
      break;
    case 'grass':
      fillPattern = '#7CFC00';
      break;
    case 'concrete':
      fillPattern = '#C0C0C0';
      break;
    case 'wood':
      fillPattern = '#DEB887';
      break;
    default:
      fillPattern = '#E6EFC8';
  }
  
  canvas.setBackgroundColor(fillPattern, canvas.renderAll.bind(canvas));
};

// Update size label on shape movement or resize
export const updateShapeSizeLabel = (shape: fabric.Object, canvas: fabric.Canvas, unit: GardenUnit) => {
  const updateLabel = () => {
    let width = 0;
    let height = 0;
    
    if (shape instanceof fabric.Rect) {
      width = (shape.width || 0) * (shape.scaleX || 1);
      height = (shape.height || 0) * (shape.scaleY || 1);
    } else if (shape instanceof fabric.Circle) {
      width = (shape.radius || 0) * 2 * (shape.scaleX || 1);
      height = (shape.radius || 0) * 2 * (shape.scaleY || 1);
    } else if (shape instanceof fabric.Line) {
      const x1 = shape.x1 || 0;
      const y1 = shape.y1 || 0;
      const x2 = shape.x2 || 0;
      const y2 = shape.y2 || 0;
      
      width = Math.abs(x2 - x1) * (shape.scaleX || 1);
      height = Math.abs(y2 - y1) * (shape.scaleY || 1);
    }
    
    // Round dimensions for display
    width = Math.round(width);
    height = Math.round(height);
    
    // Find existing label or create new one
    let label = canvas?.getObjects().find(obj => 
      obj instanceof fabric.Text && obj.data?.parentId === shape.data?.id
    );
    
    if (label) {
      canvas?.remove(label);
    }
    
    let dimensionText = '';
    if (shape instanceof fabric.Rect) {
      dimensionText = `${width} × ${height} ${unit}`;
    } else if (shape instanceof fabric.Circle) {
      dimensionText = `⌀ ${width} ${unit}`;
    } else {
      dimensionText = `${width} ${unit}`;
    }
    
    const newLabel = new fabric.Text(dimensionText, {
      fontSize: 12,
      fontFamily: 'Arial',
      fill: '#000000',
      left: (shape.left || 0) + 5,
      top: (shape.top || 0) - 15,
      selectable: false,
      evented: false
    });
    
    if (!shape.data) shape.data = {};
    if (!shape.data.id) shape.data.id = Date.now().toString();
    newLabel.data = { parentId: shape.data.id, isLabel: true };
    
    canvas?.add(newLabel);
    canvas?.renderAll();
  };
  
  shape.on('moving', updateLabel);
  shape.on('scaling', updateLabel);
  shape.on('modified', updateLabel);
  
  // Initial label
  updateLabel();
};

// Create a fabric.js path from custom shape data
export const createCustomShapePath = (shapeData: any, canvas: fabric.Canvas) => {
  try {
    const points = shapeData.points;
    const curves = shapeData.curves || [];
    const color = shapeData.color;
    
    if (!points || points.length < 3) return null;
    
    // Generate SVG path data
    let pathData = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i <= points.length; i++) {
      const nextIndex = i % points.length;
      const prevIndex = i - 1;
      
      const curveData = curves.find((c: any) => 
        (c.startIndex === prevIndex && c.endIndex === nextIndex) || 
        (c.startIndex === nextIndex && c.endIndex === prevIndex)
      );
      
      if (curveData) {
        // Quadratic curve
        pathData += ` Q ${curveData.controlPoint.x},${curveData.controlPoint.y} ${points[nextIndex].x},${points[nextIndex].y}`;
      } else {
        // Straight line
        pathData += ` L ${points[nextIndex].x} ${points[nextIndex].y}`;
      }
    }
    
    pathData += ' Z'; // Close path
    
    // Create the fabric path
    const path = new fabric.Path(pathData, {
      fill: color + '40',
      stroke: color,
      strokeWidth: 2,
      opacity: 0.9,
      objectCaching: false,
      transparentCorners: false,
      cornerColor: 'rgba(102,153,255,0.8)',
    });
    
    // Add data attribute to identify this as a custom shape
    path.data = { isCustomShape: true };
    
    return path;
  } catch (error) {
    console.error("Error creating custom shape path:", error);
    return null;
  }
};
