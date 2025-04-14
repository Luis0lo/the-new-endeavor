
import { PlantCompanionData } from './plant-data/types';
import { generatePlantData } from './plant-data/generator';

// Export our plant data
export { PlantCompanionData };
export const plantData = generatePlantData();
