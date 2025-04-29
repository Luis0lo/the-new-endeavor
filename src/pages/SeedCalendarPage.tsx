
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';

const SeedCalendarPage = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen">
        {/* Page header */}
        <div className="p-4">
          <h1 className="text-3xl font-bold tracking-tight">Seed Calendar</h1>
          <p className="text-muted-foreground">UK Seeding Guide: What to plant and when</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SeedCalendarPage;
