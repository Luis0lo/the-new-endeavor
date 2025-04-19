import React, { useEffect, useState } from "react";
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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GardenActivity } from "@/types/garden";
import { BasicInfoFields } from "./BasicInfoFields";
import { DateTimeFields } from "./DateTimeFields";
import { PriorityStatusFields } from "./PriorityStatusFields";
import { OutcomeFields } from "./OutcomeFields";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { Switch } from "@/components/ui/switch";
import { InventoryItemsField } from "./InventoryItemsField";

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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: "",
      description: "",
      date: initialDate,
      time: format(new Date(), "HH:mm"),
      priority: "normal",
      status: "pending",
      track: true,
      inventory_items: []
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
        track: initialActivity.track !== undefined ? initialActivity.track : true,
        inventory_items: []
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
        track: true,
        inventory_items: []
      });
    }
  }, [initialActivity, initialDate, form]);

  const handleSubmit = async (values: ActivityFormValues) => {
    try {
      // Create the activity
      const { data: activity, error: activityError } = await supabase
        .from('garden_activities')
        .insert({
          title: values.title,
          description: values.description,
          scheduled_date: format(values.date, 'yyyy-MM-dd'),
          activity_time: values.time,
          priority: values.priority,
          status: values.status,
          track: values.track,
          outcome_rating: values.status === "done" ? values.outcome_rating : null,
          outcome_log: values.status === "done" ? values.outcome_log : null,
          user_id: user?.id
        })
        .select()
        .single();

      if (activityError) throw activityError;

      // If there are inventory items, create the relationships
      if (values.inventory_items.length > 0) {
        const { error: itemsError } = await supabase
          .from('activity_inventory_items')
          .insert(
            values.inventory_items.map(item => ({
              activity_id: activity.id,
              inventory_item_id: item.item_id,
              quantity: item.quantity
            }))
          );

        if (itemsError) throw itemsError;
      }

      onSave(values);
      form.reset();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
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
          <DialogTitle>
            {initialActivity ? "Edit Garden Activity" : "Add Garden Activity"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <BasicInfoFields control={form.control} />
            <DateTimeFields control={form.control} />
            <PriorityStatusFields control={form.control} />
            
            <FormField
              control={form.control}
              name="track"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Track Activity
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Track this activity for future reference and yearly planning
                    </div>
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormItem>
              )}
            />
            
            <InventoryItemsField control={form.control} />
            
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
