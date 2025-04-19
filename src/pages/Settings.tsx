
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { SEO } from '@/components/SEO';

const Settings = () => {
  return (
    <DashboardLayout>
      <SEO 
        title="Account Settings" 
        description="Manage your 2day Garden account settings"
      />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Account Settings</h1>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
