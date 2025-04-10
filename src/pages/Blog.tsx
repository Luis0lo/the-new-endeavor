
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import MainLayout from '@/components/MainLayout';
import { Database } from '@/integrations/supabase/types';

// Define the BlogPost interface to match what we expect from the database
interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  featured_image: string | null;
  published_at: string | null;
  profiles: {
    username: string;
  };
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          excerpt,
          slug,
          featured_image,
          published_at,
          profiles:author_id(username)
        `)
        .eq('published', true as any)
        .order('published_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform data to match our BlogPost interface
      const formattedPosts = data?.map(post => ({
        ...post,
        profiles: post.profiles as unknown as { username: string }
      })) || [];
      
      setPosts(formattedPosts);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch blog posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Garden Blog</h1>
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="text-center py-12">Loading blog posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No blog posts published yet.</p>
              <p className="text-sm mt-2">Check back soon for gardening tips and stories!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <Card key={post.id}>
                  {post.featured_image && (
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                      <img 
                        src={post.featured_image} 
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{post.title}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      By {post.profiles?.username || "Unknown"} • 
                      {post.published_at && 
                        ` ${new Date(post.published_at).toLocaleDateString()}`
                      }
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{post.excerpt || `Read this article about ${post.title}`}</p>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/blog/${post.slug}`}>
                      <Button variant="outline">Read More</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Blog;
