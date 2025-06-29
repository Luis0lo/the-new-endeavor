
import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import { GardenActivity } from '@/types/garden';

interface MonthViewProps {
  date: Date;
  activities: GardenActivity[];
  onAddActivity: (date: Date) => void;
  onSelectDay: (date: Date) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  date,
  activities,
  onAddActivity,
  onSelectDay
}) => {
  // Create calendar grid
  const getDaysInMonth = () => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Start from Sunday
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 }); // End on Saturday
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Group days into weeks
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    
    return weeks;
  };

  const getActivitiesForDay = (day: Date) => {
    const dayString = format(day, 'yyyy-MM-dd');
    return activities.filter(activity => {
      // Ensure we're comparing date strings consistently
      return activity.date === dayString;
    });
  };

  // Priority color helper
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-300';
    }
  };

  // Status color helper
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'done':
        return 'border-green-300';
      case 'in_progress':
        return 'border-yellow-300';
      default:
        return 'border-gray-300';
    }
  };

  const weeks = getDaysInMonth();
  const today = new Date();

  const handleDayClick = (day: Date) => {
    // Create a new date object to ensure we're passing the correct date
    const selectedDate = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    console.log('MonthView - Day clicked:', format(selectedDate, 'yyyy-MM-dd'));
    onSelectDay(selectedDate);
  };

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{format(date, 'MMMM yyyy')}</h2>
        <Button 
          size="sm" 
          onClick={() => onAddActivity(date)}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Activity
        </Button>
      </div>
      
      <div className="grid grid-cols-7 text-center">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="py-2 font-semibold text-sm">
            {day}
          </div>
        ))}
        
        {weeks.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((day) => {
              const isCurrentMonth = isSameMonth(day, date);
              const isToday = isSameDay(day, today);
              const dayActivities = getActivitiesForDay(day);
              const hasActivities = dayActivities.length > 0;
              
              return (
                <div 
                  key={day.toString()}
                  className={`relative flex flex-col p-1 min-h-[100px] 
                    ${isCurrentMonth ? 'bg-transparent' : 'bg-muted/20 text-muted-foreground'}
                    ${isToday ? 'ring-2 ring-primary rounded-md' : ''}
                    hover:bg-muted/10 hover:ring-1 hover:ring-primary hover:rounded-md 
                    hover:shadow-sm cursor-pointer transition-all m-0.5`}
                  onClick={() => handleDayClick(day)}
                >
                  <div className={`text-right p-1 ${
                    isToday ? 'font-bold text-primary' : ''
                  }`}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="flex-1 overflow-hidden">
                    {hasActivities && isCurrentMonth && (
                      <div className="space-y-1 text-xs">
                        {dayActivities.slice(0, 2).map(activity => (
                          <div 
                            key={activity.id}
                            className={`truncate px-1 py-0.5 rounded-sm border flex items-center gap-1
                              ${getPriorityColor(activity.priority)}
                              ${getStatusColor(activity.status)}
                              ${activity.status === 'done' || activity.completed ? 'bg-green-50 text-green-700' : ''}
                              font-medium`}
                            title={activity.title}
                          >
                            {(activity.status === 'done' || activity.completed) && (
                              <CheckCircle2 className="inline-block h-3 w-3 text-green-500 flex-shrink-0" />
                            )}
                            {activity.priority === 'high' && (
                              <AlertTriangle className="inline-block mr-1 h-3 w-3" />
                            )}
                            <span className="truncate">{activity.title}</span>
                            {activity.activity_time && (
                              <Clock className="inline-block ml-1 h-3 w-3 opacity-70" />
                            )}
                          </div>
                        ))}
                        {dayActivities.length > 2 && (
                          <div className="text-xs text-muted-foreground pl-1">
                            +{dayActivities.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {isCurrentMonth && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-1 right-1 h-6 w-6 opacity-0 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddActivity(day);
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default MonthView;
