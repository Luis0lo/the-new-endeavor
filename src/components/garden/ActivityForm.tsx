import React, { useEffect } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, SmilePlus, Meh, SmileIcon, FrownIcon, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { GardenActivity } from "@/types/garden";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const activitySchema = z.object({
  title: z.string().min(2, { message: "Title is required" }),
  description: z.string().optional(),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().optional(),
  priority: z.enum(["high", "normal", "low"]).default("normal"),
  status: z.enum(["pending", "in_progress", "done"]).default("pending"),
  outcome_rating: z.number().min(1).max(5).optional(),
  outcome_log: z.string().optional(),
});

type ActivityFormValues = z.infer<typeof activitySchema>;

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
    onClose(); // Add this line to close the modal after saving
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
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Watering plants" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Watered the tomatoes and peppers..." 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high" className="text-red-500 font-medium">
                          <div className="flex items-center">
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            High
                          </div>
                        </SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {showOutcomeFields && (
              <>
                <FormField
                  control={form.control}
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
                  control={form.control}
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
