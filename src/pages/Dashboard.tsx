
import React, { useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ActivityList from '@/components/dashboard/ActivityList';
import PastWeekActivities from '@/components/dashboard/PastWeekActivities';
import ActivityForm from '@/components/garden/activity-form/ActivityForm';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useDashboardActivities } from "@/hooks/useDashboardActivities";
import { startOfWeek, addDays } from "date-fns";

const Dashboard = () => {
  const {
    activities,
    date,
    setDate,
    title,
    setTitle,
    description,
    setDescription,
    loading,
    dialogOpen,
    setDialogOpen,
    createActivity,
    toggleActivityStatus,
    getPastActivitiesByDay,
    handlePastActivityClick,
    editModalProps,
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
        <DashboardHeader
          date={date}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          setDate={setDate}
          onSubmit={createActivity}
        />

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
      {editModalProps && (
        <ActivityForm {...editModalProps} />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
