
import React, { useEffect, useState } from 'react';
import { generateSitemapXml } from '@/utils/sitemap-generator';

const Sitemap = () => {
  const [sitemapContent, setSitemapContent] = useState<string>('');
  
  useEffect(() => {
    const fetchSitemap = async () => {
      // Get the base URL from the browser
      const baseUrl = window.location.origin;
      const xml = await generateSitemapXml(baseUrl);
      setSitemapContent(xml);
    };
    
    fetchSitemap();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Sitemap</h1>
      <p className="mb-4">This is the sitemap for our website. You can also view the <a href="/sitemap.xml" className="text-primary hover:underline">XML version</a>.</p>
      
      <div className="bg-muted p-4 rounded-md overflow-x-auto">
        <pre className="text-sm">{sitemapContent}</pre>
      </div>
    </div>
  );
};

export default Sitemap;
