"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IconBed, IconPlus } from "@tabler/icons-react"
import { AdmissionOrderDialog } from "./components/admission-order-dialog"

// --- Mock Data ---

const bedAvailability = [
  { unit: "ICU", available: 2, total: 10 },
  { unit: "Med-Surg", available: 8, total: 30 },
  { unit: "Telemetry", available: 3, total: 12 },
  { unit: "Pediatrics", available: 5, total: 15 },
  { unit: "Cardiac", available: 1, total: 8 },
]

interface PendingRequest {
  id: string
  patient: string
  mrn: string
  reason: string
  requestedUnit: string
  priority: "Routine" | "Urgent" | "STAT"
}

const pendingRequests: PendingRequest[] = [
  { id: "pr1", patient: "Maria Garcia", mrn: "MRN-004", reason: "Acute pancreatitis", requestedUnit: "Med-Surg", priority: "Urgent" },
  { id: "pr2", patient: "Robert Lee", mrn: "MRN-005", reason: "Post-op monitoring, knee replacement", requestedUnit: "Med-Surg", priority: "Routine" },
  { id: "pr3", patient: "Susan Chen", mrn: "MRN-006", reason: "Unstable angina", requestedUnit: "Cardiac", priority: "STAT" },
]

interface ActiveAdmission {
  id: string
  patient: string
  mrn: string
  admissionDate: string
  unitBed: string
  admittingDiagnosis: string
  attending: string
  status: "Admitted" | "Pending Bed" | "Pending Transfer"
  daysAdmitted: number
}

const activeAdmissions: ActiveAdmission[] = [
  { id: "a1", patient: "John Doe", mrn: "MRN-001", admissionDate: "2025-11-01", unitBed: "Med Ward 301-A", admittingDiagnosis: "Type 2 DM with hyperglycemia", attending: "Dr. Sarah Johnson", status: "Admitted", daysAdmitted: 6 },
  { id: "a2", patient: "Alice Wong", mrn: "MRN-007", admissionDate: "2025-11-04", unitBed: "ICU 102-B", admittingDiagnosis: "Sepsis, unknown source", attending: "Dr. Lisa Park", status: "Admitted", daysAdmitted: 3 },
  { id: "a3", patient: "Carlos Mendez", mrn: "MRN-008", admissionDate: "2025-11-05", unitBed: "Telemetry 205-A", admittingDiagnosis: "Atrial fibrillation with RVR", attending: "Dr. Michael Chen", status: "Admitted", daysAdmitted: 2 },
  { id: "a4", patient: "Priya Patel", mrn: "MRN-009", admissionDate: "2025-11-06", unitBed: "—", admittingDiagnosis: "Community-acquired pneumonia", attending: "Dr. David Martinez", status: "Pending Bed", daysAdmitted: 1 },
  { id: "a5", patient: "James Brown", mrn: "MRN-010", admissionDate: "2025-11-02", unitBed: "Med-Surg 410-C", admittingDiagnosis: "CHF exacerbation", attending: "Dr. Sarah Johnson", status: "Pending Transfer", daysAdmitted: 5 },
  { id: "a6", patient: "Emily Davis", mrn: "MRN-011", admissionDate: "2025-11-03", unitBed: "Pediatrics 501-A", admittingDiagnosis: "Acute asthma exacerbation", attending: "Dr. Lisa Park", status: "Admitted", daysAdmitted: 4 },
]

// --- Helpers ---

const priorityBadgeClass: Record<PendingRequest["priority"], string> = {
  Routine: "bg-gray-100 text-gray-800 border-gray-300",
  Urgent: "bg-yellow-100 text-yellow-800 border-yellow-300",
  STAT: "bg-red-100 text-red-800 border-red-300",
}

const statusBadgeClass: Record<ActiveAdmission["status"], string> = {
  Admitted: "bg-green-100 text-green-800 border-green-300",
  "Pending Bed": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "Pending Transfer": "bg-blue-100 text-blue-800 border-blue-300",
}

function bedUtilColor(available: number, total: number) {
  const pct = available / total
  if (pct <= 0.15) return "text-red-600"
  if (pct <= 0.35) return "text-yellow-600"
  return "text-green-600"
}

// --- Page ---

export default function ClinicianAdmissionsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <ProtectedRoute requiredRole={UserRole.CLINICIAN}>
      <DashboardLayout role={UserRole.CLINICIAN}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="flex items-center justify-between px-4 lg:px-6">
            <div>
              <h1 className="text-2xl font-bold">Admissions</h1>
              <p className="text-muted-foreground">
                Bed availability, pending requests &amp; active admissions
              </p>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <IconPlus className="h-4 w-4 mr-2" />
              Place Admission Order
            </Button>
          </div>

          <div className="px-4 lg:px-6 space-y-6">
            {/* Bed Availability */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Bed Availability</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {bedAvailability.map((u) => (
                  <Card key={u.unit} className="py-3">
                    <CardContent className="flex flex-col items-center gap-1 p-0">
                      <IconBed className="h-5 w-5 text-muted-foreground" />
                      <p className="text-xs font-medium text-muted-foreground">{u.unit}</p>
                      <p className={`text-lg font-bold ${bedUtilColor(u.available, u.total)}`}>
                        {u.available}/{u.total}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Pending Admission Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Admission Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>MRN</TableHead>
                      <TableHead>Reason for Admission</TableHead>
                      <TableHead>Requested Unit</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-medium">{req.patient}</TableCell>
                        <TableCell className="text-muted-foreground">{req.mrn}</TableCell>
                        <TableCell>{req.reason}</TableCell>
                        <TableCell>{req.requestedUnit}</TableCell>
                        <TableCell>
                          <Badge className={priorityBadgeClass[req.priority]}>{req.priority}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline">Review</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Active Admissions */}
            <Card>
              <CardHeader>
                <CardTitle>Active Admissions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>MRN</TableHead>
                      <TableHead>Admission Date</TableHead>
                      <TableHead>Unit / Bed</TableHead>
                      <TableHead>Admitting Diagnosis</TableHead>
                      <TableHead>Attending</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Days</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeAdmissions.map((adm) => (
                      <TableRow key={adm.id}>
                        <TableCell className="font-medium">{adm.patient}</TableCell>
                        <TableCell className="text-muted-foreground">{adm.mrn}</TableCell>
                        <TableCell>{adm.admissionDate}</TableCell>
                        <TableCell>{adm.unitBed}</TableCell>
                        <TableCell>{adm.admittingDiagnosis}</TableCell>
                        <TableCell className="text-muted-foreground">{adm.attending}</TableCell>
                        <TableCell>
                          <Badge className={statusBadgeClass[adm.status]}>{adm.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">{adm.daysAdmitted}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
        <AdmissionOrderDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
