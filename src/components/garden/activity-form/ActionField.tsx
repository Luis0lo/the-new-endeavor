
import React from "react";
import { Control } from "react-hook-form";
import { ActivityFormValues } from "./activity-form-schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActionFieldProps {
  control: Control<ActivityFormValues>;
}

export const ActionField: React.FC<ActionFieldProps> = ({ control }) => {
  return (
    <FormField
      control={control}
      name="action"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Action</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="plant">Plant</SelectItem>
                <SelectItem value="transplant">Transplant</SelectItem>
                <SelectItem value="seed">Seed</SelectItem>
                <SelectItem value="harvest">Harvest</SelectItem>
                <SelectItem value="water">Water</SelectItem>
                <SelectItem value="fertilize">Fertilize</SelectItem>
                <SelectItem value="prune">Prune</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
