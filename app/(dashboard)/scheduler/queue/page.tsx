"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dummyQueueEntries, QueueEntry, QueueStatus, PriorityType } from "@/app/(dashboard)/dummy-data/dummy-queue"
import { toast } from "sonner"
import { IconUsers, IconClock, IconPlayerPlay, IconAlertCircle } from "@tabler/icons-react"

function getStatusColor(status: QueueStatus) {
  switch (status) {
    case "Waiting": return "secondary"
    case "In Consultation": return "default"
    case "Done": return "outline"
    case "No-show": return "destructive"
  }
}

function getPriorityColor(p: PriorityType) {
  switch (p) {
    case "Senior Citizen": case "PWD": case "Pregnant": return "default"
    case "Emergency Referral": return "destructive"
    default: return "outline"
  }
}

export default function QueueManagementPage() {
  const [queue, setQueue] = useState<QueueEntry[]>(dummyQueueEntries)
  const [filterDept, setFilterDept] = useState("all")

  const departments = [...new Set(queue.map(q => q.department))]
  const filtered = filterDept === "all" ? queue : queue.filter(q => q.department === filterDept)

  const waitingCount = queue.filter(q => q.status === "Waiting").length
  const inConsultCount = queue.filter(q => q.status === "In Consultation").length
  const doneCount = queue.filter(q => q.status === "Done").length
  const noShowCount = queue.filter(q => q.status === "No-show").length

  const avgWait = Math.round(
    queue.filter(q => q.status === "Waiting" && q.estimatedWaitMinutes > 0)
      .reduce((sum, q) => sum + q.estimatedWaitMinutes, 0) /
    (queue.filter(q => q.status === "Waiting" && q.estimatedWaitMinutes > 0).length || 1)
  )

  const handleCallNext = (department: string) => {
    const nextPatient = queue
      .filter(q => q.department === department && q.status === "Waiting")
      .sort((a, b) => {
        const prioOrder: Record<PriorityType, number> = { "Emergency Referral": 0, "Senior Citizen": 1, "PWD": 1, "Pregnant": 1, "Regular": 2 }
        return (prioOrder[a.priorityType] ?? 2) - (prioOrder[b.priorityType] ?? 2)
      })[0]

    if (!nextPatient) { toast.error(`No waiting patients in ${department}`); return }

    setQueue(prev => prev.map(q => {
      if (q.id === nextPatient.id) return { ...q, status: "In Consultation" as QueueStatus, startTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }), estimatedWaitMinutes: 0 }
      return q
    }))
    toast.success(`Now serving: ${nextPatient.patientName} (Queue #${nextPatient.queueNumber})`)
  }

  const handleMarkDone = (id: string) => {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, status: "Done" as QueueStatus, endTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) } : q))
    toast.success("Patient marked as done")
  }

  const handleMarkNoShow = (id: string) => {
    const patient = queue.find(q => q.id === id)
    setQueue(prev => prev.map(q => q.id === id ? { ...q, status: "No-show" as QueueStatus } : q))
    toast.warning(`${patient?.patientName ?? "Patient"} marked as no-show`)
  }

  return (
    <ProtectedRoute requiredRole={UserRole.SCHEDULER}>
      <DashboardLayout role={UserRole.SCHEDULER}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Queue Management</h1>
            <p className="text-muted-foreground">Real-time patient queue for walk-ins and confirmed appointments across OPD clinics.</p>
          </div>

          <div className="grid gap-4 px-4 md:grid-cols-4 lg:px-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Waiting</CardTitle>
                <IconClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{waitingCount}</div><p className="text-xs text-muted-foreground">Avg wait: {avgWait} min</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Consultation</CardTitle>
                <IconPlayerPlay className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold text-blue-600">{inConsultCount}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <IconUsers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold text-green-600">{doneCount}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">No-Show</CardTitle>
                <IconAlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold text-red-600">{noShowCount}</div></CardContent>
            </Card>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>Live Queue</CardTitle>
                  <div className="flex gap-2">
                    <Select value={filterDept} onValueChange={setFilterDept}>
                      <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter by clinic" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Clinics</SelectItem>
                        {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button onClick={() => handleCallNext(filterDept === "all" ? departments[0] : filterDept)}>
                      <IconPlayerPlay className="mr-2 h-4 w-4" />Call Next
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">Q#</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Age/Sex</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Arrival</TableHead>
                      <TableHead>Wait (min)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(q => (
                      <TableRow key={q.id} className={q.priorityType !== "Regular" && q.status === "Waiting" ? "bg-yellow-50 dark:bg-yellow-950/20" : ""}>
                        <TableCell className="font-bold text-lg">{q.queueNumber}</TableCell>
                        <TableCell className="font-medium">{q.patientName}</TableCell>
                        <TableCell>{q.ageSex}</TableCell>
                        <TableCell><Badge variant={q.appointmentType === "Walk-in" ? "secondary" : "outline"}>{q.appointmentType}</Badge></TableCell>
                        <TableCell className="text-sm">{q.department}</TableCell>
                        <TableCell className="text-sm">{q.provider}</TableCell>
                        <TableCell><Badge variant={getPriorityColor(q.priorityType)}>{q.priorityType}</Badge></TableCell>
                        <TableCell className="text-sm">{q.arrivalTime || "—"}</TableCell>
                        <TableCell className="text-sm">{q.status === "Waiting" ? `~${q.estimatedWaitMinutes}` : "—"}</TableCell>
                        <TableCell><Badge variant={getStatusColor(q.status)}>{q.status}</Badge></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {q.status === "In Consultation" && <Button size="sm" variant="outline" onClick={() => handleMarkDone(q.id)}>Done</Button>}
                            {q.status === "Waiting" && <Button size="sm" variant="ghost" onClick={() => handleMarkNoShow(q.id)}>No-show</Button>}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Per-clinic estimated wait times */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader><CardTitle>Estimated Wait Time by Clinic</CardTitle></CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {departments.map(dept => {
                    const deptQueue = queue.filter(q => q.department === dept && q.status === "Waiting")
                    const waitTime = deptQueue.length > 0 ? Math.max(...deptQueue.map(q => q.estimatedWaitMinutes)) : 0
                    return (
                      <div key={dept} className="rounded-lg border p-4">
                        <p className="font-medium">{dept}</p>
                        <p className="text-2xl font-bold">{waitTime} min</p>
                        <p className="text-sm text-muted-foreground">{deptQueue.length} patients waiting</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
