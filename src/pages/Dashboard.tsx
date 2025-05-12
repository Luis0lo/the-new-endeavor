import React, { useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ActivityList from '@/components/dashboard/ActivityList';
import PastWeekActivities from '@/components/dashboard/PastWeekActivities';
import ActivityForm from '@/components/garden/activity-form/ActivityForm';
import { useDashboardActivities } from "@/hooks/useDashboardActivities";
import { startOfWeek, addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Dashboard = () => {
  const {
    activities,
    date,
    setDate,
    loading,
    toggleActivityStatus,
    getPastActivitiesByDay,
    handlePastActivityClick,
    editModalProps,
    addActivityModalProps,
    handleAddActivity,
    handleCloseAddActivity
  } = useDashboardActivities();

  // Add state for week offset (0 = this week, -1 = previous, +1 = next, etc)
  const [weekOffset, setWeekOffset] = useState(0);

  // Adjusted date for past week navigation
  const adjustedDate = addDays(date, weekOffset * 7);

  // Computed past activities for chosen week
  const pastActivitiesByDay = useCallback(() => {
    // getPastActivitiesByDay only expects a date, so mimic the signature.
    if (typeof getPastActivitiesByDay !== "function") return { days: [], activitiesByDay: {} };
    // Trick original logic: shift week by offset
    const start = startOfWeek(adjustedDate, { weekStartsOn: 1 });
    const days: Date[] = Array.from({ length: 7 }).map((_, i) => addDays(start, i));
    const original = getPastActivitiesByDay();
    // Fix: only change the days, don't touch activitiesByDay (logic lives in hook)
    return { ...original, days };
  }, [getPastActivitiesByDay, adjustedDate]);

  const handlePreviousWeek = () => setWeekOffset((offset) => offset - 1);
  const handleNextWeek = () => setWeekOffset((offset) => offset + 1);

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Garden Dashboard</h2>
          <Button 
            onClick={handleAddActivity} 
            className="gap-2"
          >
            <Plus size={16} />
            <span>Add Activity</span>
          </Button>
        </div>

        <div className="grid gap-4">
          <ActivityList 
            activities={activities}
            date={date}
            loading={loading}
            onToggleActivityStatus={toggleActivityStatus}
          />

          <PastWeekActivities
            {...pastActivitiesByDay()}
            onActivityClick={handlePastActivityClick}
            onPreviousWeek={handlePreviousWeek}
            onNextWeek={handleNextWeek}
            weekOffset={weekOffset}
          />
        </div>
      </div>
      
      {/* Edit activity modal */}
      {editModalProps && (
        <ActivityForm {...editModalProps} />
      )}
      
      {/* Add activity modal */}
      {addActivityModalProps && (
        <ActivityForm {...addActivityModalProps} />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
