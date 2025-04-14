
import { PlantCompanionData } from '../types';

// Set up companion and antagonist relationships for base plants
export const setupBaseRelationships = (plants: PlantCompanionData[], basePlants: any[], originalCount: number) => {
  // Create a map of plant names to IDs
  const plantNameToId = new Map<string, string>();
  plants.forEach(plant => {
    plantNameToId.set(plant.name, plant.id);
  });
  
  // Set up relationships for original plants
  for (let i = 0; i < originalCount; i++) {
    const plant = plants[i];
    const basePlant = basePlants[i];
    
    // Set companions
    if (basePlant.companions && basePlant.companions.length > 0) {
      basePlant.companions.forEach((companionName: string) => {
        // Try to find exact match first
        if (plantNameToId.has(companionName)) {
          plant.companions.push(plantNameToId.get(companionName)!);
        } else {
          // Look for partial matches
          for (const [name, id] of plantNameToId.entries()) {
            if (name.includes(companionName) || companionName.includes(name)) {
              plant.companions.push(id);
              break;
            }
          }
        }
      });
    }
    
    // Set antagonists
    if (basePlant.antagonists && basePlant.antagonists.length > 0) {
      basePlant.antagonists.forEach((antagonistName: string) => {
        // Try to find exact match first
        if (plantNameToId.has(antagonistName)) {
          plant.antagonists.push(plantNameToId.get(antagonistName)!);
        } else {
          // Look for partial matches
          for (const [name, id] of plantNameToId.entries()) {
            if (name.includes(antagonistName) || antagonistName.includes(name)) {
              plant.antagonists.push(id);
              break;
            }
          }
        }
      });
    }
    
    // Make sure there are no duplicates
    plant.companions = [...new Set(plant.companions)];
    plant.antagonists = [...new Set(plant.antagonists)];
  }
  
  return plants;
};

// Set up relationships for variant plants
export const setupVariantRelationships = (plants: PlantCompanionData[], originalCount: number) => {
  // Create a map of plant names to IDs
  const plantNameToId = new Map<string, string>();
  plants.forEach(plant => {
    plantNameToId.set(plant.name, plant.id);
  });
  
  // For the variants and additional plants, inherit companion relationships from base plants
  for (let i = originalCount; i < plants.length; i++) {
    const plant = plants[i];
    
    // Find if this is a variant of another plant
    const baseName = plant.name.split(' ').slice(1).join(' ');
    const baseId = plantNameToId.get(baseName);
    
    if (baseId) {
      // Find the base plant
      const basePlant = plants.find(p => p.id === baseId);
      if (basePlant) {
        // Inherit relationships
        plant.companions = [...basePlant.companions];
        plant.antagonists = [...basePlant.antagonists];
      }
    } else {
      // No direct base plant found, assign some random relationships
      const randomCompanions = plants
        .filter(p => p.id !== plant.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 5) + 1);
      
      const randomAntagonists = plants
        .filter(p => p.id !== plant.id && !randomCompanions.find(c => c.id === p.id))
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3));
      
      plant.companions = randomCompanions.map(p => p.id);
      plant.antagonists = randomAntagonists.map(p => p.id);
    }
  }
  
  return plants;
};
