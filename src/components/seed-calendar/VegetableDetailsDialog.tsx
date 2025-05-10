
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
          {/* Legend for mobile */}
          <div className="flex flex-wrap gap-2 mb-4">
            {legendItems.map((item, i) => (
              <div key={i} className="flex items-center">
                <div className="w-3 h-3 mr-1" style={{ backgroundColor: item.color }}></div>
                <span className="text-xs">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Calendar grid for this vegetable */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                {months.map((month) => (
                  <TableHead key={month} className="text-center p-1">{month}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Sow Indoors</TableCell>
                {months.map((_, monthIdx) => (
                  <TableCell key={monthIdx} className="p-2 text-center">
                    {isMonthInPeriods(vegetable.sow_indoors, monthIdx) ? (
                      <div 
                        className="mx-auto w-4 h-4 rounded-full" 
                        style={{ backgroundColor: legendItems[0].color }}
                      ></div>
                    ) : null}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Sow Outdoors</TableCell>
                {months.map((_, monthIdx) => (
                  <TableCell key={monthIdx} className="p-2 text-center">
                    {isMonthInPeriods(vegetable.sow_outdoors, monthIdx) ? (
                      <div 
                        className="mx-auto w-4 h-4 rounded-full" 
                        style={{ backgroundColor: legendItems[1].color }}
                      ></div>
                    ) : null}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Plant Outdoors</TableCell>
                {months.map((_, monthIdx) => (
                  <TableCell key={monthIdx} className="p-2 text-center">
                    {isMonthInPeriods(vegetable.transplant_outdoors, monthIdx) ? (
                      <div 
                        className="mx-auto w-4 h-4 rounded-full" 
                        style={{ backgroundColor: legendItems[2].color }}
                      ></div>
                    ) : null}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Harvest</TableCell>
                {months.map((_, monthIdx) => (
                  <TableCell key={monthIdx} className="p-2 text-center">
                    {isMonthInPeriods(vegetable.harvest_period, monthIdx) ? (
                      <div 
                        className="mx-auto w-4 h-4 rounded-full" 
                        style={{ backgroundColor: legendItems[3].color }}
                      ></div>
                    ) : null}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VegetableDetailsDialog;
