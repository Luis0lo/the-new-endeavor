
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MainLayout from '@/components/MainLayout';
import { Book, Database, Wrench, GraduationCap, Globe, Sprout, Cloud, Camera } from 'lucide-react';
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
      {
        id: 101,
        title: 'Gardening Know How',
        url: 'https://www.gardeningknowhow.com',
        description: 'Articles and resources covering all aspects of gardening'
      },
      {
        id: 102,
        title: 'University Extension Services',
        url: 'https://extension.org',
        description: 'Research-based gardening advice from universities'
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
      {
        id: 103,
        title: 'USDA Plants Database',
        url: 'https://plants.usda.gov',
        description: 'Comprehensive database of US native plants'
      },
      {
        id: 104,
        title: 'Kew Gardens Plant Finder',
        url: 'https://www.kew.org/plants',
        description: 'Botanical information from the Royal Botanic Gardens'
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
      {
        id: 105,
        title: 'GrowVeg',
        url: 'https://www.growveg.com',
        description: 'Interactive garden planning tools with companion planting advice'
      },
      {
        id: 106,
        title: 'Garden Design App',
        url: 'https://www.gardena.com/int/garden-life/garden-planner',
        description: 'Design your garden layout with detailed measurements'
      },
    ]
  },
  {
    id: 'courses',
    title: 'Online Courses',
    icon: <GraduationCap className="w-6 h-6" />,
    links: [
      {
        id: 107,
        title: 'Organic Gardening Course',
        url: 'https://www.permaculturenews.org/courses',
        description: 'Learn organic and permaculture gardening techniques'
      },
      {
        id: 108,
        title: 'Master Gardener Online',
        url: 'https://mastergardener.extension.org',
        description: 'Extension service master gardener training'
      },
      {
        id: 109,
        title: 'Garden Fundamentals',
        url: 'https://extension.oregonstate.edu/gardening-courses',
        description: 'Fundamentals of gardening from Oregon State University'
      },
      {
        id: 110,
        title: 'Udemy Gardening Courses',
        url: 'https://www.udemy.com/topic/gardening',
        description: 'Various online gardening courses for beginners to experts'
      },
    ]
  },
  {
    id: 'communities',
    title: 'Gardening Communities',
    icon: <Globe className="w-6 h-6" />,
    links: [
      {
        id: 111,
        title: 'Garden.org Forums',
        url: 'https://garden.org/forums',
        description: 'Active forums for gardeners of all experience levels'
      },
      {
        id: 112,
        title: 'Reddit Gardening',
        url: 'https://www.reddit.com/r/gardening',
        description: 'Large community of gardeners sharing advice and photos'
      },
      {
        id: 113,
        title: 'GardenWeb by Houzz',
        url: 'https://www.houzz.com/discussions/gardening',
        description: 'Long-running gardening discussion community'
      },
      {
        id: 114,
        title: 'Dave\'s Garden',
        url: 'https://davesgarden.com',
        description: 'Plant database and gardening community with reviews'
      },
    ]
  },
  {
    id: 'sustainability',
    title: 'Sustainable Gardening',
    icon: <Sprout className="w-6 h-6" />,
    links: [
      {
        id: 115,
        title: 'Permaculture Research Institute',
        url: 'https://www.permaculturenews.org',
        description: 'Resources for permaculture and sustainable gardening'
      },
      {
        id: 116,
        title: 'Wildlife Gardening Forum',
        url: 'https://www.wildlifegardening.org',
        description: 'Creating gardens that support local wildlife'
      },
      {
        id: 117,
        title: 'Soil Association',
        url: 'https://www.soilassociation.org',
        description: 'Organic gardening and farming principles'
      },
      {
        id: 118,
        title: 'Composting Guide',
        url: 'https://www.compostguide.com',
        description: 'Everything you need to know about composting'
      },
    ]
  },
  {
    id: 'weather',
    title: 'Weather Resources',
    icon: <Cloud className="w-6 h-6" />,
    links: [
      {
        id: 119,
        title: 'Farmers\' Almanac',
        url: 'https://www.farmersalmanac.com',
        description: 'Weather forecasts and gardening by the moon calendar'
      },
      {
        id: 120,
        title: 'Weather Underground Garden',
        url: 'https://www.wunderground.com/garden',
        description: 'Local weather forecasts specific to gardening needs'
      },
      {
        id: 121,
        title: 'Frost Dates Calculator',
        url: 'https://www.almanac.com/gardening/frostdates',
        description: 'Calculate first and last frost dates for your location'
      },
      {
        id: 122,
        title: 'Growing Degree Days Calculator',
        url: 'https://www.greencastonline.com/tools/gdd-model',
        description: 'Track plant development based on heat accumulation'
      },
    ]
  },
  {
    id: 'inspiration',
    title: 'Garden Inspiration',
    icon: <Camera className="w-6 h-6" />,
    links: [
      {
        id: 123,
        title: 'Pinterest Garden Boards',
        url: 'https://www.pinterest.com/categories/gardening',
        description: 'Visual inspiration for garden designs and projects'
      },
      {
        id: 124,
        title: 'Garden Design Magazine',
        url: 'https://www.gardendesign.com',
        description: 'Professional garden design inspiration and advice'
      },
      {
        id: 125,
        title: 'Gardeners\' World',
        url: 'https://www.gardenersworld.com',
        description: 'Ideas from the popular gardening TV show and magazine'
      },
      {
        id: 126,
        title: 'Fine Gardening',
        url: 'https://www.finegardening.com',
        description: 'Garden design ideas and expert plant combinations'
      },
    ]
  },
];

const ResourceHero = () => {
  return (
    <div className="relative py-16 md:py-24 bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Greenlink</h1>
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
