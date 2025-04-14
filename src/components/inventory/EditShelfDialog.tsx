
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Archive, Leaf, Wrench } from 'lucide-react';

interface EditShelfDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shelf: {
    id: string;
    name: string;
    type: 'seeds' | 'plants' | 'tools';
    description: string | null;
    position?: number;
  };
  onShelfUpdated: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['seeds', 'plants', 'tools'], {
    required_error: 'You must select a type',
  }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const EditShelfDialog: React.FC<EditShelfDialogProps> = ({
  open,
  onOpenChange,
  shelf,
  onShelfUpdated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: shelf.name,
      type: shelf.type,
      description: shelf.description || '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from('inventory_shelves')
        .update({
          name: data.name,
          type: data.type,
          description: data.description || null,
        })
        .eq('id', shelf.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Shelf updated successfully',
      });

      onOpenChange(false);
      onShelfUpdated();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update shelf',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Shelf</DialogTitle>
          <DialogDescription>
            Update the details of your inventory shelf.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shelf Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter shelf name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Shelf Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="seeds" />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center">
                          <Archive className="h-4 w-4 text-yellow-500 mr-2" />
                          Seeds
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="plants" />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center">
                          <Leaf className="h-4 w-4 text-green-500 mr-2" />
                          Plants
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="tools" />
                        </FormControl>
                        <FormLabel className="font-normal flex items-center">
                          <Wrench className="h-4 w-4 text-blue-500 mr-2" />
                          Tools
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a description for this shelf"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Shelf'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditShelfDialog;
