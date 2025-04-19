
import * as z from 'zod';

export const activitySchema = z.object({
  title: z.string().min(2, { message: "Title is required" }),
  description: z.string().optional(),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().optional(),
  priority: z.enum(["high", "normal", "low"]).default("normal"),
  status: z.enum(["pending", "in_progress", "done"]).default("pending"),
  track: z.boolean().default(true),
  outcome_rating: z.number().min(1).max(5).optional(),
  outcome_log: z.string().optional(),
  inventory_items: z.array(z.object({
    item_id: z.string(),
    quantity: z.number().min(1)
  })).default([])
});

export type ActivityFormValues = z.infer<typeof activitySchema>;
