
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Sprout, Wrench, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';

const InventoryGuide = () => {
  return (
    <MainLayout>
      <SEO 
        title="Inventory Guide - 2day garden"
        description="Learn how to use our inventory system to organize and track your seeds, plants, and gardening tools."
        canonicalUrl={`${window.location.origin}/inventory-guide`}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Inventory Guide</h1>
          <p className="text-xl text-muted-foreground">
            Keep track of all your gardening supplies with our comprehensive inventory system
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <div className="rounded-full bg-primary/10 p-2 w-fit">
                <Sprout className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Seeds & Plants</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track your seed collection with expiration dates, varieties, and planting notes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="rounded-full bg-primary/10 p-2 w-fit">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Tools & Equipment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Organize your gardening tools with condition tracking and maintenance schedules.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="rounded-full bg-primary/10 p-2 w-fit">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Custom Organization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create custom shelves and categories to organize your inventory your way.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              Our inventory system helps you stay organized and never run out of supplies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h4 className="font-semibold">Create Shelves</h4>
                <p className="text-muted-foreground">Organize your inventory with different shelf types for seeds, plants, and tools.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h4 className="font-semibold">Add Items</h4>
                <p className="text-muted-foreground">Track quantities, brands, purchase dates, and expiration dates for all your items.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h4 className="font-semibold">Use in Activities</h4>
                <p className="text-muted-foreground">Link inventory items to garden activities to track usage and plan purchases.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link to="/auth">
            <Button size="lg" className="gap-2">
              Start Using Inventory
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default InventoryGuide;
