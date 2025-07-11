
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SeedCalendarEntry } from '@/hooks/useSeedCalendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface VegetableDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vegetable: SeedCalendarEntry;
  months: string[];
  legendItems: { label: string; color: string }[];
  isMonthInPeriods: (periods: string[], monthIndex: number) => boolean;
}

const VegetableDetailsDialog: React.FC<VegetableDetailsDialogProps> = ({
  open,
  onOpenChange,
  vegetable,
  months,
  legendItems,
  isMonthInPeriods
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{vegetable.vegetable}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {/* Legend */}
          <div className="flex flex-wrap gap-2 mb-4">
            {legendItems.map((item, i) => (
              <div key={i} className="flex items-center">
                <div className="w-3 h-3 mr-1" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Calendar grid with actions as columns and months as rows */}
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/5">Month</TableHead>
                  {/* Updated column headers to be more specific */}
                  <TableHead className="text-center w-1/5 px-1" title={legendItems[0].label}>
                    <span className="hidden sm:inline">Sow In</span>
                    <span className="sm:hidden">In</span>
                  </TableHead>
                  <TableHead className="text-center w-1/5 px-1" title={legendItems[1].label}>
                    <span className="hidden sm:inline">Sow Out</span>
                    <span className="sm:hidden">Out</span>
                  </TableHead>
                  <TableHead className="text-center w-1/5 px-1" title={legendItems[2].label}>
                    <span className="hidden sm:inline">Plant</span>
                    <span className="sm:hidden">Plant</span>
                  </TableHead>
                  <TableHead className="text-center w-1/5 px-1" title={legendItems[3].label}>
                    <span className="hidden sm:inline">Harvest</span>
                    <span className="sm:hidden">Harv</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {months.map((month, monthIdx) => (
                  <TableRow key={monthIdx}>
                    <TableCell className="font-medium py-2 px-2">{month}</TableCell>
                    
                    {/* Sow Indoors */}
                    <TableCell className="p-1 text-center">
                      {isMonthInPeriods(vegetable.sow_indoors, monthIdx) ? (
                        <div 
                          className="mx-auto w-3 h-3 sm:w-4 sm:h-4 rounded-full" 
                          style={{ backgroundColor: legendItems[0].color }}
                        ></div>
                      ) : null}
                    </TableCell>
                    
                    {/* Sow Outdoors */}
                    <TableCell className="p-1 text-center">
                      {isMonthInPeriods(vegetable.sow_outdoors, monthIdx) ? (
                        <div 
                          className="mx-auto w-3 h-3 sm:w-4 sm:h-4 rounded-full" 
                          style={{ backgroundColor: legendItems[1].color }}
                        ></div>
                      ) : null}
                    </TableCell>
                    
                    {/* Plant Outdoors */}
                    <TableCell className="p-1 text-center">
                      {isMonthInPeriods(vegetable.transplant_outdoors, monthIdx) ? (
                        <div 
                          className="mx-auto w-3 h-3 sm:w-4 sm:h-4 rounded-full" 
                          style={{ backgroundColor: legendItems[2].color }}
                        ></div>
                      ) : null}
                    </TableCell>
                    
                    {/* Harvest */}
                    <TableCell className="p-1 text-center">
                      {isMonthInPeriods(vegetable.harvest_period, monthIdx) ? (
                        <div 
                          className="mx-auto w-3 h-3 sm:w-4 sm:h-4 rounded-full" 
                          style={{ backgroundColor: legendItems[3].color }}
                        ></div>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VegetableDetailsDialog;
