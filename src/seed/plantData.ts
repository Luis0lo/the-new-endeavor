
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

// This function will create a large dataset of plants with companion relationships
export const generatePlantData = (): PlantCompanionData[] => {
  // Common vegetable plants
  const vegetables = [
    { name: 'Tomato', scientific: 'Solanum lycopersicum', companions: ['Basil', 'Marigold', 'Nasturtium', 'Carrot', 'Onion'], antagonists: ['Potato', 'Fennel', 'Corn', 'Kohlrabi'] },
    { name: 'Carrot', scientific: 'Daucus carota', companions: ['Tomato', 'Onion', 'Leek', 'Rosemary', 'Sage'], antagonists: ['Dill', 'Parsnip'] },
    { name: 'Cucumber', scientific: 'Cucumis sativus', companions: ['Sunflower', 'Nasturtium', 'Corn', 'Beans', 'Peas'], antagonists: ['Potato', 'Aromatic Herbs'] },
    { name: 'Lettuce', scientific: 'Lactuca sativa', companions: ['Carrot', 'Radish', 'Strawberry', 'Cucumber'], antagonists: [] },
    { name: 'Spinach', scientific: 'Spinacia oleracea', companions: ['Strawberry', 'Fenugreek', 'Pea'], antagonists: [] },
    { name: 'Potato', scientific: 'Solanum tuberosum', companions: ['Beans', 'Corn', 'Cabbage', 'Horseradish'], antagonists: ['Tomato', 'Cucumber', 'Sunflower'] },
    { name: 'Zucchini', scientific: 'Cucurbita pepo', companions: ['Nasturtium', 'Corn', 'Beans'], antagonists: ['Potato'] },
    { name: 'Bell Pepper', scientific: 'Capsicum annuum', companions: ['Basil', 'Onion', 'Carrot', 'Marjoram'], antagonists: ['Fennel', 'Kohlrabi'] },
    { name: 'Broccoli', scientific: 'Brassica oleracea var. italica', companions: ['Onion', 'Rosemary', 'Nasturtium', 'Sage'], antagonists: ['Strawberry', 'Tomato'] },
    { name: 'Cauliflower', scientific: 'Brassica oleracea var. botrytis', companions: ['Celery', 'Spinach', 'Beans'], antagonists: ['Strawberry', 'Tomato'] },
    { name: 'Eggplant', scientific: 'Solanum melongena', companions: ['Beans', 'Marigold', 'Thyme', 'Tarragon'], antagonists: ['Fennel'] },
    { name: 'Peas', scientific: 'Pisum sativum', companions: ['Carrot', 'Turnip', 'Cucumber', 'Corn', 'Beans'], antagonists: ['Onion', 'Garlic'] },
    { name: 'Radish', scientific: 'Raphanus sativus', companions: ['Peas', 'Nasturtium', 'Lettuce', 'Cucumber'], antagonists: ['Hyssop'] },
    { name: 'Onion', scientific: 'Allium cepa', companions: ['Carrot', 'Tomato', 'Beets', 'Chamomile'], antagonists: ['Beans', 'Peas'] },
    { name: 'Garlic', scientific: 'Allium sativum', companions: ['Tomato', 'Apple Trees', 'Roses'], antagonists: ['Beans', 'Peas'] },
    { name: 'Cabbage', scientific: 'Brassica oleracea var. capitata', companions: ['Aromatic Herbs', 'Celery', 'Onion'], antagonists: ['Strawberry', 'Tomato'] },
    { name: 'Kale', scientific: 'Brassica oleracea var. sabellica', companions: ['Beets', 'Celery', 'Cucumber'], antagonists: ['Strawberry', 'Beans'] },
    { name: 'Beans', scientific: 'Phaseolus vulgaris', companions: ['Corn', 'Cucumber', 'Potato', 'Strawberry'], antagonists: ['Onion', 'Garlic', 'Fennel'] },
    { name: 'Corn', scientific: 'Zea mays', companions: ['Beans', 'Cucumber', 'Melon', 'Squash'], antagonists: ['Tomato'] },
    { name: 'Sweet Potato', scientific: 'Ipomoea batatas', companions: ['Nasturtium', 'Thyme', 'Oregano'], antagonists: ['Squash'] },
  ];

  // Herbs
  const herbs = [
    { name: 'Basil', scientific: 'Ocimum basilicum', companions: ['Tomato', 'Pepper', 'Oregano', 'Asparagus'], antagonists: ['Rue'] },
    { name: 'Cilantro', scientific: 'Coriandrum sativum', companions: ['Anise', 'Caraway', 'Potato'], antagonists: ['Fennel'] },
    { name: 'Dill', scientific: 'Anethum graveolens', companions: ['Cabbage', 'Cucumber', 'Lettuce'], antagonists: ['Carrot', 'Tomato'] },
    { name: 'Mint', scientific: 'Mentha', companions: ['Cabbage', 'Tomato', 'Peas'], antagonists: ['Parsley'] },
    { name: 'Oregano', scientific: 'Origanum vulgare', companions: ['Tomato', 'Pepper', 'Broccoli'], antagonists: [] },
    { name: 'Parsley', scientific: 'Petroselinum crispum', companions: ['Tomato', 'Asparagus', 'Corn'], antagonists: ['Mint'] },
    { name: 'Rosemary', scientific: 'Salvia rosmarinus', companions: ['Cabbage', 'Beans', 'Carrots', 'Sage'], antagonists: [] },
    { name: 'Sage', scientific: 'Salvia officinalis', companions: ['Rosemary', 'Cabbage', 'Carrots'], antagonists: ['Cucumber'] },
    { name: 'Thyme', scientific: 'Thymus vulgaris', companions: ['Cabbage', 'Tomato', 'Eggplant'], antagonists: [] },
    { name: 'Chives', scientific: 'Allium schoenoprasum', companions: ['Carrots', 'Tomato', 'Berries'], antagonists: ['Beans', 'Peas'] },
    { name: 'Lavender', scientific: 'Lavandula', companions: ['Cabbage Family', 'Fruit Trees'], antagonists: [] },
    { name: 'Lemon Balm', scientific: 'Melissa officinalis', companions: ['Most Plants', 'Tomato', 'Squash'], antagonists: [] },
    { name: 'Fennel', scientific: 'Foeniculum vulgare', companions: ['Dill'], antagonists: ['Most Garden Vegetables', 'Tomato', 'Beans'] },
    { name: 'Tarragon', scientific: 'Artemisia dracunculus', companions: ['Eggplant', 'Vegetables'], antagonists: [] },
    { name: 'Marjoram', scientific: 'Origanum majorana', companions: ['Most Vegetables'], antagonists: [] },
  ];

  // Flowers and other plants
  const flowers = [
    { name: 'Marigold', scientific: 'Tagetes', companions: ['Most Vegetables', 'Tomato', 'Roses'], antagonists: [] },
    { name: 'Nasturtium', scientific: 'Tropaeolum', companions: ['Cucumber', 'Squash', 'Tomato', 'Fruit Trees'], antagonists: [] },
    { name: 'Sunflower', scientific: 'Helianthus annuus', companions: ['Cucumber', 'Corn'], antagonists: ['Potato', 'Bean'] },
    { name: 'Zinnia', scientific: 'Zinnia elegans', companions: ['Tomato', 'Cucumber', 'Roses'], antagonists: [] },
    { name: 'Borage', scientific: 'Borago officinalis', companions: ['Tomato', 'Squash', 'Strawberry'], antagonists: [] },
    { name: 'Chamomile', scientific: 'Matricaria chamomilla', companions: ['Cabbage', 'Onions', 'Cucumbers'], antagonists: [] },
    { name: 'Calendula', scientific: 'Calendula officinalis', companions: ['Tomatoes', 'Asparagus'], antagonists: [] },
    { name: 'Petunia', scientific: 'Petunia', companions: ['Beans', 'Tomatoes', 'Basil'], antagonists: [] },
    { name: 'Cosmos', scientific: 'Cosmos bipinnatus', companions: ['Corn', 'Beans', 'Squash'], antagonists: [] },
    { name: 'Sweet Alyssum', scientific: 'Lobularia maritima', companions: ['Lettuce', 'Cabbage Family', 'Potatoes'], antagonists: [] },
  ];

  // Fruit plants
  const fruits = [
    { name: 'Strawberry', scientific: 'Fragaria', companions: ['Beans', 'Spinach', 'Borage', 'Lettuce'], antagonists: ['Cabbage Family', 'Fennel'] },
    { name: 'Blueberry', scientific: 'Vaccinium corymbosum', companions: ['Rhododendron', 'Azalea', 'Pine Trees'], antagonists: ['Alkaline Loving Plants'] },
    { name: 'Raspberry', scientific: 'Rubus idaeus', companions: ['Yarrow', 'Garlic', 'Tansy'], antagonists: ['Blackberry', 'Potato'] },
    { name: 'Watermelon', scientific: 'Citrullus lanatus', companions: ['Corn', 'Sunflower', 'Nasturtium'], antagonists: ['Potato'] },
    { name: 'Cantaloupe', scientific: 'Cucumis melo', companions: ['Corn', 'Sunflower', 'Nasturtium'], antagonists: ['Potato'] },
  ];

  // Generate 200+ plants by combining the base sets and adding variations
  const allBasePlants = [...vegetables, ...herbs, ...flowers, ...fruits];
  const plants: PlantCompanionData[] = [];
  
  // Process base plants to create our initial dataset with companion information
  allBasePlants.forEach((plant, index) => {
    const id = (index + 1).toString();
    
    // Find companion and antagonist IDs 
    // Note: We'll need to do a second pass later to fix IDs since we're creating the list now
    const companions: string[] = [];
    const antagonists: string[] = [];
    
    // Add growing zones and planting seasons (just example data)
    const growingZones = [`Zone ${Math.floor(Math.random() * 10) + 1}`, `Zone ${Math.floor(Math.random() * 10) + 1}`];
    const plantingSeasons = ["Spring", "Summer", "Fall"].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1);

    // Benefits of companion planting with this plant
    const possibleBenefits = [
      "Pest repellent",
      "Attracts beneficial insects",
      "Improves flavor",
      "Improves growth",
      "Provides ground cover",
      "Adds nutrients to soil",
      "Creates beneficial shade",
      "Weed suppression",
      "Attracts pollinators",
      "Disease prevention"
    ];
    
    const benefits = possibleBenefits.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 4) + 1);
    
    plants.push({
      id,
      name: plant.name,
      scientific_name: plant.scientific,
      description: `${plant.name} is a popular garden plant. It ${benefits.length > 0 ? 'offers benefits like ' + benefits.join(', ').toLowerCase() : 'is commonly grown in home gardens'}.`,
      image_url: `https://source.unsplash.com/featured/?${plant.name.toLowerCase().replace(/ /g, ',')}`,
      companions,
      antagonists,
      benefits,
      growing_zones: growingZones,
      planting_season: plantingSeasons
    });
  });
  
  // Add more plants to reach at least 200
  // Add varieties of existing plants
  const varieties = [
    "Cherry", "Roma", "Beefsteak", "Heirloom", "Bush", "Pole", "Red", "Green", 
    "Yellow", "Purple", "White", "Sweet", "Hot", "Winter", "Summer", "Baby", 
    "Dwarf", "Giant", "Early", "Late", "Hybrid", "Wild", "Italian", "French",
    "Chinese", "Japanese", "Mexican", "Thai", "Indian", "German", "Russian"
  ];
  
  const originalPlantCount = plants.length;
  let currentId = originalPlantCount + 1;
  
  // Create varieties of vegetables and other high-value plants
  for (let i = 0; i < 25; i++) {
    const baseVegetable = vegetables[Math.floor(Math.random() * vegetables.length)];
    const variety = varieties[Math.floor(Math.random() * varieties.length)];
    const id = currentId.toString();
    currentId++;
    
    plants.push({
      id,
      name: `${variety} ${baseVegetable.name}`,
      scientific_name: baseVegetable.scientific,
      description: `A ${variety.toLowerCase()} variety of ${baseVegetable.name.toLowerCase()}. It has similar growing characteristics to standard ${baseVegetable.name.toLowerCase()}.`,
      image_url: `https://source.unsplash.com/featured/?${variety.toLowerCase()},${baseVegetable.name.toLowerCase()}`,
      companions: [],
      antagonists: [],
      benefits: ["Variety diversity", "Specialized traits"],
      growing_zones: [`Zone ${Math.floor(Math.random() * 10) + 1}`, `Zone ${Math.floor(Math.random() * 10) + 1}`],
      planting_season: ["Spring", "Summer", "Fall"].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1)
    });
  }
  
  // Create regional varieties and additional herbs
  const regionalPrefixes = ["Tuscan", "Provençal", "Californian", "Eastern", "Western", "Northern", "Southern", "Coastal", "Mountain", "Desert"];
  
  for (let i = 0; i < 25; i++) {
    const baseHerb = herbs[Math.floor(Math.random() * herbs.length)];
    const regional = regionalPrefixes[Math.floor(Math.random() * regionalPrefixes.length)];
    const id = currentId.toString();
    currentId++;
    
    plants.push({
      id,
      name: `${regional} ${baseHerb.name}`,
      scientific_name: baseHerb.scientific,
      description: `A ${regional.toLowerCase()} variety of ${baseHerb.name.toLowerCase()} with unique characteristics adapted to that growing region.`,
      image_url: `https://source.unsplash.com/featured/?${baseHerb.name.toLowerCase()},herb`,
      companions: [],
      antagonists: [],
      benefits: ["Regional adaptation", "Unique flavor profile"],
      growing_zones: [`Zone ${Math.floor(Math.random() * 10) + 1}`, `Zone ${Math.floor(Math.random() * 10) + 1}`],
      planting_season: ["Spring", "Summer", "Fall"].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1)
    });
  }
  
  // Add some completely new plants
  const additionalPlants = [
    { name: 'Quinoa', scientific: 'Chenopodium quinoa' },
    { name: 'Amaranth', scientific: 'Amaranthus' },
    { name: 'Arugula', scientific: 'Eruca vesicaria' },
    { name: 'Bok Choy', scientific: 'Brassica rapa subsp. chinensis' },
    { name: 'Luffa', scientific: 'Luffa aegyptiaca' },
    { name: 'Sunchoke', scientific: 'Helianthus tuberosus' },
    { name: 'Okra', scientific: 'Abelmoschus esculentus' },
    { name: 'Jicama', scientific: 'Pachyrhizus erosus' },
    { name: 'Tomatillo', scientific: 'Physalis philadelphica' },
    { name: 'Kohlrabi', scientific: 'Brassica oleracea var. gongylodes' },
    { name: 'Celeriac', scientific: 'Apium graveolens var. rapaceum' },
    { name: 'Mizuna', scientific: 'Brassica rapa var. japonica' },
    { name: 'Rutabaga', scientific: 'Brassica napus var. napobrassica' },
    { name: 'Fava Bean', scientific: 'Vicia faba' },
    { name: 'Lentil', scientific: 'Lens culinaris' },
    { name: 'Chickpea', scientific: 'Cicer arietinum' },
    { name: 'Turnip', scientific: 'Brassica rapa subsp. rapa' },
    { name: 'Daikon Radish', scientific: 'Raphanus sativus var. longipinnatus' },
    { name: 'Salsify', scientific: 'Tragopogon porrifolius' },
    { name: 'Burdock', scientific: 'Arctium lappa' },
    { name: 'Watercress', scientific: 'Nasturtium officinale' },
    { name: 'Radicchio', scientific: 'Cichorium intybus var. foliosum' },
    { name: 'Endive', scientific: 'Cichorium endivia' },
    { name: 'Sorrel', scientific: 'Rumex acetosa' },
    { name: 'Shiso', scientific: 'Perilla frutescens' },
    { name: 'Lovage', scientific: 'Levisticum officinale' },
    { name: 'Horseradish', scientific: 'Armoracia rusticana' },
    { name: 'Stevia', scientific: 'Stevia rebaudiana' },
    { name: 'Comfrey', scientific: 'Symphytum officinale' },
    { name: 'Elecampane', scientific: 'Inula helenium' },
  ];
  
  additionalPlants.forEach(plant => {
    const id = currentId.toString();
    currentId++;
    
    plants.push({
      id,
      name: plant.name,
      scientific_name: plant.scientific,
      description: `${plant.name} is a less common but valuable garden plant with unique properties.`,
      image_url: `https://source.unsplash.com/featured/?${plant.name.toLowerCase().replace(/ /g, ',')}`,
      companions: [],
      antagonists: [],
      benefits: ["Biodiversity", "Specialized use"],
      growing_zones: [`Zone ${Math.floor(Math.random() * 10) + 1}`, `Zone ${Math.floor(Math.random() * 10) + 1}`],
      planting_season: ["Spring", "Summer", "Fall"].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1)
    });
  });
  
  // Add some flower varieties
  const flowerVarieties = [
    "Tall", "Dwarf", "Double", "Climbing", "Trailing", "Single", "Miniature", 
    "Giant", "Bi-color", "Ruffled", "Crested", "Variegated", "Mounding",
    "Spreading", "Compact", "Hardy", "Annual", "Perennial", "Creeping"
  ];
  
  for (let i = 0; i < 25; i++) {
    const baseFlower = flowers[Math.floor(Math.random() * flowers.length)];
    const variety = flowerVarieties[Math.floor(Math.random() * flowerVarieties.length)];
    const id = currentId.toString();
    currentId++;
    
    plants.push({
      id,
      name: `${variety} ${baseFlower.name}`,
      scientific_name: baseFlower.scientific,
      description: `A ${variety.toLowerCase()} variety of ${baseFlower.name.toLowerCase()} that adds beauty while providing companion planting benefits.`,
      image_url: `https://source.unsplash.com/featured/?${variety.toLowerCase()},${baseFlower.name.toLowerCase()}`,
      companions: [],
      antagonists: [],
      benefits: ["Attracts pollinators", "Ornamental value"],
      growing_zones: [`Zone ${Math.floor(Math.random() * 10) + 1}`, `Zone ${Math.floor(Math.random() * 10) + 1}`],
      planting_season: ["Spring", "Summer"].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 2) + 1)
    });
  }
  
  // Add more fruit varieties
  for (let i = 0; i < 15; i++) {
    const baseFruit = fruits[Math.floor(Math.random() * fruits.length)];
    const variety = varieties[Math.floor(Math.random() * varieties.length)];
    const id = currentId.toString();
    currentId++;
    
    plants.push({
      id,
      name: `${variety} ${baseFruit.name}`,
      scientific_name: baseFruit.scientific,
      description: `A ${variety.toLowerCase()} variety of ${baseFruit.name.toLowerCase()} known for its unique flavor profile.`,
      image_url: `https://source.unsplash.com/featured/?${variety.toLowerCase()},${baseFruit.name.toLowerCase()}`,
      companions: [],
      antagonists: [],
      benefits: ["Fruit diversity", "Specialized traits"],
      growing_zones: [`Zone ${Math.floor(Math.random() * 10) + 1}`, `Zone ${Math.floor(Math.random() * 10) + 1}`],
      planting_season: ["Spring", "Summer", "Fall"].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1)
    });
  }
  
  // Now that we have all plants created, let's set up the companion and antagonist relationships
  // First, create a map of plant names to IDs
  const plantNameToId = new Map<string, string>();
  plants.forEach(plant => {
    plantNameToId.set(plant.name, plant.id);
  });
  
  // Go through our base plant definitions and properly set up the relationships
  for (let i = 0; i < originalPlantCount; i++) {
    const plant = plants[i];
    const basePlant = allBasePlants[i];
    
    // Set companions
    if (basePlant.companions && basePlant.companions.length > 0) {
      basePlant.companions.forEach(companionName => {
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
      basePlant.antagonists.forEach(antagonistName => {
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
  
  // For the variants and additional plants, inherit companion relationships from base plants
  for (let i = originalPlantCount; i < plants.length; i++) {
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

// Export our plant data
export const plantData = generatePlantData();
