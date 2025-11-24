import { useState } from "react"
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable, ColumnDef, SortingState, getSortedRowModel } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChevronUpIcon, ChevronDownIcon, ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"

import { TriageAssessment } from "@/app/(dashboard)/dummy-data/dummy-triage"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TriageTableProps {
  data: TriageAssessment[],
  onViewRecord: (assessment: TriageAssessment) => void
}

export function TriageTable({ data, onViewRecord }: TriageTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])

  const columns: ColumnDef<TriageAssessment>[] = [
    {
      accessorKey: "patient.id",
      header: "Patient ID",
    },
    {
      accessorKey: "patient.name",
      header: "Patient Name",
    },
    {
      accessorKey: "patient.ageSex",
      header: "Age/Sex",
    },
    {
        accessorKey: "patient.arrivalDetails.date",
        header: "Arrival Date",
        cell: ({ row }) => {
        const date = new Date(row.original.patient.arrivalDetails.date)
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      },
    },
    {
        accessorKey: "patient.arrivalDetails.time",
        header: "Arrival Time",
    },
    {
      accessorKey: "patient.arrivalDetails.department",
      header: "Triage Type",
      cell: ({ row }) => {
        const type = row.original.patient.arrivalDetails.department
        const variant = type === "EMERGENCY" ? "destructive" : "default"
        // console.log(row.original.patient.triageDetails[0].triageType)
        return <Badge variant={variant}>{type}</Badge>
      },
    },
    {
        accessorKey: "patient.currentTriageCategory",
        header: "Triage Category",
        cell: ({ row }) => {
        const category = row.original.patient.currentTriageCategory
        const variant = category === "EMERGENT" ? "destructive" : category === "URGENT" ? "warning" : "dimmed"
        return <Badge variant={variant}>{category}</Badge>
        }  
    },
    {
        accessorKey: "patient.status",
        header: "Status",
        cell: ({ row }) => {
        const status = row.original.patient.status
        const variant = status === "REFERRED" ? "warning" : status === "IN APT. QUEUE" ? "default" : status === "FOR DISCHARGE" ? "dimmed" : "tertiary"
        return <Badge variant={variant}>{status}</Badge>
        }
    },
    {
      accessorKey: "actions",
      header: "View Records",
      cell: ({ row }) => {
        return (
          <TooltipProvider>
            <div className="flex items-center justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    onClick={() => onViewRecord(row.original)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Triage Records</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        )
      },
    }
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
                  No triage assessments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

    {/* --- Pagination --- */}
    <div className="flex w-full justify-between gap-6">
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
