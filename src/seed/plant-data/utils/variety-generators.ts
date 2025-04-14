
import { varieties, flowerVarieties, regionalPrefixes } from '../varieties';
import { generateBenefits, generateGrowingZones, generatePlantingSeasons } from './plant-helpers';

// Create vegetable varieties
export const createVegetableVarieties = (baseVegetables: any[], currentId: number, count: number) => {
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
export const createHerbVarieties = (baseHerbs: any[], currentId: number, count: number) => {
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
export const createFlowerVarieties = (baseFlowers: any[], currentId: number, count: number) => {
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
export const createFruitVarieties = (baseFruits: any[], currentId: number, count: number) => {
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
