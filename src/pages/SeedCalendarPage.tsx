
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { format } from 'date-fns';
import { Calendar, List, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMonthEvents, ukPlantingCalendar } from '@/data/uk-seeding-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import YearlyCalendarView from '@/components/garden/YearlyCalendarView';

type ViewType = 'table' | 'list' | 'year';

const SeedCalendarPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<ViewType>('year');

  // Get events for the current month
  const events = getMonthEvents(date);

  const currentMonth = format(date, 'MMMM');
  const currentYear = format(date, 'yyyy');

  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen">
        {/* Page header */}
        <div className="p-4">
          <h1 className="text-3xl font-bold tracking-tight">Seed Calendar</h1>
          <p className="text-muted-foreground">UK Seeding Guide: What to plant and when</p>
        </div>
        
        {/* Toolbar */}
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-semibold">
            {viewType === 'year' ? 'Annual Planting Guide' : `${currentMonth} ${currentYear} - Planting Guide`}
          </h2>
          <div className="flex space-x-2">
            <Button 
              variant={viewType === 'table' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setViewType('table')}
            >
              <Table className="h-4 w-4 mr-2" />
              Table
            </Button>
            <Button 
              variant={viewType === 'list' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setViewType('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List
            </Button>
            <Button 
              variant={viewType === 'year' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setViewType('year')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Year
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 flex-1 overflow-auto">
          {viewType === 'table' && (
            <Card>
              <CardHeader>
                <CardTitle>What to Plant in {currentMonth}</CardTitle>
              </CardHeader>
              <CardContent>
                <TableComponent>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plant Name</TableHead>
                      <TableHead>Planting Method</TableHead>
                      <TableHead>Season</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell className="capitalize">{event.type}</TableCell>
                        <TableCell>{`${format(new Date(2023, event.startMonth), 'MMMM')} - ${format(new Date(2023, event.endMonth), 'MMMM')}`}</TableCell>
                      </TableRow>
                    ))}
                    {events.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          No plants to sow in {currentMonth}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </TableComponent>
              </CardContent>
            </Card>
          )}
          
          {viewType === 'list' && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{event.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p><span className="font-medium">Method:</span> <span className="capitalize">{event.type}</span></p>
                    <p><span className="font-medium">Planting period:</span> {format(new Date(2023, event.startMonth), 'MMMM')} - {format(new Date(2023, event.endMonth), 'MMMM')}</p>
                  </CardContent>
                </Card>
              ))}
              {events.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="p-6 text-center">
                    <p>No plants to sow in {currentMonth}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {viewType === 'year' && (
            <YearlyCalendarView plants={ukPlantingCalendar} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SeedCalendarPage;
