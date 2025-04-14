
import { generateBenefits, generateGrowingZones, generatePlantingSeasons } from './plant-helpers';

// Create additional plants
export const createAdditionalPlants = (plants: any[], currentId: number) => {
  const additionalPlantsData = [];
  
  for (const plant of plants) {
    const id = (currentId++).toString();
    
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
  
  return { plants: additionalPlantsData, nextId: currentId };
};
