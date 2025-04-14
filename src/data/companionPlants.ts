
export interface PlantCompatibility {
  plant: string;
  companions: string[];
  antagonists: string[];
  notes?: string;
}

export const companionPlantsData: PlantCompatibility[] = [
  {
    plant: "Tomatoes",
    companions: ["Basil", "Marigolds", "Nasturtiums", "Onions", "Garlic", "Carrots", "Parsley", "Asparagus", "Chives"],
    antagonists: ["Potatoes", "Corn", "Kohlrabi", "Fennel", "Cabbage"],
    notes: "Basil improves flavor and repels insects. Marigolds deter nematodes."
  },
  {
    plant: "Cucumbers",
    companions: ["Beans", "Corn", "Peas", "Radishes", "Sunflowers", "Marigolds"],
    antagonists: ["Potatoes", "Aromatic herbs"],
    notes: "Sunflowers provide support and partial shade."
  },
  {
    plant: "Carrots",
    companions: ["Tomatoes", "Beans", "Rosemary", "Sage", "Chives", "Leeks", "Onions"],
    antagonists: ["Dill", "Parsnips"],
    notes: "Aromatic herbs help repel carrot flies."
  },
  {
    plant: "Beans",
    companions: ["Carrots", "Cauliflower", "Celery", "Corn", "Cucumbers", "Potatoes", "Summer Savory"],
    antagonists: ["Onions", "Garlic", "Chives", "Leeks", "Fennel"],
    notes: "Fixes nitrogen in soil, benefiting most vegetables."
  },
  {
    plant: "Lettuce",
    companions: ["Carrots", "Radishes", "Strawberries", "Cucumbers", "Onions"],
    antagonists: ["None known"],
    notes: "Good for intercropping among taller plants."
  },
  {
    plant: "Spinach",
    companions: ["Strawberries", "Radishes", "Cauliflower", "Eggplant", "Celery"],
    antagonists: ["None known"],
    notes: "Fast-growing crop good for filling in empty spaces."
  },
  {
    plant: "Peppers",
    companions: ["Tomatoes", "Basil", "Carrots", "Onions", "Marjoram"],
    antagonists: ["Fennel", "Kohlrabi", "Beans"],
    notes: "Basil is especially beneficial for peppers."
  },
  {
    plant: "Potatoes",
    companions: ["Beans", "Cabbage", "Corn", "Eggplant", "Marigolds", "Peas"],
    antagonists: ["Tomatoes", "Cucumbers", "Sunflowers", "Pumpkins", "Raspberries"],
    notes: "Horseradish planted at corners of potato patch repels potato beetles."
  },
  {
    plant: "Cabbage",
    companions: ["Beets", "Celery", "Herbs", "Onions", "Potatoes", "Marigolds"],
    antagonists: ["Strawberries", "Tomatoes", "Pole Beans"],
    notes: "Aromatic herbs deter cabbage moths."
  },
  {
    plant: "Corn",
    companions: ["Beans", "Cucumbers", "Melons", "Peas", "Potatoes", "Squash"],
    antagonists: ["Tomatoes"],
    notes: "Classic Three Sisters planting: corn, beans, and squash."
  },
  {
    plant: "Onions",
    companions: ["Beets", "Carrots", "Lettuce", "Tomatoes", "Strawberries", "Peppers"],
    antagonists: ["Beans", "Peas"],
    notes: "Helps deter many garden pests."
  },
  {
    plant: "Garlic",
    companions: ["Roses", "Tomatoes", "Eggplant", "Peppers", "Potatoes"],
    antagonists: ["Beans", "Peas"],
    notes: "Beneficial throughout the garden for pest control."
  },
  {
    plant: "Squash",
    companions: ["Corn", "Marigolds", "Nasturtiums", "Borage"],
    antagonists: ["Potatoes"],
    notes: "Nasturtiums repel squash bugs and cucumber beetles."
  },
  {
    plant: "Radishes",
    companions: ["Cucumbers", "Lettuce", "Peas", "Nasturtiums", "Spinach"],
    antagonists: ["Hyssop"],
    notes: "Can be intercropped with slow-growing plants to maximize space."
  },
  {
    plant: "Strawberries",
    companions: ["Beans", "Borage", "Lettuce", "Onions", "Spinach", "Thyme"],
    antagonists: ["Cabbage", "Broccoli"],
    notes: "Borage strengthens resistance to disease and attracts pollinators."
  },
  {
    plant: "Eggplant",
    companions: ["Beans", "Marigolds", "Peppers", "Spinach", "Thyme"],
    antagonists: ["Fennel"],
    notes: "Marigolds deter nematodes."
  },
  {
    plant: "Peas",
    companions: ["Carrots", "Corn", "Cucumbers", "Radishes", "Turnips"],
    antagonists: ["Onions", "Garlic", "Potatoes", "Gladiolus"],
    notes: "Fixes nitrogen in soil to benefit other crops."
  },
  {
    plant: "Basil",
    companions: ["Tomatoes", "Peppers", "Oregano", "Asparagus"],
    antagonists: ["Rue"],
    notes: "Improves growth and flavor; repels flies and mosquitoes."
  },
  {
    plant: "Oregano",
    companions: ["Most vegetables", "Especially cabbage family"],
    antagonists: ["None known"],
    notes: "General garden beneficial for repelling many pests."
  },
  {
    plant: "Rosemary",
    companions: ["Beans", "Cabbage", "Carrots", "Sage"],
    antagonists: ["None known"],
    notes: "Deters cabbage moths and carrot flies."
  }
];

// Find companion plants for a given plant
export function findCompanionPlants(plantName: string): PlantCompatibility | undefined {
  return companionPlantsData.find(plant => 
    plant.plant.toLowerCase() === plantName.toLowerCase()
  );
}

// Check compatibility between multiple plants
export function checkPlantCompatibility(plants: string[]): {
  compatible: boolean;
  reason?: string;
  incompatiblePairs?: { plant1: string; plant2: string; }[];
} {
  if (plants.length < 2) {
    return { compatible: true };
  }

  const incompatiblePairs: { plant1: string; plant2: string; }[] = [];

  for (let i = 0; i < plants.length; i++) {
    const plant1Data = findCompanionPlants(plants[i]);
    
    if (!plant1Data) continue;
    
    for (let j = i + 1; j < plants.length; j++) {
      const plant2 = plants[j];
      
      // Check if plant2 is in plant1's antagonists list
      if (plant1Data.antagonists.some(ant => ant.toLowerCase() === plant2.toLowerCase())) {
        incompatiblePairs.push({ plant1: plants[i], plant2 });
      }
      
      // Check the reverse direction too
      const plant2Data = findCompanionPlants(plant2);
      if (plant2Data && plant2Data.antagonists.some(ant => ant.toLowerCase() === plants[i].toLowerCase())) {
        incompatiblePairs.push({ plant1: plants[i], plant2 });
      }
    }
  }

  return {
    compatible: incompatiblePairs.length === 0,
    incompatiblePairs: incompatiblePairs.length > 0 ? incompatiblePairs : undefined
  };
}
