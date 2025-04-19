
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { SEO } from '@/components/SEO';

const Companions = () => {
  return (
    <DashboardLayout>
      <SEO 
        title="Companion Plants" 
        description="Discover compatible plants for your garden"
      />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Companion Plants</h1>
      </div>
    </DashboardLayout>
  );
};

export default Companions;
