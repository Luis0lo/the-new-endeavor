
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ActivityFormDialog from "@/components/dashboard/ActivityFormDialog";

interface DashboardHeaderProps {
  date: Date;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  setDate: (date: Date) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  date,
  dialogOpen,
  setDialogOpen,
  title,
  setTitle,
  description,
  setDescription,
  setDate,
  onSubmit
}) => (
  <div className="flex items-center justify-between">
    <h2 className="text-3xl font-bold tracking-tight">Garden Dashboard</h2>
    <ActivityFormDialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
      date={date}
      onSubmit={onSubmit}
      title={title}
      setTitle={setTitle}
      description={description}
      setDescription={setDescription}
      setDate={setDate}
    />
  </div>
);

export default DashboardHeader;
