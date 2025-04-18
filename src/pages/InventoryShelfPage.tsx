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

const InventoryShelfPage = () => {
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
  
  const handleDeleteItem = async (item: InventoryItem) => {
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
    }
  };
  
  const getShelfIcon = (type?: 'seeds' | 'plants' | 'tools') => {
    switch (type) {
      case 'seeds':
        return <Archive className="h-6 w-6 text-yellow-500" />;
      case 'plants':
        return <Leaf className="h-6 w-6 text-green-500" />;
      case 'tools':
        return <Wrench className="h-6 w-6 text-blue-500" />;
      default:
        return <Archive className="h-6 w-6" />;
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const handleEditItem = (item: InventoryItem) => {
    setItemToEdit(item);
    setEditDialogOpen(true);
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
          <div className="flex items-center justify-end gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleEditItem(item)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleDeleteItem(item)}
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
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
            </Table>
          </div>
        )}
      </div>
      
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
        onOpenChange={setDeleteDialogOpen}
        title="Delete Inventory Item"
        description={`Are you sure you want to delete ${itemToDelete?.name}? This action cannot be undone.`}
        onConfirm={confirmDeleteItem}
      />

      {itemToEdit && (
        <EditItemDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          shelf={shelf!}
          item={itemToEdit}
          onItemUpdated={fetchShelfItems}
        />
      )}
    </DashboardLayout>
  );
};

export default InventoryShelfPage;
