import { useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppointmentEntry } from "@/app/(dashboard)/scheduler/dummy-data/dummy-appointments"
import { AppointmentActionsMenu } from "./appointment-action-menu"
import { Badge } from "@/components/ui/badge"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AppointmentsTableProps {
  data: AppointmentEntry[]
  onEdit: (appointment: AppointmentEntry) => void
  onConfirm: (appointment: AppointmentEntry) => void
  onCancel: (appointment: AppointmentEntry) => void
}

export function AppointmentsTable({ data, onEdit, onConfirm, onCancel }: AppointmentsTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])

  const columns: ColumnDef<AppointmentEntry>[] = [
    {
      accessorKey: "patientId",
      header: "Patient ID",
    },
    {
      accessorKey: "patientName",
      header: "Patient Name",
      cell: ({ row }) => <span className="font-medium">{row.original.patientName}</span>,
    },
    {
      accessorKey: "ageSex",
      header: "Age/Sex",
    },
    {
      accessorKey: "appointmentDate",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.original.appointmentDate)
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      },
      sortingFn: (rowA, rowB) => {
        const dateA = new Date(rowA.original.appointmentDate).getTime()
        const dateB = new Date(rowB.original.appointmentDate).getTime()
        return dateA - dateB
      },
    },
    {
      accessorKey: "appointmentTime",
      header: "Time",
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "provider",
      header: "Physician",
    },
    {
      accessorKey: "visitType",
      header: "Visit Type",
      cell: ({ row }) => {
        const type = row.original.visitType
        const variant = type === "New" ? "default" : "secondary"
        return <Badge variant={variant}>{type}</Badge>
      },
    },
    {
      accessorKey: "bookingStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.bookingStatus
        const variant =
          status === "Confirmed"
            ? "default"
            : status === "Cancelled"
            ? "destructive"
            : "secondary"
        return <Badge variant={variant}>{status}</Badge>
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <AppointmentActionsMenu
          appointment={row.original}
          onEdit={onEdit}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      ),
    },
  ]

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
      sorting,
    },
  })

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    aria-sort={
                      header.column.getIsSorted() === "asc"
                        ? "ascending"
                        : header.column.getIsSorted() === "desc"
                        ? "descending"
                        : "none"
                    }
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          header.column.getCanSort() &&
                            "flex h-full cursor-pointer items-center justify-between gap-2 select-none"
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                        onKeyDown={(e) => {
                          if (header.column.getCanSort() && (e.key === "Enter" || e.key === " ")) {
                            e.preventDefault()
                            header.column.getToggleSortingHandler()?.(e)
                          }
                        }}
                        tabIndex={header.column.getCanSort() ? 0 : undefined}
                      >
                        <span className="truncate">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        {{
                          asc: <ChevronUpIcon className="shrink-0 opacity-60" size={16} />,
                          desc: <ChevronDownIcon className="shrink-0 opacity-60" size={16} />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No appointments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="btn-outline btn-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <span className="text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            className="btn-outline btn-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
