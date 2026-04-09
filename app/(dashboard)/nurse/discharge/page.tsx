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
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { dummyDischargeRecords, DischargeRecord, DischargeStep, dummyWardPatients } from "@/app/(dashboard)/dummy-data/dummy-nurse-ward"
import { toast } from "sonner"
import { IconChecklist, IconClipboardCheck } from "@tabler/icons-react"

const dischargeSteps: DischargeStep[] = [
  "Discharge Summary",
  "Medications Explained",
  "Home Instructions",
  "Follow-up Booked",
  "PhilHealth Clearance",
  "Pharmacy Clearance",
  "Final Vitals",
  "Wheeled Out",
]

export default function DischargeManagementPage() {
  const [records, setRecords] = useState<DischargeRecord[]>(dummyDischargeRecords)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<DischargeRecord | null>(null)
  const [vitalsOpen, setVitalsOpen] = useState(false)
  const [vitalsData, setVitalsData] = useState({ bp: "", hr: "", rr: "", temp: "", o2sat: "" })

  const handleToggleStep = (recordId: string, step: DischargeStep) => {
    setRecords(prev => prev.map(r => {
      if (r.id !== recordId) return r
      return { ...r, checklist: { ...r.checklist, [step]: !r.checklist[step] } }
    }))
    // Update selected record too
    setSelectedRecord(prev => {
      if (!prev || prev.id !== recordId) return prev
      return { ...prev, checklist: { ...prev.checklist, [step]: !prev.checklist[step] } }
    })
  }

  const handleRecordVitals = () => {
    if (!selectedRecord || !vitalsData.bp || !vitalsData.hr) {
      toast.error("Please fill in vitals")
      return
    }
    setRecords(prev => prev.map(r => {
      if (r.id !== selectedRecord.id) return r
      return {
        ...r,
        dischargeVitals: {
          bp: vitalsData.bp,
          hr: Number(vitalsData.hr),
          rr: Number(vitalsData.rr),
          temp: Number(vitalsData.temp),
          o2sat: Number(vitalsData.o2sat),
        },
        checklist: { ...r.checklist, "Final Vitals": true },
      }
    }))
    setSelectedRecord(prev => prev ? {
      ...prev,
      dischargeVitals: { bp: vitalsData.bp, hr: Number(vitalsData.hr), rr: Number(vitalsData.rr), temp: Number(vitalsData.temp), o2sat: Number(vitalsData.o2sat) },
      checklist: { ...prev.checklist, "Final Vitals": true },
    } : prev)
    setVitalsOpen(false)
    toast.success("Discharge vitals recorded")
  }

  const handleCompleteDischarge = (id: string) => {
    const record = records.find(r => r.id === id)
    if (!record) return
    const allComplete = Object.values(record.checklist).every(Boolean)
    if (!allComplete) {
      toast.error("Please complete all checklist items before discharge")
      return
    }
    setRecords(prev => prev.map(r => r.id === id ? { ...r, discharged: true, dischargeDate: new Date().toISOString().split("T")[0] } : r))
    setDetailOpen(false)
    toast.success(`${record.patientName} has been discharged successfully`)
  }

  const forDischargePatients = dummyWardPatients.filter(p => p.status === "For Discharge")

  return (
    <ProtectedRoute requiredRole={UserRole.NURSE}>
      <DashboardLayout role={UserRole.NURSE}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold flex items-center gap-2"><IconChecklist className="h-6 w-6" />Discharge Management</h1>
            <p className="text-muted-foreground">Manage discharge checklists, final vitals, home instructions, and clearances.</p>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 px-4 lg:px-6">
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">For Discharge</p><p className="text-3xl font-bold">{forDischargePatients.length}</p></CardContent></Card>
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">In Progress</p><p className="text-3xl font-bold text-yellow-600">{records.filter(r => !r.discharged).length}</p></CardContent></Card>
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Discharged Today</p><p className="text-3xl font-bold text-green-600">{records.filter(r => r.discharged).length}</p></CardContent></Card>
          </div>

          {/* Active Discharge Records */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader><CardTitle>Active Discharge Checklists</CardTitle></CardHeader>
              <CardContent>
                {records.filter(r => !r.discharged).length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No active discharge records. Patients marked &quot;For Discharge&quot; will appear here when discharge orders are placed.</p>
                ) : (
                  <div className="space-y-4">
                    {records.filter(r => !r.discharged).map(r => {
                      const completed = Object.values(r.checklist).filter(Boolean).length
                      const total = Object.keys(r.checklist).length
                      const percentage = Math.round((completed / total) * 100)
                      return (
                        <Card key={r.id} className="border">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <p className="font-medium text-lg">{r.patientName}</p>
                                <p className="text-sm text-muted-foreground">{r.hospitalNumber} — Bed {r.bedNumber} — Ordered by {r.dischargeOrderBy}</p>
                              </div>
                              <div className="text-right">
                                <Badge variant={percentage === 100 ? "default" : "secondary"}>{completed}/{total} ({percentage}%)</Badge>
                                <Button size="sm" className="ml-2" onClick={() => { setSelectedRecord(r); setDetailOpen(true) }}><IconClipboardCheck className="h-4 w-4 mr-1" />Manage</Button>
                              </div>
                            </div>
                            {/* Progress bar */}
                            <div className="w-full bg-muted rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${percentage}%` }} />
                            </div>
                            <div className="grid grid-cols-4 gap-2 mt-3">
                              {dischargeSteps.map(step => (
                                <div key={step} className="flex items-center gap-1">
                                  <Checkbox checked={r.checklist[step]} onCheckedChange={() => handleToggleStep(r.id, step)} id={`${r.id}-${step}`} />
                                  <label htmlFor={`${r.id}-${step}`} className={`text-xs ${r.checklist[step] ? "line-through text-muted-foreground" : ""}`}>{step}</label>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Completed Discharges */}
          {records.filter(r => r.discharged).length > 0 && (
            <div className="px-4 lg:px-6">
              <Card>
                <CardHeader><CardTitle>Completed Discharges</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow><TableHead>Patient</TableHead><TableHead>Hospital #</TableHead><TableHead>Ward/Bed</TableHead><TableHead>Discharge Date</TableHead><TableHead>Follow-up</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {records.filter(r => r.discharged).map(r => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium">{r.patientName}</TableCell>
                          <TableCell className="font-mono text-sm">{r.hospitalNumber}</TableCell>
                          <TableCell>{r.ward} — {r.bedNumber}</TableCell>
                          <TableCell>{r.dischargeDate}</TableCell>
                          <TableCell>{r.followUpDate ? `${r.followUpDate} at ${r.followUpClinic}` : "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Discharge Detail Dialog */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Discharge Checklist — {selectedRecord?.patientName}</DialogTitle></DialogHeader>
            {selectedRecord && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><Label className="text-muted-foreground">Hospital #</Label><p className="font-mono">{selectedRecord.hospitalNumber}</p></div>
                  <div><Label className="text-muted-foreground">Ward / Bed</Label><p>{selectedRecord.ward} — {selectedRecord.bedNumber}</p></div>
                  <div><Label className="text-muted-foreground">Discharge Ordered By</Label><p>{selectedRecord.dischargeOrderBy}</p></div>
                  <div><Label className="text-muted-foreground">Follow-up</Label><p>{selectedRecord.followUpDate ?? "Not set"}</p></div>
                </div>

                <hr />
                <div>
                  <h3 className="font-semibold mb-2">Checklist Steps</h3>
                  <div className="space-y-2">
                    {dischargeSteps.map(step => (
                      <div key={step} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox checked={selectedRecord.checklist[step]} onCheckedChange={() => handleToggleStep(selectedRecord.id, step)} />
                          <span className={`text-sm ${selectedRecord.checklist[step] ? "line-through text-muted-foreground" : ""}`}>{step}</span>
                        </div>
                        {step === "Final Vitals" && !selectedRecord.checklist["Final Vitals"] && (
                          <Button size="sm" variant="outline" onClick={() => { setVitalsOpen(true); setVitalsData({ bp: "", hr: "", rr: "", temp: "", o2sat: "" }) }}>Record</Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedRecord.dischargeVitals && (
                  <div className="rounded-lg bg-muted p-3">
                    <Label className="text-muted-foreground text-xs">Discharge Vitals</Label>
                    <p className="font-mono text-sm">BP {selectedRecord.dischargeVitals.bp} | HR {selectedRecord.dischargeVitals.hr} | RR {selectedRecord.dischargeVitals.rr} | T {selectedRecord.dischargeVitals.temp}°C | SpO2 {selectedRecord.dischargeVitals.o2sat}%</p>
                  </div>
                )}

                <div><Label className="text-muted-foreground">Home Instructions</Label><p className="text-sm mt-1">{selectedRecord.homeInstructions}</p></div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailOpen(false)}>Close</Button>
              {selectedRecord && !selectedRecord.discharged && (
                <Button onClick={() => handleCompleteDischarge(selectedRecord.id)} disabled={!Object.values(selectedRecord.checklist).every(Boolean)}>Complete Discharge</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Final Vitals Dialog */}
        <Dialog open={vitalsOpen} onOpenChange={setVitalsOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Record Discharge Vitals</DialogTitle></DialogHeader>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Label>BP</Label><Input value={vitalsData.bp} onChange={e => setVitalsData(p => ({ ...p, bp: e.target.value }))} placeholder="120/80" /></div>
              <div className="space-y-2"><Label>HR</Label><Input type="number" value={vitalsData.hr} onChange={e => setVitalsData(p => ({ ...p, hr: e.target.value }))} placeholder="bpm" /></div>
              <div className="space-y-2"><Label>RR</Label><Input type="number" value={vitalsData.rr} onChange={e => setVitalsData(p => ({ ...p, rr: e.target.value }))} placeholder="/min" /></div>
              <div className="space-y-2"><Label>Temp (°C)</Label><Input type="number" step="0.1" value={vitalsData.temp} onChange={e => setVitalsData(p => ({ ...p, temp: e.target.value }))} placeholder="36.5" /></div>
              <div className="space-y-2"><Label>SpO2 (%)</Label><Input type="number" value={vitalsData.o2sat} onChange={e => setVitalsData(p => ({ ...p, o2sat: e.target.value }))} placeholder="98" /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setVitalsOpen(false)}>Cancel</Button><Button onClick={handleRecordVitals}>Save Vitals</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
