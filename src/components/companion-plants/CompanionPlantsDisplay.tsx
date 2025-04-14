
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Flower2, ThumbsUp, ThumbsDown, Leaf, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Plant {
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

interface CompanionPlantsDisplayProps {
  selectedPlants: Plant[];
}

export function CompanionPlantsDisplay({ selectedPlants }: CompanionPlantsDisplayProps) {
  const [compatibilityData, setCompatibilityData] = useState<{
    compatible: {plants: string[], reasons: string[]};
    incompatible: {plants: string[], reasons: string[]};
    neutral: string[];
  }>({
    compatible: {plants: [], reasons: []},
    incompatible: {plants: [], reasons: []},
    neutral: []
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only analyze compatibility when we have 2 or more plants
    if (selectedPlants.length >= 2) {
      analyzeCompatibility();
    }
  }, [selectedPlants]);

  const analyzeCompatibility = async () => {
    if (selectedPlants.length < 2) return;
    
    setLoading(true);
    
    try {
      // If we don't have companion/antagonist data in the selectedPlants, fetch it
      let plantsWithCompanionData = [...selectedPlants];
      
      // Check if any plant is missing companion data
      const needToFetch = selectedPlants.some(plant => 
        !plant.companions || !plant.antagonists);
      
      if (needToFetch) {
        // Fetch full plant data with companion information
        const { data, error } = await supabase
          .from('plants')
          .select('*')
          .in('id', selectedPlants.map(p => p.id));
          
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          // Create a map for easy lookup
          const plantMap = new Map();
          data.forEach(p => plantMap.set(p.id, p));
          
          // Update our plants with the companion data
          plantsWithCompanionData = selectedPlants.map(p => {
            const fullData = plantMap.get(p.id);
            return fullData ? { ...p, ...fullData } : p;
          });
        }
      }
      
      // Now analyze compatibility between all plants
      const compatible = { plants: [] as string[], reasons: [] as string[] };
      const incompatible = { plants: [] as string[], reasons: [] as string[] };
      const neutral = [] as string[];
      
      // Analyze each pair of plants
      for (let i = 0; i < plantsWithCompanionData.length; i++) {
        for (let j = i + 1; j < plantsWithCompanionData.length; j++) {
          const plant1 = plantsWithCompanionData[i];
          const plant2 = plantsWithCompanionData[j];
          
          const plant1Name = plant1.name;
          const plant2Name = plant2.name;
          const pairName = `${plant1Name} & ${plant2Name}`;
          
          const isCompanion1 = plant1.companions && plant1.companions.includes(plant2.id);
          const isCompanion2 = plant2.companions && plant2.companions.includes(plant1.id);
          const isAntagonist1 = plant1.antagonists && plant1.antagonists.includes(plant2.id);
          const isAntagonist2 = plant2.antagonists && plant2.antagonists.includes(plant1.id);
          
          if (isCompanion1 || isCompanion2) {
            compatible.plants.push(pairName);
            
            // Add reasons if available
            const plant1Benefits = plant1.benefits || [];
            const plant2Benefits = plant2.benefits || [];
            const allBenefits = [...new Set([...plant1Benefits, ...plant2Benefits])];
            
            if (allBenefits.length > 0) {
              compatible.reasons.push(...allBenefits);
            } else {
              compatible.reasons.push("Enhance growth and health");
            }
          } else if (isAntagonist1 || isAntagonist2) {
            incompatible.plants.push(pairName);
            incompatible.reasons.push("May inhibit growth");
            incompatible.reasons.push("Compete for resources");
            incompatible.reasons.push("Potential pest attraction");
          } else {
            neutral.push(pairName);
          }
        }
      }
      
      // Deduplicate reasons
      compatible.reasons = [...new Set(compatible.reasons)];
      incompatible.reasons = [...new Set(incompatible.reasons)];
      
      setCompatibilityData({
        compatible,
        incompatible,
        neutral
      });
    } catch (error: any) {
      console.error("Error analyzing compatibility:", error);
      toast({
        title: "Error",
        description: "There was a problem analyzing plant compatibility",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compatibility Results</CardTitle>
        <CardDescription>
          View compatibility between your selected plants
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedPlants.length < 2 ? (
          <div className="flex flex-col items-center justify-center h-40 bg-muted/50 rounded-md p-4">
            <Flower2 className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-center">
              Select at least two plants to see compatibility information
            </p>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse flex flex-col items-center">
              <Leaf className="h-8 w-8 text-primary animate-spin" />
              <p className="mt-2 text-muted-foreground">Analyzing compatibility...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedPlants.map(plant => (
                <div 
                  key={plant.id} 
                  className="bg-primary/10 text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center"
                >
                  <Leaf className="h-3 w-3 mr-1" />
                  {plant.name}
                </div>
              ))}
            </div>
            
            <div className="bg-primary/10 p-4 rounded-md">
              <h3 className="font-medium mb-2 flex items-center">
                <Flower2 className="h-4 w-4 mr-2" />
                Compatibility Summary
              </h3>
              <p>
                {compatibilityData.compatible.plants.length > 0 
                  ? "These plants have beneficial companion relationships! Consider planting them together."
                  : compatibilityData.incompatible.plants.length > 0
                    ? "Some of these plants may not grow well together. Check the details below."
                    : "These plants neither help nor hinder each other significantly."
                }
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              {compatibilityData.compatible.plants.length > 0 && (
                <div className="bg-green-100 dark:bg-green-950/30 p-3 rounded-md">
                  <h4 className="font-medium text-green-700 dark:text-green-400 flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Compatible Combinations
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm">
                    {compatibilityData.compatible.plants.map((pair, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-1 mt-0.5 flex-shrink-0" />
                        <span>{pair}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <h5 className="font-medium mt-3 mb-1 text-sm text-green-700 dark:text-green-400">
                    Benefits
                  </h5>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {compatibilityData.compatible.reasons.length > 0 
                      ? compatibilityData.compatible.reasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))
                      : <li>Enhanced growth and health</li>
                    }
                  </ul>
                </div>
              )}
              
              {compatibilityData.incompatible.plants.length > 0 && (
                <div className="bg-red-100 dark:bg-red-950/30 p-3 rounded-md">
                  <h4 className="font-medium text-red-700 dark:text-red-400 flex items-center">
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Incompatible Combinations
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm">
                    {compatibilityData.incompatible.plants.map((pair, idx) => (
                      <li key={idx} className="flex items-start">
                        <X className="h-4 w-4 text-red-500 mr-1 mt-0.5 flex-shrink-0" />
                        <span>{pair}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <h5 className="font-medium mt-3 mb-1 text-sm text-red-700 dark:text-red-400">
                    Considerations
                  </h5>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {compatibilityData.incompatible.reasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {(!compatibilityData.compatible.plants.length || !compatibilityData.incompatible.plants.length) && (
                <div className="bg-blue-100 dark:bg-blue-950/30 p-3 rounded-md">
                  <h4 className="font-medium text-blue-700 dark:text-blue-400">
                    {compatibilityData.neutral.length > 0 ? "Neutral Combinations" : "Companion Planting Tips"}
                  </h4>
                  
                  {compatibilityData.neutral.length > 0 ? (
                    <ul className="mt-2 space-y-1 text-sm">
                      {compatibilityData.neutral.map((pair, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-1">•</span>
                          <span>{pair} - No known positive or negative interactions</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="list-disc list-inside text-sm mt-1">
                      <li>Consider space requirements for each plant</li>
                      <li>Match plants with similar water and sun needs</li>
                      <li>Diverse plantings help reduce pest issues</li>
                      <li>Observe and document what works in your garden</li>
                    </ul>
                  )}
                </div>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground mt-4">
              <p>Note: Plant compatibility is based on companion planting principles. Results may vary based on your specific growing conditions.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
