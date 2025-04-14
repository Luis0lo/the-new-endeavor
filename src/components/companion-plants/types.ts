
export interface Plant {
  id: string;
  name: string;
  scientific_name?: string;
  description?: string;
  image_url?: string;
  companions?: string[];
  antagonists?: string[];
  benefits?: string[];
  growing_zones?: string[];
  planting_season?: string[];
}

export interface CompatibilityData {
  compatible: {plants: string[], reasons: string[]};
  incompatible: {plants: string[], reasons: string[]};
  neutral: string[];
}
