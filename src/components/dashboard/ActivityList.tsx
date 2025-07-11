
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import ActivityItem from './ActivityItem';

interface Activity {
  id: string;
  title: string;
  description: string | null;
  scheduled_date: string;
  completed: boolean | null;
  status: string | null;
}

interface ActivityListProps {
  activities: Activity[];
  date: Date;
  loading: boolean;
  onToggleActivityStatus: (id: string, currentStatus: boolean | null) => void;
}

const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  date,
  loading,
  onToggleActivityStatus
}) => {
  // Process activities to ensure consistent status handling
  const processedActivities = activities.map(activity => {
    // If activity has status "done", ensure completed is true
    if (activity.status === 'done' && !activity.completed) {
      return { ...activity, completed: true };
    }
    // If activity has completed as true, ensure status is "done"
    if (activity.completed && activity.status !== 'done') {
      return { ...activity, status: 'done' };
    }
    return activity;
  });

  return (
    <Card className="col-span-1 md:col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>
          Activities for {format(date, 'MMMM d, yyyy')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading activities...</div>
        ) : processedActivities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No activities scheduled for this day.</p>
            <p className="text-sm mt-2">Click "Add Activity" to schedule something.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {processedActivities.map((activity) => (
              <ActivityItem
                key={activity.id}
                id={activity.id}
                title={activity.title}
                description={activity.description}
                completed={activity.completed}
                onToggleStatus={onToggleActivityStatus}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityList;
