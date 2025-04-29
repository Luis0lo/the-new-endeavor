
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useSeedCalendar } from '@/hooks/useSeedCalendar';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const SeedCalendarPage = () => {
  const { seedData, loading, error } = useSeedCalendar();

  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen">
        {/* Page header */}
        <div className="p-4">
          <h1 className="text-3xl font-bold tracking-tight">Seed Calendar</h1>
          <p className="text-muted-foreground">UK Seeding Guide: What to plant and when</p>
        </div>
        
        {/* Calendar content */}
        <div className="p-4 flex-1 overflow-auto">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>UK Vegetable Planting Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="text-center text-destructive py-6">
                  Failed to load seed calendar data
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="font-bold w-[180px]">Vegetable</TableHead>
                        <TableHead className="font-bold">Sow Indoors</TableHead>
                        <TableHead className="font-bold">Sow Outdoors</TableHead>
                        <TableHead className="font-bold">Transplant Outdoors</TableHead>
                        <TableHead className="font-bold">Harvest Period</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {seedData.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">{entry.vegetable}</TableCell>
                          <TableCell>{entry.sow_indoors?.filter(Boolean).join(', ') || '-'}</TableCell>
                          <TableCell>{entry.sow_outdoors?.filter(Boolean).join(', ') || '-'}</TableCell>
                          <TableCell>{entry.transplant_outdoors?.filter(Boolean).join(', ') || '-'}</TableCell>
                          <TableCell>{entry.harvest_period?.filter(Boolean).join(', ') || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SeedCalendarPage;
