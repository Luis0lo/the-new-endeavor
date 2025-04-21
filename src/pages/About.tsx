
import React from 'react';
import MainLayout from '@/components/MainLayout';
import { AboutComponent } from '@/components/About';
import { SEO } from '@/components/SEO';

const About = () => {
  return (
    <MainLayout>
      <SEO 
        title="About 2day garden - Our Garden Journey" 
        description="Learn about 2day garden, a personal garden planning tool born from a passion for growing food and maximizing harvests"
      />
      <AboutComponent />
    </MainLayout>
  );
};

export default About;
