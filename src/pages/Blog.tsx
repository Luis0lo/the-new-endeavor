
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import MainLayout from '@/components/MainLayout';
import { Search, ArrowRight } from 'lucide-react';
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

const BlogHero = ({ onSearch }: { onSearch: (term: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  return (
    <div className="relative py-24 bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Garden Blog</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
          Tips, guides, and inspiration for your garden journey
        </p>
        
        <form onSubmit={handleSearch} className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for gardening tips..."
              className="pl-10 pr-4 py-6 rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button 
              type="submit" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full px-4"
            >
              Search
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const BlogSection = ({ title, posts }: { title: string, posts: BlogPost[] }) => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">{title}</h2>
          <Link to="/blog/all" className="text-primary flex items-center">
            View all <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

const BlogCard = ({ post }: { post: BlogPost }) => {
  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      {post.featured_image && (
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={post.featured_image} 
            alt={post.title}
            className="h-full w-full object-cover transition-transform hover:scale-105 duration-300"
          />
        </div>
      )}
      <CardHeader className="flex-grow">
        <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
        <div className="text-sm text-muted-foreground">
          By {post.profiles?.username || "Unknown"} • 
          {post.published_at && 
            ` ${new Date(post.published_at).toLocaleDateString()}`
          }
        </div>
      </CardHeader>
      <CardContent className="flex-grow-0">
        <p className="line-clamp-3">{post.excerpt || `Read this article about ${post.title}`}</p>
      </CardContent>
      <CardFooter className="pt-2">
        <Link to={`/blog/${post.slug}`} className="w-full">
          <Button variant="outline" className="w-full">Read More</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const Blog = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
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
        .eq('published', true)
        .order('published_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform data to match our BlogPost interface with type safety
      if (data) {
        const formattedPosts = data.map(post => {
          // Make sure profiles exists and has the expected shape
          const profileData = post.profiles || { username: "Unknown" };
          return {
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            slug: post.slug,
            featured_image: post.featured_image,
            published_at: post.published_at,
            profiles: {
              username: (profileData as any).username || "Unknown"
            }
          } as BlogPost;
        });
        
        setLatestPosts(formattedPosts);
        
        // For demonstration, we'll just use the first 3 posts as featured
        // In a real application, you might have a 'featured' field in your database
        setFeaturedPosts(formattedPosts.slice(0, 3));
      }
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
  
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    
    if (!term.trim()) {
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    setLoading(true);
    
    try {
      // This is a simple search implementation
      // In a real application, you might use a more sophisticated search solution
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
        .eq('published', true)
        .or(`title.ilike.%${term}%,excerpt.ilike.%${term}%,content.ilike.%${term}%`)
        .order('published_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        const formattedPosts = data.map(post => {
          const profileData = post.profiles || { username: "Unknown" };
          return {
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            slug: post.slug,
            featured_image: post.featured_image,
            published_at: post.published_at,
            profiles: {
              username: (profileData as any).username || "Unknown"
            }
          } as BlogPost;
        });
        
        setSearchResults(formattedPosts);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to search blog posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <BlogHero onSearch={handleSearch} />
      
      {isSearching ? (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Search Results for "{searchTerm}"</h2>
          
          {loading ? (
            <div className="text-center py-12">Searching...</div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No matching blog posts found.</p>
              <p className="text-sm mt-2">Try a different search term or browse our blog categories.</p>
              <Button variant="outline" className="mt-4" onClick={() => setIsSearching(false)}>
                View All Posts
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <div className="py-12 bg-muted/50">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8">Featured Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Categories */}
          <div className="py-6 border-b">
            <div className="container mx-auto px-4">
              <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList className="w-full justify-start overflow-auto py-2">
                  <TabsTrigger value="all">All Posts</TabsTrigger>
                  <TabsTrigger value="vegetables">Vegetables</TabsTrigger>
                  <TabsTrigger value="flowers">Flowers</TabsTrigger>
                  <TabsTrigger value="herbs">Herbs</TabsTrigger>
                  <TabsTrigger value="tips">Gardening Tips</TabsTrigger>
                  <TabsTrigger value="tools">Tools</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          {/* Latest Posts */}
          <div className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8">Latest Posts</h2>
              
              {loading ? (
                <div className="text-center py-12">Loading blog posts...</div>
              ) : latestPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">No blog posts published yet.</p>
                  <p className="text-sm mt-2">Check back soon for gardening tips and stories!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {latestPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default Blog;
