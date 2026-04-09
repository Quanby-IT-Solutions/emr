"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconDownload } from "@tabler/icons-react"
import { toast } from "sonner"
import { exportToCSV } from "@/lib/export-utils"

const appointmentSummary = [
  { clinic: "Internal Medicine", booked: 45, checkedIn: 38, completed: 32, noShow: 5, cancelled: 2 },
  { clinic: "Family Medicine", booked: 30, checkedIn: 27, completed: 24, noShow: 2, cancelled: 1 },
  { clinic: "Surgery OPD", booked: 22, checkedIn: 20, completed: 18, noShow: 1, cancelled: 1 },
  { clinic: "Dermatology", booked: 18, checkedIn: 16, completed: 15, noShow: 1, cancelled: 0 },
  { clinic: "Orthopedics", booked: 15, checkedIn: 12, completed: 10, noShow: 2, cancelled: 1 },
  { clinic: "Urology", booked: 10, checkedIn: 9, completed: 8, noShow: 0, cancelled: 1 },
]

const noShowReport = [
  { date: "2026-04-09", patient: "Carlos Mendoza", clinic: "Orthopedics", provider: "Dr. Jose Rivera", appointmentTime: "9:00 AM", contactNumber: "09171234567" },
  { date: "2026-04-09", patient: "Lisa Reyes", clinic: "Internal Medicine", provider: "Dr. Corey McDonald", appointmentTime: "10:30 AM", contactNumber: "09281234568" },
  { date: "2026-04-08", patient: "Mark Tan", clinic: "Surgery OPD", provider: "Dr. David Kim", appointmentTime: "2:00 PM", contactNumber: "09391234569" },
  { date: "2026-04-08", patient: "Angela Santos", clinic: "Dermatology", provider: "Dr. Martha Chen", appointmentTime: "3:30 PM", contactNumber: "09451234570" },
  { date: "2026-04-07", patient: "Roberto Cruz", clinic: "Internal Medicine", provider: "Dr. Liam Macintyre", appointmentTime: "8:00 AM", contactNumber: "09561234571" },
]

const slotUtilization = [
  { provider: "Dr. Corey McDonald", clinic: "Internal Medicine", totalSlots: 40, filledSlots: 38, utilization: 95 },
  { provider: "Dr. Ana Reyes", clinic: "Family Medicine", totalSlots: 30, filledSlots: 27, utilization: 90 },
  { provider: "Dr. David Kim", clinic: "Surgery OPD", totalSlots: 25, filledSlots: 20, utilization: 80 },
  { provider: "Dr. Martha Chen", clinic: "Dermatology", totalSlots: 20, filledSlots: 16, utilization: 80 },
  { provider: "Dr. Liam Macintyre", clinic: "Internal Medicine", totalSlots: 35, filledSlots: 22, utilization: 63 },
  { provider: "Dr. Jose Rivera", clinic: "Orthopedics", totalSlots: 20, filledSlots: 12, utilization: 60 },
  { provider: "Dr. Patricia Lim", clinic: "Urology", totalSlots: 15, filledSlots: 9, utilization: 60 },
]

const waitTimeReport = [
  { clinic: "Internal Medicine", avgWait: 25, maxWait: 55, patientsServed: 32 },
  { clinic: "Family Medicine", avgWait: 18, maxWait: 40, patientsServed: 24 },
  { clinic: "Surgery OPD", avgWait: 22, maxWait: 45, patientsServed: 18 },
  { clinic: "Dermatology", avgWait: 15, maxWait: 30, patientsServed: 15 },
  { clinic: "Orthopedics", avgWait: 30, maxWait: 60, patientsServed: 10 },
  { clinic: "Urology", avgWait: 12, maxWait: 25, patientsServed: 8 },
]

