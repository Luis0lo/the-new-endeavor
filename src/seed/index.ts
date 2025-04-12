
import { supabase } from '@/integrations/supabase/client';
import seedBlogPosts from './blogPosts';

export const runSeedData = async () => {
  // Check if user is logged in
  const { data } = await supabase.auth.getSession();
  
  if (data?.session?.user) {
    // Seed blog posts
    await seedBlogPosts(data.session.user.id);
    
    return true;
  }
  
  return false;
};
