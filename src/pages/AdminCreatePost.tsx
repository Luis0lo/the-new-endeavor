
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { X, ImagePlus } from 'lucide-react';

interface BlogPost {
  id?: string;
  title: string;
  content: string;
  header_image_id?: string | null;
  seo_keywords?: string[];
  status: 'draft' | 'published';
}

const AdminCreatePost = () => {
  const [post, setPost] = useState<BlogPost>({
    title: '',
    content: '',
    status: 'draft',
    header_image_id: null,
  });
  const [headerImage, setHeaderImage] = useState<File | null>(null);
  const [keywords, setKeywords] = useState('');
  const navigate = useNavigate();
  const { postId } = useParams();
  const isEditing = !!postId;

  // Check admin authentication
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('admin_logged_in');
    if (!adminLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Fetch post for editing
  useEffect(() => {
    if (isEditing) {
      const fetchPost = async () => {
        try {
          const { data, error } = await supabase
            .from('admin_blog_posts')
            .select('*')
            .eq('id', postId)
            .single();

          if (error) throw error;

          setPost({
            id: data.id,
            title: data.title,
            content: data.content,
            status: data.status,
            header_image_id: data.header_image_id,
          });
          setKeywords(data.seo_keywords?.join(', ') || '');
        } catch (error) {
          toast({
            title: 'Error',
            description: 'Failed to fetch post',
            variant: 'destructive'
          });
        }
      };

      fetchPost();
    }
  }, [postId, isEditing]);

  const handleImageUpload = async (file: File) => {
    try {
      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('blog_images')
        .upload(`header_images/${Date.now()}_${file.name}`, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('blog_images')
        .getPublicUrl(uploadData.path);

      // Save image metadata to blog_images table
      const { data: imageData, error: imageError } = await supabase
        .from('blog_images')
        .insert({
          name: file.name,
          url: urlData.publicUrl,
          alt_text: post.title
        })
        .select('id')
        .single();

      if (imageError) throw imageError;

      // Update post state with image ID
      setPost(prev => ({
        ...prev,
        header_image_id: imageData.id
      }));

      return imageData.id;
    } catch (error) {
      toast({
        title: 'Image Upload Failed',
        description: 'Could not upload header image',
        variant: 'destructive'
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!post.title || !post.content) {
      toast({
        title: 'Validation Error',
        description: 'Title and content are required',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Upload header image if selected
      if (headerImage) {
        const imageId = await handleImageUpload(headerImage);
        if (imageId) {
          setPost(prev => ({ ...prev, header_image_id: imageId }));
        }
      }

      // Prepare keywords
      const keywordArray = keywords.split(',')
        .map(k => k.trim())
        .filter(k => k);

      const postData = {
        ...post,
        seo_keywords: keywordArray
      };

      // Insert or update post
      if (isEditing) {
        const { error } = await supabase
          .from('admin_blog_posts')
          .update(postData)
          .eq('id', postId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('admin_blog_posts')
          .insert(postData);

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: isEditing ? 'Post updated' : 'Post created',
      });

      navigate('/admin/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save post',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? 'Edit Blog Post' : 'Create Blog Post'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label>Title</Label>
          <Input
            value={post.title}
            onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter blog post title"
            required
          />
        </div>

        <div>
          <Label>Content</Label>
          <Textarea
            value={post.content}
            onChange={(e) => setPost(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Write your blog post content here"
            className="min-h-[300px]"
            required
          />
        </div>

        <div>
          <Label>Header Image</Label>
          <div className="flex items-center space-x-4">
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setHeaderImage(file);
              }} 
              className="hidden" 
              id="header-image-upload" 
            />
            <label 
              htmlFor="header-image-upload" 
              className="flex items-center space-x-2 cursor-pointer bg-secondary p-2 rounded"
            >
              <ImagePlus className="h-5 w-5" />
              <span>Upload Image</span>
            </label>
            {headerImage && (
              <div className="flex items-center space-x-2">
                <span>{headerImage.name}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setHeaderImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div>
          <Label>SEO Keywords (comma-separated)</Label>
          <Input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Enter SEO keywords"
          />
        </div>

        <div className="flex items-center space-x-4">
          <Label>Status</Label>
          <Button 
            type="button"
            variant={post.status === 'draft' ? 'default' : 'outline'}
            onClick={() => setPost(prev => ({ ...prev, status: 'draft' }))}
          >
            Draft
          </Button>
          <Button 
            type="button"
            variant={post.status === 'published' ? 'default' : 'outline'}
            onClick={() => setPost(prev => ({ ...prev, status: 'published' }))}
          >
            Publish
          </Button>
        </div>

        <Button type="submit" className="w-full">
          {isEditing ? 'Update Post' : 'Create Post'}
        </Button>
      </form>
    </div>
  );
};

export default AdminCreatePost;
