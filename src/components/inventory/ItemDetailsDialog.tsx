
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDays, Hourglass } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface ActivityUsage {
  activity_id: string;
  title: string;
  scheduled_date: string;
  quantity: number;
}

interface ItemDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    id: string;
    name: string;
    quantity: number;
    expiration_date: string | null;
    purchase_date: string | null;
    description: string | null;
  } | null;
}

export function ItemDetailsDialog({
  open,
  onOpenChange,
  item
}: ItemDetailsDialogProps) {
  const [activityUsage, setActivityUsage] = useState<ActivityUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsed, setTotalUsed] = useState(0);

  useEffect(() => {
    async function fetchActivityUsage() {
      if (!item?.id || !open) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('activity_inventory_items')
          .select(`
            quantity,
            activity:garden_activities(
              id,
              title,
              scheduled_date
            )
          `)
          .eq('inventory_item_id', item.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const usage = data.map(record => ({
          activity_id: record.activity.id,
          title: record.activity.title,
          scheduled_date: record.activity.scheduled_date,
          quantity: record.quantity
        }));

        const total = usage.reduce((sum, record) => sum + record.quantity, 0);
        
        setActivityUsage(usage);
        setTotalUsed(total);
      } catch (error) {
        console.error('Error fetching activity usage:', error);
        toast({
          title: "Error",
          description: "Could not load item usage history",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchActivityUsage();
  }, [item?.id, open]);

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Purchased: {item.purchase_date ? format(new Date(item.purchase_date), 'MMM d, yyyy') : 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Hourglass className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Expires: {item.expiration_date ? format(new Date(item.expiration_date), 'MMM d, yyyy') : 'N/A'}
              </span>
            </div>
          </div>

          {item.description && (
            <p className="text-sm text-muted-foreground">{item.description}</p>
          )}

          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Inventory Summary</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="block text-muted-foreground">Initial Amount</span>
                  <span className="font-medium">{item.quantity}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground">Used in Activities</span>
                  <span className="font-medium">{totalUsed}</span>
                </div>
                <div>
                  <span className="block text-muted-foreground">Remaining</span>
                  <span className="font-medium">{item.quantity - totalUsed}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Activity History</h3>
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : activityUsage.length > 0 ? (
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {activityUsage.map((usage) => (
                    <Card key={usage.activity_id}>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-sm font-medium">{usage.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(usage.scheduled_date), 'MMM d, yyyy')}
                            </p>
                          </div>
                          <span className="text-sm">
                            Used: {usage.quantity}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                This item hasn't been used in any activities yet.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
