
import { PlantCompanionData } from './types';
import { vegetables } from './vegetables';
import { herbs } from './herbs';
import { flowers } from './flowers';
import { fruits } from './fruits';
import { additionalPlants } from './additionalPlants';
import { varieties, flowerVarieties, regionalPrefixes } from './varieties';
import { possibleBenefits } from './benefits';
import { createBasePlant, generateBenefits, generateGrowingZones, generatePlantingSeasons } from './utils/plant-helpers';
import { createVegetableVarieties, createHerbVarieties, createFlowerVarieties, createFruitVarieties } from './utils/variety-generators';
import { createAdditionalPlants } from './utils/additional-plant-helpers';
import { setupBaseRelationships, setupVariantRelationships } from './utils/relationship-helpers';

// Main function to generate plant data
export const generatePlantData = (): PlantCompanionData[] => {
  // Combine base plant categories
  const allBasePlants = [...vegetables, ...herbs, ...flowers, ...fruits];
  const plants: PlantCompanionData[] = [];
  
  // Process base plants to create initial dataset
  allBasePlants.forEach((plant, index) => {
    plants.push(createBasePlant(plant, index));
  });
  
  const originalPlantCount = plants.length;
  let currentId = originalPlantCount + 1;
  
  // Create varieties of vegetables
  const vegetableVarieties = createVegetableVarieties(vegetables, currentId, 25);
  plants.push(...vegetableVarieties.plants);
  currentId = vegetableVarieties.nextId;
  
  // Create regional herb varieties
  const herbVarieties = createHerbVarieties(herbs, currentId, 25);
  plants.push(...herbVarieties.plants);
  currentId = herbVarieties.nextId;
  
  // Add additional plants
  const additionalPlantsData = createAdditionalPlants(additionalPlants, currentId);
  plants.push(...additionalPlantsData.plants);
  currentId = additionalPlantsData.nextId;
  
  // Add flower varieties
  const flowerVarietiesData = createFlowerVarieties(flowers, currentId, 25);
  plants.push(...flowerVarietiesData.plants);
  currentId = flowerVarietiesData.nextId;
  
  // Add fruit varieties
  const fruitVarieties = createFruitVarieties(fruits, currentId, 15);
  plants.push(...fruitVarieties.plants);
  
  // Set up relationships
  const plantsWithBaseRelationships = setupBaseRelationships(plants, allBasePlants, originalPlantCount);
  const finalPlants = setupVariantRelationships(plantsWithBaseRelationships, originalPlantCount);
  
  return finalPlants;
};
