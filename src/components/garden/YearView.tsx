
import React from 'react';
import { format, startOfYear, endOfYear, eachMonthOfInterval, parseISO, isSameMonth } from 'date-fns';
import { GardenActivity } from '@/types/garden';

interface YearViewProps {
  date: Date;
  activities: GardenActivity[];
  onSelectMonth: (date: Date) => void;
}

const YearView: React.FC<YearViewProps> = ({
  date,
  activities,
  onSelectMonth
}) => {
  const yearStart = startOfYear(date);
  const yearEnd = endOfYear(date);
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd });
  
  return (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
      {months.map((month) => {
        // Check if the month has activities
        const hasActivities = activities.some(activity => {
          const activityDate = new Date(activity.date);
          return (
            activityDate.getMonth() === month.getMonth() &&
            activityDate.getFullYear() === month.getFullYear()
          );
        });
        
        const isCurrentMonth = isSameMonth(month, new Date());
        
        return (
          <div 
            key={month.toString()}
            className={`border rounded-md p-4 text-center cursor-pointer hover:bg-accent/10 ${
              isCurrentMonth ? 'border-primary' : ''
            }`}
            onClick={() => onSelectMonth(month)}
          >
            <div className="font-medium">{format(month, 'MMMM')}</div>
            {hasActivities && (
              <div className="mt-2 text-xs text-muted-foreground">
                Has activities
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default YearView;
