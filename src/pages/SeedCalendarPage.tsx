
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
        <div className="p-4 flex-1 overflow-hidden">
          <Card className="p-4 flex flex-col h-full">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center text-destructive py-6">
                Failed to load seed calendar data
              </div>
            ) : (
              <div className="flex flex-col space-y-4 h-full">
                {/* Legend */}
                <div className="flex flex-wrap gap-4 mb-2">
                  {legendItems.map((item, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-4 h-4 mr-2" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>
                
                {/* Main calendar table with fixed column widths */}
                <div className="flex flex-col overflow-hidden h-full">
                  {/* Fixed header with defined column widths */}
                  <div className="bg-muted/50 border-b">
                    <table className="w-full table-fixed">
                      <colgroup>
                        {/* Vegetable column width */}
                        <col style={{ width: '180px' }} />
                        {months.map((_, i) => (
                          /* Fixed width for each month */
                          <col key={i} style={{ width: '60px' }} />
                        ))}
                      </colgroup>
                      <thead>
                        <tr>
                          <th className="whitespace-nowrap font-medium p-4 text-left border-r border-border">Vegetable</th>
                          {months.map((month, index) => (
                            <th 
                              key={month} 
                              className={`text-center p-4 ${index < months.length - 1 ? 'border-r border-border' : ''}`}
                            >
                              {month}
                            </th>
                          ))}
                        </tr>
                      </thead>
                    </table>
                  </div>
                  
                  {/* Scrollable body with same column structure */}
                  <div className="overflow-y-auto flex-1">
                    <table className="w-full table-fixed">
                      <colgroup>
                        {/* Vegetable column width */}
                        <col style={{ width: '180px' }} />
                        {months.map((_, i) => (
                          /* Fixed width for each month */
                          <col key={i} style={{ width: '60px' }} />
                        ))}
                      </colgroup>
                      <tbody>
                        {seedData.map((entry, idx) => (
                          <tr key={entry.id} className={`${idx % 2 === 0 ? 'bg-background' : 'bg-muted/10'}`}>
                            <td className="font-medium whitespace-nowrap p-4 border-r border-border">
                              {entry.vegetable}
                            </td>
                            {months.map((_, monthIdx) => (
                              <td 
                                key={monthIdx} 
                                className={`p-0 h-12 relative ${monthIdx < months.length - 1 ? 'border-r border-border' : ''}`}
                              >
                                <div className="flex flex-col h-full">
                                  {/* Activity indicators with absolute positioning for consistent alignment */}
                                  {/* Sow Indoors */}
                                  {isMonthInPeriods(entry.sow_indoors, monthIdx) && (
                                    <div 
                                      className="absolute inset-x-0 top-0 h-3" 
                                      style={{ backgroundColor: legendItems[0].color }}
                                    ></div>
                                  )}
                                  
                                  {/* Sow Outdoors */}
                                  {isMonthInPeriods(entry.sow_outdoors, monthIdx) && (
                                    <div 
                                      className="absolute inset-x-0 top-3 h-3" 
                                      style={{ backgroundColor: legendItems[1].color }}
                                    ></div>
                                  )}
                                  
                                  {/* Transplant/Plant Outdoors */}
                                  {isMonthInPeriods(entry.transplant_outdoors, monthIdx) && (
                                    <div 
                                      className="absolute inset-x-0 top-6 h-3" 
                                      style={{ backgroundColor: legendItems[2].color }}
                                    ></div>
                                  )}
                                  
                                  {/* Harvest Period */}
                                  {isMonthInPeriods(entry.harvest_period, monthIdx) && (
                                    <div 
                                      className="absolute inset-x-0 top-9 h-3" 
                                      style={{ backgroundColor: legendItems[3].color }}
                                    ></div>
                                  )}
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SeedCalendarPage;
