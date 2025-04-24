
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Trash2, Edit } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  status: 'draft' | 'published';
}

const AdminDashboard = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();

  // Check admin authentication
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('admin_logged_in');
    if (!adminLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Fetch blog posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_blog_posts')
          .select('id, title, status');

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch blog posts',
          variant: 'destructive'
        });
      }
    };

    fetchPosts();
  }, []);

  // Toggle post status
  const togglePostStatus = async (postId: string, currentStatus: 'draft' | 'published') => {
    try {
      const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
      const { error } = await supabase
        .from('admin_blog_posts')
        .update({ status: newStatus })
        .eq('id', postId);

      if (error) throw error;

      // Update local state
      setPosts(posts.map(post => 
        post.id === postId ? { ...post, status: newStatus } : post
      ));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update post status',
        variant: 'destructive'
      });
    }
  };

  // Delete post
  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('admin_blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      // Remove from local state
      setPosts(posts.filter(post => post.id !== postId));
      toast({
        title: 'Success',
        description: 'Post deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive'
      });
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    navigate('/admin/login');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <div className="space-x-4">
          <Link to="/admin/create-post">
            <Button>Create New Post</Button>
          </Link>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.title}</TableCell>
              <TableCell>
                <Switch
                  checked={post.status === 'published'}
                  onCheckedChange={() => togglePostStatus(post.id, post.status)}
                />
                <span className="ml-2">
                  {post.status === 'draft' ? 'Draft' : 'Published'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Link to={`/admin/edit-post/${post.id}`}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deletePost(post.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminDashboard;
