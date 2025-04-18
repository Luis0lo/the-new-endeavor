
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { inventoryItemSchema, type InventoryItemFormValues } from './schemas/inventoryItemSchema';
import { BasicItemFields } from './form-fields/BasicItemFields';
import { DateFields } from './form-fields/DateFields';
import { ToolFields } from './form-fields/ToolFields';

interface EditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shelf: {
    id: string;
    type: 'seeds' | 'plants' | 'tools';
  };
  item: {
    id: string;
    name: string;
    quantity: number;
    description: string | null;
    expiration_date: string | null;
    purchase_date: string | null;
    condition: string | null;
    brand: string | null;
    notes: string | null;
  };
  onItemUpdated: () => void;
}

const EditItemDialog = ({
  open,
  onOpenChange,
  shelf,
  item,
  onItemUpdated,
}: EditItemDialogProps) => {
  // Reset the form when the item changes (this ensures if we edit different items, the form updates)
  const form = useForm<InventoryItemFormValues>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      name: item.name,
      quantity: item.quantity,
      description: item.description || '',
      expiration_date: item.expiration_date ? new Date(item.expiration_date) : null,
      purchase_date: item.purchase_date ? new Date(item.purchase_date) : null,
      brand: item.brand || '',
      condition: item.condition || '',
      notes: item.notes || '',
    },
  });

  // Reset form values when item changes
  React.useEffect(() => {
    if (item) {
      form.reset({
        name: item.name,
        quantity: item.quantity,
        description: item.description || '',
        expiration_date: item.expiration_date ? new Date(item.expiration_date) : null,
        purchase_date: item.purchase_date ? new Date(item.purchase_date) : null,
        brand: item.brand || '',
        condition: item.condition || '',
        notes: item.notes || '',
      });
    }
  }, [form, item]);

  const onSubmit = async (values: InventoryItemFormValues) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .update({
          name: values.name,
          quantity: values.quantity,
          description: values.description || null,
          expiration_date: values.expiration_date ? values.expiration_date.toISOString().split('T')[0] : null,
          purchase_date: values.purchase_date ? values.purchase_date.toISOString().split('T')[0] : null,
          brand: values.brand || null,
          condition: values.condition || null,
          notes: values.notes || null,
        })
        .eq('id', item.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item updated successfully",
      });

      onOpenChange(false);
      onItemUpdated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update item",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit {item.name}</DialogTitle>
          <DialogDescription>
            Make changes to your inventory item here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <BasicItemFields form={form} />
            
            {shelf.type === 'seeds' && (
              <DateFields form={form} showExpirationDate />
            )}

            {shelf.type !== 'seeds' && (
              <ToolFields 
                form={form} 
                showCondition={shelf.type === 'tools'} 
              />
            )}

            <DateFields form={form} />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog;
