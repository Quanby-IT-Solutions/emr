import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IconCalendar, IconClock, IconUser, IconAlertCircle, IconAlertTriangle } from "@tabler/icons-react"
import Link from "next/link"

const providerAvailability = [
  { name: "Dr. Corey McDonald", clinic: "Internal Medicine", status: "Available", slotsFilled: 8, totalSlots: 10 },
  { name: "Dr. Ana Reyes", clinic: "Family Medicine", status: "Available", slotsFilled: 6, totalSlots: 8 },
  { name: "Dr. David Kim", clinic: "Surgery OPD", status: "On Leave", slotsFilled: 0, totalSlots: 0 },
  { name: "Dr. Martha Chen", clinic: "Dermatology", status: "Available", slotsFilled: 5, totalSlots: 6 },
  { name: "Dr. Liam Macintyre", clinic: "Internal Medicine", status: "Available", slotsFilled: 3, totalSlots: 8 },
  { name: "Dr. Patricia Lim", clinic: "Urology", status: "Available", slotsFilled: 4, totalSlots: 5 },
]

const upcomingAlerts = [
  { patient: "Rosa Santos", time: "9:15 AM", clinic: "Internal Medicine", alert: "Not yet checked in" },
  { patient: "Pedro Reyes", time: "9:30 AM", clinic: "Family Medicine", alert: "Needs confirmation" },
  { patient: "Anna Lim", time: "10:00 AM", clinic: "Orthopedics", alert: "No contact number on file" },
]

const pendingRequests = [
  { patient: "New Patient - Elena Santos", type: "New OPD", department: "Internal Medicine", referredBy: "ER Referral", date: "2026-04-09" },
  { patient: "New Patient - Mark Cruz", type: "New OPD", department: "Surgery", referredBy: "Self-presenting", date: "2026-04-09" },
  { patient: "Roberto Aquino", type: "Follow-up", department: "Nephrology", referredBy: "Ward 3B Discharge", date: "2026-04-09" },
]

const announcements = [
  { title: "Dr. David Kim on leave", message: "April 9-11. Surgery OPD patients to be rescheduled.", type: "warning" },
  { title: "Dermatology clinic closed", message: "April 14 for fumigation. All appointments moved to April 15.", type: "info" },
]

export default function SchedulerDashboard() {
  return (
    <ProtectedRoute requiredRole={UserRole.SCHEDULER}>
      <DashboardLayout role={UserRole.SCHEDULER}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Scheduler Dashboard</h1>
            <p className="text-muted-foreground">Central overview of all scheduling activity for today and the upcoming week.</p>
          </div>

          {/* Today's Appointment Summary */}
          <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Booked Today</CardTitle>
                <IconCalendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">Across all clinics</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Checked In</CardTitle>
                <IconUser className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">16</div>
                <p className="text-xs text-muted-foreground">8 pending check-in</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <IconClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">50% of today&apos;s bookings</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">No-Shows</CardTitle>
                <IconAlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">3</div>
                <p className="text-xs text-muted-foreground">Slots available for walk-ins</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 px-4 md:grid-cols-2 lg:px-6">
            {/* Provider Availability */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Provider Availability</CardTitle>
                  <Button variant="ghost" size="sm" asChild><Link href="/scheduler/providers">View All</Link></Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {providerAvailability.map((p, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.clinic}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={p.status === "Available" ? "default" : "destructive"}>{p.status}</Badge>
                        {p.status === "Available" && (
                          <p className="text-xs text-muted-foreground mt-1">{p.slotsFilled}/{p.totalSlots} slots filled</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming & Pending */}
            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader><CardTitle className="text-lg">Upcoming Appointment Alerts</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {upcomingAlerts.map((a, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 p-3">
                      <IconAlertTriangle className="h-4 w-4 text-yellow-600 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{a.patient} — {a.time}</p>
                        <p className="text-xs text-muted-foreground">{a.clinic}: {a.alert}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="text-lg">Announcements & Cancellations</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {announcements.map((a, i) => (
                    <div key={i} className="rounded-lg border p-3">
                      <p className="text-sm font-semibold">{a.title}</p>
                      <p className="text-sm text-muted-foreground">{a.message}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid gap-4 px-4 md:grid-cols-2 lg:px-6">
            {/* Pending Scheduling Requests */}
            <Card>
              <CardHeader><CardTitle className="text-lg">Pending Scheduling Requests</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Patient</TableHead><TableHead>Type</TableHead><TableHead>Department</TableHead><TableHead>Source</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {pendingRequests.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{r.patient}</TableCell>
                        <TableCell><Badge variant="secondary">{r.type}</Badge></TableCell>
                        <TableCell>{r.department}</TableCell>
                        <TableCell className="text-sm">{r.referredBy}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Queue Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Queue Status</CardTitle>
                  <Button variant="ghost" size="sm" asChild><Link href="/scheduler/queue">Manage Queue</Link></Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { dept: "Internal Medicine", waiting: 4, est: "25 min" },
                    { dept: "Family Medicine", waiting: 2, est: "15 min" },
                    { dept: "Dermatology", waiting: 1, est: "10 min" },
                    { dept: "Orthopedics", waiting: 3, est: "35 min" },
                  ].map((q, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                      <div><p className="text-sm font-medium">{q.dept}</p></div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{q.waiting} waiting</p>
                        <p className="text-xs text-muted-foreground">Est. {q.est}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
