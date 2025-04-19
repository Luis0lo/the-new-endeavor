
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface BlogPostFormData {
  title: string;
  content: string;
  meta_title: string;
  meta_description: string;
  canonical_url?: string;
  published: boolean;
}

interface BlogPostFormProps {
  onSubmit: (data: BlogPostFormData) => void;
  initialData?: Partial<BlogPostFormData>;
  isLoading?: boolean;
}

const BlogPostForm = ({ onSubmit, initialData, isLoading }: BlogPostFormProps) => {
  const { register, handleSubmit, watch } = useForm<BlogPostFormData>({
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      meta_title: initialData?.meta_title || '',
      meta_description: initialData?.meta_description || '',
      canonical_url: initialData?.canonical_url || '',
      published: initialData?.published || false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register('title')} required />
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea 
            id="content" 
            {...register('content')} 
            required 
            className="min-h-[200px]"
          />
        </div>

        <div>
          <Label htmlFor="meta_title">Meta Title (SEO)</Label>
          <Input id="meta_title" {...register('meta_title')} />
        </div>

        <div>
          <Label htmlFor="meta_description">Meta Description (SEO)</Label>
          <Textarea id="meta_description" {...register('meta_description')} />
        </div>

        <div>
          <Label htmlFor="canonical_url">Canonical URL (Optional)</Label>
          <Input id="canonical_url" {...register('canonical_url')} />
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="published" {...register('published')} />
          <Label htmlFor="published">Published</Label>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Post'}
      </Button>
    </form>
  );
};

export default BlogPostForm;
