
import { possibleBenefits } from '../benefits';
import { v4 as uuidv4 } from 'uuid';

// Helper function to generate growing zones
export const generateGrowingZones = () => {
  return [`Zone ${Math.floor(Math.random() * 10) + 1}`, `Zone ${Math.floor(Math.random() * 10) + 1}`];
};

// Helper function to generate planting seasons
export const generatePlantingSeasons = () => {
  return ["Spring", "Summer", "Fall"].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1);
};

// Helper function to generate random benefits
export const generateBenefits = () => {
  return possibleBenefits.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 4) + 1);
};

// Helper function to create a base plant
export const createBasePlant = (plant: any, index: number) => {
  const id = uuidv4();
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
