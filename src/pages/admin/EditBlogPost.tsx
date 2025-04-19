
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import BlogPostForm from '@/components/admin/BlogPostForm';

const EditBlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setPost(data);
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

    fetchPost();
  }, [id]);

  const handleSubmit = async (formData: any) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update(formData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post updated successfully"
      });
      
      navigate('/admin/posts');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
        <BlogPostForm 
          onSubmit={handleSubmit}
          initialData={post}
          isLoading={saving}
        />
      </div>
    </DashboardLayout>
  );
};

export default EditBlogPost;
