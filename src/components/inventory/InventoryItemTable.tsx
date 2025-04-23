import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  ArrowUpDown,
  Edit,
  Trash
} from "lucide-react";
import { flexRender, ColumnDef, useReactTable, getCoreRowModel, getSortedRowModel, SortingState } from "@tanstack/react-table";
import { format } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

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

interface InventoryShelf {
  id: string;
  name: string;
  type: "seeds" | "plants" | "tools";
  description: string | null;
}

interface InventoryItemTableProps {
  shelf: InventoryShelf | null;
  items: InventoryItem[];
  sorting: SortingState;
  setSorting: (s: SortingState) => void;
  onEditItem: (e: React.MouseEvent, item: InventoryItem) => void;
  onDeleteItem: (e: React.MouseEvent, item: InventoryItem) => void;
  onRowClick: (item: InventoryItem) => void;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return format(new Date(dateString), "MMM d, yyyy");
};

export const InventoryItemTable: React.FC<InventoryItemTableProps> = ({
  shelf,
  items,
  sorting,
  setSorting,
  onEditItem,
  onDeleteItem,
  onRowClick,
}) => {
  const isMobile = useIsMobile();

  const getMobileColumns = (): ColumnDef<InventoryItem>[] => [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div
            className="flex items-center justify-end gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => onEditItem(e, item)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => onDeleteItem(e, item)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const getDesktopColumns = (): ColumnDef<InventoryItem>[] => [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Quantity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    ...(shelf?.type === "seeds"
      ? [
          {
            accessorKey: "expiration_date",
            header: ({ column }) => (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Expiration
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            ),
            cell: ({ row }) => {
              const date = row.getValue("expiration_date");
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
        ]
      : [
          {
            accessorKey: "brand",
            header: ({ column }) => (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Brand
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            ),
          },
        ]),
    ...(shelf?.type === "tools"
      ? [
          {
            accessorKey: "condition",
            header: ({ column }) => (
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Condition
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            ),
          },
        ]
      : []),
    {
      accessorKey: "purchase_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Purchase Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue("purchase_date");
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
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div
            className="flex items-center justify-end gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => onEditItem(e, item)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => onDeleteItem(e, item)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const columns = isMobile ? getMobileColumns() : getDesktopColumns();

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
          <TableRow
            key={row.id}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onRowClick(row.original)}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
