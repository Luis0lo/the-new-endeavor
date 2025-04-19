
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ActivityFormContent } from "./ActivityFormContent";
import { useActivityForm } from "../hooks/useActivityForm";
import { GardenActivity } from "@/types/garden";
import { ActivityFormValues } from "../activity-form-schema";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ActivityFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: ActivityFormValues) => void;
  initialDate: Date;
  initialActivity?: GardenActivity | null;
}

export const ActivityFormDialog: React.FC<ActivityFormDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDate,
  initialActivity,
}) => {
  const { form, handleSubmit, showOutcomeFields } = useActivityForm(
    onSave,
    onClose,
    initialActivity,
    initialDate
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {initialActivity ? "Edit Garden Activity" : "Add Garden Activity"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-4 pr-2">
                <ActivityFormContent control={form.control} showOutcomeFields={showOutcomeFields} />
              </div>
            </ScrollArea>
            <DialogFooter className="mt-4">
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
