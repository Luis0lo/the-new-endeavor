
import React from 'react';
import { Control, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Plus, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface InventoryItemsFieldProps {
  control: Control<any>;
}

export const InventoryItemsField = ({ control }: InventoryItemsFieldProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "inventory_items"
  });

  const { data: shelves } = useQuery({
    queryKey: ['inventory-shelves'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_shelves')
        .select('*, inventory_items(*)');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <FormLabel>Inventory Items</FormLabel>
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={() => append({ item_id: '', quantity: 1 })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-4 items-start">
          <FormField
            control={control}
            name={`inventory_items.${index}.item_id`}
            render={({ field: itemField }) => (
              <FormItem className="flex-1">
                <Select
                  value={itemField.value}
                  onValueChange={itemField.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an item" />
                  </SelectTrigger>
                  <SelectContent>
                    {shelves?.map((shelf) => (
                      <React.Fragment key={shelf.id}>
                        <SelectItem value="" disabled className="font-semibold">
                          {shelf.name}
                        </SelectItem>
                        {shelf.inventory_items.map((item: any) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </React.Fragment>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`inventory_items.${index}.quantity`}
            render={({ field: quantityField }) => (
              <FormItem className="w-24">
                <Input
                  type="number"
                  min="1"
                  {...quantityField}
                />
              </FormItem>
            )}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => remove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
