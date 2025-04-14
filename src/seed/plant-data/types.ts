
// Define the core plant data types
export interface PlantCompanionData {
  id: string;
  name: string;
  scientific_name?: string;
  description?: string;
  image_url?: string;
  companions: string[]; // IDs of plants that grow well with this plant
  antagonists: string[]; // IDs of plants that should not be planted with this plant
  benefits?: string[]; // Benefits of companion planting with this plant
  growing_zones?: string[];
  planting_season?: string[];
}
