"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Combobox } from "@/components/ui/combo-box"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Search } from "lucide-react"

interface AppointmentsFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedDepartment: string
  onDepartmentChange: (value: string) => void
  selectedStatus: string
  onStatusChange: (value: string) => void
  selectedVisitType: string
  onVisitTypeChange: (value: string) => void
  selectedDate: Date | null
  onDateChange: (date: Date | null) => void
  departments: string[]
}

export function AppointmentsFilters({
  searchQuery,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  selectedStatus,
  onStatusChange,
  selectedDate,
  onDateChange,
  selectedVisitType,
  onVisitTypeChange,
  departments,
}: AppointmentsFiltersProps) {

  return (
    <div className="grid gap-4 md:grid-cols-12">
      {/* Department Filter */}
      <div className="space-y-2 md:col-span-2">
        <Label>Department</Label>
        <Combobox
          options={[
            { value: "all", label: "All Departments" },
            ...departments.map((dept) => ({ value: dept, label: dept })),
          ]}
          value={selectedDepartment}
          onChange={onDepartmentChange}
          placeholder="Select department"
        />
      </div>
      
      {/* Search Bar */}
      <div className="space-y-2 md:col-span-4">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Patient name or ID..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 "
          />
        </div>
      </div>

      {/* Status Filter */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="status">Status</Label>
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger id="status" className="w-full">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Visit Type Filter */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="visitType">Visit Type</Label>
        <Select value={selectedVisitType} onValueChange={onVisitTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Follow-up">Follow-up</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date Filter */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center justify-center gap-2 border rounded-lg px-4 py-2 shadow-sm text-sm hover:bg-muted/50 w-full">
              <CalendarIcon className="h-4 w-4" />
              {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Select date"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
          <Calendar
              mode="single"
              selected={selectedDate || undefined}
              onSelect={(day) => onDateChange(day || null)}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}