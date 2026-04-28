"use client"

import { useState, useEffect, useCallback } from "react"
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
import { toast } from "sonner"
import { IconHeartbeat, IconPlus } from "@tabler/icons-react"
import { encountersClient, type ApiEncounterDetail, type ApiFlowsheetObservation } from "@/lib/api/encounters-client"

function getVitalFlags(bp: string, hr: number, rr: number, temp: number, o2sat: number): string[] {
  const flags: string[] = []
  const parts = bp.split("/").map(Number)
  const sys = parts[0] ?? 0
  const dia = parts[1] ?? 0
  if (sys > 140 || dia > 90) flags.push("Hypertensive")
  if (sys > 0 && (sys < 90 || dia < 60)) flags.push("Hypotensive")
  if (hr > 100) flags.push("Tachycardia")
  if (hr > 0 && hr < 60) flags.push("Bradycardia")
  if (rr > 20) flags.push("Tachypnea")
  if (temp > 38.0) flags.push("Febrile")
  if (temp > 0 && temp < 36.0) flags.push("Hypothermia")
  if (o2sat > 0 && o2sat < 94) flags.push("Low SpO2")
  return flags
}

function patientName(enc: ApiEncounterDetail) {
  return `${enc.patient.lastName}, ${enc.patient.firstName}`
}

function bedLabel(enc: ApiEncounterDetail) {
  const loc = enc.currentLocation
  if (!loc) return "—"
  return [loc.unit, loc.bedNumber].filter(Boolean).join(" / ")
}

function groupObsByType(obs: ApiFlowsheetObservation[]) {
  const latest: Record<string, ApiFlowsheetObservation> = {}
  for (const o of obs) {
    if (!latest[o.observationType]) latest[o.observationType] = o
  }
  return latest
}

