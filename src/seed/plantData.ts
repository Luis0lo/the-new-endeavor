
import { PlantCompanionData } from './plant-data/types';
import { generatePlantData } from './plant-data/generator';

// Use export type for the type re-export
export type { PlantCompanionData };
export const plantData = generatePlantData();
