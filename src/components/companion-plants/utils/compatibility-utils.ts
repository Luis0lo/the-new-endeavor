
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Plant, CompatibilityData } from '../types';

export const fetchPlantsWithCompanionData = async (selectedPlants: Plant[]): Promise<Plant[]> => {
  try {
    // Check if any plant is missing companion data
    const needToFetch = selectedPlants.some(plant => 
      !plant.companions || !plant.antagonists);
    
    if (needToFetch) {
      // Fetch full plant data with companion information
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .in('id', selectedPlants.map(p => p.id));
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Create a map for easy lookup
        const plantMap = new Map();
        data.forEach(p => plantMap.set(p.id, p));
        
        // Update our plants with the companion data
        return selectedPlants.map(p => {
          const fullData = plantMap.get(p.id);
          return fullData ? { ...p, ...fullData } : p;
        });
      }
    }
    
    return selectedPlants;
  } catch (error: any) {
    console.error("Error fetching plant companion data:", error);
    toast({
      title: "Error",
      description: "There was a problem fetching plant data",
      variant: "destructive"
    });
    return selectedPlants;
  }
};

export const analyzeCompatibility = (plants: Plant[]): CompatibilityData => {
  // Initialize compatibility data structure
  const compatible = { plants: [] as string[], reasons: [] as string[] };
  const incompatible = { plants: [] as string[], reasons: [] as string[] };
  const neutral = [] as string[];
  
  // Analyze each pair of plants
  for (let i = 0; i < plants.length; i++) {
    for (let j = i + 1; j < plants.length; j++) {
      const plant1 = plants[i];
      const plant2 = plants[j];
      
      const plant1Name = plant1.name;
      const plant2Name = plant2.name;
      const pairName = `${plant1Name} & ${plant2Name}`;
      
      const isCompanion1 = plant1.companions && plant1.companions.includes(plant2.id);
      const isCompanion2 = plant2.companions && plant2.companions.includes(plant1.id);
      const isAntagonist1 = plant1.antagonists && plant1.antagonists.includes(plant2.id);
      const isAntagonist2 = plant2.antagonists && plant2.antagonists.includes(plant1.id);
      
      if (isCompanion1 || isCompanion2) {
        compatible.plants.push(pairName);
        
        // Add reasons if available
        const plant1Benefits = plant1.benefits || [];
        const plant2Benefits = plant2.benefits || [];
        const allBenefits = [...new Set([...plant1Benefits, ...plant2Benefits])];
        
        if (allBenefits.length > 0) {
          compatible.reasons.push(...allBenefits);
        } else {
          compatible.reasons.push("Enhance growth and health");
        }
      } else if (isAntagonist1 || isAntagonist2) {
        incompatible.plants.push(pairName);
        incompatible.reasons.push("May inhibit growth");
        incompatible.reasons.push("Compete for resources");
        incompatible.reasons.push("Potential pest attraction");
      } else {
        neutral.push(pairName);
      }
    }
  }
  
  // Deduplicate reasons
  compatible.reasons = [...new Set(compatible.reasons)];
  incompatible.reasons = [...new Set(incompatible.reasons)];
  
  return {
    compatible,
    incompatible,
    neutral
  };
};
