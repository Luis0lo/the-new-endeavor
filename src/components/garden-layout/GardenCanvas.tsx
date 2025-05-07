
import React, { useEffect } from 'react';
import { fabric } from 'fabric';
import { BackgroundPattern, GardenUnit } from './utils/canvasUtils';

interface GardenCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  canvas: fabric.Canvas | null;
  activeTab: string;
}

const GardenCanvas: React.FC<GardenCanvasProps> = ({ 
  canvasRef, 
  canvas,
  activeTab
}) => {
  // Debug logs to track canvas initialization
  useEffect(() => {
    console.log("GardenCanvas mounted, canvas instance:", canvas ? "exists" : "null");
    
    // Initialize canvas if it doesn't exist
    if (!canvas && canvasRef.current) {
      console.log("Canvas reference exists but no fabric canvas instance");
    }
    
    return () => {
      console.log("GardenCanvas unmounted");
    };
  }, [canvas]);

  // Control object resizability based on active tab
  useEffect(() => {
    if (!canvas) return;
    
    // Only allow resizing on the Shapes & Tools tab
    const canResize = activeTab === 'shapes';
    
    canvas.getObjects().forEach(obj => {
      if (!obj.data?.isGrid && !obj.data?.isLabel) {
        obj.set({
          lockScalingX: !canResize,
          lockScalingY: !canResize,
          hasControls: canResize,
        });
      }
    });
    
    canvas.renderAll();
  }, [canvas, activeTab]);

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <canvas id="gardenCanvas" ref={canvasRef} className="w-full" />
    </div>
  );
};

export default GardenCanvas;
