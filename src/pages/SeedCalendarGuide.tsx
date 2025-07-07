
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Sprout, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';

const SeedCalendarGuide = () => {
  return (
    <MainLayout>
      <SEO 
        title="Seed Calendar Guide - 2day garden"
        description="Learn how to use our seed calendar to plan your vegetable garden perfectly. Know when to sow, transplant, and harvest."
        canonicalUrl={`${window.location.origin}/seed-calendar-guide`}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Seed Calendar Guide</h1>
          <p className="text-xl text-muted-foreground">
            Master the timing of your vegetable garden with our comprehensive seed calendar
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <div className="rounded-full bg-primary/10 p-2 w-fit">
                <Sprout className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Sowing Times</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Know exactly when to start your seeds indoors or sow them directly outdoors for optimal growth.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="rounded-full bg-primary/10 p-2 w-fit">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Transplant Timing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get reminders for when to move your seedlings from indoors to your garden beds.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="rounded-full bg-primary/10 p-2 w-fit">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Harvest Windows</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track when your vegetables will be ready for harvest to plan your meals accordingly.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              Our seed calendar is designed to take the guesswork out of vegetable gardening
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h4 className="font-semibold">Browse Vegetables</h4>
                <p className="text-muted-foreground">Choose from our extensive database of vegetables with UK-specific timing data.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h4 className="font-semibold">Add to Your Calendar</h4>
                <p className="text-muted-foreground">Add vegetables to your personal seed calendar with customized timing.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h4 className="font-semibold">Get Reminders</h4>
                <p className="text-muted-foreground">Receive timely reminders for sowing, transplanting, and harvesting.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link to="/auth">
            <Button size="lg" className="gap-2">
              Start Using Seed Calendar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default SeedCalendarGuide;
