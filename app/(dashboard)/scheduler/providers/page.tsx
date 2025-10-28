"use client"

import React, { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { format, isSameDay, startOfToday } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

// --------------------
// Appointment details
// --------------------
export interface Appointment {
  time: string
  patient: string
}

// --------------------
// Provider model
// --------------------
export interface Provider {
  name: string
  department: string
  shift: string // replaces "availability[]" as a daily window
  availability: string[] // used in WEEKLY mode
  appointments: Appointment[]
  officeLocation: string
  contactSchedulerOnly: string
  publicContact: string
}

// --------------------
// Department model
// --------------------
export interface DepartmentData {
  department: string
  clinicLocation: string
  officePhone: string
  providers: Provider[]
}

// --------------------
// Weekly availability structure
// --------------------
export type WeeklyAvailability = {
  [providerName: string]: {
    [day: string]: string[]
  }
}

// --------------------
// Mock Data
// --------------------
export const mockData: DepartmentData[] = [
  {
    department: "Internal Medicine",
    clinicLocation: "Main Hospital Building - 2nd Floor",
    officePhone: "(555) 901-2234",
    providers: [
      {
        name: "Corey McDonald",
        department: "Internal Medicine",
        shift: "9:00 AM - 3:00 PM",
        availability: ["9:00 AM - 11:00 AM", "1:00 PM - 3:00 PM"],
        appointments: [
          { time: "9:30 AM", patient: "John Doe" },
          { time: "1:45 PM", patient: "Jane Smith" },
        ],
        officeLocation: "Room 205B",
        contactSchedulerOnly: "310-862-0026",
        publicContact: "(555) 722-3321"
      },
    ],
  },
  {
    department: "Family Medicine",
    clinicLocation: "Outpatient Clinic - Suite 14",
    officePhone: "(555) 589-9930",
    providers: [
      {
        name: "Kurt Clark",
        department: "Family Medicine",
        shift: "8:00 AM - 12:00 PM",
        availability: ["8:00 AM - 12:00 PM"],
        appointments: [
          { time: "10:15 AM", patient: "Bob Adams" },
          { time: "11:30 AM", patient: "Alice Lee" },
        ],
        officeLocation: "Room 102A",
        contactSchedulerOnly: "702-589-9930",
        publicContact: "(555) 111-2222"
      },
      {
        name: "Brandon Funk",
        department: "Family Medicine",
        shift: "10:00 AM - 4:00 PM",
        availability: ["10:00 AM - 4:00 PM"],
        appointments: [
          { time: "2:00 PM", patient: "Tom Harris" },
        ],
        officeLocation: "Suite 16 — Pediatrics Wing",
        contactSchedulerOnly: "702-589-8830",
        publicContact: "(555) 789-2221"
      },
    ],
  },
]

// --------------------
// Weekly Availability
// --------------------
export const mockWeeklyAvailability: WeeklyAvailability = {
  "Corey McDonald": {
    Monday: ["9:00 AM", "10:00 AM", "1:00 PM"],
    Tuesday: ["9:30 AM"],
    Wednesday: [],
    Thursday: ["11:00 AM", "3:00 PM"],
    Friday: ["8:30 AM", "1:30 PM"],
  },
  "Kurt Clark": {
    Monday: ["10:30 AM"],
    Tuesday: ["9:00 AM", "2:00 PM"],
    Wednesday: ["11:00 AM"],
    Thursday: [],
    Friday: ["3:30 PM"],
  },
  "Brandon Funk": {
    Monday: ["8:00 AM", "1:30 PM"],
    Tuesday: [],
    Wednesday: ["10:00 AM"],
    Thursday: ["9:45 AM"],
    Friday: ["11:30 AM"],
  },
}

export default function ProviderSchedulePage() {
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily")
  const [selectedProvider, setSelectedProvider] = useState<Provider & { department: string } | null>(null)
  const [date, setDate] = useState<Date>(startOfToday())
  const [department, setDepartment] = useState("All")
  const [search, setSearch] = useState("")

  const filteredData = mockData
    .filter((d) => department === "All" || d.department === department)
    .map((dept) => ({
      ...dept,
      providers: dept.providers.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((d) => d.providers.length > 0)

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
                {mockData.map((d) => (
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
            <div className="space-y-8">
              {filteredData.map((dept) => (
                <Card key={dept.department} className="p-5 shadow-lg bg-card/95">
                  
                  {/* Department Header */}
                  <h2 className="text-lg font-semibold mb-4 text-primary">
                    {dept.department}
                  </h2>

                  <div className="space-y-6">
                    {dept.providers.map((prov) => {
                      
                      const isToday = isSameDay(date, startOfToday());

                      const filteredAppointments = isToday ? prov.appointments : [];

                      return (
                        <div
                          key={prov.name}
                          className="p-4 border border-border rounded-lg grid grid-cols-1 md:grid-cols-3 gap-6 cursor-pointer hover:bg-muted/30 transition"
                          onClick={() => {
                            setSelectedProvider({ ...prov, department: dept.department });
                            setViewMode("weekly");
                          }}
                        >

                          {/* SECTION 1 — Provider Info */}
                          <div className="space-y-2">
                            <p className="text-base font-semibold">{prov.name}</p>

                            <p className="text-sm text-muted-foreground">
                              Shift: {prov.availability.join(", ")}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {format(date, "EEEE, MMM d")}
                            </p>

                            {/* Daily Appointments */}
                            <div className="pt-1">
                              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                                {isToday ? "Today’s Visits" : "Scheduled Visits"}
                              </p>

                              {filteredAppointments.length > 0 ? (
                                <ul className="text-xs space-y-1">
                                  {filteredAppointments.map((appt, idx) => (
                                    <li key={idx}>
                                      {appt.time} — {appt.patient}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-xs italic text-muted-foreground">
                                  No visits on this day
                                </p>
                              )}
                            </div>
                          </div>

                          {/* SECTION 2 — Dept / Clinic */}
                          <div className="space-y-2 text-sm">
                            <p className="text-xs font-semibold uppercase text-primary">
                              Department
                            </p>
                            <p>{dept.department}</p>

                            <p className="text-xs font-semibold uppercase text-primary mt-2">
                              Office Location
                            </p>
                            <p className="text-muted-foreground">
                              {prov.officeLocation ?? "Not Available"}
                            </p>
                          </div>

                          {/* SECTION 3 — Contacts */}
                          <div className="space-y-2 text-sm md:text-right">
                            <p className="text-xs font-semibold uppercase text-primary">
                              Contact Details
                            </p>

                            {prov.contactSchedulerOnly ? (
                              <p className="text-muted-foreground">
                                Scheduler Only: {prov.contactSchedulerOnly}
                              </p>
                            ) : (
                              <p className="text-muted-foreground italic">No scheduler line</p>
                            )}

                            {prov.publicContact && (
                              <p className="text-muted-foreground">
                                Patient Line: {prov.publicContact}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              ))}
            </div>
          )}



          {viewMode === "weekly" && selectedProvider && (
            <WeeklyView provider={selectedProvider} />
          )}

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

function WeeklyView({ provider }: { provider: Provider & { department: string } }) {
  const schedule = mockWeeklyAvailability[provider.name] ?? {}

  return (
    <Card className="shadow-lg bg-card/95 border border-border rounded-xl hover:shadow-xl transition">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-primary">
          Weekly Availability
        </CardTitle>

        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">{provider.name}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{provider.department}</span>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="p-6">
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(schedule).map(([day, slots]) => (
            <div key={day} className="text-center bg-muted/20 rounded-lg p-3">
              <p className="font-semibold">{day}</p>
              <div className="flex flex-col gap-2 mt-2">
                {slots.length > 0 ? (
                  slots.map((slot) => (
                    <button
                      key={slot}
                      className="border rounded-lg py-2 text-sm hover:bg-primary/10 transition"
                    >
                      {slot}
                    </button>
                  ))
                ) : (
                  <p className="text-muted-foreground text-xs italic">
                    No availability
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}




// "use client"

// import { DashboardLayout } from "@/components/dashboard-layout"
// import { ProtectedRoute } from "@/components/auth/protected-route"
// import { UserRole } from "@/lib/auth/roles"

// export default function ProvidersPage() {
//   return (
//     <ProtectedRoute requiredRole={UserRole.SCHEDULER}>
//       <DashboardLayout role={UserRole.SCHEDULER}>
//         <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
//           <div className="px-4 lg:px-6">
//             <h1 className="text-2xl font-bold">Provider Schedules</h1>
//             <p className="text-muted-foreground">
//               Manage provider availability and schedules
//             </p>
//           </div>
//           <div className="px-4 lg:px-6">
//             <div>Sample page
              

//             </div>
//           </div>
//         </div>
//       </DashboardLayout>
//     </ProtectedRoute>
//   )
// }
