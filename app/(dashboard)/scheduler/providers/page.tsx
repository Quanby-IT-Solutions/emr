"use client"

import React, { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { UserRole } from "@/lib/auth/roles"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format, startOfToday } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Departments, Provider } from "@/app/(dashboard)/scheduler/dummy-data/dummy-providers"
import { DailyView } from "./components/daily-view"
import { WeeklyView } from "./components/weekly-view"

export default function ProviderSchedulePage() {
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily")
  const [selectedProvider, setSelectedProvider] = useState<Provider & { department: string } | null>(null)
  const [date, setDate] = useState<Date>(startOfToday())
  const [department, setDepartment] = useState("All")
  const [search, setSearch] = useState("")

  const filteredData = Departments
    .filter((d) => department === "All" || d.department === department)
    .map((dept) => ({
      ...dept,
      providers: dept.providers.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((d) => d.providers.length > 0)

  const handleProviderClick = (provider: Provider & { department: string }) => {
    setSelectedProvider(provider)
    setViewMode("weekly")
  }

  return (
    <ProtectedRoute requiredRole={UserRole.SCHEDULER}>
      <DashboardLayout role={UserRole.SCHEDULER}>
        <div className="px-4 py-6 space-y-6">
          <header>
            <h1 className="text-2xl font-bold">Provider Schedules</h1>
            <p className="text-muted-foreground">
              Manage provider availability and schedules
            </p>
          </header>

          {/* Filter toolbar */}
          <div className="bg-white/80 border border-border rounded-xl shadow-md p-4 flex flex-wrap gap-4 sticky top-0 z-20">
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-[200px] bg-background text-sm border shadow-sm rounded-lg">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Departments</SelectItem>
                {Departments.map((d) => (
                  <SelectItem key={d.department} value={d.department}>
                    {d.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder="Search provider..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded-lg border text-sm shadow-sm bg-background flex-1 min-w-[220px]"
            />

            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 border rounded-lg px-4 py-2 shadow-sm text-sm hover:bg-muted/50">
                  <CalendarIcon className="h-4 w-4" />
                  {format(date, "MMM d, yyyy")}
                </button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(day) => day && setDate(day)}
                />
              </PopoverContent>
            </Popover>

            <Button
              variant={viewMode === "daily" ? "default" : "outline"}
              onClick={() => setViewMode("daily")}
            >
              Daily
            </Button>
            <Button
              variant={viewMode === "weekly" ? "default" : "outline"}
              disabled={!selectedProvider}
              onClick={() => setViewMode("weekly")}
            >
              Weekly
            </Button>
          </div>

          {/* Daily view */}
          {viewMode === "daily" && (
            <DailyView 
              filteredData={filteredData} 
              date={date}
              onProviderClick={handleProviderClick}
            />
          )}

          {/* Weekly view */}
          {viewMode === "weekly" && selectedProvider && (
            <WeeklyView provider={selectedProvider} />
          )}

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}