"use client"

import { useState, useEffect } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { Patient } from "@/app/(dashboard)/scheduler/dummy-data/dummy-patients"

interface DataTableProps {
  data: Patient[]
  onPatientSelect: (patient: Patient | null) => void
  selectedPatientId: string | null
}

export function PatientDataTable({ data, onPatientSelect, selectedPatientId }: DataTableProps) {
  const [globalFilter, setGlobalFilter] = useState("")

  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: "id",
      header: "Patient ID",
    },
    {
      accessorKey: "firstName",
      header: "First Name",
    },
    {
      accessorKey: "middleName",
      header: "Middle Name",
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
    },
  ]

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase()
      const patient = row.original
      
      return (
        patient.id.toLowerCase().includes(searchValue) ||
        patient.firstName.toLowerCase().includes(searchValue) ||
        patient.middleName.toLowerCase().includes(searchValue) ||
        patient.lastName.toLowerCase().includes(searchValue)
      )
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  })

  // When a new patient is selected, navigate to the page containing that patient
  useEffect(() => {
    if (!selectedPatientId) return

    const timer = setTimeout(() => {
      const rows = table.getFilteredRowModel().rows
      const selectedRowIndex = rows.findIndex(
        (row) => row.original.id === selectedPatientId
      )

      if (selectedRowIndex !== -1) {
        const pageSize = table.getState().pagination.pageSize
        const targetPage = Math.floor(selectedRowIndex / pageSize)
        table.setPageIndex(targetPage)
      }
    }, 0)

    return () => clearTimeout(timer)
  }, [selectedPatientId, table])


  const handleRowClick = (patient: Patient) => {
    if (selectedPatientId === patient.id) {
      // Deselect if clicking the same row
      onPatientSelect(null)
    } else {
      onPatientSelect(patient)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <div className="p-4 border-b">
          <Input
            placeholder="Search by name or ID..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="w-full"
          />
        </div>
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={selectedPatientId === row.original.id && "selected"}
                  onClick={() => handleRowClick(row.original)}
                  className={`cursor-pointer transition-colors duration-200 ease-linear ${
                    selectedPatientId === row.original.id
                      ? 'bg-primary! text-primary-foreground! hover:bg-primary/90! hover:text-primary-foreground!'
                      : ''
                  }`}
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No patients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-xs text-muted-foreground">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <div className="text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export type { Patient }