
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { SEO } from '@/components/SEO';

const Calendar = () => {
  return (
    <DashboardLayout>
      <SEO 
        title="Garden Calendar" 
        description="Manage your garden activities and schedule"
      />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Garden Calendar</h1>
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
