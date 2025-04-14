
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCompatibilityAnalysis } from '@/hooks/useCompatibilityAnalysis';
import { EmptyPlantSelection } from './EmptyPlantSelection';
import { CompatibilityLoading } from './CompatibilityLoading';
import { SelectedPlantsList } from './SelectedPlantsList';
import { CompatibilitySummary } from './CompatibilitySummary';
import { CompatiblePlants } from './CompatiblePlants';
import { IncompatiblePlants } from './IncompatiblePlants';
import { NeutralPlants } from './NeutralPlants';
import { Plant } from './types';

interface CompanionPlantsDisplayProps {
  selectedPlants: Plant[];
}

export function CompanionPlantsDisplay({ selectedPlants }: CompanionPlantsDisplayProps) {
  const { compatibilityData, loading } = useCompatibilityAnalysis(selectedPlants);

  const renderContent = () => {
    if (selectedPlants.length < 2) {
      return <EmptyPlantSelection />;
    }
    
    if (loading) {
      return <CompatibilityLoading />;
    }
    
    return (
      <div className="space-y-4">
        <SelectedPlantsList plants={selectedPlants} />
        
        <CompatibilitySummary compatibilityData={compatibilityData} />
        
        <div className="grid md:grid-cols-2 gap-4">
          <CompatiblePlants 
            plants={compatibilityData.compatible.plants} 
            reasons={compatibilityData.compatible.reasons} 
          />
          
          <IncompatiblePlants 
            plants={compatibilityData.incompatible.plants} 
            reasons={compatibilityData.incompatible.reasons} 
          />
          
          {(!compatibilityData.compatible.plants.length || !compatibilityData.incompatible.plants.length) && (
            <NeutralPlants 
              plants={compatibilityData.neutral} 
              showTips={compatibilityData.neutral.length === 0}
            />
          )}
        </div>
        
        <div className="text-xs text-muted-foreground mt-4">
          <p>Note: Plant compatibility is based on companion planting principles. Results may vary based on your specific growing conditions.</p>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compatibility Results</CardTitle>
        <CardDescription>
          View compatibility between your selected plants
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
