import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/MainLayout';
import { Flower2, Calendar, Book, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <MainLayout>
      <Helmet prioritizeSeoTags>
        <title>GardenApp - Track Your Plants and Plan Your Garden</title>
        <meta name="description" content="Track your plants, plan your garden activities, and learn from our community. Get started with GardenApp for free today." />
        <link rel="canonical" href={`${window.location.origin}/`} />
        <meta property="og:title" content="GardenApp - Track Your Plants and Plan Your Garden" />
        <meta property="og:description" content="Track your plants, plan your garden activities, and learn from our community. Get started with GardenApp for free today." />
        <meta property="og:url" content={`${window.location.origin}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=800&auto=format&fit=crop" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="GardenApp - Track Your Plants and Plan Your Garden" />
        <meta name="twitter:description" content="Track your plants, plan your garden activities, and learn from our community. Get started with GardenApp for free today." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=800&auto=format&fit=crop" />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Grow Your Perfect Garden with Our App
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Track your plants, plan your garden activities, and learn from our community. Get started for free today.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/auth">
                  <Button size="lg" className="gap-2">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/blog">
                  <Button variant="outline" size="lg">
                    Read Our Blog
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=800&auto=format&fit=crop"
                alt="Garden"
                className="rounded-xl object-cover aspect-square sm:aspect-video lg:aspect-square"
                style={{ objectFit: 'cover', maxHeight: '500px', width: '100%' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Everything You Need to Grow</h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                Our app provides all the tools you need to plan, track, and grow your perfect garden.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6">
              <div className="rounded-full border bg-background p-3">
                <Flower2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Plant Database</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Explore our extensive database of plants with growing tips and care instructions.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6">
              <div className="rounded-full border bg-background p-3">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Garden Calendar</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Plan your garden activities with our smart calendar and get reminders.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6">
              <div className="rounded-full border bg-background p-3">
                <Book className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Gardening Blog</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Learn from our community of garden experts with regular articles and tips.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Only shown if user is not logged in */}
      {!user && (
        <section className="bg-gradient-to-br from-primary/80 to-primary py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center text-primary-foreground">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Dig into a smarter way to garden</h2>
                <p className="max-w-[700px] text-primary-foreground/90 md:text-xl/relaxed">
                  Join our community of garden enthusiasts today and transform your gardening experience.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to="/auth">
                  <Button size="lg" variant="secondary">
                    Sign Up Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Preview Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Latest from Our Blog</h2>
              <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                Discover gardening tips, plant care guides, and seasonal advice from our experts.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
            {/* Blog Card 1 */}
            <Link to="/blog" className="group rounded-lg border bg-background p-4 transition-colors hover:border-primary">
              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1599685315640-8e2a53210971?q=80&w=400&auto=format&fit=crop"
                  alt="Vegetables"
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="pt-4">
                <h3 className="font-bold">Growing Vegetables for Beginners</h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  Learn how to start your own vegetable garden with these simple tips.
                </p>
              </div>
            </Link>
            
            {/* Blog Card 2 */}
            <Link to="/blog" className="group rounded-lg border bg-background p-4 transition-colors hover:border-primary">
              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1635314924426-6a0358bd0bbd?q=80&w=400&auto=format&fit=crop"
                  alt="Herb Garden"
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="pt-4">
                <h3 className="font-bold">Creating an Indoor Herb Garden</h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  Fresh herbs year-round: How to create and maintain your indoor herb garden.
                </p>
              </div>
            </Link>
            
            {/* Blog Card 3 */}
            <Link to="/blog" className="group rounded-lg border bg-background p-4 transition-colors hover:border-primary">
              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1603436326446-74f0ea425d34?q=80&w=400&auto=format&fit=crop"
                  alt="Seasonal Flowers"
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="pt-4">
                <h3 className="font-bold">Best Seasonal Flowers for Your Region</h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  Discover which flowers thrive in your climate during each season of the year.
                </p>
              </div>
            </Link>
          </div>
          <div className="flex justify-center">
            <Link to="/blog">
              <Button variant="outline">View All Articles</Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
