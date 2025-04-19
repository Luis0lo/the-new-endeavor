
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { SEO } from '@/components/SEO';

const Inventory = () => {
  return (
    <DashboardLayout>
      <SEO 
        title="Garden Inventory" 
        description="Manage your gardening tools, seeds, and supplies"
      />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Garden Inventory</h1>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
