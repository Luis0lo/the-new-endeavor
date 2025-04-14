
import { useState, useEffect } from 'react';
import { Plant, CompatibilityData } from '@/components/companion-plants/types';
import { fetchPlantsWithCompanionData, analyzeCompatibility } from '@/components/companion-plants/utils/compatibility-utils';
import { toast } from '@/hooks/use-toast';

export function useCompatibilityAnalysis(selectedPlants: Plant[]) {
  const [compatibilityData, setCompatibilityData] = useState<CompatibilityData>({
    compatible: {plants: [], reasons: []},
    incompatible: {plants: [], reasons: []},
    neutral: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const analyzeCompanionPlants = async () => {
      // Only analyze compatibility when we have 2 or more plants
      if (selectedPlants.length < 2) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        // Fetch complete plant data if needed
        const plantsWithCompanionData = await fetchPlantsWithCompanionData(selectedPlants);
        
        // Analyze compatibility
        const compatibility = analyzeCompatibility(plantsWithCompanionData);
        setCompatibilityData(compatibility);
      } catch (error: any) {
        console.error("Error analyzing compatibility:", error);
        toast({
          title: "Error",
          description: "There was a problem analyzing plant compatibility",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    analyzeCompanionPlants();
  }, [selectedPlants]);

  return { compatibilityData, loading };
}