export default function SchedulingReportsPage() {
  const [period, setPeriod] = useState("daily")
  const [activeTab, setActiveTab] = useState("summary")

  const totalBooked = appointmentSummary.reduce((s, r) => s + r.booked, 0)
  const totalNoShow = appointmentSummary.reduce((s, r) => s + r.noShow, 0)
  const noShowRate = ((totalNoShow / totalBooked) * 100).toFixed(1)

  const handleExport = () => {
    switch (activeTab) {
      case "summary":
        exportToCSV(appointmentSummary, [
          { key: "clinic", header: "Clinic" },
          { key: "booked", header: "Booked" },
          { key: "checkedIn", header: "Checked-In" },
          { key: "completed", header: "Completed" },
          { key: "noShow", header: "No-Show" },
          { key: "cancelled", header: "Cancelled" },
        ], `appointment-summary-${period}-${new Date().toISOString().split("T")[0]}`)
        break
      case "no-show":
        exportToCSV(noShowReport, [
          { key: "date", header: "Date" },
          { key: "patient", header: "Patient" },
          { key: "clinic", header: "Clinic" },
          { key: "provider", header: "Provider" },
          { key: "appointmentTime", header: "Time" },
          { key: "contactNumber", header: "Contact" },
        ], `no-show-report-${period}-${new Date().toISOString().split("T")[0]}`)
        break
      case "utilization":
        exportToCSV(slotUtilization, [
          { key: "provider", header: "Provider" },
          { key: "clinic", header: "Clinic" },
          { key: "totalSlots", header: "Total Slots" },
          { key: "filledSlots", header: "Filled Slots" },
          { key: "utilization", header: "Utilization %" },
        ], `slot-utilization-${period}-${new Date().toISOString().split("T")[0]}`)
        break
      case "wait-time":
        exportToCSV(waitTimeReport, [
          { key: "clinic", header: "Clinic" },
          { key: "avgWait", header: "Avg Wait (min)" },
          { key: "maxWait", header: "Max Wait (min)" },
          { key: "patientsServed", header: "Patients Served" },
        ], `wait-time-report-${period}-${new Date().toISOString().split("T")[0]}`)
        break
    }
    toast.success("Report exported as CSV")
  }

  return (
    <ProtectedRoute requiredRole={UserRole.SCHEDULER}>
      <DashboardLayout role={UserRole.SCHEDULER}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Scheduling Reports</h1>
              <p className="text-muted-foreground">Analytics on appointments, no-shows, slot utilization, and wait times.</p>
            </div>
            <div className="flex gap-2">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleExport}><IconDownload className="mr-2 h-4 w-4" />Export</Button>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid gap-4 px-4 md:grid-cols-4 lg:px-6">
            <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{totalBooked}</div><p className="text-sm text-muted-foreground">Total Appointments</p></CardContent></Card>
            <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{appointmentSummary.reduce((s, r) => s + r.completed, 0)}</div><p className="text-sm text-muted-foreground">Completed</p></CardContent></Card>
            <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-red-600">{totalNoShow}</div><p className="text-sm text-muted-foreground">No-Shows ({noShowRate}%)</p></CardContent></Card>
            <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{appointmentSummary.reduce((s, r) => s + r.cancelled, 0)}</div><p className="text-sm text-muted-foreground">Cancelled</p></CardContent></Card>
          </div>

          <div className="px-4 lg:px-6">
            <Tabs defaultValue="summary" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="summary">Appointment Summary</TabsTrigger>
                <TabsTrigger value="no-show">No-Show Report</TabsTrigger>
                <TabsTrigger value="utilization">Slot Utilization</TabsTrigger>
                <TabsTrigger value="wait-time">Wait Time</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <Card>
                  <CardHeader><CardTitle>Appointments by Clinic</CardTitle></CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Clinic</TableHead>
                          <TableHead className="text-right">Booked</TableHead>
                          <TableHead className="text-right">Checked-In</TableHead>
                          <TableHead className="text-right">Completed</TableHead>
                          <TableHead className="text-right">No-Show</TableHead>
                          <TableHead className="text-right">Cancelled</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointmentSummary.map(r => (
                          <TableRow key={r.clinic}>
                            <TableCell className="font-medium">{r.clinic}</TableCell>
                            <TableCell className="text-right">{r.booked}</TableCell>
                            <TableCell className="text-right">{r.checkedIn}</TableCell>
                            <TableCell className="text-right text-green-600 font-medium">{r.completed}</TableCell>
                            <TableCell className="text-right text-red-600 font-medium">{r.noShow}</TableCell>
                            <TableCell className="text-right">{r.cancelled}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="no-show" className="space-y-4">
                <Card>
                  <CardHeader><CardTitle>No-Show Patients</CardTitle><CardDescription>Patients who missed their appointments for follow-up</CardDescription></CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Patient</TableHead><TableHead>Clinic</TableHead><TableHead>Provider</TableHead><TableHead>Time</TableHead><TableHead>Contact</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {noShowReport.map((r, i) => (
                          <TableRow key={i}><TableCell>{r.date}</TableCell><TableCell className="font-medium">{r.patient}</TableCell><TableCell>{r.clinic}</TableCell><TableCell>{r.provider}</TableCell><TableCell>{r.appointmentTime}</TableCell><TableCell className="font-mono text-sm">{r.contactNumber}</TableCell></TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="utilization" className="space-y-4">
                <Card>
                  <CardHeader><CardTitle>Slot Utilization by Provider</CardTitle></CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader><TableRow><TableHead>Provider</TableHead><TableHead>Clinic</TableHead><TableHead className="text-right">Total Slots</TableHead><TableHead className="text-right">Filled</TableHead><TableHead className="text-right">Utilization</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {slotUtilization.map((r, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{r.provider}</TableCell><TableCell>{r.clinic}</TableCell>
                            <TableCell className="text-right">{r.totalSlots}</TableCell><TableCell className="text-right">{r.filledSlots}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant={r.utilization >= 80 ? "default" : r.utilization >= 60 ? "secondary" : "destructive"}>{r.utilization}%</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="wait-time" className="space-y-4">
                <Card>
                  <CardHeader><CardTitle>Wait Time by Clinic</CardTitle></CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader><TableRow><TableHead>Clinic</TableHead><TableHead className="text-right">Avg Wait (min)</TableHead><TableHead className="text-right">Max Wait (min)</TableHead><TableHead className="text-right">Patients Served</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {waitTimeReport.map((r, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{r.clinic}</TableCell>
                            <TableCell className="text-right">{r.avgWait}</TableCell>
                            <TableCell className="text-right font-medium">{r.maxWait}</TableCell>
                            <TableCell className="text-right">{r.patientsServed}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
