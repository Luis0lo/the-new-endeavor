
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ActivityList from '@/components/dashboard/ActivityList';
import PastWeekActivities from '@/components/dashboard/PastWeekActivities';
import ActivityForm from '@/components/garden/activity-form/ActivityForm';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { useDashboardActivities } from "@/hooks/useDashboardActivities";

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

          <PastWeekActivities {...getPastActivitiesByDay()} onActivityClick={handlePastActivityClick} />
        </div>
      </div>
      {editModalProps && (
        <ActivityForm {...editModalProps} />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
