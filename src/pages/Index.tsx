
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/MainLayout';
import { Calendar, Package, ArrowRight, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { SEO } from '@/components/SEO';

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
      <SEO 
        title="2day garden - Track Your Plants and Plan Your Garden"
        description="Track your plants, plan your garden activities, and learn from our community. Get started with 2day garden for free today."
        canonicalUrl={`${window.location.origin}/`}
        ogImage="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=800&auto=format&fit=crop"
      />
      
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

      {/* Beta Disclaimer Section */}
      <section className="bg-amber-50 border-y border-amber-200 py-6">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-center gap-3 text-center">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div className="text-amber-800">
              <span className="font-semibold">Beta Version:</span> This is a development version intended for building and testing the final product. Features may be incomplete or subject to change.
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
            <div className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-6">
              <div className="rounded-full border bg-background p-3">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Seed Calendar</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Plan when to sow, transplant, and harvest your vegetables with our comprehensive seed calendar.
              </p>
              <Link to="/seed-calendar-guide">
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </Link>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-6">
              <div className="rounded-full border bg-background p-3">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Garden Calendar</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Plan your garden activities with our smart calendar and get reminders.
              </p>
              <Link to="/garden-calendar-guide">
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </Link>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border bg-background p-6">
              <div className="rounded-full border bg-background p-3">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Inventory</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">
                Keep track of your seeds, plants, and gardening tools with our inventory management system.
              </p>
              <Link to="/inventory-guide">
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </Link>
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
    </MainLayout>
  );
};

export default Index;
