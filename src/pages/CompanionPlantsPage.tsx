
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { PlantSelector } from '@/components/companion-plants/PlantSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompanionPlantsDisplay } from '@/components/companion-plants/CompanionPlantsDisplay';

const CompanionPlantsPage = () => {
  const [selectedPlants, setSelectedPlants] = React.useState<any[]>([]);

  const handleAddPlant = (plant: any) => {
    if (!selectedPlants.some(p => p.id === plant.id)) {
      setSelectedPlants(prev => [...prev, plant]);
    }
  };

  const handleRemovePlant = (plantId: string) => {
    setSelectedPlants(prev => prev.filter(p => p.id !== plantId));
  };

  return (
    <DashboardLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Plant Compatibility Checker</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Plants</CardTitle>
            </CardHeader>
            <CardContent>
              <PlantSelector onSelectPlant={handleAddPlant} />
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Selected Plants:</h3>
                {selectedPlants.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedPlants.map(plant => (
                      <li key={plant.id} className="flex justify-between items-center bg-muted p-2 rounded">
                        <span>{plant.name}</span>
                        <button 
                          onClick={() => handleRemovePlant(plant.id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No plants selected</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <CompanionPlantsDisplay selectedPlants={selectedPlants} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanionPlantsPage;
