"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dummyWardPatients } from "@/app/(dashboard)/dummy-data/dummy-nurse-ward"
import { toast } from "sonner"
import { IconHeartbeat, IconPlus } from "@tabler/icons-react"

interface VitalRecord {
  id: string
  patientId: string
  patientName: string
  bedNumber: string
  timestamp: string
  bp: string
  hr: number
  rr: number
  temp: number
  o2sat: number
  painScore: number
  gcs: number | null
  recordedBy: string
  flags: string[]
}

const dummyVitals: VitalRecord[] = [
  { id: "V-001", patientId: "WP-001", patientName: "Juan Dela Cruz", bedNumber: "3B-01", timestamp: "2026-04-09 08:00", bp: "130/80", hr: 78, rr: 18, temp: 36.8, o2sat: 96, painScore: 2, gcs: null, recordedBy: "Nurse Joy Reyes", flags: [] },
  { id: "V-002", patientId: "WP-003", patientName: "Pedro Reyes", bedNumber: "3B-03", timestamp: "2026-04-09 08:15", bp: "118/72", hr: 68, rr: 16, temp: 36.5, o2sat: 98, painScore: 0, gcs: null, recordedBy: "Nurse Joy Reyes", flags: [] },
  { id: "V-003", patientId: "WP-007", patientName: "Carlos Mendoza", bedNumber: "3B-08", timestamp: "2026-04-09 08:30", bp: "150/90", hr: 82, rr: 20, temp: 37.0, o2sat: 95, painScore: 3, gcs: 12, recordedBy: "Nurse Joy Reyes", flags: ["Elevated BP"] },
  { id: "V-004", patientId: "WP-002", patientName: "Rosa Santos", bedNumber: "3B-02", timestamp: "2026-04-09 06:00", bp: "138/88", hr: 80, rr: 17, temp: 36.8, o2sat: 97, painScore: 1, gcs: null, recordedBy: "Nurse Maria Santos", flags: [] },
  { id: "V-005", patientId: "WP-004", patientName: "Elena Marcos", bedNumber: "3B-05", timestamp: "2026-04-09 08:45", bp: "110/70", hr: 72, rr: 16, temp: 36.6, o2sat: 98, painScore: 4, gcs: null, recordedBy: "Nurse Joy Reyes", flags: ["Joint pain noted"] },
  { id: "V-006", patientId: "WP-005", patientName: "Roberto Aquino", bedNumber: "3B-06", timestamp: "2026-04-09 07:30", bp: "140/92", hr: 76, rr: 18, temp: 36.7, o2sat: 96, painScore: 0, gcs: null, recordedBy: "Nurse Joy Reyes", flags: ["Elevated BP - CKD baseline"] },
]

function getVitalFlags(bp: string, hr: number, rr: number, temp: number, o2sat: number): string[] {
  const flags: string[] = []
  const [sys, dia] = bp.split("/").map(Number)
  if (sys > 140 || dia > 90) flags.push("Hypertensive")
  if (sys < 90 || dia < 60) flags.push("Hypotensive")
  if (hr > 100) flags.push("Tachycardia")
  if (hr < 60) flags.push("Bradycardia")
  if (rr > 20) flags.push("Tachypnea")
  if (temp > 38.0) flags.push("Febrile")
  if (temp < 36.0) flags.push("Hypothermia")
  if (o2sat < 94) flags.push("Low SpO2")
  return flags
}

