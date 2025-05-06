
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SeedCalendarEntry {
  id: string;
  vegetable: string;
  sow_indoors: string[];
  sow_outdoors: string[];
  transplant_outdoors: string[];
  harvest_period: string[];
  user_id?: string | null; // Added to identify user entries
}

export function useSeedCalendar() {
  const [seedData, setSeedData] = useState<SeedCalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setUserId(data.session?.user.id || null);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user.id || null);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchSeedCalendar = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch user-specific entries if logged in
      let userEntries: SeedCalendarEntry[] = [];
      
      if (userId) {
        const { data: userData, error: userError } = await supabase
          .from('user_seed_calendar')
          .select('*')
          .eq('user_id', userId)
          .order('vegetable'); // Sort alphabetically
        
        if (userError) throw userError;
        
        userEntries = userData.map((entry: any) => ({
          ...entry,
          sow_indoors: entry.sow_indoors?.filter(Boolean) || [],
          sow_outdoors: entry.sow_outdoors?.filter(Boolean) || [],
          transplant_outdoors: entry.transplant_outdoors?.filter(Boolean) || [],
          harvest_period: entry.harvest_period?.filter(Boolean) || [],
        }));
      }
      
      // Always fetch default entries
      const { data: defaultData, error: defaultError } = await supabase
        .from('seed_calendar_uk')
        .select('*')
        .order('vegetable'); // Sort alphabetically
      
      if (defaultError) throw defaultError;
      
      // Process the data to handle empty strings in arrays
      const processedDefaultData = defaultData.map((entry: SeedCalendarEntry) => ({
        ...entry,
        sow_indoors: entry.sow_indoors?.filter(Boolean) || [],
        sow_outdoors: entry.sow_outdoors?.filter(Boolean) || [],
        transplant_outdoors: entry.transplant_outdoors?.filter(Boolean) || [],
        harvest_period: entry.harvest_period?.filter(Boolean) || [],
        user_id: null // Mark as default entry
      }));
      
      // Merge user entries with default entries, prioritizing user entries
      // (overwriting default entries with the same vegetable name)
      const userVegetableNames = new Set(userEntries.map(entry => entry.vegetable.toLowerCase()));
      const filteredDefaultData = processedDefaultData.filter(
        entry => !userVegetableNames.has(entry.vegetable.toLowerCase())
      );
      
      setSeedData([...userEntries, ...filteredDefaultData]);
      
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
  }, [userId]);

  useEffect(() => {
    fetchSeedCalendar();
  }, [fetchSeedCalendar]);

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_seed_calendar')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Entry deleted successfully"
      });
      
      // Refetch the data
      fetchSeedCalendar();
      
    } catch (error: any) {
      console.error('Error deleting entry:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete entry",
        variant: "destructive"
      });
    }
  };

  const refetch = useCallback(() => {
    fetchSeedCalendar();
  }, [fetchSeedCalendar]);

  return { seedData, loading, error, refetch, deleteEntry, userId };
}
