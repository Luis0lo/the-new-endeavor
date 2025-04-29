
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

  // Helper function to generate continuous spans for a specific activity type
  const generateActivitySpans = (periods: string[], activityIndex: number) => {
    if (!periods || !periods.length) return [];
    
    const spans: {start: number, end: number}[] = [];
    
    periods.forEach(period => {
      const monthsInPeriod = getMonthsInPeriod(period);
      if (monthsInPeriod.length === 0) return;
      
      // Sort months to ensure they're in order
      monthsInPeriod.sort((a, b) => a - b);
      
      let currentSpan = { start: monthsInPeriod[0], end: monthsInPeriod[0] };
      
      for (let i = 1; i < monthsInPeriod.length; i++) {
        // If month is consecutive, extend the span
        if (monthsInPeriod[i] === currentSpan.end + 1) {
          currentSpan.end = monthsInPeriod[i];
        } else {
          // Non-consecutive month, push the current span and start a new one
          spans.push(currentSpan);
          currentSpan = { start: monthsInPeriod[i], end: monthsInPeriod[i] };
        }
      }
      
      // Push the last span
      spans.push(currentSpan);
    });
    
    return spans;
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
                        {seedData.map((entry, idx) => {
                          // Pre-calculate all spans for this entry
                          const indoorsSpans = generateActivitySpans(entry.sow_indoors, 0);
                          const outdoorsSpans = generateActivitySpans(entry.sow_outdoors, 1);
                          const transplantSpans = generateActivitySpans(entry.transplant_outdoors, 2);
                          const harvestSpans = generateActivitySpans(entry.harvest_period, 3);
                          
                          return (
                            <TableRow key={entry.id} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/10'}>
                              <TableCell className="border border-border p-2 font-medium whitespace-nowrap">
                                {entry.vegetable}
                              </TableCell>
                              <TableCell colSpan={12} className="p-0 relative">
                                <div className="grid grid-cols-12 h-24 relative">
                                  {/* Create columns for each month */}
                                  {months.map((_, monthIdx) => (
                                    <div 
                                      key={monthIdx} 
                                      className="border border-border h-full"
                                    />
                                  ))}
                                  
                                  {/* Render continuous spans for each activity type */}
                                  {/* Sow Indoors */}
                                  {indoorsSpans.map((span, i) => {
                                    const spanWidth = (span.end - span.start + 1) * (100 / 12);
                                    const spanLeft = span.start * (100 / 12);
                                    
                                    return (
                                      <div
                                        key={`indoors-${i}`}
                                        className="absolute h-6 z-10"
                                        style={{
                                          width: `${spanWidth}%`,
                                          left: `${spanLeft}%`,
                                          top: '0',
                                          backgroundColor: legendItems[0].color
                                        }}
                                      />
                                    );
                                  })}
                                  
                                  {/* Sow Outdoors */}
                                  {outdoorsSpans.map((span, i) => {
                                    const spanWidth = (span.end - span.start + 1) * (100 / 12);
                                    const spanLeft = span.start * (100 / 12);
                                    
                                    return (
                                      <div
                                        key={`outdoors-${i}`}
                                        className="absolute h-6 z-10"
                                        style={{
                                          width: `${spanWidth}%`,
                                          left: `${spanLeft}%`,
                                          top: '6px',
                                          backgroundColor: legendItems[1].color
                                        }}
                                      />
                                    );
                                  })}
                                  
                                  {/* Plant Outdoors */}
                                  {transplantSpans.map((span, i) => {
                                    const spanWidth = (span.end - span.start + 1) * (100 / 12);
                                    const spanLeft = span.start * (100 / 12);
                                    
                                    return (
                                      <div
                                        key={`transplant-${i}`}
                                        className="absolute h-6 z-10"
                                        style={{
                                          width: `${spanWidth}%`,
                                          left: `${spanLeft}%`,
                                          top: '12px',
                                          backgroundColor: legendItems[2].color
                                        }}
                                      />
                                    );
                                  })}
                                  
                                  {/* Harvest */}
                                  {harvestSpans.map((span, i) => {
                                    const spanWidth = (span.end - span.start + 1) * (100 / 12);
                                    const spanLeft = span.start * (100 / 12);
                                    
                                    return (
                                      <div
                                        key={`harvest-${i}`}
                                        className="absolute h-6 z-10"
                                        style={{
                                          width: `${spanWidth}%`,
                                          left: `${spanLeft}%`,
                                          top: '18px',
                                          backgroundColor: legendItems[3].color
                                        }}
                                      />
                                    );
                                  })}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
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
