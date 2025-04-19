
import React from "react";
import { ActivityFormDialog } from "./components/ActivityFormDialog";
import { GardenActivity } from "@/types/garden";
import { ActivityFormValues } from "./activity-form-schema";

interface ActivityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: ActivityFormValues) => void;
  initialDate: Date;
  initialActivity?: GardenActivity | null;
}

const ActivityForm: React.FC<ActivityFormProps> = (props) => {
  return <ActivityFormDialog {...props} />;
};

export default ActivityForm;
