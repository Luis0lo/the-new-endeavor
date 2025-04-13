
import React from "react";
import { Control } from "react-hook-form";
import { ActivityFormValues } from "./activity-form-schema";
import { cn } from "@/lib/utils";
import { SmilePlus, Meh, SmileIcon, FrownIcon } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface OutcomeFieldsProps {
  control: Control<ActivityFormValues>;
}

export const OutcomeFields: React.FC<OutcomeFieldsProps> = ({ control }) => {
  return (
    <>
      <FormField
        control={control}
        name="outcome_rating"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Outcome Rating</FormLabel>
            <FormDescription>How satisfied are you with the results?</FormDescription>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => field.onChange(parseInt(value))}
                defaultValue={field.value?.toString()}
                className="flex justify-between pt-2"
              >
                <FormItem className="flex flex-col items-center space-y-1">
                  <FormControl>
                    <RadioGroupItem value="1" className="sr-only" />
                  </FormControl>
                  <FormLabel className="cursor-pointer">
                    <FrownIcon className={cn(
                      "h-8 w-8", 
                      field.value === 1 ? "text-red-500 scale-125" : "text-muted-foreground"
                    )} />
                  </FormLabel>
                </FormItem>
                
                <FormItem className="flex flex-col items-center space-y-1">
                  <FormControl>
                    <RadioGroupItem value="2" className="sr-only" />
                  </FormControl>
                  <FormLabel className="cursor-pointer">
                    <FrownIcon className={cn(
                      "h-8 w-8", 
                      field.value === 2 ? "text-orange-500 scale-125" : "text-muted-foreground"
                    )} />
                  </FormLabel>
                </FormItem>
                
                <FormItem className="flex flex-col items-center space-y-1">
                  <FormControl>
                    <RadioGroupItem value="3" className="sr-only" />
                  </FormControl>
                  <FormLabel className="cursor-pointer">
                    <Meh className={cn(
                      "h-8 w-8", 
                      field.value === 3 ? "text-yellow-500 scale-125" : "text-muted-foreground"
                    )} />
                  </FormLabel>
                </FormItem>
                
                <FormItem className="flex flex-col items-center space-y-1">
                  <FormControl>
                    <RadioGroupItem value="4" className="sr-only" />
                  </FormControl>
                  <FormLabel className="cursor-pointer">
                    <SmileIcon className={cn(
                      "h-8 w-8", 
                      field.value === 4 ? "text-green-500 scale-125" : "text-muted-foreground"
                    )} />
                  </FormLabel>
                </FormItem>
                
                <FormItem className="flex flex-col items-center space-y-1">
                  <FormControl>
                    <RadioGroupItem value="5" className="sr-only" />
                  </FormControl>
                  <FormLabel className="cursor-pointer">
                    <SmilePlus className={cn(
                      "h-8 w-8", 
                      field.value === 5 ? "text-emerald-500 scale-125" : "text-muted-foreground"
                    )} />
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="outcome_log"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Outcome Log</FormLabel>
            <FormDescription>Record your observations or results</FormDescription>
            <FormControl>
              <Textarea 
                placeholder="What were the results of this activity? How did it go?"
                className="min-h-[100px]"
                {...field} 
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
