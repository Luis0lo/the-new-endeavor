
import { supabase } from '@/integrations/supabase/client';
import { blogPosts } from './blogPosts';
import { plantData } from './plantData';

export const runSeedData = async () => {
  // Check if user is logged in
  const { data } = await supabase.auth.getSession();
  
  if (data?.session?.user) {
    // Seed blog posts
    console.log("Seeding database with blog posts:", blogPosts.length);
    
    // Seed plant data
    console.log("Seeding database with plants:", plantData.length);
    try {
      // Check if plants already exist in the database
      const { count } = await supabase
        .from('plants')
        .select('*', { count: 'exact', head: true });
        
      if (!count || count < 20) {
        // Insert plants if database has few or no plants
        const { error } = await supabase
          .from('plants')
          .upsert(
            plantData.map(plant => ({
              id: plant.id,
              name: plant.name,
              scientific_name: plant.scientific_name,
              description: plant.description,
              image_url: plant.image_url,
              planting_season: plant.planting_season,
              growing_zones: plant.growing_zones,
              // Store companions and antagonists as metadata
              companions: plant.companions,
              antagonists: plant.antagonists,
              benefits: plant.benefits
            })),
            { onConflict: 'id' }
          );
          
        if (error) {
          console.error("Error seeding plants:", error);
        } else {
          console.log("Successfully seeded plants database");
        }
      } else {
        console.log("Plants data already exists, skipping seed");
      }
    } catch (error) {
      console.error("Error in plant seeding process:", error);
    }
    
    return true;
  }
  
  return false;
};
