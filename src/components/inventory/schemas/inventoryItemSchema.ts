
import * as z from 'zod';

export const inventoryItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  quantity: z.number().min(0, 'Quantity must be 0 or greater'),
  description: z.string().optional(),
  expiration_date: z.date().optional().nullable(),
  purchase_date: z.date().optional().nullable(),
  brand: z.string().optional(),
  condition: z.string().optional(),
  notes: z.string().optional(),
});

export type InventoryItemFormValues = z.infer<typeof inventoryItemSchema>;
