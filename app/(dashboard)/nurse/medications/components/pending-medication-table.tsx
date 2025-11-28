import { useState } from "react"
import { MedicationProfile } from "@/app/(dashboard)/dummy-data/dummy-medication-admin"
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable, ColumnDef, SortingState, getSortedRowModel } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, Eye, PillBottle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface PendingMedicationTableProps {
    data: MedicationProfile[]
    onViewRecord: (record: MedicationProfile) => void
    onAdminister: (record: MedicationProfile) => void
    // selectedPatient: MedicationProfile | null
}

export default function PendingMedicationTable({data, onViewRecord, onAdminister}: PendingMedicationTableProps) {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })
    
    const [sorting, setSorting] = useState<SortingState>([])

    const columns: ColumnDef<MedicationProfile>[] = [
        {
            accessorKey: "patient.patientId",
            header: "Patient ID",
        },
        {
            accessorKey: "patient.patientName",
            header: "Patient Name",
        },
        {
            accessorKey: "patient.ageSex",
            header: "Age/Sex",
        },
        {
            accessorKey: "patient.currentRoom",
            header: "Room",
        },
        {
            id: "pendingOrders",
            accessorKey: "patient.medicationOrders",
            header: "Pending Orders",
            cell: ({ row }) => {
                const orders = row.original.patient.medicationOrders
                return (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                        {orders.length} pending
                    </Badge>
                )
            }
        },
        {
            id: "nextScheduled",
            accessorKey: "patient.medicationOrders",
            header: "Next Scheduled",
            cell: ({ row }) => {
                const orders = row.original.patient.medicationOrders
                if (orders.length === 0) return "N/A"
                
                // Get the earliest scheduled time
                const earliestOrder = orders.reduce((earliest, current) => {
                    if (current.timeAdminSchedule === "PRN") return earliest
                    if (earliest.timeAdminSchedule === "PRN") return current
                    return current.timeAdminSchedule < earliest.timeAdminSchedule ? current : earliest
                })
                
                if (earliestOrder.timeAdminSchedule === "PRN") return "PRN"
                
                // Format time to 24-hour format
                const time = earliestOrder.timeAdminSchedule.split(",")[0].trim()
                if (time.length === 4) {
                    const hours = time.substring(0, 2)
                    const minutes = time.substring(2, 4)
                    return `${hours}:${minutes}`
                }
                return time
            }
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    size="sm" 
                                    className="bg-blue-500 hover:bg-blue-600 mr-2"
                                    onClick={() => onAdminister(row.original)}
                                >
                                    <PillBottle className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Administer Pending Medications</p>
                            </TooltipContent>
                        </Tooltip>

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
                            <p>View Medication Records</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )
            },
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

    const generatePageNumbers = () => {
        const totalPages = table.getPageCount()
        const current = table.getState().pagination.pageIndex
        const delta = 1
        const range: number[] = []

        for (let i = Math.max(0, current - delta); i <= Math.min(totalPages - 1, current + delta); i++) {
            range.push(i)
        }

        if (range[0] > 0) {
            if (range[0] > 1) range.unshift(-1)
            range.unshift(0)
        }
        if (range[range.length - 1] < totalPages - 1) {
            if (range[range.length - 1] < totalPages - 2) range.push(-1)
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
                                                        <ChevronUp
                                                            className="shrink-0 opacity-60"
                                                            size={16}
                                                        />
                                                    ),
                                                    desc: (
                                                        <ChevronDown
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
                                    No pending medication orders found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex w-full justify-between gap-6">
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

                <Pagination className="flex w-full justify-end">
                    <PaginationContent>
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
                                <ChevronsLeft className="h-4 w-4" />
                            </PaginationLink>
                        </PaginationItem>

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
                                <ChevronLeft className="h-4 w-4" />
                            </PaginationLink>
                        </PaginationItem>

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
                                <ChevronRight className="h-4 w-4" />
                            </PaginationLink>
                        </PaginationItem>

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
                                <ChevronsRight className="h-4 w-4" />
                            </PaginationLink>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}