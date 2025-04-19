
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

interface BlogPost {
  id: string;
  title: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const BlogPostsAdmin = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post deleted successfully"
      });

      setPosts(posts.filter(post => post.id !== id));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <Button onClick={() => navigate('/admin/posts/new')}>
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid gap-4">
            {posts.map(post => (
              <div
                key={post.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h2 className="font-semibold">{post.title}</h2>
                  <p className="text-sm text-gray-500">
                    {format(new Date(post.created_at), 'MMM d, yyyy')}
                    {post.published ? ' • Published' : ' • Draft'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/admin/posts/${post.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BlogPostsAdmin;
