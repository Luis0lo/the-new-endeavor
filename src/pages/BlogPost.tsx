
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Share2, Copy, Twitter, Facebook, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import MainLayout from '@/components/MainLayout';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { SEO } from '@/components/SEO';

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

  const handleShare = async () => {
    try {
      // Check if navigator.share is available and supported
      if (navigator.share && post) {
        await navigator.share({
          title: post.title,
          text: `Check out this garden article: ${post.title}`,
          url: window.location.href,
        });
        
        toast({
          title: "Shared successfully",
          description: "Thanks for sharing this article!"
        });
      } else {
        // Fallback for browsers that don't support navigator.share
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Article link copied to clipboard"
        });
      }
    } catch (error: any) {
      toast({
        title: "Sharing failed",
        description: error.message || "Unable to share content",
        variant: "destructive"
      });
      console.error("Sharing failed:", error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Article link copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  return (
    <MainLayout>
      {post && (
        <SEO 
          title={`${post.title} | Garden Blog`}
          description={`Read our gardening article: ${post.title}`}
          ogImage={post.featured_image || undefined}
        />
      )}
      
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
            {/* Post navigation buttons - Hidden on mobile, shown on desktop */}
            {prevPost && (
              <div className="hidden md:block fixed left-4 top-1/2 transform -translate-y-1/2 z-10">
                <Link to={`/blog/${prevPost.slug}`} className="group relative">
                  <Button variant="outline" size="icon" className="rounded-full transition-all duration-300 group-hover:bg-primary/10">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div className="absolute left-full ml-2 px-3 py-1 bg-background border rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {prevPost.title}
                  </div>
                </Link>
              </div>
            )}
            
            {nextPost && (
              <div className="hidden md:block fixed right-4 top-1/2 transform -translate-y-1/2 z-10">
                <Link to={`/blog/${nextPost.slug}`} className="group relative">
                  <Button variant="outline" size="icon" className="rounded-full transition-all duration-300 group-hover:bg-primary/10">
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <div className="absolute right-full mr-2 px-3 py-1 bg-background border rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {nextPost.title}
                  </div>
                </Link>
              </div>
            )}
            
            <article className="max-w-3xl mx-auto">
              {/* Hero Image */}
              {post.featured_image && (
                <div className="w-full mb-6">
                  <img 
                    src={post.featured_image} 
                    alt={post.title}
                    className="w-full h-auto object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
              
              {/* Article Header */}
              <header className="mb-8">
                <h1 className="font-bold text-3xl md:text-4xl mb-4">{post.title}</h1>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
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
                        <time 
                          dateTime={post.published_at}
                          className="text-sm text-muted-foreground"
                        >
                          {new Date(post.published_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </time>
                      )}
                    </div>
                  </div>
                  
                  {/* Share Button */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Share2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Share</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2" align="end">
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="justify-start gap-2"
                          onClick={handleCopyLink}
                        >
                          <Copy className="h-4 w-4" />
                          Copy link
                        </Button>
                        <a 
                          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full"
                        >
                          <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                            <Twitter className="h-4 w-4" />
                            Twitter
                          </Button>
                        </a>
                        <a 
                          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full"
                        >
                          <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                            <Facebook className="h-4 w-4" />
                            Facebook
                          </Button>
                        </a>
                        <a 
                          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title} - ${window.location.href}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full"
                        >
                          <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                            <MessageCircle className="h-4 w-4" />
                            WhatsApp
                          </Button>
                        </a>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </header>
              
              {/* Article Content */}
              <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
              
              {/* Mobile Post Navigation */}
              <div className="md:hidden border-t pt-8 mt-8">
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
