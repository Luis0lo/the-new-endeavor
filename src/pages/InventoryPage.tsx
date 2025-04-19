import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, Home } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const InventoryPage: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto px-4 py-8">
      {isMobile && (
        <div className="flex justify-between items-center mb-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <Home size={24} />
            Garden App
          </Link>
          <Button variant="ghost" size="icon" className="ml-auto">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Button>+ Add Shelf</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Shelf 1</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-accent/30 rounded">
              <span>Tomato Seeds</span>
              <span className="text-sm text-muted-foreground">12 packets</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-accent/30 rounded">
              <span>Basil Seeds</span>
              <span className="text-sm text-muted-foreground">5 packets</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-accent/30 rounded">
              <span>Fertilizer</span>
              <span className="text-sm text-muted-foreground">2 bags</span>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" size="sm">Edit</Button>
            <Button variant="ghost" size="sm">Delete</Button>
          </div>
        </div>

        <div className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Shelf 2</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-accent/30 rounded">
              <span>Gardening Gloves</span>
              <span className="text-sm text-muted-foreground">3 pairs</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-accent/30 rounded">
              <span>Pruning Shears</span>
              <span className="text-sm text-muted-foreground">2 units</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-accent/30 rounded">
              <span>Watering Can</span>
              <span className="text-sm text-muted-foreground">1 unit</span>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" size="sm">Edit</Button>
            <Button variant="ghost" size="sm">Delete</Button>
          </div>
        </div>

        <div className="border rounded-lg p-4 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Shelf 3</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-accent/30 rounded">
              <span>Potting Soil</span>
              <span className="text-sm text-muted-foreground">4 bags</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-accent/30 rounded">
              <span>Plant Pots</span>
              <span className="text-sm text-muted-foreground">8 units</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-accent/30 rounded">
              <span>Plant Labels</span>
              <span className="text-sm text-muted-foreground">50 pieces</span>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" size="sm">Edit</Button>
            <Button variant="ghost" size="sm">Delete</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