export default function VitalsPage() {
  const [vitals, setVitals] = useState(dummyVitals)
  const [newOpen, setNewOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState("all")
  const [formData, setFormData] = useState({
    patientId: "", bp: "", hr: "", rr: "", temp: "", o2sat: "", painScore: "0", gcs: "",
  })

  const filtered = selectedPatient === "all" ? vitals : vitals.filter(v => v.patientId === selectedPatient)
  const latestByPatient = dummyWardPatients.map(p => {
    const latest = vitals.filter(v => v.patientId === p.id).sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0]
    return { patient: p, vitals: latest }
  })

  const handleRecord = () => {
    if (!formData.patientId || !formData.bp || !formData.hr || !formData.rr || !formData.temp || !formData.o2sat) {
      toast.error("Please fill in all required fields")
      return
    }
    const patient = dummyWardPatients.find(p => p.id === formData.patientId)
    const flags = getVitalFlags(formData.bp, Number(formData.hr), Number(formData.rr), Number(formData.temp), Number(formData.o2sat))
    const newVital: VitalRecord = {
      id: `V-${Date.now()}`,
      patientId: formData.patientId,
      patientName: patient?.patientName ?? "",
      bedNumber: patient?.bedNumber ?? "",
      timestamp: new Date().toLocaleString("sv-SE", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }),
      bp: formData.bp, hr: Number(formData.hr), rr: Number(formData.rr),
      temp: Number(formData.temp), o2sat: Number(formData.o2sat),
      painScore: Number(formData.painScore), gcs: formData.gcs ? Number(formData.gcs) : null,
      recordedBy: "Nurse Joy Reyes", flags,
    }
    setVitals(prev => [newVital, ...prev])
    setNewOpen(false)
    setFormData({ patientId: "", bp: "", hr: "", rr: "", temp: "", o2sat: "", painScore: "0", gcs: "" })
    if (flags.length > 0) {
      toast.warning(`Vitals recorded with alerts: ${flags.join(", ")}`)
    } else {
      toast.success("Vitals recorded successfully")
    }
  }

  return (
    <ProtectedRoute requiredRole={UserRole.NURSE}>
      <DashboardLayout role={UserRole.NURSE}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-between px-4 lg:px-6">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2"><IconHeartbeat className="h-6 w-6" />Vital Signs Monitoring</h1>
              <p className="text-muted-foreground">Record, monitor, and alert on patient vital signs.</p>
            </div>
            <Button onClick={() => setNewOpen(true)}><IconPlus className="h-4 w-4 mr-2" />Record Vitals</Button>
          </div>

          {/* Latest Vitals Overview */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader><CardTitle>Latest Vitals — All Ward Patients</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bed</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>BP</TableHead>
                      <TableHead>HR</TableHead>
                      <TableHead>RR</TableHead>
                      <TableHead>Temp</TableHead>
                      <TableHead>SpO2</TableHead>
                      <TableHead>Pain</TableHead>
                      <TableHead>GCS</TableHead>
                      <TableHead>Alerts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {latestByPatient.map(({ patient, vitals: v }) => (
                      <TableRow key={patient.id} className={v?.flags.length ? "bg-yellow-50 dark:bg-yellow-950/20" : ""}>
                        <TableCell className="font-mono text-sm">{patient.bedNumber}</TableCell>
                        <TableCell className="font-medium">{patient.patientName}</TableCell>
                        <TableCell className="text-sm">{v?.timestamp.split(" ")[1] ?? "—"}</TableCell>
                        <TableCell className="font-mono">{v?.bp ?? "—"}</TableCell>
                        <TableCell className="font-mono">{v?.hr ?? "—"}</TableCell>
                        <TableCell className="font-mono">{v?.rr ?? "—"}</TableCell>
                        <TableCell className="font-mono">{v?.temp ?? "—"}°C</TableCell>
                        <TableCell className="font-mono">{v ? `${v.o2sat}%` : "—"}</TableCell>
                        <TableCell>{v?.painScore !== undefined ? `${v.painScore}/10` : "—"}</TableCell>
                        <TableCell>{v?.gcs ?? "—"}</TableCell>
                        <TableCell>{v?.flags.length ? v.flags.map((f, i) => <Badge key={i} variant="destructive" className="mr-1 text-xs">{f}</Badge>) : <Badge variant="outline">Normal</Badge>}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Historical Log */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Vitals Log</CardTitle>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Patients</SelectItem>
                      {dummyWardPatients.map(p => <SelectItem key={p.id} value={p.id}>{p.patientName} ({p.bedNumber})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Date/Time</TableHead><TableHead>Patient</TableHead><TableHead>BP</TableHead><TableHead>HR</TableHead><TableHead>RR</TableHead><TableHead>Temp</TableHead><TableHead>SpO2</TableHead><TableHead>Pain</TableHead><TableHead>By</TableHead><TableHead>Flags</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(v => (
                      <TableRow key={v.id} className={v.flags.length ? "bg-yellow-50 dark:bg-yellow-950/20" : ""}>
                        <TableCell className="text-sm">{v.timestamp}</TableCell>
                        <TableCell className="font-medium">{v.patientName}</TableCell>
                        <TableCell className="font-mono">{v.bp}</TableCell>
                        <TableCell className="font-mono">{v.hr}</TableCell>
                        <TableCell className="font-mono">{v.rr}</TableCell>
                        <TableCell className="font-mono">{v.temp}°C</TableCell>
                        <TableCell className="font-mono">{v.o2sat}%</TableCell>
                        <TableCell>{v.painScore}/10</TableCell>
                        <TableCell className="text-sm">{v.recordedBy}</TableCell>
                        <TableCell>{v.flags.length > 0 ? v.flags.map((f, i) => <Badge key={i} variant="destructive" className="text-xs mr-1">{f}</Badge>) : "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Record Vitals Dialog */}
        <Dialog open={newOpen} onOpenChange={setNewOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Record Vital Signs</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Patient *</Label>
                <Select value={formData.patientId} onValueChange={v => setFormData(p => ({ ...p, patientId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                  <SelectContent>{dummyWardPatients.map(p => <SelectItem key={p.id} value={p.id}>{p.patientName} — {p.bedNumber}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Blood Pressure *</Label><Input value={formData.bp} onChange={e => setFormData(p => ({ ...p, bp: e.target.value }))} placeholder="120/80" /></div>
                <div className="space-y-2"><Label>Heart Rate *</Label><Input type="number" value={formData.hr} onChange={e => setFormData(p => ({ ...p, hr: e.target.value }))} placeholder="bpm" /></div>
                <div className="space-y-2"><Label>Respiratory Rate *</Label><Input type="number" value={formData.rr} onChange={e => setFormData(p => ({ ...p, rr: e.target.value }))} placeholder="/min" /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Temperature (°C) *</Label><Input type="number" step="0.1" value={formData.temp} onChange={e => setFormData(p => ({ ...p, temp: e.target.value }))} placeholder="36.5" /></div>
                <div className="space-y-2"><Label>SpO2 (%) *</Label><Input type="number" value={formData.o2sat} onChange={e => setFormData(p => ({ ...p, o2sat: e.target.value }))} placeholder="98" /></div>
                <div className="space-y-2"><Label>Pain Score (0-10)</Label><Input type="number" min="0" max="10" value={formData.painScore} onChange={e => setFormData(p => ({ ...p, painScore: e.target.value }))} /></div>
              </div>
              <div className="space-y-2"><Label>GCS (if applicable)</Label><Input type="number" min="3" max="15" value={formData.gcs} onChange={e => setFormData(p => ({ ...p, gcs: e.target.value }))} placeholder="3-15" /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button><Button onClick={handleRecord}>Save Vitals</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
