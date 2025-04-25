
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MainLayout from '@/components/MainLayout';
import { Search, Book, Database, Wrench, Video, ShoppingCart, Users } from 'lucide-react';
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

const ResourcesHero = () => {
  return (
    <div className="relative py-24 bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Gardening Resources</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
          Discover the best gardening websites, tools, and educational resources
        </p>
        
        <div className="max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search resources..."
              className="pl-10 pr-4 py-6 rounded-full"
            />
            <Button 
              type="submit" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full px-4"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResourceCard = ({ resource }: { resource: ResourceLink }) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{resource.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{resource.description}</p>
        <Button asChild variant="outline" className="w-full">
          <a href={resource.url} target="_blank" rel="noopener noreferrer">
            Visit Website
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

const GardeningResources = () => {
  return (
    <MainLayout>
      <SEO 
        title="Gardening Resources | Useful Links and Tools"
        description="Discover the best gardening websites, tools, and educational resources for your gardening journey."
      />
      
      <ResourcesHero />
      
      <div className="container mx-auto px-4 py-12">
        {categories.map((category) => (
          <div key={category.id} className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              {category.icon}
              <h2 className="text-2xl font-bold">{category.title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.links.map((link) => (
                <ResourceCard key={link.id} resource={link} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
};

export default GardeningResources;
