
import React, { useEffect, useState } from 'react';
import { generateSitemapXml } from '@/utils/sitemap-generator';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const Sitemap = () => {
  const [sitemapContent, setSitemapContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        setLoading(true);
        // Get the base URL from the browser
        const baseUrl = window.location.origin;
        const xml = await generateSitemapXml(baseUrl);
        setSitemapContent(xml);
      } catch (error) {
        console.error('Error generating sitemap:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSitemap();
  }, []);

  const downloadSitemap = () => {
    const blob = new Blob([sitemapContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Format XML for visual display (escaping special characters)
  const formatXmlForDisplay = (xml: string) => {
    if (!xml) return '';
    return xml
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <SEO 
        title="Sitemap - GardenApp"
        description="Complete sitemap of GardenApp - Find all pages and resources on our website"
        canonicalUrl={`${window.location.origin}/sitemap`}
      />
      
      <h1 className="text-2xl font-bold mb-4">Sitemap</h1>
      <p className="mb-4">This is the sitemap for our website. You can also view the <a href="/sitemap.xml" className="text-primary hover:underline">XML version</a>.</p>
      
      <div className="flex justify-end mb-4">
        <Button onClick={downloadSitemap} className="flex items-center gap-2">
          <Download size={16} />
          Download XML
        </Button>
      </div>
      
      <div className="bg-muted p-4 rounded-md overflow-x-auto">
        {loading ? (
          <p>Loading sitemap...</p>
        ) : (
          <pre 
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: formatXmlForDisplay(sitemapContent) }}
          />
        )}
      </div>
    </div>
  );
};

export default Sitemap;
