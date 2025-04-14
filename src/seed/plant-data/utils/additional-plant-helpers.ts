
import { v4 as uuidv4 } from 'uuid';
import { generateBenefits, generateGrowingZones, generatePlantingSeasons } from './plant-helpers';

// Create additional plants
export const createAdditionalPlants = (plants: any[], currentId: number) => {
  const additionalPlantsData = [];
  
  for (const plant of plants) {
    const id = uuidv4();
    
    additionalPlantsData.push({
      id,
      name: plant.name,
      scientific_name: plant.scientific,
      description: `${plant.name} is a less common but valuable garden plant with unique properties.`,
      image_url: `https://source.unsplash.com/featured/?${plant.name.toLowerCase().replace(/ /g, ',')}`,
      companions: [],
      antagonists: [],
      benefits: ["Biodiversity", "Specialized use"],
      growing_zones: generateGrowingZones(),
      planting_season: generatePlantingSeasons()
    });
  }
  
  // We still return the nextId for compatibility, but it's not used for generating IDs anymore
  return { plants: additionalPlantsData, nextId: currentId };
};
