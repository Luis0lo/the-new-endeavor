import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  Archive, 
  Leaf, 
  Wrench, 
  ChevronLeft,
  Calendar,
  ArrowUpDown,
  Edit,
  Trash
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AddItemDialog from '@/components/inventory/AddItemDialog';
import DeleteConfirmDialog from '@/components/inventory/DeleteConfirmDialog';
import EditItemDialog from '@/components/inventory/EditItemDialog';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { ItemDetailsDialog } from '@/components/inventory/ItemDetailsDialog';
import { getShelfIcon } from "@/components/inventory/inventoryIcons";
import { InventoryItemTable } from "@/components/inventory/InventoryItemTable";

interface InventoryShelf {
  id: string;
  name: string;
  type: 'seeds' | 'plants' | 'tools';
  description: string | null;
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  description: string | null;
  expiration_date: string | null;
  purchase_date: string | null;
  condition: string | null;
  brand: string | null;
  notes: string | null;
}

export default function InventoryShelfPage() {
  const { shelfId } = useParams<{ shelfId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [shelf, setShelf] = useState<InventoryShelf | null>(null);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteWarning, setDeleteWarning] = useState<null | string>(null); // Added for warning

  useEffect(() => {
    if (shelfId) {
      fetchShelfData();
      fetchShelfItems();
    }
  }, [shelfId]);
  
  const fetchShelfData = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('inventory_shelves')
        .select('*')
        .eq('id', shelfId)
        .single();
        
      if (error) throw error;
      
      setShelf(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch shelf data",
        variant: "destructive"
      });
      navigate('/dashboard/inventory');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchShelfItems = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('shelf_id', shelfId)
        .order('name', { ascending: true });
        
      if (error) throw error;
      
      setItems(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch shelf items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper to check if item is used
  const checkIfItemIsUsed = async (itemId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('activity_inventory_items')
      .select('id')
      .eq('inventory_item_id', itemId)
      .limit(1);

    return !!(data && data.length > 0);
  };
  
  const handleDeleteItem = async (e: React.MouseEvent, item: InventoryItem) => {
    // Explicitly stop propagation to prevent row click
    e.stopPropagation();
    // Prevent default to ensure no additional events are triggered
    e.preventDefault();

    // Check if used in any activities (show warning if so)
    setDeleteWarning(null);
    const isUsed = await checkIfItemIsUsed(item.id);
    if (isUsed) {
      setDeleteWarning(
        "This item has been used on an activity. Its deletion will remove the item from the record."
      );
    }

    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };
  
  const confirmDeleteItem = async () => {
    if (!itemToDelete) return;
    
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', itemToDelete.id);
        
      if (error) throw error;
      
      setItems(items.filter(item => item.id !== itemToDelete.id));
      
      toast({
        title: "Success",
        description: `${itemToDelete.name} has been removed from your inventory.`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete item",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      setDeleteWarning(null);
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const handleEditItem = (e: React.MouseEvent, item: InventoryItem) => {
    // Explicitly stop propagation to prevent row click
    e.stopPropagation();
    // Prevent default to ensure no additional events are triggered
    e.preventDefault();
    setItemToEdit(item);
    setEditDialogOpen(true);
  };

  const handleRowClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setDetailsDialogOpen(true);
  };

  const columns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'quantity',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Quantity
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    ...(shelf?.type === 'seeds' ? [
      {
        accessorKey: 'expiration_date',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Expiration
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => {
          const date = row.getValue('expiration_date');
          return date ? (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(date as string)}
            </div>
          ) : (
            <span className="text-muted-foreground">N/A</span>
          );
        },
      }
    ] : [
      {
        accessorKey: 'brand',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Brand
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
      }
    ]),
    ...(shelf?.type === 'tools' ? [
      {
        accessorKey: 'condition',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Condition
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
      }
    ] : []),
    {
      accessorKey: 'purchase_date',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Purchase Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = row.getValue('purchase_date');
        return date ? (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(date as string)}
          </div>
        ) : (
          <span className="text-muted-foreground">N/A</span>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div 
            className="flex items-center justify-end gap-2"
            // Add this to stop propagation at the div level as an extra precaution
            onClick={(e) => e.stopPropagation()}
          >
            <Button 
              variant="ghost" 
              size="icon"
              onClick={(e) => handleEditItem(e, item)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={(e) => handleDeleteItem(e, item)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: items,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Move tableBody definition AFTER table is defined
  const tableBody = (
    <TableBody>
      {table.getRowModel().rows.map((row) => (
        <TableRow 
          key={row.id}
          className="cursor-pointer hover:bg-muted/50"
          onClick={() => handleRowClick(row.original)}
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(
                cell.column.columnDef.cell,
                cell.getContext()
              )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => navigate('/dashboard/inventory')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            {loading ? (
              <div className="animate-pulse bg-muted h-8 w-40 rounded"></div>
            ) : (
              <>
                {getShelfIcon(shelf?.type)}
                {shelf?.name}
              </>
            )}
          </h2>
        </div>
        
        {!loading && shelf && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <p className="text-muted-foreground">
                {shelf.description || `This shelf contains ${shelf.type}.`}
              </p>
            </div>
            <Button onClick={() => setDialogOpen(true)} className="mt-4 md:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        )}
        
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : items.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent className="pt-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                {getShelfIcon(shelf?.type)}
                <h3 className="text-lg font-medium">No items found</h3>
                <p className="text-muted-foreground">
                  Start by adding items to your {shelf?.name} shelf.
                </p>
                <Button onClick={() => setDialogOpen(true)} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Item
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Refactored: use InventoryItemTable instead of local table logic
          <div className="overflow-x-auto">
            <InventoryItemTable
              shelf={shelf}
              items={items}
              sorting={sorting}
              setSorting={setSorting}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onRowClick={handleRowClick}
            />
          </div>
        )}

        {/* Add the ItemDetailsDialog */}
        <ItemDetailsDialog
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          item={selectedItem}
        />
        
        {shelf && (
          <AddItemDialog 
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            shelf={shelf}
            onItemAdded={fetchShelfItems}
          />
        )}
        
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={(open) => {
            setDeleteDialogOpen(open);
            if (!open) setDeleteWarning(null);
          }}
          title="Delete Inventory Item"
          description={`Are you sure you want to delete ${itemToDelete?.name}? This action cannot be undone.`}
          onConfirm={confirmDeleteItem}
          showWarning={!!deleteWarning}
          warningMessage={deleteWarning || ""}
        />

        {itemToEdit && (
          <EditItemDialog
            open={editDialogOpen}
            onOpenChange={(open) => {
              setEditDialogOpen(open);
              // Clear the itemToEdit when dialog is closed
              if (!open) setItemToEdit(null);
            }}
            shelf={shelf!}
            item={itemToEdit}
            onItemUpdated={fetchShelfItems}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
