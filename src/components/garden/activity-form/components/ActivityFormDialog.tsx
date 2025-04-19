
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
      <DialogContent className="max-w-full h-screen flex flex-col m-0 rounded-none border-0">
        <DialogHeader>
          <DialogTitle>
            {initialActivity ? "Edit Garden Activity" : "Add Garden Activity"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4 max-w-3xl mx-auto py-6">
                <ActivityFormContent control={form.control} showOutcomeFields={showOutcomeFields} />
              </div>
            </ScrollArea>
            <DialogFooter className="mt-4 px-4 py-4 border-t bg-background">
              <div className="max-w-3xl w-full mx-auto flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Save Activity</Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

