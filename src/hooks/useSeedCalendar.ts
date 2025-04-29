
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SeedCalendarEntry {
  id: string;
  vegetable: string;
  sow_indoors: string[];
  sow_outdoors: string[];
  transplant_outdoors: string[];
  harvest_period: string[];
}

export function useSeedCalendar() {
  const [seedData, setSeedData] = useState<SeedCalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSeedCalendar = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('seed_calendar_uk')
          .select('*')
          .order('vegetable');
        
        if (error) {
          throw error;
        }
        
        setSeedData(data);
      } catch (error: any) {
        console.error('Error fetching seed calendar:', error);
        setError(error);
        toast({
          title: "Error",
          description: error.message || "Failed to load seed calendar data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSeedCalendar();
  }, []);

  return { seedData, loading, error };
}
