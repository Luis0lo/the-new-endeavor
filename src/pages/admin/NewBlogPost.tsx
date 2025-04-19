
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';
import BlogPostForm from '@/components/admin/BlogPostForm';

const NewBlogPost = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (formData: any) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('blog_posts')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post created successfully"
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

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">New Post</h1>
        <BlogPostForm 
          onSubmit={handleSubmit}
          isLoading={saving}
        />
      </div>
    </DashboardLayout>
  );
};

export default NewBlogPost;
