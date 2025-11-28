import { useState } from "react"
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable, ColumnDef, SortingState, getSortedRowModel } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppointmentEntry } from "@/app/(dashboard)/dummy-data/dummy-appointments"
import { AppointmentActionsMenu } from "./appointment-action-menu"
import { Badge } from "@/components/ui/badge"
import { ChevronUpIcon, ChevronDownIcon, ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"

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
      cell: ({ row }) => (
        <span className="font-medium">{row.original.patientName}</span>
      ),
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

  // --- Helper to generate adaptive pagination pages ---
  const generatePageNumbers = () => {
    const totalPages = table.getPageCount()
    const current = table.getState().pagination.pageIndex
    const delta = 1 // show one before and after current
    const range: number[] = []

    for (let i = Math.max(0, current - delta); i <= Math.min(totalPages - 1, current + delta); i++) {
      range.push(i)
    }

    // Always include first and last
    if (range[0] > 0) {
      if (range[0] > 1) range.unshift(-1) // ellipsis
      range.unshift(0)
    }
    if (range[range.length - 1] < totalPages - 1) {
      if (range[range.length - 1] < totalPages - 2) range.push(-1) // ellipsis
      range.push(totalPages - 1)
    }

    return range
  }

  const pages = generatePageNumbers()

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
                          if (
                            header.column.getCanSort() &&
                            (e.key === "Enter" || e.key === " ")
                          ) {
                            e.preventDefault()
                            header.column.getToggleSortingHandler()?.(e)
                          }
                        }}
                        tabIndex={header.column.getCanSort() ? 0 : undefined}
                      >
                        <span className="truncate">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        {{
                          asc: (
                            <ChevronUpIcon
                              className="shrink-0 opacity-60"
                              size={16}
                            />
                          ),
                          desc: (
                            <ChevronDownIcon
                              className="shrink-0 opacity-60"
                              size={16}
                            />
                          ),
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

    {/* --- Pagination --- */}
    <div className="flex w-full items-center justify-between gap-6">
      {/* Left: Rows per page */}
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-sm text-muted-foreground">Rows per page:</span>
        <Select
          value={pagination.pageSize.toString()}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger className="w-fit">
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

      {/* Right: Pagination controls */}
      <Pagination className="flex w-full justify-end">
        <PaginationContent>
          {/* First */}
          <PaginationItem>
            <PaginationLink
              href="#"
              aria-label="Go to first page"
              size="icon"
              className={cn(
                "rounded-full",
                !table.getCanPreviousPage() && "opacity-50 pointer-events-none"
              )}
              onClick={(e) => {
                e.preventDefault();
                if (!table.getCanPreviousPage()) return;
                table.setPageIndex(0);
              }}
            >
              <ChevronFirstIcon className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>

          {/* Prev */}
          <PaginationItem>
            <PaginationLink
              href="#"
              aria-label="Go to previous page"
              size="icon"
              className={cn(
                "rounded-full",
                !table.getCanPreviousPage() && "opacity-50 pointer-events-none"
              )}
              onClick={(e) => {
                e.preventDefault();
                if (!table.getCanPreviousPage()) return;
                table.previousPage();
              }}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>

          {/* Page numbers */}
          {pages.map((page, idx) =>
            page === -1 ? (
              <PaginationItem key={`ellipsis-${idx}`}>
                <span className="px-3 text-muted-foreground">...</span>
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    table.setPageIndex(page);
                  }}
                  isActive={table.getState().pagination.pageIndex === page}
                  className="rounded-full"
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          {/* Next */}
          <PaginationItem>
            <PaginationLink
              href="#"
              aria-label="Go to next page"
              size="icon"
              className={cn(
                "rounded-full",
                !table.getCanNextPage() && "opacity-50 pointer-events-none"
              )}
              onClick={(e) => {
                e.preventDefault();
                if (!table.getCanNextPage()) return;
                table.nextPage();
              }}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>

          {/* Last */}
          <PaginationItem>
            <PaginationLink
              href="#"
              aria-label="Go to last page"
              size="icon"
              className={cn(
                "rounded-full",
                !table.getCanNextPage() && "opacity-50 pointer-events-none"
              )}
              onClick={(e) => {
                e.preventDefault();
                if (!table.getCanNextPage()) return;
                table.setPageIndex(table.getPageCount() - 1);
              }}
            >
              <ChevronLastIcon className="h-4 w-4" />
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
    </div>
  )
}
