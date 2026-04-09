"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { IconAlertTriangle, IconShieldLock } from "@tabler/icons-react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { UserRole } from "@/lib/auth/roles"
import { AccessConfirmationDialog } from "./components/access-confirmation-dialog"

interface BreakGlassPatient {
  id: string
  name: string
  mrn: string
  encounter: string
}

interface AccessLogEntry {
  id: string
  date: string
  patient: string
  reason: string
  duration: string
  reviewedBy: string
  status: "Pending Review" | "Reviewed" | "Flagged"
}

const mockPatients: BreakGlassPatient[] = [
  { id: "1", name: "John Doe", mrn: "MRN-001", encounter: "Inpatient - Med Ward" },
  { id: "2", name: "Jane Smith", mrn: "MRN-002", encounter: "Outpatient - Pulmonology" },
  { id: "3", name: "Bob Wilson", mrn: "MRN-003", encounter: "Emergency Department" },
  { id: "4", name: "Maria Garcia", mrn: "MRN-004", encounter: "Observation Unit" },
  { id: "5", name: "Emily Davis", mrn: "MRN-011", encounter: "Pediatrics" },
]

const initialLog: AccessLogEntry[] = [
  {
    id: "bg-001",
    date: "Apr 8, 2026 22:10",
    patient: "Carlos Mendez",
    reason: "Direct Patient Care Emergency",
    duration: "18 min",
    reviewedBy: "Privacy Officer Lane",
    status: "Reviewed",
  },
  {
    id: "bg-002",
    date: "Apr 7, 2026 03:40",
    patient: "Susan Chen",
    reason: "Consultation Requested",
    duration: "11 min",
    reviewedBy: "Pending",
    status: "Pending Review",
  },
  {
    id: "bg-003",
    date: "Apr 6, 2026 14:05",
    patient: "Anna Petrov",
    reason: "Other",
    duration: "29 min",
    reviewedBy: "Privacy Officer Lane",
    status: "Flagged",
  },
]

const logStatusClass: Record<AccessLogEntry["status"], string> = {
  "Pending Review": "bg-yellow-100 text-yellow-800 border-yellow-300",
  Reviewed: "bg-green-100 text-green-800 border-green-300",
  Flagged: "bg-red-100 text-red-800 border-red-300",
}

export default function BreakGlassPage() {
  const [search, setSearch] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<BreakGlassPatient | null>(null)
  const [reason, setReason] = useState("")
  const [justification, setJustification] = useState("")
  const [acknowledged, setAcknowledged] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [accessLog, setAccessLog] = useState(initialLog)

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return mockPatients
    }

    return mockPatients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(query) || patient.mrn.toLowerCase().includes(query)
    )
  }, [search])

  const isValid = Boolean(selectedPatient && reason && justification.trim().length >= 50 && acknowledged)

  const resetForm = () => {
    setSearch("")
    setSelectedPatient(null)
    setReason("")
    setJustification("")
    setAcknowledged(false)
    setConfirmOpen(false)
  }

  const handleConfirm = () => {
    if (!selectedPatient) {
      return
    }

    const timestamp = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    setAccessLog((current) => [
      {
        id: `bg-${Date.now()}`,
        date: timestamp,
        patient: selectedPatient.name,
        reason,
        duration: "In Progress",
        reviewedBy: "Pending",
        status: "Pending Review",
      },
      ...current,
    ])

    toast.success("Emergency access granted — all activity is being logged")
    resetForm()
  }

  return (
    <ProtectedRoute requiredRole={UserRole.CLINICIAN}>
      <DashboardLayout role={UserRole.CLINICIAN}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Break-Glass Access</h1>
            <p className="text-muted-foreground">
              Emergency-only override access to protected patient records.
            </p>
          </div>

          <div className="px-4 lg:px-6 space-y-6">
            <div className="rounded-xl border border-red-300 bg-gradient-to-r from-red-50 via-amber-50 to-red-50 p-5">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-red-100 p-3 text-red-700">
                  <IconAlertTriangle className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-red-900">Emergency Access Only</p>
                  <p className="text-sm text-red-800">
                    All access is logged, audited, and reviewed by the Privacy Officer. Use only when clinically necessary.
                  </p>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Request Break-Glass Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Search Patient</Label>
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search by patient name or MRN..."
                  />
                  <div className="grid gap-2 md:grid-cols-2">
                    {filteredPatients.map((patient) => (
                      <button
                        key={patient.id}
                        type="button"
                        onClick={() => setSelectedPatient(patient)}
                        className={`rounded-lg border p-3 text-left transition hover:border-primary ${
                          selectedPatient?.id === patient.id ? "border-red-400 bg-red-50" : "border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-medium">{patient.name}</p>
                            <p className="text-sm text-muted-foreground">{patient.mrn}</p>
                          </div>
                          <Badge variant="outline">{patient.encounter}</Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Patient Name</Label>
                    <Input value={selectedPatient?.name ?? ""} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>MRN</Label>
                    <Input value={selectedPatient?.mrn ?? ""} readOnly />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Select value={reason} onValueChange={setReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Direct Patient Care Emergency">Direct Patient Care Emergency</SelectItem>
                      <SelectItem value="Consultation Requested">Consultation Requested</SelectItem>
                      <SelectItem value="Public Health Emergency">Public Health Emergency</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label>Detailed Justification</Label>
                    <span className={`text-xs ${justification.trim().length >= 50 ? "text-green-700" : "text-muted-foreground"}`}>
                      {justification.trim().length}/50 minimum characters
                    </span>
                  </div>
                  <Textarea
                    rows={5}
                    value={justification}
                    onChange={(event) => setJustification(event.target.value)}
                    placeholder="Document the clinical emergency, why standard access is insufficient, and what immediate patient care need is being addressed."
                  />
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4">
                  <Checkbox checked={acknowledged} onCheckedChange={(checked) => setAcknowledged(Boolean(checked))} />
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-amber-900">Acknowledge audited access</p>
                    <p className="text-amber-800">
                      I understand this action is extraordinary, will be audited, and must be justified for immediate clinical need.
                    </p>
                  </div>
                </div>

                <Button
                  className="h-12 bg-red-600 text-white hover:bg-red-700"
                  disabled={!isValid}
                  onClick={() => setConfirmOpen(true)}
                >
                  <IconShieldLock className="mr-2 h-4 w-4" />
                  Request Emergency Access
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Access Log</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Reviewed By</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessLog.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.date}</TableCell>
                        <TableCell className="font-medium">{entry.patient}</TableCell>
                        <TableCell>{entry.reason}</TableCell>
                        <TableCell>{entry.duration}</TableCell>
                        <TableCell>{entry.reviewedBy}</TableCell>
                        <TableCell>
                          <Badge className={logStatusClass[entry.status]}>{entry.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        <AccessConfirmationDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          patientName={selectedPatient?.name ?? "this patient"}
          onConfirm={handleConfirm}
        />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
