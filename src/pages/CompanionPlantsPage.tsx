
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Leaf, Search, X, ThumbsUp, ThumbsDown, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PlantCompanionship {
  name: string;
  goodCompanions: string[];
  badCompanions: string[];
  notes?: string;
}

const PLANTS_DATABASE: PlantCompanionship[] = [
  {
    name: "tomato",
    goodCompanions: ["basil", "marigold", "nasturtium", "onion", "garlic", "parsley", "carrot", "asparagus", "chives"],
    badCompanions: ["potato", "corn", "fennel", "cabbage", "broccoli", "cauliflower", "kale"],
    notes: "Basil improves flavor and repels insects."
  },
  {
    name: "basil",
    goodCompanions: ["tomato", "pepper", "oregano", "asparagus", "petunias"],
    badCompanions: ["rue"],
    notes: "Improves growth and flavor of tomatoes."
  },
  {
    name: "carrot",
    goodCompanions: ["tomato", "onion", "leek", "rosemary", "sage", "peas", "beans", "chives"],
    badCompanions: ["dill", "parsnip", "radish"],
    notes: "Onions, leeks and rosemary help repel carrot fly."
  },
  {
    name: "cucumber",
    goodCompanions: ["beans", "corn", "peas", "radish", "sunflower", "nasturtium"],
    badCompanions: ["potato", "aromatic herbs"],
    notes: "Nasturtium improves growth and flavor."
  },
  {
    name: "lettuce",
    goodCompanions: ["carrot", "radish", "strawberry", "cucumber", "onion", "garlic"],
    badCompanions: ["broccoli", "cabbage", "cauliflower", "kale"],
    notes: "Grows well with onions which help repel aphids."
  },
  {
    name: "pepper",
    goodCompanions: ["basil", "onion", "carrot", "tomato", "oregano", "marjoram"],
    badCompanions: ["fennel", "kohlrabi", "beans"],
    notes: "Basil is said to improve the flavor."
  },
  {
    name: "spinach",
    goodCompanions: ["strawberry", "pea", "bean", "cauliflower", "cabbage", "eggplant"],
    badCompanions: ["potato"],
    notes: "Grows well with most plants."
  },
  {
    name: "onion",
    goodCompanions: ["beetroot", "strawberry", "tomato", "lettuce", "carrot", "pepper"],
    badCompanions: ["peas", "beans", "asparagus"],
    notes: "Helps repel many insects."
  },
  {
    name: "potato",
    goodCompanions: ["beans", "corn", "cabbage", "horseradish", "marigold", "eggplant"],
    badCompanions: ["tomato", "cucumber", "squash", "sunflower", "raspberry"],
    notes: "Horseradish planted at corners of potato patch helps repel potato bugs."
  },
  {
    name: "peas",
    goodCompanions: ["carrot", "turnip", "radish", "cucumber", "corn", "beans"],
    badCompanions: ["onion", "garlic", "leek", "chives", "shallots"],
    notes: "Don't plant near onions or garlic."
  },
  {
    name: "beets",
    goodCompanions: ["bush beans", "onions", "kohlrabi", "lettuce", "cabbage", "garlic"],
    badCompanions: ["pole beans", "mustard"],
    notes: "Bush beans and beets help each other by providing nitrogen."
  },
  {
    name: "broccoli",
    goodCompanions: ["potato", "onion", "oregano", "sage", "dill", "rosemary", "mint", "beetroot"],
    badCompanions: ["tomato", "strawberry", "squash"],
    notes: "Aromatic herbs help repel pests."
  }
];

const CompanionPlantsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<PlantCompanionship[]>([]);
  const [comparisonResults, setComparisonResults] = useState<{
    compatible: boolean;
    description: string;
  } | null>(null);
  
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Error",
        description: "Please enter a plant name to search",
        variant: "destructive"
      });
      return;
    }
    
    const term = searchTerm.trim().toLowerCase();
    const results = PLANTS_DATABASE.filter(plant => 
      plant.name.toLowerCase().includes(term)
    );
    
    setSearchResults(results);
    
    if (results.length === 0) {
      toast({
        title: "No results found",
        description: `No information available for "${searchTerm}". Try a different plant name.`,
        variant: "destructive"
      });
    }
  };
  
  const addToComparison = (plantName: string) => {
    if (selectedPlants.includes(plantName)) return;
    
    if (selectedPlants.length >= 5) {
      toast({
        title: "Limit reached",
        description: "You can only compare up to 5 plants at once",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedPlants([...selectedPlants, plantName]);
  };
  
  const removeFromComparison = (plantName: string) => {
    setSelectedPlants(selectedPlants.filter(p => p !== plantName));
  };
  
  const clearComparison = () => {
    setSelectedPlants([]);
    setComparisonResults(null);
  };
  
  const compareSelectedPlants = () => {
    if (selectedPlants.length < 2) {
      toast({
        title: "Error",
        description: "Please select at least 2 plants to compare",
        variant: "destructive"
      });
      return;
    }
    
    // Check if all selected plants are in our database
    const unknownPlants = selectedPlants.filter(p => 
      !PLANTS_DATABASE.some(dbPlant => dbPlant.name === p)
    );
    
    if (unknownPlants.length > 0) {
      toast({
        title: "Unknown plants",
        description: `The following plants are not in our database: ${unknownPlants.join(', ')}`,
        variant: "destructive"
      });
      return;
    }
    
    let areCompatible = true;
    let incompatibilities: string[] = [];
    
    // Check each pair of plants for compatibility
    for (let i = 0; i < selectedPlants.length; i++) {
      const plantA = PLANTS_DATABASE.find(p => p.name === selectedPlants[i])!;
      
      for (let j = i + 1; j < selectedPlants.length; j++) {
        const plantB = selectedPlants[j];
        
        if (plantA.badCompanions.includes(plantB)) {
          areCompatible = false;
          incompatibilities.push(`${plantA.name} and ${plantB} do not grow well together`);
        }
      }
    }
    
    if (areCompatible) {
      setComparisonResults({
        compatible: true,
        description: "All these plants can be grown together! They make good companions."
      });
    } else {
      setComparisonResults({
        compatible: false,
        description: "These plants are not all compatible. Issues found: " + incompatibilities.join('; ')
      });
    }
  };
  
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Companion Plants</h2>
        </div>
        
        <p className="text-muted-foreground">
          Find which plants grow well together and which ones to avoid planting side by side.
        </p>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Search Plants</CardTitle>
              <CardDescription>
                Find companion information for a specific plant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input 
                  placeholder="Enter plant name (e.g., tomato)" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                  }}
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              
              {searchResults.map((plant) => (
                <div key={plant.name} className="border rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-medium capitalize flex items-center">
                      <Leaf className="h-5 w-5 mr-2 text-green-500" />
                      {plant.name}
                    </h3>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => addToComparison(plant.name)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add to comparison
                    </Button>
                  </div>
                  
                  {plant.notes && (
                    <p className="text-sm text-muted-foreground mb-3">{plant.notes}</p>
                  )}
                  
                  <div className="mb-3">
                    <h4 className="text-sm font-medium flex items-center mb-2">
                      <ThumbsUp className="h-4 w-4 mr-1 text-green-500" />
                      Good Companions:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {plant.goodCompanions.map(companion => (
                        <Badge key={companion} variant="outline" className="bg-green-50">
                          {companion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium flex items-center mb-2">
                      <ThumbsDown className="h-4 w-4 mr-1 text-red-500" />
                      Bad Companions:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {plant.badCompanions.map(companion => (
                        <Badge key={companion} variant="outline" className="bg-red-50">
                          {companion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Compare Plants</CardTitle>
              <CardDescription>
                Check if multiple plants are compatible for planting together
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Selected Plants:</h3>
                {selectedPlants.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No plants selected. Use the search to find and add plants.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedPlants.map(plant => (
                      <Badge key={plant} className="pl-2 flex items-center capitalize">
                        {plant}
                        <button 
                          className="ml-1 hover:bg-primary-foreground rounded-full p-1"
                          onClick={() => removeFromComparison(plant)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex space-x-2 mt-4">
                  <Button 
                    disabled={selectedPlants.length < 2} 
                    onClick={compareSelectedPlants}
                  >
                    Compare
                  </Button>
                  <Button 
                    variant="outline" 
                    disabled={selectedPlants.length === 0}
                    onClick={clearComparison}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
              
              {comparisonResults && (
                <Alert className={comparisonResults.compatible ? "bg-green-50" : "bg-red-50"}>
                  <AlertTitle className="flex items-center">
                    {comparisonResults.compatible ? (
                      <>
                        <ThumbsUp className="h-4 w-4 mr-2 text-green-500" />
                        Compatible!
                      </>
                    ) : (
                      <>
                        <ThumbsDown className="h-4 w-4 mr-2 text-red-500" />
                        Not Compatible
                      </>
                    )}
                  </AlertTitle>
                  <AlertDescription>
                    {comparisonResults.description}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanionPlantsPage;
