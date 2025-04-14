
import { useState, useEffect } from 'react';
import { fetchPlantsWithCompanionData, analyzeCompatibility } from '@/components/companion-plants/utils/compatibility-utils';
import { Plant, CompatibilityData } from '@/components/companion-plants/types';

export function useCompatibilityAnalysis(selectedPlants: Plant[]) {
  const [compatibilityData, setCompatibilityData] = useState<CompatibilityData>({
    compatible: { plants: [], reasons: [] },
    incompatible: { plants: [], reasons: [] },
    neutral: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reset if less than 2 plants
    if (selectedPlants.length < 2) {
      setCompatibilityData({
        compatible: { plants: [], reasons: [] },
        incompatible: { plants: [], reasons: [] },
        neutral: []
      });
      setLoading(false);
      return;
    }

    const analyzeSelectedPlants = async () => {
      try {
        setLoading(true);
        
        // Fetch full plant data with companion information
        const plantsWithCompanionData = await fetchPlantsWithCompanionData(selectedPlants);
        
        // Analyze compatibility between plants
        const result = analyzeCompatibility(plantsWithCompanionData);
        
        setCompatibilityData(result);
      } catch (error: any) {
        console.error("Error analyzing plant compatibility:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    
    analyzeSelectedPlants();
  }, [selectedPlants]);

  return { compatibilityData, loading, error };
}
