
import React from "react";
import { Control } from "react-hook-form";
import { ActivityFormValues } from "../activity-form-schema";
import { BasicInfoFields } from "../BasicInfoFields";
import { DateTimeFields } from "../DateTimeFields";
import { PriorityStatusFields } from "../PriorityStatusFields";
import { OutcomeFields } from "../OutcomeFields";
import { Switch } from "@/components/ui/switch";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { InventoryItemsField } from "../InventoryItemsField";
import { ActionField } from "../ActionField";

interface ActivityFormContentProps {
  control: Control<ActivityFormValues>;
  showOutcomeFields: boolean;
}

export const ActivityFormContent: React.FC<ActivityFormContentProps> = ({
  control,
  showOutcomeFields,
}) => {
  return (
    <>
      <BasicInfoFields control={control} />
      <DateTimeFields control={control} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActionField control={control} />
        <PriorityStatusFields control={control} />
      </div>
      
      <FormField
        control={control}
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
      
      <InventoryItemsField control={control} />
      
      {showOutcomeFields && (
        <OutcomeFields control={control} />
      )}
    </>
  );
};
