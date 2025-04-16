
import { supabase } from '@/integrations/supabase/client';

interface SitemapData {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export const generateSitemapXml = async (baseUrl: string): Promise<string> => {
  // Fetch all published blog posts
  const { data: blogPosts, error } = await supabase
    .from('blog_posts')
    .select('slug, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts for sitemap:', error);
    return '';
  }

  // Create sitemap entries for static pages
  const staticPages: SitemapData[] = [
    {
      loc: `${baseUrl}/`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/blog`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: 0.8
    }
  ];

  // Create sitemap entries for blog posts
  const blogEntries: SitemapData[] = blogPosts.map(post => ({
    loc: `${baseUrl}/blog/${post.slug}`,
    lastmod: post.published_at 
      ? new Date(post.published_at).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0],
    changefreq: 'yearly',
    priority: 0.7
  }));

  // Combine all entries
  const allEntries = [...staticPages, ...blogEntries];

  // Generate the XML
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries.map(entry => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xmlContent;
};
