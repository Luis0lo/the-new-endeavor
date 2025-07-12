
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
  <div className="bg-white dark:bg-[#221F26] rounded-lg shadow-sm border border-gray-200 dark:border-[#403E43] p-4 mt-2">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-[#F1F1F1]">
        This week in past years {`(${Object.values(activitiesByDay).flat().length})`}
      </h3>
      <div className="flex items-center gap-2 text-gray-700 dark:text-[#C8C8C9]">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 bg-white dark:bg-[#333333] dark:text-[#F1F1F1]"
          title="Previous Week"
          onClick={onPreviousWeek}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm select-none">
          {weekOffset === 0 ? 'Current week' : `Week ${weekOffset > 0 ? '+' : ''}${weekOffset}`}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 bg-white dark:bg-[#333333] dark:text-[#F1F1F1]"
          title="Next Week"
          onClick={onNextWeek}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 w-full">
      {days.map((day) => {
        const key = format(day, "MM-dd");
        const activities = activitiesByDay[key] || [];
        const hasActivities = activities.length > 0;
        return (
          <div
            key={key}
            className={`rounded-md p-2 min-h-[120px] border flex-1 ${
              hasActivities ? 'border-green-400 dark:border-green-500' : 'border-gray-300 dark:border-[#555555]'
            } bg-white dark:bg-[#333333]`}
          >
            <div className="text-sm font-bold text-gray-900 dark:text-[#D6BCFA] mb-1 text-center">
              {format(day, "E MMM d")}
              {hasActivities ? ` (${activities.length})` : ""}
            </div>
            {hasActivities ? (
              <ul className="space-y-1">
                {activities.map((activity) => (
                  <li
                    key={activity.id}
                    className="text-xs border-b last:border-b-0 pb-1 flex flex-col gap-0.5 cursor-pointer hover:bg-muted dark:hover:bg-[#444444] px-1 rounded"
                    onClick={() => onActivityClick?.(activity)}
                    tabIndex={0}
                    role="button"
                    title="Click to view/edit activity"
                  >
                    <span className="font-medium text-gray-800 dark:text-[#D6BCFA]">
                      {activity.title}
                    </span>
                    <span className="text-muted-foreground dark:text-[#9F9EA1]">
                      {getYear(new Date(activity.date))}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-muted-foreground dark:text-[#8A898C] text-center">
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
