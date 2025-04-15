
import { supabase } from '@/integrations/supabase/client';
import { blogPosts } from './blogPosts';
import { plantData } from './plantData';

export const runSeedData = async () => {
  // Check if user is logged in
  const { data } = await supabase.auth.getSession();
  
  if (data?.session?.user) {
    // Seed blog posts
    console.log("Seeding database with blog posts:", blogPosts.length);
    try {
      // Check if blog posts already exist
      const { count: blogCount, error: blogCountError } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });
        
      if (blogCountError) {
        console.error("Error checking blog posts count:", blogCountError);
      } else if (!blogCount || blogCount < 5) {
        console.log("Inserting blog posts data...");
        const { error: blogError } = await supabase
          .from('blog_posts')
          .upsert(
            blogPosts.map(post => ({
              id: post.id,
              title: post.title,
              slug: post.slug,
              excerpt: post.excerpt,
              content: post.content,
              author_id: post.author_id,
              published: post.published,
              published_at: post.published_at,
              featured_image: post.featured_image
            })),
            { onConflict: 'id' }
          );
          
        if (blogError) {
          console.error("Error seeding blog posts:", blogError);
        } else {
          console.log("Successfully seeded blog posts database");
        }
      } else {
        console.log("Blog posts data already exists, skipping seed");
      }
    } catch (blogError) {
      console.error("Error in blog post seeding process:", blogError);
    }
    
    // Seed plant data
    console.log("Seeding database with plants:", plantData.length);
    try {
      // Check if plants already exist in the database
      const { count, error: countError } = await supabase
        .from('plants')
        .select('*', { count: 'exact', head: true });
        
      if (countError) {
        console.error("Error checking plants count:", countError);
        return false;
      }
        
      if (!count || count < 20) {
        console.log("Inserting plants data...");
        
        // Process plants in smaller batches to avoid request size limits
        const batchSize = 50;
        for (let i = 0; i < plantData.length; i += batchSize) {
          const batch = plantData.slice(i, i + batchSize);
          
          const { error } = await supabase
            .from('plants')
            .upsert(
              batch.map(plant => ({
                id: plant.id,
                name: plant.name,
                scientific_name: plant.scientific_name,
                description: plant.description,
                image_url: plant.image_url,
                planting_season: plant.planting_season,
                growing_zones: plant.growing_zones,
                companions: plant.companions,
                antagonists: plant.antagonists,
                benefits: plant.benefits
              })),
              { onConflict: 'id' }
            );
            
          if (error) {
            console.error("Error seeding plants batch:", error);
            return false;
          }
          
          console.log(`Successfully seeded ${i + batch.length}/${plantData.length} plants`);
        }
        
        console.log("Successfully seeded all plants database");
        return true;
      } else {
        console.log("Plants data already exists, skipping seed");
        return true;
      }
    } catch (error) {
      console.error("Error in plant seeding process:", error);
      return false;
    }
  }
  
  return false;
};
