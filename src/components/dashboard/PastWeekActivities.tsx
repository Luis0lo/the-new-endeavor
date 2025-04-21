
import React from "react";
import { format, getYear } from "date-fns";
import { GardenActivity } from "@/types/garden";

interface PastWeekActivitiesProps {
  days: Date[];
  activitiesByDay: { [dateKey: string]: GardenActivity[] };
  onActivityClick?: (activity: GardenActivity) => void;
}

export const PastWeekActivities: React.FC<PastWeekActivitiesProps> = ({
  days,
  activitiesByDay,
  onActivityClick,
}) => (
  <div className="bg-white rounded-lg shadow-sm border p-4 mt-2">
    <h3 className="text-xl font-semibold mb-2">
      This week in past years
    </h3>
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
