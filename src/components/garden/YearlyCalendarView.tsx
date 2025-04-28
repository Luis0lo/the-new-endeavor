
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { months, PlantSchedule } from '@/data/uk-seeding-data';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface YearlyCalendarViewProps {
  plants: PlantSchedule[];
}

const YearlyCalendarView: React.FC<YearlyCalendarViewProps> = ({ plants }) => {
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
        </div>
      </CardContent>
    </Card>
  );
};

export default YearlyCalendarView;
