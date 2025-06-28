
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { GardenActivity } from '@/types/garden';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ActivityWithChildren from './ActivityWithChildren';
import { useActivityHierarchy } from '@/hooks/useActivityHierarchy';
import ActivityForm from './activity-form/ActivityForm';

interface DayViewProps {
  date: Date;
  activities: GardenActivity[];
  onAddActivity: (date: Date) => void;
  onEditActivity: (activity: GardenActivity) => void;
  onDeleteActivity: (activityId: string) => void;
  onToggleComplete: (activity: GardenActivity) => void;
}

const DayView: React.FC<DayViewProps> = ({
  date,
  activities,
  onAddActivity,
  onEditActivity,
  onDeleteActivity,
  onToggleComplete
}) => {
  const { loading, fetchActivitiesWithChildren, createChildActivity } = useActivityHierarchy();
  const [hierarchicalActivities, setHierarchicalActivities] = useState<GardenActivity[]>([]);
  const [isChildFormOpen, setIsChildFormOpen] = useState(false);
  const [parentActivity, setParentActivity] = useState<GardenActivity | null>(null);

  // Load activities with children when date changes
  useEffect(() => {
    const loadActivities = async () => {
      const activitiesWithChildren = await fetchActivitiesWithChildren(date);
      setHierarchicalActivities(activitiesWithChildren);
    };
    loadActivities();
  }, [date, fetchActivitiesWithChildren, activities]); // Re-fetch when activities prop changes

  const handleAddChildActivity = (parent: GardenActivity) => {
    setParentActivity(parent);
    setIsChildFormOpen(true);
  };

  const handleSaveChildActivity = async (formData: any) => {
    if (!parentActivity) return;

    const success = await createChildActivity(parentActivity, {
      title: formData.title,
      description: formData.description,
      activity_time: formData.time,
      priority: formData.priority,
      status: formData.status,
      action: formData.action,
      track: formData.track
    });

    if (success) {
      setIsChildFormOpen(false);
      setParentActivity(null);
      // Refresh the activities
      const refreshedActivities = await fetchActivitiesWithChildren(date);
      setHierarchicalActivities(refreshedActivities);
    }
  };

  const activitiesToShow = hierarchicalActivities.length > 0 ? hierarchicalActivities : activities;

  return (
    <div className="h-full flex flex-col">
      {/* Day header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-2xl font-bold">
            {format(date, 'EEEE, MMMM d')}
          </h2>
          <p className="text-muted-foreground">
            {format(date, 'yyyy')}
          </p>
        </div>
        
        <Button onClick={() => onAddActivity(date)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Activity
        </Button>
      </div>

      {/* Activities list */}
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <div className="text-center py-8">Loading activities...</div>
        ) : activitiesToShow.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No activities scheduled for this day.</p>
            <Button onClick={() => onAddActivity(date)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add your first activity
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {activitiesToShow.map((activity) => (
              <ActivityWithChildren
                key={activity.id}
                activity={activity}
                onEditActivity={onEditActivity}
                onDeleteActivity={onDeleteActivity}
                onToggleComplete={onToggleComplete}
                onAddChildActivity={handleAddChildActivity}
              />
            ))}
          </div>
        )}
      </div>

      {/* Child Activity Form */}
      <ActivityForm
        isOpen={isChildFormOpen}
        onClose={() => {
          setIsChildFormOpen(false);
          setParentActivity(null);
        }}
        onSave={handleSaveChildActivity}
        initialDate={date}
        initialActivity={null}
      />
    </div>
  );
};

export default DayView;
