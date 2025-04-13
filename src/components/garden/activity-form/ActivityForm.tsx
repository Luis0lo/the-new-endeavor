
import React, { useEffect } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { activitySchema, type ActivityFormValues } from "./activity-form-schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GardenActivity } from "@/types/garden";
import { BasicInfoFields } from "./BasicInfoFields";
import { DateTimeFields } from "./DateTimeFields";
import { PriorityStatusFields } from "./PriorityStatusFields";
import { OutcomeFields } from "./OutcomeFields";

interface ActivityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: ActivityFormValues) => void;
  initialDate: Date;
  initialActivity?: GardenActivity | null;
}

const ActivityForm: React.FC<ActivityFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDate,
  initialActivity,
}) => {
  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: "",
      description: "",
      date: initialDate,
      time: format(new Date(), "HH:mm"),
      priority: "normal",
      status: "pending",
    },
  });

  // Get current status value for conditional rendering
  const status = form.watch("status");
  const showOutcomeFields = status === "done";

  // Reset form when initialActivity changes
  useEffect(() => {
    if (initialActivity) {
      const activityDate = new Date(initialActivity.date);
      form.reset({
        title: initialActivity.title,
        description: initialActivity.description || "",
        date: activityDate,
        time: initialActivity.activity_time || format(new Date(), "HH:mm"),
        priority: initialActivity.priority || "normal",
        status: initialActivity.status || "pending",
        outcome_rating: initialActivity.outcome_rating,
        outcome_log: initialActivity.outcome_log,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        date: initialDate,
        time: format(new Date(), "HH:mm"),
        priority: "normal",
        status: "pending",
        outcome_rating: undefined,
        outcome_log: "",
      });
    }
  }, [initialActivity, initialDate, form]);

  const handleSubmit = (values: ActivityFormValues) => {
    onSave(values);
    form.reset();
    onClose();
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{initialActivity ? "Edit Garden Activity" : "Add Garden Activity"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <BasicInfoFields control={form.control} />
            <DateTimeFields control={form.control} />
            <PriorityStatusFields control={form.control} />
            
            {showOutcomeFields && (
              <OutcomeFields control={form.control} />
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Activity</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityForm;
