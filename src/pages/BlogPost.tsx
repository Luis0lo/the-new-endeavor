
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import MainLayout from '@/components/MainLayout';
import { Database } from '@/integrations/supabase/types';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  featured_image: string | null;
  published_at: string | null;
  slug: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}

interface NavigationPost {
  title: string;
  slug: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [nextPost, setNextPost] = useState<NavigationPost | null>(null);
  const [prevPost, setPrevPost] = useState<NavigationPost | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);
  
  const fetchPost = async () => {
    try {
      // Fetch the current post
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          content,
          featured_image,
          published_at,
          slug,
          profiles:author_id(username, avatar_url)
        `)
        .eq('slug', slug)
        .eq('published', true)
        .single();
        
      if (error) throw error;
      
      // Transform with type safety
      if (data) {
        const formattedPost: BlogPost = {
          id: data.id,
          title: data.title,
          content: data.content,
          featured_image: data.featured_image,
          published_at: data.published_at,
          slug: data.slug,
          profiles: {
            username: (data.profiles as any)?.username || "Unknown",
            avatar_url: (data.profiles as any)?.avatar_url
          }
        };
        
        setPost(formattedPost);
        
        // Fetch the next and previous posts
        const { data: allPosts, error: allPostsError } = await supabase
          .from('blog_posts')
          .select('id, title, slug, published_at')
          .eq('published', true)
          .order('published_at', { ascending: false });
          
        if (allPostsError) throw allPostsError;
        
        if (allPosts && allPosts.length > 0) {
          const currentIndex = allPosts.findIndex(p => p.slug === slug);
          
          if (currentIndex > 0) {
            setPrevPost({
              title: allPosts[currentIndex - 1].title,
              slug: allPosts[currentIndex - 1].slug
            });
          } else {
            setPrevPost(null);
          }
          
          if (currentIndex < allPosts.length - 1) {
            setNextPost({
              title: allPosts[currentIndex + 1].title,
              slug: allPosts[currentIndex + 1].slug
            });
          } else {
            setNextPost(null);
          }
        }
      }
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
          <>
            {post.featured_image && (
              <div className="w-full h-[50vh] relative mb-12">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background opacity-80"></div>
                <img 
                  src={post.featured_image} 
                  alt={post.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <div className="max-w-3xl mx-auto">
                    <h1 className="font-bold text-3xl md:text-4xl mb-4 text-foreground">{post.title}</h1>
                    
                    <div className="flex items-center gap-3 mb-4">
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
                        <div className="font-medium text-foreground">{post.profiles?.username || "Unknown"}</div>
                        {post.published_at && (
                          <div className="text-sm text-muted-foreground">
                            {new Date(post.published_at).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <article className="max-w-3xl mx-auto">
              {!post.featured_image && (
                <>
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
                          {new Date(post.published_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              
              <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
              
              {/* Post Navigation */}
              <div className="border-t pt-8 mt-8">
                <div className="flex justify-between items-center">
                  {prevPost ? (
                    <Link to={`/blog/${prevPost.slug}`} className="group flex items-center">
                      <Button variant="outline" size="icon" className="mr-2 group-hover:bg-primary/10">
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <div>
                        <div className="text-sm text-muted-foreground">Previous</div>
                        <div className="font-medium">{prevPost.title}</div>
                      </div>
                    </Link>
                  ) : <div></div>}
                  
                  {nextPost && (
                    <Link to={`/blog/${nextPost.slug}`} className="group flex items-center text-right">
                      <div>
                        <div className="text-sm text-muted-foreground">Next</div>
                        <div className="font-medium">{nextPost.title}</div>
                      </div>
                      <Button variant="outline" size="icon" className="ml-2 group-hover:bg-primary/10">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </article>
          </>
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
