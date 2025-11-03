"use client"

import { useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
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

export type Patient = {
  id: string
  firstName: string
  middleName: string
  lastName: string
  mobileNumber: string
  birthday: string
  age: number
}

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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
  })

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
      <Input
        placeholder="Search by name or ID..."
        value={globalFilter ?? ""}
        onChange={(event) => setGlobalFilter(event.target.value)}
        className="max-w-sm"
      />
      <div className="rounded-md border">
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
                      ? '!bg-primary !text-primary-foreground hover:!bg-primary/90 hover:!text-primary-foreground'
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
      </div>
    </div>
  )
}