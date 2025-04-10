
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import MainLayout from '@/components/MainLayout';
import { Database } from '@/integrations/supabase/types';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  featured_image: string | null;
  published_at: string | null;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);
  
  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          content,
          featured_image,
          published_at,
          profiles:author_id(username, avatar_url)
        `)
        .eq('slug', slug)
        .eq('published', true)
        .single();
        
      if (error) throw error;
      
      setPost(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch blog post",
        variant: "destructive"
      });
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <Link to="/blog">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
        
        {loading ? (
          <div className="text-center py-12">Loading blog post...</div>
        ) : post ? (
          <article className="max-w-3xl mx-auto prose prose-slate lg:prose-lg dark:prose-invert">
            {post.featured_image && (
              <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
                <img 
                  src={post.featured_image} 
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            
            <h1 className="font-bold text-3xl md:text-4xl mb-4">{post.title}</h1>
            
            <div className="flex items-center gap-3 mb-8">
              <div className="rounded-full overflow-hidden h-10 w-10 bg-muted">
                {post.profiles?.avatar_url ? (
                  <img 
                    src={post.profiles.avatar_url} 
                    alt={post.profiles.username} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
                    {post.profiles?.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
              </div>
              <div>
                <div className="font-medium">{post.profiles?.username || "Unknown"}</div>
                {post.published_at && (
                  <div className="text-sm text-muted-foreground">
                    {new Date(post.published_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
            
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Post not found</p>
            <Link to="/blog" className="mt-4 inline-block">
              <Button>Back to Blog</Button>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default BlogPost;
