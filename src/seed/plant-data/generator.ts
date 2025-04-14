
import { PlantCompanionData } from './types';
import { vegetables } from './vegetables';
import { herbs } from './herbs';
import { flowers } from './flowers';
import { fruits } from './fruits';
import { additionalPlants } from './additionalPlants';
import { varieties, flowerVarieties, regionalPrefixes } from './varieties';
import { possibleBenefits } from './benefits';

// Helper function to generate growing zones
const generateGrowingZones = () => {
  return [`Zone ${Math.floor(Math.random() * 10) + 1}`, `Zone ${Math.floor(Math.random() * 10) + 1}`];
};

// Helper function to generate planting seasons
const generatePlantingSeasons = () => {
  return ["Spring", "Summer", "Fall"].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1);
};

// Helper function to generate random benefits
const generateBenefits = () => {
  return possibleBenefits.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 4) + 1);
};

// Helper function to create a base plant
const createBasePlant = (plant: any, index: number) => {
  const id = (index + 1).toString();
  const benefits = generateBenefits();
  
  return {
    id,
    name: plant.name,
    scientific_name: plant.scientific,
    description: `${plant.name} is a popular garden plant. It ${benefits.length > 0 ? 'offers benefits like ' + benefits.join(', ').toLowerCase() : 'is commonly grown in home gardens'}.`,
    image_url: `https://source.unsplash.com/featured/?${plant.name.toLowerCase().replace(/ /g, ',')}`,
    companions: [],
    antagonists: [],
    benefits,
    growing_zones: generateGrowingZones(),
    planting_season: generatePlantingSeasons()
  };
};

// Create vegetable varieties
const createVegetableVarieties = (baseVegetables: any[], currentId: number, count: number) => {
  const plants = [];
  
  for (let i = 0; i < count; i++) {
    const baseVegetable = baseVegetables[Math.floor(Math.random() * baseVegetables.length)];
    const variety = varieties[Math.floor(Math.random() * varieties.length)];
    const id = (currentId++).toString();
    
    plants.push({
      id,
      name: `${variety} ${baseVegetable.name}`,
      scientific_name: baseVegetable.scientific,
      description: `A ${variety.toLowerCase()} variety of ${baseVegetable.name.toLowerCase()}. It has similar growing characteristics to standard ${baseVegetable.name.toLowerCase()}.`,
      image_url: `https://source.unsplash.com/featured/?${variety.toLowerCase()},${baseVegetable.name.toLowerCase()}`,
      companions: [],
      antagonists: [],
      benefits: ["Variety diversity", "Specialized traits"],
      growing_zones: generateGrowingZones(),
      planting_season: generatePlantingSeasons()
    });
  }
  
  return { plants, nextId: currentId };
};

// Create herb varieties
const createHerbVarieties = (baseHerbs: any[], currentId: number, count: number) => {
  const plants = [];
  
  for (let i = 0; i < count; i++) {
    const baseHerb = baseHerbs[Math.floor(Math.random() * baseHerbs.length)];
    const regional = regionalPrefixes[Math.floor(Math.random() * regionalPrefixes.length)];
    const id = (currentId++).toString();
    
    plants.push({
      id,
      name: `${regional} ${baseHerb.name}`,
      scientific_name: baseHerb.scientific,
      description: `A ${regional.toLowerCase()} variety of ${baseHerb.name.toLowerCase()} with unique characteristics adapted to that growing region.`,
      image_url: `https://source.unsplash.com/featured/?${baseHerb.name.toLowerCase()},herb`,
      companions: [],
      antagonists: [],
      benefits: ["Regional adaptation", "Unique flavor profile"],
      growing_zones: generateGrowingZones(),
      planting_season: generatePlantingSeasons()
    });
  }
  
  return { plants, nextId: currentId };
};

// Create flower varieties
const createFlowerVarieties = (baseFlowers: any[], currentId: number, count: number) => {
  const plants = [];
  
  for (let i = 0; i < count; i++) {
    const baseFlower = baseFlowers[Math.floor(Math.random() * baseFlowers.length)];
    const variety = flowerVarieties[Math.floor(Math.random() * flowerVarieties.length)];
    const id = (currentId++).toString();
    
    plants.push({
      id,
      name: `${variety} ${baseFlower.name}`,
      scientific_name: baseFlower.scientific,
      description: `A ${variety.toLowerCase()} variety of ${baseFlower.name.toLowerCase()} that adds beauty while providing companion planting benefits.`,
      image_url: `https://source.unsplash.com/featured/?${variety.toLowerCase()},${baseFlower.name.toLowerCase()}`,
      companions: [],
      antagonists: [],
      benefits: ["Attracts pollinators", "Ornamental value"],
      growing_zones: generateGrowingZones(),
      planting_season: ["Spring", "Summer"].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 2) + 1)
    });
  }
  
  return { plants, nextId: currentId };
};

// Create fruit varieties
const createFruitVarieties = (baseFruits: any[], currentId: number, count: number) => {
  const plants = [];
  
  for (let i = 0; i < count; i++) {
    const baseFruit = baseFruits[Math.floor(Math.random() * baseFruits.length)];
    const variety = varieties[Math.floor(Math.random() * varieties.length)];
    const id = (currentId++).toString();
    
    plants.push({
      id,
      name: `${variety} ${baseFruit.name}`,
      scientific_name: baseFruit.scientific,
      description: `A ${variety.toLowerCase()} variety of ${baseFruit.name.toLowerCase()} known for its unique flavor profile.`,
      image_url: `https://source.unsplash.com/featured/?${variety.toLowerCase()},${baseFruit.name.toLowerCase()}`,
      companions: [],
      antagonists: [],
      benefits: ["Fruit diversity", "Specialized traits"],
      growing_zones: generateGrowingZones(),
      planting_season: generatePlantingSeasons()
    });
  }
  
  return { plants, nextId: currentId };
};

// Create additional plants
const createAdditionalPlants = (plants: any[], currentId: number) => {
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

// Set up companion and antagonist relationships for base plants
const setupBaseRelationships = (plants: PlantCompanionData[], basePlants: any[], originalCount: number) => {
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
const setupVariantRelationships = (plants: PlantCompanionData[], originalCount: number) => {
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
