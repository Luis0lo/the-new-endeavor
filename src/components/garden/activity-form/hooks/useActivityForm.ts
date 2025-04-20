
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { activitySchema, type ActivityFormValues } from "../activity-form-schema";
import { GardenActivity } from "@/types/garden";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useActivityForm = (
  onSave: (values: ActivityFormValues) => void,
  onClose: () => void,
  initialActivity?: GardenActivity | null,
  initialDate?: Date
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activityItems, setActivityItems] = useState<{ item_id: string; quantity: number }[]>([]);

  // Custom resolver to conditionally validate outcome fields only when status is "done"
  const customResolver = zodResolver(activitySchema);

  const form = useForm<ActivityFormValues>({
    resolver: customResolver,
    defaultValues: {
      title: "",
      description: "",
      date: initialDate || new Date(),
      time: format(new Date(), "HH:mm"),
      priority: "normal",
      status: "pending",
      track: true,
      outcome_rating: null,
      outcome_log: "",
      inventory_items: []
    },
    mode: "onChange"
  });

  // Watch the status field to update outcome fields validation
  const status = form.watch("status");
  
  // Reset outcome fields when status changes away from "done"
  useEffect(() => {
    if (status !== "done") {
      form.setValue("outcome_rating", null);
    }
  }, [status, form]);

  // Fetch inventory items for the activity when editing
  useEffect(() => {
    const fetchActivityItems = async () => {
      if (initialActivity?.id) {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from('activity_inventory_items')
            .select('inventory_item_id, quantity')
            .eq('activity_id', initialActivity.id);
          
          if (error) throw error;
          
          if (data) {
            const formattedItems = data.map(item => ({
              item_id: item.inventory_item_id,
              quantity: item.quantity
            }));
            setActivityItems(formattedItems);
            form.setValue("inventory_items", formattedItems);
            console.log("Loaded activity items:", formattedItems);
          }
        } catch (error) {
          console.error("Error fetching activity items:", error);
          toast({
            title: "Error loading inventory items",
            description: "Could not load the inventory items for this activity",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setActivityItems([]);
        form.setValue("inventory_items", []);
      }
    };

    fetchActivityItems();
  }, [initialActivity, form]);

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
        outcome_rating: initialActivity.outcome_rating || null,
        outcome_log: initialActivity.outcome_log || "",
        track: initialActivity.track !== undefined ? initialActivity.track : true,
        inventory_items: activityItems
      });
    } else {
      form.reset({
        title: "",
        description: "",
        date: initialDate || new Date(),
        time: format(new Date(), "HH:mm"),
        priority: "normal",
        status: "pending",
        outcome_rating: null,
        outcome_log: "",
        track: true,
        inventory_items: []
      });
    }
  }, [initialActivity, initialDate, form, activityItems]);

  const handleSubmit = async (values: ActivityFormValues) => {
    onSave(values);
    form.reset();
    onClose();
  };

  return {
    form,
    isLoading,
    handleSubmit: form.handleSubmit(handleSubmit),
    showOutcomeFields: form.watch("status") === "done"
  };
};
