
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from '@/components/MainLayout';
import { Book, Database, Wrench } from 'lucide-react';
import { SEO } from '@/components/SEO';

interface ResourceLink {
  id: number;
  title: string;
  url: string;
  description: string;
}

interface ResourceCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  links: ResourceLink[];
}

const categories: ResourceCategory[] = [
  {
    id: 'educational',
    title: 'Educational Resources',
    icon: <Book className="w-6 h-6" />,
    links: [
      {
        id: 1,
        title: 'RHS - Royal Horticultural Society',
        url: 'https://www.rhs.org.uk',
        description: 'Expert gardening advice and educational resources'
      },
      {
        id: 2,
        title: 'Gardener\'s Supply Company - Learning Center',
        url: 'https://www.gardeners.com/how-to',
        description: 'Comprehensive gardening guides and tutorials'
      },
    ]
  },
  {
    id: 'databases',
    title: 'Plant Databases',
    icon: <Database className="w-6 h-6" />,
    links: [
      {
        id: 3,
        title: 'Plants For A Future',
        url: 'https://pfaf.org',
        description: 'Database of edible and useful plants'
      },
      {
        id: 4,
        title: 'Missouri Botanical Garden',
        url: 'https://www.missouribotanicalgarden.org',
        description: 'Extensive plant finder and care guides'
      },
    ]
  },
  {
    id: 'tools',
    title: 'Garden Planning',
    icon: <Wrench className="w-6 h-6" />,
    links: [
      {
        id: 5,
        title: 'Smart Gardener',
        url: 'https://www.smartgardener.com',
        description: 'Garden planning and management tools'
      },
      {
        id: 6,
        title: 'Vegetable Garden Planner',
        url: 'https://gardenplanner.almanac.com',
        description: 'Plan your vegetable garden layout'
      },
    ]
  },
];

const ResourceHero = () => {
  return (
    <div className="relative py-24 bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Greenlink</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
          Discover the best gardening websites, tools, and educational resources
        </p>
      </div>
    </div>
  );
};

const ResourceCard = ({ category }: { category: ResourceCategory }) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          {category.icon}
          <CardTitle>{category.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {category.links.map((link) => (
            <li key={link.id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <h3 className="font-semibold mb-1">{link.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{link.description}</p>
              <a 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                Visit Website →
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const Greenlink = () => {
  return (
    <MainLayout>
      <SEO 
        title="Greenlink | Useful Gardening Resources and Tools"
        description="Discover the best gardening websites, tools, and educational resources for your gardening journey."
      />
      
      <ResourceHero />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <ResourceCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Greenlink;
