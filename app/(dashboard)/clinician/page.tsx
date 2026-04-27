"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  IconUsers,
  IconFileText,
  IconPencil,
  IconAlertTriangle,
  IconClipboardCheck,
  IconFileCheck,
  IconPlus,
  IconSearch,
  IconBed,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth/context"

// --- Mock Data ---

const scheduleItems = [
  { id: "1", time: "08:00", patientName: "John Doe", mrn: "MRN-001", visitType: "OPD" as const, status: "Completed" as const },
  { id: "4", time: "09:30", patientName: "Maria Garcia", mrn: "MRN-007", visitType: "ER" as const, status: "In Progress" as const },
  { id: "5", time: "10:00", patientName: "James Lee", mrn: "MRN-012", visitType: "OPD" as const, status: "Checked-In" as const },
  { id: "7", time: "11:30", patientName: "Sarah Kim", mrn: "MRN-015", visitType: "IPD" as const, status: "Scheduled" as const },
  { id: "8", time: "13:00", patientName: "Ahmed Hassan", mrn: "MRN-018", visitType: "OPD" as const, status: "Scheduled" as const },
  { id: "9", time: "14:30", patientName: "Emily Chen", mrn: "MRN-022", visitType: "ER" as const, status: "Scheduled" as const },
]

const activeInpatients = [
  { id: "1", patientName: "John Doe", mrn: "MRN-001", roomBed: "Room 301-A", admissionDate: "2026-04-01", diagnosis: "Type 2 DM" },
  { id: "3", patientName: "Robert Chen", mrn: "MRN-009", roomBed: "ICU Bed 4", admissionDate: "2026-03-28", diagnosis: "Sepsis" },
  { id: "6", patientName: "Linda Park", mrn: "MRN-011", roomBed: "Room 205-B", admissionDate: "2026-04-03", diagnosis: "CHF Exacerbation" },
]

const criticalAlerts = [
  { id: "ca1", text: "Critical Lab — Potassium 6.8 mEq/L", patientName: "John Doe", mrn: "MRN-001" },
  { id: "ca2", text: "Critical Imaging — Pneumothorax", patientName: "Maria Garcia", mrn: "MRN-007" },
]

// --- Helpers ---

const visitTypeBadge = (type: "OPD" | "ER" | "IPD") => {
  const styles: Record<string, string> = {
    OPD: "bg-blue-100 text-blue-800 border-blue-200",
    ER: "bg-orange-100 text-orange-800 border-orange-200",
    IPD: "bg-purple-100 text-purple-800 border-purple-200",
  }
  return <Badge className={styles[type]}>{type}</Badge>
}

const statusBadge = (status: "Scheduled" | "Checked-In" | "In Progress" | "Completed") => {
  const styles: Record<string, string> = {
    Scheduled: "bg-blue-100 text-blue-800 border-blue-200",
    "Checked-In": "bg-cyan-100 text-cyan-800 border-cyan-200",
    "In Progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
    Completed: "bg-green-100 text-green-800 border-green-200",
  }
  return <Badge className={styles[status]}>{status}</Badge>
}

// --- Page ---

export default function ClinicianDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [draftNoteCount, setDraftNoteCount] = useState<number | null>(null)
  const [activePatientCount, setActivePatientCount] = useState<number | null>(null)

  useEffect(() => {
    if (!user?.staffId) return
    fetch(`/api/clinical-notes?authorId=${user.staffId}&status=DRAFT`)
      .then((r) => r.json())
      .then((json) => {
        const notes = Array.isArray(json?.data) ? json.data : []
        setDraftNoteCount(notes.length)
      })
      .catch(() => {})
    fetch('/api/patients?withEncounters=true')
      .then((r) => r.json())
      .then((json) => {
        const pts = Array.isArray(json?.data) ? json.data : []
        const active = pts.filter((p: any) =>
          (p.encounters ?? []).some((e: any) => e.status === 'ACTIVE')
        )
        setActivePatientCount(active.length)
      })
      .catch(() => {})
  }, [user?.staffId])

  return (
    <ProtectedRoute requiredRole={UserRole.CLINICIAN}>
      <DashboardLayout role={UserRole.CLINICIAN}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Clinician Dashboard</h1>
            <p className="text-muted-foreground">
              Patient care, documentation, and orders
            </p>
          </div>

          {/* KPI Stat Cards */}
          <div className="grid gap-4 px-4 md:grid-cols-3 lg:grid-cols-5 lg:px-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
                <IconUsers className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activePatientCount ?? '—'}</div>
                <p className="text-xs text-muted-foreground">With active encounters</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                <IconFileCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">—</div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unsigned Notes</CardTitle>
                <IconPencil className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{draftNoteCount ?? '—'}</div>
                <p className="text-xs text-muted-foreground">Require signature</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Results</CardTitle>
                <IconAlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">2</div>
                <p className="text-xs text-muted-foreground">Awaiting acknowledgment</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chart Deficiencies</CardTitle>
                <IconClipboardCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">Open deficiencies</p>
              </CardContent>
            </Card>
          </div>

          {/* Schedule + Inpatients (2-column) */}
          <div className="grid gap-4 px-4 md:grid-cols-2 lg:px-6">
            {/* My Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">My Schedule (Today)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {scheduleItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-md border p-2 text-sm cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => router.push(`/clinician/chart?patientId=${item.id}`)}
                  >
                    <span className="w-12 shrink-0 text-muted-foreground font-mono text-xs">
                      {item.time}
                    </span>
                    <span className="font-medium min-w-[110px]">{item.patientName}</span>
                    <span className="text-muted-foreground text-xs">{item.mrn}</span>
                    <div className="ml-auto flex items-center gap-2">
                      {visitTypeBadge(item.visitType)}
                      {statusBadge(item.status)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Active Inpatients */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Active Inpatients</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeInpatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="rounded-md border p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => router.push(`/clinician/chart?patientId=${patient.id}`)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{patient.patientName}</span>
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">IPD</Badge>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                      <span>{patient.mrn}</span>
                      <span>·</span>
                      <IconBed className="h-3 w-3" />
                      <span>{patient.roomBed}</span>
                      <span>·</span>
                      <span>Admitted {patient.admissionDate}</span>
                      <span>·</span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {patient.diagnosis}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Critical Alerts */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Critical Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {criticalAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 p-3 dark:bg-red-950/20 dark:border-red-900"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <IconAlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                      <span className="font-medium text-destructive">{alert.text}</span>
                      <span className="text-muted-foreground">
                        — {alert.patientName} ({alert.mrn})
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        toast.success(`Acknowledged: ${alert.text} for ${alert.patientName}`)
                      }
                    >
                      Acknowledge
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 px-4 lg:px-6">
            <Button onClick={() => router.push("/clinician/documentation")}>
              <IconPlus className="h-4 w-4 mr-1" />
              New Note
            </Button>
            <Button variant="outline" onClick={() => router.push("/clinician/orders")}>
              <IconFileText className="h-4 w-4 mr-1" />
              Place Order
            </Button>
            <Button variant="outline" onClick={() => router.push("/clinician/patients")}>
              <IconSearch className="h-4 w-4 mr-1" />
              Search Patient
            </Button>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
