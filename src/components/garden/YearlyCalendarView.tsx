
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { months, PlantSchedule } from '@/data/uk-seeding-data';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface YearlyCalendarViewProps {
  plants: PlantSchedule[];
}

const YearlyCalendarView: React.FC<YearlyCalendarViewProps> = ({ plants }) => {
  const isMobile = useIsMobile();
  const [selectedPlant, setSelectedPlant] = React.useState<PlantSchedule | null>(null);
  
  // Color coding for different activities
  const colors = {
    sowIndoors: '#FEF7CD', // Yellow
    sowOutdoors: '#D3E4FD', // Blue
    plantOutdoors: '#FDE1D3', // Red/Orange
    harvest: '#F2FCE2', // Green
  };

  // Check if a month is within a date range
  const isMonthInRange = (month: number, ranges: { startMonth: number; endMonth: number }[]) => {
    return ranges.some(range => month >= range.startMonth && month <= range.endMonth);
  };

  // Handle plant click on mobile
  const handlePlantClick = (plant: PlantSchedule) => {
    if (isMobile) {
      setSelectedPlant(plant);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>UK Vegetable Planting Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="mt-2 mb-4 flex items-center justify-start space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 mr-1" style={{ backgroundColor: colors.sowIndoors }}></div>
              <span className="text-xs">Sow Indoors</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 mr-1" style={{ backgroundColor: colors.sowOutdoors }}></div>
              <span className="text-xs">Sow Outdoors</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 mr-1" style={{ backgroundColor: colors.plantOutdoors }}></div>
              <span className="text-xs">Plant Outdoors</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 mr-1" style={{ backgroundColor: colors.harvest }}></div>
              <span className="text-xs">Harvest</span>
            </div>
          </div>

          {isMobile ? (
            // Mobile view: List of plants
            <div className="flex flex-col">
              {plants.map((plant, index) => (
                <div 
                  key={index} 
                  className={`p-3 border-b cursor-pointer ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                  onClick={() => handlePlantClick(plant)}
                >
                  <span className="font-medium">{plant.name}</span>
                </div>
              ))}
            </div>
          ) : (
            // Desktop view: Full table
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="border p-2 text-left w-[160px]">Vegetable</th>
                  {months.map((month) => (
                    <th key={month} className="border p-2 text-center w-16">{month}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plants.map((plant, plantIndex) => (
                  <tr key={plantIndex} className={plantIndex % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                    <td className="border p-2 text-left font-medium">{plant.name}</td>
                    {Array.from({ length: 12 }, (_, monthIndex) => (
                      <td key={monthIndex} className="border p-0 relative h-10">
                        <div className="flex flex-col h-full">
                          {/* Layered colored indicators for each activity type */}
                          {isMonthInRange(monthIndex, plant.sowIndoors) && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className="h-2.5 w-full cursor-help"
                                    style={{ backgroundColor: colors.sowIndoors }}
                                  ></div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Sow {plant.name} indoors</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {isMonthInRange(monthIndex, plant.sowOutdoors) && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className="h-2.5 w-full cursor-help"
                                    style={{ backgroundColor: colors.sowOutdoors }}
                                  ></div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Sow {plant.name} outdoors</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {isMonthInRange(monthIndex, plant.plantOutdoors) && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className="h-2.5 w-full cursor-help"
                                    style={{ backgroundColor: colors.plantOutdoors }}
                                  ></div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Plant {plant.name} outdoors</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {isMonthInRange(monthIndex, plant.harvest) && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className="h-2.5 w-full cursor-help"
                                    style={{ backgroundColor: colors.harvest }}
                                  ></div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Harvest {plant.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </CardContent>

      {/* Plant details dialog for mobile */}
      {selectedPlant && (
        <Dialog open={!!selectedPlant} onOpenChange={(open) => !open && setSelectedPlant(null)}>
          <DialogContent className="sm:max-w-[90vw]">
            <DialogHeader>
              <DialogTitle>{selectedPlant.name}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-12 gap-1 mt-4 border rounded-lg overflow-hidden">
              <div className="col-span-3 font-medium p-2 bg-muted/20"></div>
              {months.map(month => (
                <div key={month} className="col-span-3/4 text-center p-2 bg-muted/20 text-xs sm:text-sm">
                  {month}
                </div>
              ))}
              
              <div className="col-span-3 p-2 border-t font-medium">Sow Indoors</div>
              {Array.from({ length: 12 }, (_, monthIndex) => (
                <div key={monthIndex} className="col-span-3/4 p-0 border-t text-center">
                  {isMonthInRange(monthIndex, selectedPlant.sowIndoors) && (
                    <div className="h-full w-full p-2" style={{ backgroundColor: colors.sowIndoors }}>
                      ✓
                    </div>
                  )}
                </div>
              ))}
              
              <div className="col-span-3 p-2 border-t font-medium">Sow Outdoors</div>
              {Array.from({ length: 12 }, (_, monthIndex) => (
                <div key={monthIndex} className="col-span-3/4 p-0 border-t text-center">
                  {isMonthInRange(monthIndex, selectedPlant.sowOutdoors) && (
                    <div className="h-full w-full p-2" style={{ backgroundColor: colors.sowOutdoors }}>
                      ✓
                    </div>
                  )}
                </div>
              ))}
              
              <div className="col-span-3 p-2 border-t font-medium">Plant Outdoors</div>
              {Array.from({ length: 12 }, (_, monthIndex) => (
                <div key={monthIndex} className="col-span-3/4 p-0 border-t text-center">
                  {isMonthInRange(monthIndex, selectedPlant.plantOutdoors) && (
                    <div className="h-full w-full p-2" style={{ backgroundColor: colors.plantOutdoors }}>
                      ✓
                    </div>
                  )}
                </div>
              ))}
              
              <div className="col-span-3 p-2 border-t font-medium">Harvest</div>
              {Array.from({ length: 12 }, (_, monthIndex) => (
                <div key={monthIndex} className="col-span-3/4 p-0 border-t text-center">
                  {isMonthInRange(monthIndex, selectedPlant.harvest) && (
                    <div className="h-full w-full p-2" style={{ backgroundColor: colors.harvest }}>
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default YearlyCalendarView;
