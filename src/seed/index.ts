
import { supabase } from '@/integrations/supabase/client';
import { blogPosts } from './blogPosts';

export const runSeedData = async () => {
  // Check if user is logged in
  const { data } = await supabase.auth.getSession();
  
  if (data?.session?.user) {
    // Seed blog posts
    for (const post of blogPosts) {
      const { error } = await supabase
        .from('blog_posts')
        .upsert({
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          author_id: data.session.user.id, // Use the logged-in user's ID
          published: post.published,
          published_at: post.published_at,
          featured_image: post.featured_image
        }, { onConflict: 'id' });
      
      if (error) {
        console.error('Error seeding blog post:', error);
      }
    }
    
    return true;
  }
  
  return false;
};
