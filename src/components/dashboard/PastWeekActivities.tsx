
import React from "react";
import { format, getYear } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GardenActivity } from "@/types/garden";

interface PastWeekActivitiesProps {
  days: Date[];
  activitiesByDay: { [dateKey: string]: GardenActivity[] };
  onActivityClick?: (activity: GardenActivity) => void;
  onPreviousWeek?: () => void;
  onNextWeek?: () => void;
  weekOffset?: number;
}

export const PastWeekActivities: React.FC<PastWeekActivitiesProps> = ({
  days,
  activitiesByDay,
  onActivityClick,
  onPreviousWeek,
  onNextWeek,
  weekOffset = 0
}) => (
  <div className="bg-white rounded-lg shadow-sm border p-4 mt-2">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-xl font-semibold">
        This week in past years
      </h3>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          title="Previous Week"
          onClick={onPreviousWeek}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm">{weekOffset === 0 ? 'Current week' : `Week ${weekOffset > 0 ? '+' : ''}${weekOffset}`}</div>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          title="Next Week"
          onClick={onNextWeek}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {days.map((day) => {
        const key = format(day, "MM-dd");
        const activities = activitiesByDay[key] || [];
        return (
          <div key={key} className="border rounded-md p-2 min-h-[120px]">
            <div className="text-sm font-bold text-gray-700 mb-1 text-center">
              {format(day, "E MMM d")}
            </div>
            {activities.length > 0 ? (
              <ul className="space-y-1">
                {activities.map((activity) => (
                  <li
                    key={activity.id}
                    className="text-xs border-b last:border-b-0 pb-1 flex flex-col gap-0.5 cursor-pointer hover:bg-muted px-1 rounded"
                    onClick={() => onActivityClick?.(activity)}
                    tabIndex={0}
                    role="button"
                    title="Click to view/edit activity"
                  >
                    <span className="font-medium">
                      {activity.title}
                    </span>
                    <span className="text-muted-foreground">
                      {getYear(new Date(activity.date))}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-muted-foreground text-center">
                No activity
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default PastWeekActivities;
