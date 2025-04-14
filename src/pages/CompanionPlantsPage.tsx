
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, X, ThumbsUp, ThumbsDown, AlertTriangle } from 'lucide-react';
import { companionPlantsData, findCompanionPlants, checkPlantCompatibility } from '@/data/companionPlants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CompanionPlantsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(companionPlantsData);
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);
  const [compatibilityPlants, setCompatibilityPlants] = useState<string[]>([]);
  const [plantInput, setPlantInput] = useState('');
  const [compatibilityResult, setCompatibilityResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('search');

  // Filter plants based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = companionPlantsData.filter(plant => 
        plant.plant.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults(companionPlantsData);
    }
  }, [searchTerm]);

  // Handle plant selection
  const handlePlantSelect = (plantName: string) => {
    setSelectedPlant(plantName);
  };

  // Add plant to compatibility check list
  const handleAddCompatibilityPlant = () => {
    if (plantInput && !compatibilityPlants.includes(plantInput)) {
      setCompatibilityPlants([...compatibilityPlants, plantInput]);
      setPlantInput('');
      
      // If we have more than one plant, check compatibility
      if (compatibilityPlants.length > 0) {
        const result = checkPlantCompatibility([...compatibilityPlants, plantInput]);
        setCompatibilityResult(result);
      }
    }
  };

  // Remove plant from compatibility list
  const handleRemovePlant = (plantToRemove: string) => {
    const updatedPlants = compatibilityPlants.filter(plant => plant !== plantToRemove);
    setCompatibilityPlants(updatedPlants);
    
    // Recheck compatibility with the updated list
    if (updatedPlants.length > 1) {
      const result = checkPlantCompatibility(updatedPlants);
      setCompatibilityResult(result);
    } else {
      setCompatibilityResult(null);
    }
  };

  // Get selected plant details
  const selectedPlantData = selectedPlant 
    ? findCompanionPlants(selectedPlant) 
    : null;

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="flex flex-col mb-6">
          <h1 className="text-3xl font-bold">Companion Plants</h1>
          <p className="text-muted-foreground">
            Discover plant combinations that help each other grow better
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search">Search Plants</TabsTrigger>
            <TabsTrigger value="compatibility">Check Compatibility</TabsTrigger>
          </TabsList>
          
          <TabsContent value="search" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Search and Plants List */}
              <div className="md:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Plants Directory</CardTitle>
                    <CardDescription>
                      Search for plants to see their companions
                    </CardDescription>
                    <div className="relative mt-2">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search plants..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="max-h-[500px] overflow-y-auto">
                    <div className="space-y-2">
                      {searchResults.map(plant => (
                        <Button
                          key={plant.plant}
                          variant={selectedPlant === plant.plant ? "default" : "outline"}
                          className="w-full justify-start"
                          onClick={() => handlePlantSelect(plant.plant)}
                        >
                          {plant.plant}
                        </Button>
                      ))}
                      {searchResults.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          No plants found matching "{searchTerm}"
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Plant Details */}
              <div className="md:col-span-2">
                {selectedPlantData ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">{selectedPlantData.plant}</CardTitle>
                      {selectedPlantData.notes && (
                        <CardDescription>{selectedPlantData.notes}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-2 flex items-center">
                            <ThumbsUp className="h-5 w-5 text-green-500 mr-2" /> 
                            Good Companion Plants
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedPlantData.companions.map(companion => (
                              <Badge key={companion} className="bg-green-100 text-green-800 hover:bg-green-200">
                                {companion}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2 flex items-center">
                            <ThumbsDown className="h-5 w-5 text-red-500 mr-2" /> 
                            Bad Companion Plants
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedPlantData.antagonists.length > 0 ? (
                              selectedPlantData.antagonists.map(antagonist => (
                                <Badge key={antagonist} className="bg-red-100 text-red-800 hover:bg-red-200">
                                  {antagonist}
                                </Badge>
                              ))
                            ) : (
                              <p className="text-muted-foreground">No known antagonists.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Plant Details</CardTitle>
                      <CardDescription>
                        Select a plant from the list to see its companion plants
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center py-12">
                      <p className="text-muted-foreground">No plant selected</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="compatibility" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Plant Compatibility Checker</CardTitle>
                <CardDescription>
                  Check if multiple plants grow well together
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor="plantInput">Add Plants</Label>
                      <Input
                        id="plantInput"
                        placeholder="Enter plant name..."
                        value={plantInput}
                        onChange={(e) => setPlantInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCompatibilityPlant();
                          }
                        }}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleAddCompatibilityPlant}>
                        <Plus className="h-4 w-4 mr-2" /> Add
                      </Button>
                    </div>
                  </div>
                  
                  {compatibilityPlants.length > 0 && (
                    <div>
                      <Label>Selected Plants</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {compatibilityPlants.map(plant => (
                          <Badge key={plant} variant="outline" className="text-sm py-1 pl-2 pr-1">
                            {plant}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-5 w-5 ml-1 p-0"
                              onClick={() => handleRemovePlant(plant)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {compatibilityResult && compatibilityPlants.length > 1 && (
                    <Alert variant={compatibilityResult.compatible ? "default" : "destructive"}>
                      {compatibilityResult.compatible ? (
                        <>
                          <ThumbsUp className="h-4 w-4" />
                          <AlertTitle>Good Compatibility</AlertTitle>
                          <AlertDescription>
                            These plants should grow well together!
                          </AlertDescription>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Compatibility Issues</AlertTitle>
                          <AlertDescription>
                            <p>Some plants may not grow well together:</p>
                            <ul className="list-disc list-inside mt-2">
                              {compatibilityResult.incompatiblePairs?.map((pair: any, index: number) => (
                                <li key={index}>
                                  <strong>{pair.plant1}</strong> and <strong>{pair.plant2}</strong> are not compatible
                                </li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </>
                      )}
                    </Alert>
                  )}
                  
                  {compatibilityPlants.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">Detailed Compatibility</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Plant</TableHead>
                            <TableHead>Good Companions</TableHead>
                            <TableHead>Bad Companions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {compatibilityPlants.map(plant => {
                            const plantData = findCompanionPlants(plant);
                            return (
                              <TableRow key={plant}>
                                <TableCell className="font-medium">{plant}</TableCell>
                                <TableCell>
                                  {plantData ? (
                                    <div className="flex flex-wrap gap-1">
                                      {plantData.companions
                                        .filter(comp => compatibilityPlants.includes(comp))
                                        .map(comp => (
                                          <Badge key={comp} className="bg-green-100 text-green-800">
                                            {comp}
                                          </Badge>
                                        ))}
                                      {!plantData.companions.some(comp => compatibilityPlants.includes(comp)) && (
                                        <span className="text-muted-foreground text-sm">
                                          No companions in selection
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground text-sm">Data not available</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {plantData ? (
                                    <div className="flex flex-wrap gap-1">
                                      {plantData.antagonists
                                        .filter(ant => compatibilityPlants.includes(ant))
                                        .map(ant => (
                                          <Badge key={ant} className="bg-red-100 text-red-800">
                                            {ant}
                                          </Badge>
                                        ))}
                                      {!plantData.antagonists.some(ant => compatibilityPlants.includes(ant)) && (
                                        <span className="text-muted-foreground text-sm">
                                          No conflicts in selection
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground text-sm">Data not available</span>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CompanionPlantsPage;
