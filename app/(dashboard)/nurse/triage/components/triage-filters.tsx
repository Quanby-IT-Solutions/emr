"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Search } from "lucide-react"

interface TriageFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedTriageType: string
  onTriageTypeChange: (value: string) => void
  selectedTriageCategory: string
  onTriageCategoryChange: (value: string) => void
  selectedArrivalDate: Date | null
  onArrivalDateChange: (date: Date | null) => void
  selectedLastTriageDate: Date | null
  onLastTriageDateChange: (date: Date | null) => void
  isERMode: boolean
}

export function TriageFilters({
  searchQuery,
  onSearchChange,
  selectedTriageType,
  onTriageTypeChange,
  selectedTriageCategory,
  onTriageCategoryChange,
  selectedArrivalDate,
  onArrivalDateChange,
  selectedLastTriageDate,
  onLastTriageDateChange,
  isERMode,
}: TriageFiltersProps) {

  return (
    <div className="grid gap-4 md:grid-cols-12">            
      {/* Search Bar */}
      <div className={`space-y-2 ${isERMode ? 'md:col-span-4' : 'md:col-span-6'}`}>
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Patient name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 "
          />
        </div>
      </div>

      {/* Arrival Date Filter */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="date">Arrival Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center justify-center gap-2 border rounded-lg px-4 py-2 shadow-sm text-sm hover:bg-muted/50 w-full">
              <CalendarIcon className="h-4 w-4" />
              {selectedArrivalDate ? format(selectedArrivalDate, "MMM d, yyyy") : "Select date"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
          <Calendar
              mode="single"
              selected={selectedArrivalDate || undefined}
              onSelect={(day) => onArrivalDateChange(day || null)}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Last Triage Date Filter - Only show in ER mode */}
      {isERMode && (
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="date">Last Triage Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center justify-center gap-2 border rounded-lg px-4 py-2 shadow-sm text-sm hover:bg-muted/50 w-full">
                <CalendarIcon className="h-4 w-4" />
                {selectedLastTriageDate ? format(selectedLastTriageDate, "MMM d, yyyy") : "Select date"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
            <Calendar
                mode="single"
                selected={selectedLastTriageDate || undefined}
                onSelect={(day) => onLastTriageDateChange(day || null)}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {/* Triage Type Filter */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="triageType">Triage Type</Label>
        <Select value={selectedTriageType} onValueChange={onTriageTypeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="EMERGENCY">Emergency</SelectItem>
            <SelectItem value="OPD">Outpatient</SelectItem>
            <SelectItem value="WALK_IN">Walk-in</SelectItem>
            <SelectItem value="REFERRAL">Referral</SelectItem>
            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
            <SelectItem value="OTHER">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Triage Category Filter */}
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="triageCategory">Triage Category</Label>
        <Select value={selectedTriageCategory} onValueChange={onTriageCategoryChange}>
          <SelectTrigger id="triageCategory" className="w-full">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="EMERGENT">Emergent</SelectItem>
            <SelectItem value="URGENT">Urgent</SelectItem>
            <SelectItem value="NON_URGENT">Non-urgent</SelectItem>
            <SelectItem value="DEAD">Deceased</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}