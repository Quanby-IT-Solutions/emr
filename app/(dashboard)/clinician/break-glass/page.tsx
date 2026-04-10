"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { IconAlertTriangle, IconClock, IconExternalLink, IconShieldLock } from "@tabler/icons-react"
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
  patientId: string
  reason: string
  justification: string
  duration: string
  reviewedBy: string
  status: "Pending Review" | "Reviewed" | "Flagged"
  grantedAt?: number
}

interface ActiveSession {
  patientId: string
  patientName: string
  grantedAt: number
  expiresAt: number
}

const STORAGE_KEY = "emr_break_glass_log"
const SESSION_KEY = "emr_break_glass_sessions"
const SESSION_DURATION_MS = 60 * 60 * 1000 // 1 hour

const mockPatients: BreakGlassPatient[] = [
  { id: "1", name: "John Doe", mrn: "MRN-001", encounter: "Inpatient - Med Ward Rm 301-A" },
  { id: "2", name: "Jane Smith", mrn: "MRN-002", encounter: "Outpatient - Pulmonology" },
  { id: "3", name: "Robert Chen", mrn: "MRN-009", encounter: "Inpatient - ICU Bed 4" },
  { id: "4", name: "Maria Garcia", mrn: "MRN-007", encounter: "Emergency - ER Bay 3" },
  { id: "5", name: "James Lee", mrn: "MRN-012", encounter: "Outpatient - Orthopedics" },
  { id: "6", name: "Linda Park", mrn: "MRN-011", encounter: "Inpatient - Cardiology Rm 205-B" },
  { id: "7", name: "Sarah Kim", mrn: "MRN-015", encounter: "Outpatient - Psychiatry" },
  { id: "8", name: "Ahmed Hassan", mrn: "MRN-018", encounter: "Outpatient - Internal Medicine" },
  { id: "9", name: "Emily Chen", mrn: "MRN-022", encounter: "Emergency - Discharged" },
  { id: "10", name: "David Wilson", mrn: "MRN-003", encounter: "Outpatient - Pain Management" },
  { id: "11", name: "Patricia Martinez", mrn: "MRN-025", encounter: "Inpatient - Ortho (Discharged)" },
  { id: "12", name: "Michael Brown", mrn: "MRN-030", encounter: "Emergency - ER Bay 7" },
]

const seedLog: AccessLogEntry[] = [
  {
    id: "bg-001",
    date: "Apr 8, 2026 10:10 PM",
    patient: "Carlos Mendez",
    patientId: "",
    reason: "Direct Patient Care Emergency",
    justification: "Patient presented unconscious in ER, required immediate allergy and medication history review for resuscitation protocol.",
    duration: "18 min",
    reviewedBy: "Privacy Officer Lane",
    status: "Reviewed",
  },
  {
    id: "bg-002",
    date: "Apr 7, 2026 03:40 AM",
    patient: "Susan Chen",
    patientId: "",
    reason: "Consultation Requested",
    justification: "Consulting on post-operative complication case — needed to review surgical notes and lab trends for urgent recommendation.",
    duration: "11 min",
    reviewedBy: "Pending",
    status: "Pending Review",
  },
  {
    id: "bg-003",
    date: "Apr 6, 2026 02:05 PM",
    patient: "Anna Petrov",
    patientId: "",
    reason: "Other",
    justification: "Reviewed chart during quality assurance meeting to discuss treatment pathway and outcome — access flagged for non-emergency use.",
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

function loadLog(): AccessLogEntry[] {
  if (typeof window === "undefined") return seedLog
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AccessLogEntry[]
  } catch { /* ignore */ }
  return seedLog
}

function saveLog(log: AccessLogEntry[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(log)) } catch { /* ignore */ }
}

function loadSessions(): ActiveSession[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (raw) {
      const sessions = JSON.parse(raw) as ActiveSession[]
      return sessions.filter((s) => s.expiresAt > Date.now())
    }
  } catch { /* ignore */ }
  return []
}

function saveSessions(sessions: ActiveSession[]) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(sessions)) } catch { /* ignore */ }
}

