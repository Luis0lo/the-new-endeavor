
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { useGardenLayouts } from './hooks/useGardenLayouts';
import GardenLayoutCard from './GardenLayoutCard';
import SaveGardenDialog from './SaveGardenDialog';
import DeleteGardenDialog from './DeleteGardenDialog';
import { NoLayouts, SignInPrompt } from './EmptyStateComponents';

interface GardenLayoutsProps {
  canvasJson: string;
  loadGardenLayout: (layoutJson: string) => void;
  generatePreview: () => string;
}

const GardenLayouts: React.FC<GardenLayoutsProps> = ({ 
  canvasJson, 
  loadGardenLayout,
  generatePreview
}) => {
  const {
    layouts,
    loading,
    saveDialogOpen,
    setSaveDialogOpen,
    gardenName,
    setGardenName,
    gardenDescription,
    setGardenDescription,
    deleteDialogOpen,
    setDeleteDialogOpen,
    userId,
    handleSaveGarden,
    confirmDeleteGarden,
    handleDeleteGarden,
    loadLayout
  } = useGardenLayouts({ canvasJson, loadGardenLayout, generatePreview });

  if (!userId) {
    return (
      <div className="space-y-4 p-4">
        <SignInPrompt />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Garden Layouts</h3>
        <Button
          onClick={() => setSaveDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Save size={16} />
          <span>Save Current Layout</span>
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p>Loading your garden layouts...</p>
        </div>
      ) : layouts.length === 0 ? (
        <NoLayouts onSave={() => setSaveDialogOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {layouts.map((layout) => (
            <GardenLayoutCard 
              key={layout.id}
              layout={layout}
              onLoad={loadLayout}
              onDelete={confirmDeleteGarden}
            />
          ))}
        </div>
      )}

      {/* Save Garden Dialog */}
      <SaveGardenDialog
        open={saveDialogOpen}
        setOpen={setSaveDialogOpen}
        gardenName={gardenName}
        setGardenName={setGardenName}
        gardenDescription={gardenDescription}
        setGardenDescription={setGardenDescription}
        onSave={handleSaveGarden}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteGardenDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onDelete={handleDeleteGarden}
      />
    </div>
  );
};

export default GardenLayouts;
