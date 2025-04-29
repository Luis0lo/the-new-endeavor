
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
  TableRow 
} from '@/components/ui/table';

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
                    <Table className="min-w-full">
                      <TableHeader className="sticky top-0 z-10">
                        <TableRow>
                          <TableHead className="bg-muted/50 border border-border whitespace-nowrap">Vegetable</TableHead>
                          {months.map((month) => (
                            <TableHead 
                              key={month} 
                              className="bg-muted/50 border border-border p-2 text-center w-20"
                            >
                              {month}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {seedData.map((entry, idx) => (
                          <TableRow key={entry.id} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/10'}>
                            <TableCell className="border border-border p-2 font-medium whitespace-nowrap">
                              {entry.vegetable}
                            </TableCell>
                            {months.map((_, monthIdx) => {
                              // Calculate which activities happen in this month
                              const hasIndoors = isMonthInPeriods(entry.sow_indoors, monthIdx);
                              const hasOutdoors = isMonthInPeriods(entry.sow_outdoors, monthIdx);
                              const hasTransplant = isMonthInPeriods(entry.transplant_outdoors, monthIdx);
                              const hasHarvest = isMonthInPeriods(entry.harvest_period, monthIdx);
                              
                              // Calculate how many activities we need to display
                              const activitiesCount = [hasIndoors, hasOutdoors, hasTransplant, hasHarvest].filter(Boolean).length;
                              const heightClass = activitiesCount > 0 ? `h-${activitiesCount * 6}` : 'h-6';
                              
                              return (
                                <TableCell key={monthIdx} className="border border-border p-0 relative">
                                  <div className="flex flex-col h-full">
                                    {/* Render activities in their respective positions */}
                                    {hasIndoors && (
                                      <div 
                                        className="h-6 w-full" 
                                        style={{ backgroundColor: legendItems[0].color }}
                                      ></div>
                                    )}
                                    
                                    {hasOutdoors && (
                                      <div 
                                        className="h-6 w-full" 
                                        style={{ backgroundColor: legendItems[1].color }}
                                      ></div>
                                    )}
                                    
                                    {hasTransplant && (
                                      <div 
                                        className="h-6 w-full" 
                                        style={{ backgroundColor: legendItems[2].color }}
                                      ></div>
                                    )}
                                    
                                    {hasHarvest && (
                                      <div 
                                        className="h-6 w-full" 
                                        style={{ backgroundColor: legendItems[3].color }}
                                      ></div>
                                    )}
                                    
                                    {/* If no activities, still maintain height */}
                                    {activitiesCount === 0 && <div className="h-6"></div>}
                                  </div>
                                </TableCell>
                              );
                            })}
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
