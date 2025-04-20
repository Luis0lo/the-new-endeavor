
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
  outcome_rating: z.number().min(1).max(5).optional().nullable(),
  outcome_log: z.string().optional().nullable(),
  inventory_items: z.array(
    z.object({
      item_id: z.string().min(1, "Please select an item"),
      quantity: z.number().min(1, "Quantity must be at least 1")
    })
  ).default([])
}).superRefine((data, ctx) => {
  // Only validate outcome_rating when status is "done"
  if (data.status === "done") {
    if (data.outcome_rating === undefined || data.outcome_rating === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Outcome rating is required when status is Done",
        path: ["outcome_rating"]
      });
    }
  }
});

export type ActivityFormValues = z.infer<typeof activitySchema>;
