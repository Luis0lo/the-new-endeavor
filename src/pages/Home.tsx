
import React from 'react';
import { SEO } from '@/components/SEO';

const Home = () => {
  return (
    <div>
      <SEO 
        title="2day Garden" 
        description="Welcome to 2day Garden, your companion for gardening and plant care"
      />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Welcome to 2day Garden</h1>
      </div>
    </div>
  );
};

export default Home;
