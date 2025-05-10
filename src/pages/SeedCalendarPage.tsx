import React, { useRef, useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useSeedCalendar, SeedCalendarEntry } from '@/hooks/useSeedCalendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import AddVegetableDialog from '@/components/seed-calendar/AddVegetableDialog';
import EditVegetableDialog from '@/components/seed-calendar/EditVegetableDialog';
import DeleteConfirmDialog from '@/components/inventory/DeleteConfirmDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import VegetableDetailsDialog from '@/components/seed-calendar/VegetableDetailsDialog';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Legend items with their colors
const legendItems = [
  { label: 'Sow Indoors', color: '#8B5CF6' }, // Purple
  { label: 'Sow Outdoors', color: '#FBBF24' }, // Yellow
  { label: 'Plant Outdoors', color: '#10B981' }, // Green
  { label: 'Harvest', color: '#EF4444' }, // Red
];

const SeedCalendarPage = () => {
  const { seedData, loading, error, refetch, deleteEntry, userId } = useSeedCalendar();
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const scrollBodyRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vegetableToDelete, setVegetableToDelete] = useState<{ id: string, name: string } | null>(null);
  
  // State for vegetable details dialog on mobile
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedVegetable, setSelectedVegetable] = useState<SeedCalendarEntry | null>(null);

  // Calculate scrollbar width on mount and when data loads
  useEffect(() => {
    if (scrollBodyRef.current && !loading) {
      const element = scrollBodyRef.current;
      const hasVerticalScrollbar = element.scrollHeight > element.clientHeight;
      if (hasVerticalScrollbar) {
        // Calculate the width of the scrollbar
        const width = element.offsetWidth - element.clientWidth;
        setScrollbarWidth(width);
      } else {
        setScrollbarWidth(0);
      }
    }
  }, [loading, seedData.length]);

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

  const handleDeleteClick = (id: string, vegetableName: string) => {
    setVegetableToDelete({ id, name: vegetableName });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (vegetableToDelete) {
      deleteEntry(vegetableToDelete.id);
      setDeleteDialogOpen(false);
      setVegetableToDelete(null);
    }
  };

  const handleVegetableClick = (vegetable: SeedCalendarEntry) => {
    if (isMobile) {
      setSelectedVegetable(vegetable);
      setDetailsDialogOpen(true);
    }
  };

  // Separate user entries from default entries for display
  const userEntries = seedData.filter(entry => entry.user_id);
  const defaultEntries = seedData.filter(entry => !entry.user_id);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen">
        {/* Page header */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-3xl font-bold tracking-tight">Seed Calendar</h1>
            <AddVegetableDialog onVegetableAdded={refetch} userId={userId} />
          </div>
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
                {/* Legend - hide on mobile */}
                {!isMobile && (
                  <div className="flex flex-wrap gap-4 mb-2">
                    {legendItems.map((item, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-4 h-4 mr-2" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm">{item.label}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Mobile view */}
                {isMobile ? (
                  <div className="flex flex-col overflow-auto h-full">
                    {/* User entries section */}
                    {userEntries.length > 0 && (
                      <>
                        <div className="bg-primary/10 p-2 font-medium text-primary border-b">
                          Your Custom Vegetables
                        </div>
                        {userEntries.map((entry, idx) => (
                          <div 
                            key={entry.id} 
                            className={`${idx % 2 === 0 ? 'bg-background' : 'bg-muted/10'} border-b border-gray-200 p-4 flex justify-between items-center`}
                            onClick={() => handleVegetableClick(entry)}
                          >
                            <span className="text-primary font-medium">{entry.vegetable}</span>
                            <div className="flex items-center">
                              <EditVegetableDialog 
                                vegetable={entry} 
                                onVegetableUpdated={refetch} 
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(entry.id, entry.vegetable)
                                }}
                              >
                                <Trash2 size={16} className="text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                    
                    {/* Default entries section */}
                    {defaultEntries.length > 0 && (
                      <>
                        <div className="bg-muted p-2 font-medium text-muted-foreground border-b">
                          Standard UK Vegetables
                        </div>
                        {defaultEntries.map((entry, idx) => (
                          <div 
                            key={entry.id} 
                            className={`${idx % 2 === 0 ? 'bg-background' : 'bg-muted/10'} border-b border-gray-200 p-4`}
                            onClick={() => handleVegetableClick(entry)}
                          >
                            <span className="font-medium">{entry.vegetable}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                ) : (
                  // Desktop view - existing table layout
                  <div className="flex flex-col overflow-hidden h-full">
                    {/* Fixed header with defined column widths */}
                    <div className="bg-muted/50 border-b" style={{ paddingRight: `${scrollbarWidth}px` }}>
                      <table className="w-full table-fixed">
                        <colgroup>
                          {/* Vegetable column width */}
                          <col style={{ width: '220px' }} />
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
                    <div ref={scrollBodyRef} className="overflow-y-auto flex-1">
                      <table className="w-full table-fixed">
                        <colgroup>
                          {/* Vegetable column width */}
                          <col style={{ width: '220px' }} />
                          {months.map((_, i) => (
                            /* Fixed width for each month */
                            <col key={i} style={{ width: '60px' }} />
                          ))}
                        </colgroup>
                        <tbody>
                          {/* User entries section with header */}
                          {userEntries.length > 0 && (
                            <>
                              <tr className="bg-primary/10">
                                <td colSpan={13} className="p-2 font-medium text-primary border-b">
                                  Your Custom Vegetables
                                </td>
                              </tr>
                              {userEntries.map((entry, idx) => (
                                <tr 
                                  key={entry.id} 
                                  className={`${idx % 2 === 0 ? 'bg-background' : 'bg-muted/10'} border-b border-gray-200`}
                                >
                                  <td className="font-medium whitespace-nowrap p-4 border-r border-border flex items-center justify-between">
                                    <span className="text-primary">
                                      {entry.vegetable}
                                    </span>
                                    
                                    <div className="flex items-center">
                                      <EditVegetableDialog 
                                        vegetable={entry} 
                                        onVegetableUpdated={refetch} 
                                      />
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleDeleteClick(entry.id, entry.vegetable)}
                                      >
                                        <Trash2 size={16} className="text-destructive" />
                                      </Button>
                                    </div>
                                  </td>
                                  {months.map((_, monthIdx) => (
                                    <td 
                                      key={monthIdx} 
                                      className={`p-0 h-10 relative ${monthIdx < months.length - 1 ? 'border-r border-border' : ''}`}
                                    >
                                      {/* Activity indicators stacked without gaps */}
                                      {/* Sow Indoors */}
                                      {isMonthInPeriods(entry.sow_indoors, monthIdx) && (
                                        <div 
                                          className="absolute inset-x-0 top-0 h-2.5" 
                                          style={{ backgroundColor: legendItems[0].color }}
                                        ></div>
                                      )}
                                      
                                      {/* Sow Outdoors */}
                                      {isMonthInPeriods(entry.sow_outdoors, monthIdx) && (
                                        <div 
                                          className="absolute inset-x-0 top-2.5 h-2.5" 
                                          style={{ backgroundColor: legendItems[1].color }}
                                        ></div>
                                      )}
                                      
                                      {/* Transplant/Plant Outdoors */}
                                      {isMonthInPeriods(entry.transplant_outdoors, monthIdx) && (
                                        <div 
                                          className="absolute inset-x-0 top-5 h-2.5" 
                                          style={{ backgroundColor: legendItems[2].color }}
                                        ></div>
                                      )}
                                      
                                      {/* Harvest Period */}
                                      {isMonthInPeriods(entry.harvest_period, monthIdx) && (
                                        <div 
                                          className="absolute inset-x-0 top-7.5 h-2.5" 
                                          style={{ backgroundColor: legendItems[3].color }}
                                        ></div>
                                      )}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </>
                          )}
                          
                          {/* Default entries section with header */}
                          {defaultEntries.length > 0 && (
                            <>
                              <tr className="bg-muted">
                                <td colSpan={13} className="p-2 font-medium text-muted-foreground border-b">
                                  Standard UK Vegetables
                                </td>
                              </tr>
                              {defaultEntries.map((entry, idx) => (
                                <tr 
                                  key={entry.id} 
                                  className={`${idx % 2 === 0 ? 'bg-background' : 'bg-muted/10'} border-b border-gray-200`}
                                >
                                  <td className="font-medium whitespace-nowrap p-4 border-r border-border">
                                    {entry.vegetable}
                                  </td>
                                  {months.map((_, monthIdx) => (
                                    <td 
                                      key={monthIdx} 
                                      className={`p-0 h-10 relative ${monthIdx < months.length - 1 ? 'border-r border-border' : ''}`}
                                    >
                                      {isMonthInPeriods(entry.sow_indoors, monthIdx) && (
                                        <div 
                                          className="absolute inset-x-0 top-0 h-2.5" 
                                          style={{ backgroundColor: legendItems[0].color }}
                                        ></div>
                                      )}
                                      
                                      {isMonthInPeriods(entry.sow_outdoors, monthIdx) && (
                                        <div 
                                          className="absolute inset-x-0 top-2.5 h-2.5" 
                                          style={{ backgroundColor: legendItems[1].color }}
                                        ></div>
                                      )}
                                      
                                      {isMonthInPeriods(entry.transplant_outdoors, monthIdx) && (
                                        <div 
                                          className="absolute inset-x-0 top-5 h-2.5" 
                                          style={{ backgroundColor: legendItems[2].color }}
                                        ></div>
                                      )}
                                      
                                      {isMonthInPeriods(entry.harvest_period, monthIdx) && (
                                        <div 
                                          className="absolute inset-x-0 top-7.5 h-2.5" 
                                          style={{ backgroundColor: legendItems[3].color }}
                                        ></div>
                                      )}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {/* Delete confirmation dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Vegetable"
        description={`Are you sure you want to delete ${vegetableToDelete?.name || ''}? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />

      {/* Vegetable details dialog for mobile */}
      {selectedVegetable && (
        <VegetableDetailsDialog
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          vegetable={selectedVegetable}
          months={months}
          legendItems={legendItems}
          isMonthInPeriods={isMonthInPeriods}
        />
      )}
    </DashboardLayout>
  );
};

export default SeedCalendarPage;
