
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Plant {
  id: string;
  name: string;
  scientific_name?: string;
  description?: string;
  image_url?: string;
  growing_zones?: string[];
  planting_season?: string[];
}

export function usePlants() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('plants')
          .select('id, name, scientific_name, description, image_url, growing_zones, planting_season')
          .order('name');
        
        if (error) {
          throw error;
        }
        
        setPlants(Array.isArray(data) ? data : []);
      } catch (error: any) {
        console.error('Error fetching plants:', error);
        setError(error);
        toast({
          title: "Error",
          description: error.message || "Failed to load plants",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlants();
  }, []);

  return { plants, loading, error };
}
