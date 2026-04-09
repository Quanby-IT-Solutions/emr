"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IconCheck, IconAlertCircle } from "@tabler/icons-react"
import { DischargeDialog, type DischargePatient } from "./components/discharge-dialog"

// --- Mock Data ---

const pendingDischarges: DischargePatient[] = [
  { id: "d1", patient: "John Doe", mrn: "MRN-001", unitBed: "Med Ward 301-A", admissionDate: "2025-11-01", lengthOfStay: 6, primaryDiagnosis: "Type 2 DM with hyperglycemia", attending: "Dr. Sarah Johnson" },
  { id: "d2", patient: "Carlos Mendez", mrn: "MRN-008", unitBed: "Telemetry 205-A", admissionDate: "2025-11-05", lengthOfStay: 2, primaryDiagnosis: "Atrial fibrillation with RVR", attending: "Dr. Michael Chen" },
  { id: "d3", patient: "James Brown", mrn: "MRN-010", unitBed: "Med-Surg 410-C", admissionDate: "2025-11-02", lengthOfStay: 5, primaryDiagnosis: "CHF exacerbation", attending: "Dr. Sarah Johnson" },
  { id: "d4", patient: "Emily Davis", mrn: "MRN-011", unitBed: "Pediatrics 501-A", admissionDate: "2025-11-03", lengthOfStay: 4, primaryDiagnosis: "Acute asthma exacerbation", attending: "Dr. Lisa Park" },
  { id: "d5", patient: "Robert Lee", mrn: "MRN-005", unitBed: "Med-Surg 412-B", admissionDate: "2025-11-04", lengthOfStay: 3, primaryDiagnosis: "Post-op monitoring, knee replacement", attending: "Dr. David Martinez" },
]

type DischargeStatus = "Ready" | "Pending Orders" | "Awaiting Transport"

const dischargeStatus: Record<string, DischargeStatus> = {
  d1: "Ready",
  d2: "Ready",
  d3: "Pending Orders",
  d4: "Ready",
  d5: "Awaiting Transport",
}

interface RecentDischarge {
  id: string
  patient: string
  mrn: string
  dischargeDate: string
  disposition: string
  summaryStatus: "Signed" | "Unsigned"
}

const recentlyDischarged: RecentDischarge[] = [
  { id: "rd1", patient: "Alice Wong", mrn: "MRN-007", dischargeDate: "2025-11-06", disposition: "Transfer to ICU Step-Down", summaryStatus: "Signed" },
  { id: "rd2", patient: "Thomas Green", mrn: "MRN-012", dischargeDate: "2025-11-06", disposition: "Home", summaryStatus: "Signed" },
  { id: "rd3", patient: "Linda Park", mrn: "MRN-013", dischargeDate: "2025-11-05", disposition: "Home with Home Health", summaryStatus: "Unsigned" },
  { id: "rd4", patient: "David Kim", mrn: "MRN-014", dischargeDate: "2025-11-05", disposition: "Skilled Nursing Facility", summaryStatus: "Signed" },
  { id: "rd5", patient: "Sarah Taylor", mrn: "MRN-015", dischargeDate: "2025-11-04", disposition: "Home", summaryStatus: "Unsigned" },
  { id: "rd6", patient: "Michael Reyes", mrn: "MRN-016", dischargeDate: "2025-11-04", disposition: "Home", summaryStatus: "Signed" },
  { id: "rd7", patient: "Jennifer Wu", mrn: "MRN-017", dischargeDate: "2025-11-03", disposition: "Transfer to Rehab", summaryStatus: "Signed" },
  { id: "rd8", patient: "Kevin Adams", mrn: "MRN-018", dischargeDate: "2025-11-03", disposition: "AMA", summaryStatus: "Unsigned" },
  { id: "rd9", patient: "Anna Petrov", mrn: "MRN-019", dischargeDate: "2025-11-02", disposition: "Home", summaryStatus: "Signed" },
  { id: "rd10", patient: "Chris Oliver", mrn: "MRN-020", dischargeDate: "2025-11-01", disposition: "Home with Home Health", summaryStatus: "Signed" },
]

// --- Helpers ---

const dischargeStatusBadge: Record<DischargeStatus, string> = {
  Ready: "bg-green-100 text-green-800 border-green-300",
  "Pending Orders": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "Awaiting Transport": "bg-blue-100 text-blue-800 border-blue-300",
}

// --- Page ---

export default function ClinicianDischargePage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<DischargePatient | null>(null)

  const handleOpenDialog = (patient: DischargePatient) => {
    setSelectedPatient(patient)
    setDialogOpen(true)
  }

  return (
    <ProtectedRoute requiredRole={UserRole.CLINICIAN}>
      <DashboardLayout role={UserRole.CLINICIAN}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Discharge</h1>
            <p className="text-muted-foreground">
              Manage patient discharges, medication reconciliation &amp; discharge summaries
            </p>
          </div>

          <div className="px-4 lg:px-6 space-y-6">
            {/* Patients Ready for Discharge */}
            <Card>
              <CardHeader>
                <CardTitle>Patients Ready for Discharge</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>MRN</TableHead>
                      <TableHead>Unit / Bed</TableHead>
                      <TableHead>Admission Date</TableHead>
                      <TableHead>Length of Stay</TableHead>
                      <TableHead>Primary Diagnosis</TableHead>
                      <TableHead>Attending</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingDischarges.map((pt) => (
                      <TableRow key={pt.id}>
                        <TableCell className="font-medium">{pt.patient}</TableCell>
                        <TableCell className="text-muted-foreground">{pt.mrn}</TableCell>
                        <TableCell>{pt.unitBed}</TableCell>
                        <TableCell>{pt.admissionDate}</TableCell>
                        <TableCell className="font-medium">{pt.lengthOfStay} days</TableCell>
                        <TableCell>{pt.primaryDiagnosis}</TableCell>
                        <TableCell className="text-muted-foreground">{pt.attending}</TableCell>
                        <TableCell>
                          <Badge className={dischargeStatusBadge[dischargeStatus[pt.id]]}>
                            {dischargeStatus[pt.id]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" onClick={() => handleOpenDialog(pt)}>
                            Discharge
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Recently Discharged */}
            <Card>
              <CardHeader>
                <CardTitle>Recently Discharged</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>MRN</TableHead>
                      <TableHead>Discharge Date</TableHead>
                      <TableHead>Disposition</TableHead>
                      <TableHead>Summary Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentlyDischarged.map((pt) => (
                      <TableRow key={pt.id}>
                        <TableCell className="font-medium">{pt.patient}</TableCell>
                        <TableCell className="text-muted-foreground">{pt.mrn}</TableCell>
                        <TableCell>{pt.dischargeDate}</TableCell>
                        <TableCell>{pt.disposition}</TableCell>
                        <TableCell>
                          {pt.summaryStatus === "Signed" ? (
                            <div className="flex items-center gap-1.5 text-green-700">
                              <IconCheck className="h-4 w-4" />
                              <span className="text-sm font-medium">Signed</span>
                            </div>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 border-red-300">
                              <IconAlertCircle className="h-3.5 w-3.5 mr-1" />
                              Unsigned
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        <DischargeDialog open={dialogOpen} onOpenChange={setDialogOpen} patient={selectedPatient} />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
