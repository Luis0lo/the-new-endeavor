
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { PlantSelector } from '@/components/companion-plants/PlantSelector';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompanionPlantsDisplay } from '@/components/companion-plants/CompanionPlantsDisplay';
import { Button } from '@/components/ui/button';
import { X, Flower2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { runSeedData } from '@/seed';

interface Plant {
  id: string;
  name: string;
  scientific_name?: string;
  description?: string;
  image_url?: string;
  growing_zones?: string[];
  planting_season?: string[];
}

const CompanionPlantsPage = () => {
  const [selectedPlants, setSelectedPlants] = useState<Plant[]>([]);
  const [isSeedingData, setIsSeedingData] = useState(false);
  
  // Check if we have plants data in the database
  useEffect(() => {
    const checkPlantsData = async () => {
      try {
        const { count, error } = await supabase
          .from('plants')
          .select('*', { count: 'exact', head: true });
          
        if (error) throw error;
        
        // If we have very few plants, seed the data
        if (!count || count < 20) {
          setIsSeedingData(true);
          const success = await runSeedData();
          setIsSeedingData(false);
          
          if (success) {
            toast({
              title: "Plants Database Ready",
              description: "Plant compatibility database has been prepared.",
            });
          } else {
            toast({
              title: "Database Error",
              description: "Unable to prepare the plants database. Please try again later.",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error("Error checking plants data:", error);
        setIsSeedingData(false);
      }
    };
    
    checkPlantsData();
  }, []);

  const handleAddPlant = (plant: Plant) => {
    if (!selectedPlants.some(p => p.id === plant.id)) {
      setSelectedPlants(prev => [...prev, plant]);
    } else {
      toast({
        title: "Plant already selected",
        description: `${plant.name} is already in your selection.`,
        variant: "default"
      });
    }
  };

  const handleRemovePlant = (plantId: string) => {
    setSelectedPlants(prev => prev.filter(p => p.id !== plantId));
  };

  const handleClearAll = () => {
    setSelectedPlants([]);
  };

  return (
    <DashboardLayout>
      <div className="container py-8 bg-background"> {/* Changed background to use theme variable */}
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Flower2 className="h-8 w-8 mr-2 text-primary" />
          Plant Compatibility Checker
        </h1>
        <p className="text-muted-foreground mb-6">
          Select plants to check their companion planting compatibility. Learn which plants grow well together and which should be kept apart.
        </p>
        
        {isSeedingData && (
          <div className="bg-secondary/20 p-4 rounded-md mb-6"> {/* Replaced with a more subtle background */}
            <p className="text-secondary-foreground flex items-center">
              <Flower2 className="h-4 w-4 mr-2 animate-pulse" />
              Preparing plant database... This may take a moment.
            </p>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Plants</CardTitle>
            </CardHeader>
            <CardContent>
              <PlantSelector onSelectPlant={handleAddPlant} />
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Selected Plants:</h3>
                  {selectedPlants.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleClearAll}
                    >
                      Clear All
                    </Button>
                  )}
                </div>
                
                {selectedPlants.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedPlants.map(plant => (
                      <li key={plant.id} className="flex justify-between items-center bg-muted p-2 rounded">
                        <div className="flex items-center">
                          {plant.image_url ? (
                            <div className="h-8 w-8 rounded-full overflow-hidden mr-2">
                              <img 
                                src={plant.image_url} 
                                alt={plant.name} 
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  // If image fails to load, replace with a placeholder
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40?text=🌱';
                                }}
                              />
                            </div>
                          ) : (
                            <Flower2 className="h-5 w-5 mr-2 text-primary" />
                          )}
                          
                          <div>
                            <span className="font-medium">{plant.name}</span>
                            {plant.scientific_name && (
                              <p className="text-xs text-muted-foreground italic">
                                {plant.scientific_name}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleRemovePlant(plant.id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground bg-muted/50 p-4 rounded text-center">
                    No plants selected
                  </p>
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
