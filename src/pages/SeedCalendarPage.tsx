
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useSeedCalendar } from '@/hooks/useSeedCalendar';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Legend items with their colors
const legendItems = [
  { label: 'Sow Indoors', color: '#8B5CF6' }, // Purple
  { label: 'Sow Outdoors', color: '#FBBF24' }, // Yellow
  { label: 'Plant Outdoors', color: '#10B981' }, // Green
  { label: 'Harvest', color: '#EF4444' }, // Red
];

const SeedCalendarPage = () => {
  const { seedData, loading, error } = useSeedCalendar();

  // Helper function to determine which months are included in a period
  const getMonthsInPeriod = (period: string): number[] => {
    const monthIndices: number[] = [];
    
    // Skip empty periods
    if (!period || period === '-') return monthIndices;
    
    // Extract month ranges like "Jan-Mar" or "Apr"
    const pattern = /([A-Za-z]{3})-?([A-Za-z]{3})?/g;
    let match;
    
    while ((match = pattern.exec(period)) !== null) {
      const startMonth = months.findIndex(m => m.toLowerCase() === match[1].toLowerCase());
      const endMonth = match[2] 
        ? months.findIndex(m => m.toLowerCase() === match[2].toLowerCase()) 
        : startMonth;
      
      // Handle case where period crosses year boundary (e.g., Nov-Feb)
      if (startMonth > endMonth) {
        // Add months from start to December
        for (let i = startMonth; i < 12; i++) {
          monthIndices.push(i);
        }
        // Add months from January to end
        for (let i = 0; i <= endMonth; i++) {
          monthIndices.push(i);
        }
      } else {
        // Regular case
        for (let i = startMonth; i <= endMonth; i++) {
          monthIndices.push(i);
        }
      }
    }
    
    return monthIndices;
  };

  // Helper function to check if a month is in period array
  const isMonthInPeriods = (periods: string[], monthIndex: number): boolean => {
    if (!periods || !periods.length) return false;
    
    return periods.some(period => {
      const monthsInPeriod = getMonthsInPeriod(period);
      return monthsInPeriod.includes(monthIndex);
    });
  };

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
          <Card className="p-4">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center text-destructive py-6">
                Failed to load seed calendar data
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                {/* Legend */}
                <div className="flex flex-wrap gap-4 mb-2">
                  {legendItems.map((item, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-4 h-4 mr-2" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>
                
                <ScrollArea className="h-[calc(100vh-220px)]">
                  <div className="overflow-x-auto w-full">
                    <Table>
                      <TableHeader className="sticky top-0 z-10 bg-muted/50">
                        <TableRow>
                          <TableHead className="whitespace-nowrap font-medium">Vegetable</TableHead>
                          {months.map((month) => (
                            <TableHead key={month} className="text-center w-20">
                              {month}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {seedData.map((entry, idx) => (
                          <TableRow key={entry.id} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/10'}>
                            <TableCell className="font-medium whitespace-nowrap">
                              {entry.vegetable}
                            </TableCell>
                            {months.map((_, monthIdx) => (
                              <TableCell key={monthIdx} className="p-0 h-12 relative">
                                <div className="flex flex-col h-full">
                                  {/* Using absolute positioning to create straight horizontal lines */}
                                  {/* Sow Indoors */}
                                  {isMonthInPeriods(entry.sow_indoors, monthIdx) && (
                                    <div 
                                      className="absolute top-0 left-0 right-0 h-3" 
                                      style={{ backgroundColor: legendItems[0].color }}
                                    ></div>
                                  )}
                                  
                                  {/* Sow Outdoors */}
                                  {isMonthInPeriods(entry.sow_outdoors, monthIdx) && (
                                    <div 
                                      className="absolute top-3 left-0 right-0 h-3" 
                                      style={{ backgroundColor: legendItems[1].color }}
                                    ></div>
                                  )}
                                  
                                  {/* Transplant/Plant Outdoors */}
                                  {isMonthInPeriods(entry.transplant_outdoors, monthIdx) && (
                                    <div 
                                      className="absolute top-6 left-0 right-0 h-3" 
                                      style={{ backgroundColor: legendItems[2].color }}
                                    ></div>
                                  )}
                                  
                                  {/* Harvest Period */}
                                  {isMonthInPeriods(entry.harvest_period, monthIdx) && (
                                    <div 
                                      className="absolute top-9 left-0 right-0 h-3" 
                                      style={{ backgroundColor: legendItems[3].color }}
                                    ></div>
                                  )}
                                </div>
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SeedCalendarPage;
