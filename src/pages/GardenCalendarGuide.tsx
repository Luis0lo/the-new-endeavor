
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckSquare, Bell, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SEO } from '@/components/SEO';

const GardenCalendarGuide = () => {
  return (
    <MainLayout>
      <SEO 
        title="Garden Calendar Guide - 2day garden"
        description="Learn how to use our garden calendar to plan and track all your gardening activities with smart reminders."
        canonicalUrl={`${window.location.origin}/garden-calendar-guide`}
      />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Garden Calendar Guide</h1>
          <p className="text-xl text-muted-foreground">
            Organize and track all your gardening activities with our smart calendar system
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <div className="rounded-full bg-primary/10 p-2 w-fit">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Activity Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Schedule all your gardening tasks from watering to fertilizing with detailed planning tools.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="rounded-full bg-primary/10 p-2 w-fit">
                <CheckSquare className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Task Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Mark activities as complete and track your progress with detailed logs and outcomes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="rounded-full bg-primary/10 p-2 w-fit">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Smart Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Never miss important garden tasks with intelligent reminders based on your schedule.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              Our garden calendar helps you stay organized and productive in your garden
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h4 className="font-semibold">Create Activities</h4>
                <p className="text-muted-foreground">Add garden tasks with dates, priorities, and detailed descriptions.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h4 className="font-semibold">View Multiple Layouts</h4>
                <p className="text-muted-foreground">Switch between day, week, month, and year views to see your activities at different scales.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="rounded-full bg-primary text-primary-foreground w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h4 className="font-semibold">Track Progress</h4>
                <p className="text-muted-foreground">Log outcomes, rate success, and build a history of your gardening journey.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link to="/auth">
            <Button size="lg" className="gap-2">
              Start Using Garden Calendar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default GardenCalendarGuide;