function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return "Expired"
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`
}

export default function BreakGlassPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<BreakGlassPatient | null>(null)
  const [reason, setReason] = useState("")
  const [justification, setJustification] = useState("")
  const [acknowledged, setAcknowledged] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [accessLog, setAccessLog] = useState<AccessLogEntry[]>(() => loadLog())
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(() => loadSessions())
  const [nowMs, setNowMs] = useState(() => Date.now())
  const [, setTick] = useState(0)

  // Tick every second to update active session countdowns
  useEffect(() => {
    if (activeSessions.length === 0) return
    const interval = setInterval(() => {
      const currentNow = Date.now()
      const updated = activeSessions.filter((s) => s.expiresAt > Date.now())
      if (updated.length !== activeSessions.length) {
        setActiveSessions(updated)
        saveSessions(updated)
      }
      setNowMs(currentNow)
      setTick((t) => t + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [activeSessions])

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return mockPatients
    return mockPatients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(query) || patient.mrn.toLowerCase().includes(query)
    )
  }, [search])

  const validationState = {
    patientSelected: Boolean(selectedPatient),
    reasonSelected: Boolean(reason),
    justificationValid: justification.trim().length >= 50,
    acknowledgmentChecked: acknowledged,
  }

  const isValid =
    validationState.patientSelected &&
    validationState.reasonSelected &&
    validationState.justificationValid &&
    validationState.acknowledgmentChecked

  const missingRequirements = [
    !validationState.patientSelected ? "Select a patient" : null,
    !validationState.reasonSelected ? "Choose a reason" : null,
    !validationState.justificationValid ? "Enter at least 50 characters of justification" : null,
    !validationState.acknowledgmentChecked ? "Acknowledge audited access" : null,
  ].filter(Boolean) as string[]

  const isSessionActive = (patientId: string) =>
    activeSessions.some((s) => s.patientId === patientId && s.expiresAt > nowMs)

  const resetForm = () => {
    setSearch("")
    setSelectedPatient(null)
    setReason("")
    setJustification("")
    setAcknowledged(false)
    setConfirmOpen(false)
  }

  const handleConfirm = () => {
    if (!selectedPatient) return

    const now = Date.now()
    const timestamp = new Date(now).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

    const newEntry: AccessLogEntry = {
      id: `bg-${now}`,
      date: timestamp,
      patient: selectedPatient.name,
      patientId: selectedPatient.id,
      reason,
      justification,
      duration: "In Progress",
      reviewedBy: "Pending",
      status: "Pending Review",
      grantedAt: now,
    }

    const updatedLog = [newEntry, ...accessLog]
    setAccessLog(updatedLog)
    saveLog(updatedLog)

    // Create active session
    const newSession: ActiveSession = {
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      grantedAt: now,
      expiresAt: now + SESSION_DURATION_MS,
    }
    const updatedSessions = [...activeSessions.filter((s) => s.patientId !== selectedPatient.id), newSession]
    setActiveSessions(updatedSessions)
    saveSessions(updatedSessions)

    toast.success(`Emergency access granted for ${selectedPatient.name}`, {
      description: "Redirecting to patient chart — all activity is being logged.",
      duration: 4000,
    })

    const patientId = selectedPatient.id
    resetForm()

    // Navigate to the patient chart after a short delay
    setTimeout(() => {
      router.push(`/clinician/chart?patientId=${patientId}`)
    }, 1500)
  }

  const handleViewChart = (patientId: string) => {
    router.push(`/clinician/chart?patientId=${patientId}`)
  }

  const handleRequestAccessClick = () => {
    if (!isValid) {
      toast.error("Complete required fields before requesting access", {
        description: missingRequirements.join(" • "),
      })
      return
    }
    setConfirmOpen(true)
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
            {/* Emergency Warning Banner */}
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

            {/* Active Sessions */}
            {activeSessions.length > 0 && (
              <Card className="border-amber-400 bg-amber-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base text-amber-900">
                    <IconClock className="h-5 w-5" />
                    Active Break-Glass Sessions ({activeSessions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {activeSessions.map((session) => (
                    <div
                      key={session.patientId}
                      className="flex items-center justify-between gap-3 rounded-lg border border-amber-300 bg-white p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Badge className="bg-red-100 text-red-800 border-red-300">ACTIVE</Badge>
                        <span className="font-medium">{session.patientName}</span>
                        <span className="text-sm text-muted-foreground">
                          Expires in {formatTimeRemaining(session.expiresAt - nowMs)}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewChart(session.patientId)}
                      >
                        <IconExternalLink className="mr-1.5 h-3.5 w-3.5" />
                        View Chart
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Request Form */}
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
                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPatients.map((patient) => {
                      const hasActive = isSessionActive(patient.id)
                      return (
                        <button
                          key={patient.id}
                          type="button"
                          onClick={() => setSelectedPatient(patient)}
                          className={`rounded-lg border p-3 text-left transition hover:border-primary ${
                            selectedPatient?.id === patient.id
                              ? "border-red-400 bg-red-50"
                              : hasActive
                                ? "border-amber-300 bg-amber-50/50"
                                : "border-border"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-medium truncate">{patient.name}</p>
                              <p className="text-sm text-muted-foreground">{patient.mrn}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <Badge variant="outline" className="text-[10px] px-1.5">{patient.encounter}</Badge>
                              {hasActive && (
                                <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[10px] px-1.5">
                                  Access Active
                                </Badge>
                              )}
                            </div>
                          </div>
                        </button>
                      )
                    })}
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
                  className={`h-12 text-white ${
                    isValid
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-red-400 hover:bg-red-500"
                  }`}
                  onClick={handleRequestAccessClick}
                >
                  <IconShieldLock className="mr-2 h-4 w-4" />
                  Request Emergency Access
                </Button>
                {!isValid && (
                  <p className="text-xs text-muted-foreground">
                    Complete all required fields to continue.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Access Log */}
            <Card>
              <CardHeader>
                <CardTitle>Access Log</CardTitle>
              </CardHeader>
              <CardContent>
                {accessLog.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No break-glass access events recorded.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Patient</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Reviewed By</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[1%]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accessLog.map((entry) => {
                        const hasActiveSession = entry.patientId && isSessionActive(entry.patientId)
                        return (
                          <TableRow key={entry.id}>
                            <TableCell className="text-sm whitespace-nowrap">{entry.date}</TableCell>
                            <TableCell className="font-medium">{entry.patient}</TableCell>
                            <TableCell className="text-sm">{entry.reason}</TableCell>
                            <TableCell className="text-sm">
                              {hasActiveSession ? (
                                <span className="text-amber-700 font-medium">In Progress</span>
                              ) : (
                                entry.duration
                              )}
                            </TableCell>
                            <TableCell className="text-sm">{entry.reviewedBy}</TableCell>
                            <TableCell>
                              <Badge className={logStatusClass[entry.status]}>{entry.status}</Badge>
                            </TableCell>
                            <TableCell>
                              {entry.patientId && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-2"
                                  onClick={() => handleViewChart(entry.patientId)}
                                >
                                  <IconExternalLink className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <AccessConfirmationDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          patientName={selectedPatient?.name ?? "this patient"}
          patientMrn={selectedPatient?.mrn ?? ""}
          reason={reason}
          justification={justification}
          onConfirm={handleConfirm}
        />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