export default function VitalsPage() {
  const [encounters, setEncounters] = useState<ApiEncounterDetail[]>([])
  const [selectedEncounterId, setSelectedEncounterId] = useState<string>("all")
  const [flowsheetByEnc, setFlowsheetByEnc] = useState<Record<string, ApiFlowsheetObservation[]>>({})
  const [newOpen, setNewOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    encounterId: "", bp: "", hr: "", rr: "", temp: "", o2sat: "", painScore: "0", gcs: "",
  })

  const fetchEncounters = useCallback(async () => {
    try {
      const data = await encountersClient.list("ACTIVE")
      setEncounters(data)
    } catch {
      toast.error("Failed to load patients")
    }
  }, [])

  const fetchFlowsheet = useCallback(async (encounterId: string) => {
    try {
      const data = await encountersClient.getFlowsheet(encounterId)
      setFlowsheetByEnc(prev => ({ ...prev, [encounterId]: data.observations }))
    } catch {
      // silently ignore per-encounter fetch failures
    }
  }, [])

  useEffect(() => {
    fetchEncounters()
  }, [fetchEncounters])

  useEffect(() => {
    for (const enc of encounters) {
      fetchFlowsheet(enc.id)
    }
  }, [encounters, fetchFlowsheet])

  const handleRecord = async () => {
    const { encounterId, bp, hr, rr, temp, o2sat, painScore, gcs } = formData
    if (!encounterId || !bp || !hr || !rr || !temp || !o2sat) {
      toast.error("Please fill in all required fields")
      return
    }

    const flags = getVitalFlags(bp, Number(hr), Number(rr), Number(temp), Number(o2sat))

    const bpParts = bp.split("/")
    const vitals: { observationType: string; value: string; unit: string }[] = [
      { observationType: "SYSTOLIC_BP",      value: bpParts[0] ?? "",  unit: "MMHG"    },
      { observationType: "DIASTOLIC_BP",     value: bpParts[1] ?? "",  unit: "MMHG"    },
      { observationType: "HEART_RATE",       value: hr,                unit: "BPM"     },
      { observationType: "RESPIRATORY_RATE", value: rr,                unit: "BRPM"    },
      { observationType: "TEMPERATURE",      value: temp,              unit: "CELSIUS" },
      { observationType: "SPO2",             value: o2sat,             unit: "PERCENT" },
      { observationType: "PAIN_SCORE",       value: painScore,         unit: "POINTS"  },
    ]

    if (gcs) {
      vitals.push({ observationType: "NEWS_SCORE", value: gcs, unit: "POINTS" })
    }

    setSubmitting(true)
    try {
      for (const v of vitals) {
        await encountersClient.recordObservation(encounterId, v)
      }
      await fetchFlowsheet(encounterId)
      setNewOpen(false)
      setFormData({ encounterId: "", bp: "", hr: "", rr: "", temp: "", o2sat: "", painScore: "0", gcs: "" })
      if (flags.length > 0) {
        toast.warning(`Vitals recorded with alerts: ${flags.join(", ")}`)
      } else {
        toast.success("Vitals recorded successfully")
      }
    } catch {
      toast.error("Failed to record vitals")
    } finally {
      setSubmitting(false)
    }
  }

  const selectedObs =
    selectedEncounterId === "all"
      ? Object.values(flowsheetByEnc).flat().sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
      : (flowsheetByEnc[selectedEncounterId] ?? [])

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
              <CardHeader><CardTitle>Latest Vitals — Active Encounters</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bed / Location</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>HR</TableHead>
                      <TableHead>BP (Sys/Dia)</TableHead>
                      <TableHead>RR</TableHead>
                      <TableHead>Temp</TableHead>
                      <TableHead>SpO2</TableHead>
                      <TableHead>Pain</TableHead>
                      <TableHead>Alerts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {encounters.length === 0 && (
                      <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground">Loading patients...</TableCell></TableRow>
                    )}
                    {encounters.map(enc => {
                      const obs = groupObsByType(flowsheetByEnc[enc.id] ?? [])
                      const hr   = obs["HEART_RATE"]?.value
                      const sys  = obs["SYSTOLIC_BP"]?.value
                      const dia  = obs["DIASTOLIC_BP"]?.value
                      const rr   = obs["RESPIRATORY_RATE"]?.value
                      const tmp  = obs["TEMPERATURE"]?.value
                      const spo2 = obs["SPO2"]?.value
                      const pain = obs["PAIN_SCORE"]?.value
                      const bp   = sys && dia ? `${sys}/${dia}` : null
                      const flags = bp && hr && rr && tmp && spo2
                        ? getVitalFlags(bp, Number(hr), Number(rr), Number(tmp), Number(spo2))
                        : []
                      return (
                        <TableRow key={enc.id} className={flags.length > 0 ? "bg-yellow-50 dark:bg-yellow-950/20" : ""}>
                          <TableCell className="font-mono text-sm">{bedLabel(enc)}</TableCell>
                          <TableCell className="font-medium">{patientName(enc)}</TableCell>
                          <TableCell className="font-mono">{hr ?? "—"}</TableCell>
                          <TableCell className="font-mono">{bp ?? "—"}</TableCell>
                          <TableCell className="font-mono">{rr ?? "—"}</TableCell>
                          <TableCell className="font-mono">{tmp ? `${tmp}°C` : "—"}</TableCell>
                          <TableCell className="font-mono">{spo2 ? `${spo2}%` : "—"}</TableCell>
                          <TableCell>{pain ? `${pain}/10` : "—"}</TableCell>
                          <TableCell>{flags.length > 0 ? flags.map((f, i) => <Badge key={i} variant="destructive" className="mr-1 text-xs">{f}</Badge>) : <Badge variant="outline">Normal</Badge>}</TableCell>
                        </TableRow>
                      )
                    })}
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
                  <Select value={selectedEncounterId} onValueChange={v => { setSelectedEncounterId(v); if (v !== "all") fetchFlowsheet(v) }}>
                    <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Patients</SelectItem>
                      {encounters.map(enc => (
                        <SelectItem key={enc.id} value={enc.id}>{patientName(enc)} ({bedLabel(enc)})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Date/Time</TableHead><TableHead>Patient</TableHead><TableHead>Type</TableHead><TableHead>Value</TableHead><TableHead>Unit</TableHead><TableHead>Recorded By</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedObs.length === 0 && (
                      <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No observations recorded</TableCell></TableRow>
                    )}
                    {selectedObs.map(obs => {
                      const enc = encounters.find(e => e.id === obs.encounterId)
                      return (
                        <TableRow key={obs.id}>
                          <TableCell className="text-sm">{new Date(obs.recordedAt).toLocaleString()}</TableCell>
                          <TableCell className="font-medium">{enc ? patientName(enc) : obs.encounterId}</TableCell>
                          <TableCell>{obs.observationType.replace(/_/g, " ")}</TableCell>
                          <TableCell className="font-mono">{obs.value}</TableCell>
                          <TableCell className="font-mono">{obs.unit ?? "—"}</TableCell>
                          <TableCell className="text-sm">{obs.recorder.firstName} {obs.recorder.lastName}</TableCell>
                        </TableRow>
                      )
                    })}
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
                <Select value={formData.encounterId} onValueChange={v => setFormData(p => ({ ...p, encounterId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                  <SelectContent>
                    {encounters.map(enc => (
                      <SelectItem key={enc.id} value={enc.id}>{patientName(enc)} — {bedLabel(enc)}</SelectItem>
                    ))}
                  </SelectContent>
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
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewOpen(false)} disabled={submitting}>Cancel</Button>
              <Button onClick={handleRecord} disabled={submitting}>{submitting ? "Saving..." : "Save Vitals"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
