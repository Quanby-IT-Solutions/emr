"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { dummyShiftEndorsements, dummyIncidentReports, ShiftEndorsement, IncidentReport } from "@/app/(dashboard)/dummy-data/dummy-nurse-ward"
import { toast } from "sonner"
import { IconPlus, IconEye, IconFileText, IconDownload } from "@tabler/icons-react"
import { exportToCSV } from "@/lib/export-utils"

export default function ReportsEndorsementPage() {
  const [endorsements, setEndorsements] = useState(dummyShiftEndorsements)
  const [incidents, setIncidents] = useState(dummyIncidentReports)
  const [endorsementOpen, setEndorsementOpen] = useState(false)
  const [incidentOpen, setIncidentOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedEndorsement, setSelectedEndorsement] = useState<ShiftEndorsement | null>(null)
  const [incidentDetailOpen, setIncidentDetailOpen] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null)

  // New endorsement form
  const [endForm, setEndForm] = useState({
    ward: "Ward 3B", shiftType: "PM (15:00-23:00)" as ShiftEndorsement["shiftType"],
    incomingNurse: "", generalNotes: "",
  })

  // New incident form
  const [incForm, setIncForm] = useState({
    ward: "Ward 3B", patientName: "", incidentType: "" as IncidentReport["incidentType"] | "",
    severity: "" as IncidentReport["severity"] | "", description: "", immediateAction: "",
  })

  const handleNewEndorsement = () => {
    if (!endForm.incomingNurse) {
      toast.error("Please specify the incoming nurse")
      return
    }
    const newEnd: ShiftEndorsement = {
      id: `SE-${Date.now()}`,
      ward: endForm.ward,
      shiftDate: new Date().toISOString().split("T")[0],
      shiftType: endForm.shiftType,
      outgoingNurse: "Nurse Joy Reyes",
      incomingNurse: endForm.incomingNurse,
      totalPatients: 6,
      admissions: 0,
      discharges: 0,
      transfers: 0,
      patientSummaries: [],
      createdAt: new Date().toISOString(),
    }
    setEndorsements(prev => [newEnd, ...prev])
    setEndorsementOpen(false)
    setEndForm({ ward: "Ward 3B", shiftType: "PM (15:00-23:00)", incomingNurse: "", generalNotes: "" })
    toast.success("Shift endorsement created")
  }

  const handleNewIncident = () => {
    if (!incForm.incidentType || !incForm.severity || !incForm.description || !incForm.immediateAction) {
      toast.error("Please fill in all required fields")
      return
    }
    const newInc: IncidentReport = {
      id: `IR-${Date.now()}`,
      incidentDate: new Date().toISOString().split("T")[0],
      incidentTime: new Date().toTimeString().substring(0, 5),
      ward: incForm.ward,
      patientName: incForm.patientName || null,
      patientId: null,
      reportedBy: "Nurse Joy Reyes",
      incidentType: incForm.incidentType as IncidentReport["incidentType"],
      severity: incForm.severity as IncidentReport["severity"],
      description: incForm.description,
      immediateAction: incForm.immediateAction,
      physicianNotified: true,
      status: "Open",
    }
    setIncidents(prev => [newInc, ...prev])
    setIncidentOpen(false)
    setIncForm({ ward: "Ward 3B", patientName: "", incidentType: "", severity: "", description: "", immediateAction: "" })
    toast.success("Incident report filed")
  }

  return (
    <ProtectedRoute requiredRole={UserRole.NURSE}>
      <DashboardLayout role={UserRole.NURSE}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold flex items-center gap-2"><IconFileText className="h-6 w-6" />Reports & Shift Endorsement</h1>
            <p className="text-muted-foreground">Shift endorsements, incident reports, and nursing documentation.</p>
          </div>

          <div className="px-4 lg:px-6 flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => {
              exportToCSV(endorsements.map(e => ({ ward: e.ward, date: e.shiftDate, shift: e.shiftType, outgoing: e.outgoingNurse, incoming: e.incomingNurse, patients: e.totalPatients, admissions: e.admissions, discharges: e.discharges })), [
                { key: "ward", header: "Ward" }, { key: "date", header: "Date" }, { key: "shift", header: "Shift" },
                { key: "outgoing", header: "Outgoing Nurse" }, { key: "incoming", header: "Incoming Nurse" },
                { key: "patients", header: "Total Patients" }, { key: "admissions", header: "Admissions" }, { key: "discharges", header: "Discharges" },
              ], `shift-endorsements-${new Date().toISOString().split("T")[0]}`)
              toast.success("Endorsements exported as CSV")
            }}><IconDownload className="h-4 w-4 mr-2" />Export Endorsements</Button>
            <Button variant="outline" size="sm" onClick={() => {
              exportToCSV(incidents.map(i => ({ id: i.id, date: i.incidentDate, time: i.incidentTime, ward: i.ward, patient: i.patientName ?? "N/A", type: i.incidentType, severity: i.severity, reporter: i.reportedBy, status: i.status })), [
                { key: "id", header: "ID" }, { key: "date", header: "Date" }, { key: "time", header: "Time" },
                { key: "ward", header: "Ward" }, { key: "patient", header: "Patient" }, { key: "type", header: "Type" },
                { key: "severity", header: "Severity" }, { key: "reporter", header: "Reported By" }, { key: "status", header: "Status" },
              ], `incident-reports-${new Date().toISOString().split("T")[0]}`)
              toast.success("Incident reports exported as CSV")
            }}><IconDownload className="h-4 w-4 mr-2" />Export Incidents</Button>
          </div>

          <div className="px-4 lg:px-6">
            <Tabs defaultValue="endorsement">
              <TabsList>
                <TabsTrigger value="endorsement">Shift Endorsement</TabsTrigger>
                <TabsTrigger value="incidents">Incident Reports</TabsTrigger>
              </TabsList>

              {/* Shift Endorsement Tab */}
              <TabsContent value="endorsement" className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={() => setEndorsementOpen(true)}><IconPlus className="h-4 w-4 mr-2" />New Endorsement</Button>
                </div>

                {endorsements.map(e => (
                  <Card key={e.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{e.ward} — {e.shiftType}</CardTitle>
                          <CardDescription>{e.shiftDate} | {e.outgoingNurse} → {e.incomingNurse}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{e.totalPatients} patients</Badge>
                          {e.admissions > 0 && <Badge variant="secondary">{e.admissions} admission(s)</Badge>}
                          {e.discharges > 0 && <Badge variant="default">{e.discharges} discharge(s)</Badge>}
                          <Button size="sm" variant="ghost" onClick={() => { setSelectedEndorsement(e); setDetailOpen(true) }}><IconEye className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {e.patientSummaries.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow><TableHead>Bed</TableHead><TableHead>Patient</TableHead><TableHead>Status Summary</TableHead><TableHead>Pending Tasks</TableHead><TableHead>Notable Events</TableHead></TableRow>
                          </TableHeader>
                          <TableBody>
                            {e.patientSummaries.map((ps, i) => (
                              <TableRow key={i}>
                                <TableCell className="font-mono text-sm">{ps.bedNumber}</TableCell>
                                <TableCell className="font-medium">{ps.patientName}</TableCell>
                                <TableCell className="text-sm max-w-48">{ps.keyStatus}</TableCell>
                                <TableCell>
                                  <ul className="list-disc list-inside text-xs text-muted-foreground">
                                    {ps.pendingTasks.map((t, j) => <li key={j}>{t}</li>)}
                                  </ul>
                                </TableCell>
                                <TableCell className="text-sm max-w-48">{ps.notableEvents}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No patient summaries added yet.</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Incident Reports Tab */}
              <TabsContent value="incidents" className="space-y-4">
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Badge variant="destructive">{incidents.filter(i => i.status === "Open").length} Open</Badge>
                    <Badge variant="secondary">{incidents.filter(i => i.status === "Under Review").length} Under Review</Badge>
                    <Badge variant="outline">{incidents.filter(i => i.status === "Closed").length} Closed</Badge>
                  </div>
                  <Button onClick={() => setIncidentOpen(true)}><IconPlus className="h-4 w-4 mr-2" />File Incident</Button>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Date/Time</TableHead>
                          <TableHead>Ward</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Severity</TableHead>
                          <TableHead>Reported By</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {incidents.map(ir => (
                          <TableRow key={ir.id} className={ir.severity === "Severe" ? "bg-red-50 dark:bg-red-950/20" : ""}>
                            <TableCell className="font-mono text-sm">{ir.id}</TableCell>
                            <TableCell className="text-sm">{ir.incidentDate} {ir.incidentTime}</TableCell>
                            <TableCell>{ir.ward}</TableCell>
                            <TableCell className="font-medium">{ir.patientName ?? "N/A"}</TableCell>
                            <TableCell><Badge variant="outline">{ir.incidentType}</Badge></TableCell>
                            <TableCell><Badge variant={ir.severity === "Severe" ? "destructive" : ir.severity === "Moderate" ? "secondary" : "outline"}>{ir.severity}</Badge></TableCell>
                            <TableCell className="text-sm">{ir.reportedBy}</TableCell>
                            <TableCell><Badge variant={ir.status === "Open" ? "destructive" : ir.status === "Under Review" ? "secondary" : "outline"}>{ir.status}</Badge></TableCell>
                            <TableCell><Button size="sm" variant="ghost" onClick={() => { setSelectedIncident(ir); setIncidentDetailOpen(true) }}><IconEye className="h-4 w-4" /></Button></TableCell>
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

        {/* Endorsement Detail Dialog */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Shift Endorsement — {selectedEndorsement?.ward}</DialogTitle></DialogHeader>
            {selectedEndorsement && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><Label className="text-muted-foreground">Date</Label><p>{selectedEndorsement.shiftDate}</p></div>
                  <div><Label className="text-muted-foreground">Shift</Label><p>{selectedEndorsement.shiftType}</p></div>
                  <div><Label className="text-muted-foreground">Outgoing</Label><p className="font-medium">{selectedEndorsement.outgoingNurse}</p></div>
                  <div><Label className="text-muted-foreground">Incoming</Label><p className="font-medium">{selectedEndorsement.incomingNurse}</p></div>
                </div>
                <div className="flex gap-4">
                  <Badge variant="outline">Total: {selectedEndorsement.totalPatients}</Badge>
                  <Badge variant="secondary">Admissions: {selectedEndorsement.admissions}</Badge>
                  <Badge variant="default">Discharges: {selectedEndorsement.discharges}</Badge>
                  <Badge variant="outline">Transfers: {selectedEndorsement.transfers}</Badge>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* New Endorsement Dialog */}
        <Dialog open={endorsementOpen} onOpenChange={setEndorsementOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>New Shift Endorsement</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Ward</Label><Input value={endForm.ward} onChange={e => setEndForm(p => ({ ...p, ward: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Shift</Label>
                  <Select value={endForm.shiftType} onValueChange={v => setEndForm(p => ({ ...p, shiftType: v as ShiftEndorsement["shiftType"] }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM (7:00-15:00)">AM (7:00-15:00)</SelectItem>
                      <SelectItem value="PM (15:00-23:00)">PM (15:00-23:00)</SelectItem>
                      <SelectItem value="Night (23:00-07:00)">Night (23:00-07:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Incoming Nurse *</Label><Input value={endForm.incomingNurse} onChange={e => setEndForm(p => ({ ...p, incomingNurse: e.target.value }))} placeholder="Nurse name" /></div>
              <div className="space-y-2"><Label>General Notes</Label><Textarea value={endForm.generalNotes} onChange={e => setEndForm(p => ({ ...p, generalNotes: e.target.value }))} rows={3} placeholder="Overall shift summary..." /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setEndorsementOpen(false)}>Cancel</Button><Button onClick={handleNewEndorsement}>Create Endorsement</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        {/* New Incident Dialog */}
        <Dialog open={incidentOpen} onOpenChange={setIncidentOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>File Incident Report</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Ward</Label><Input value={incForm.ward} onChange={e => setIncForm(p => ({ ...p, ward: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Patient Name (if applicable)</Label><Input value={incForm.patientName} onChange={e => setIncForm(p => ({ ...p, patientName: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Incident Type *</Label>
                  <Select value={incForm.incidentType} onValueChange={v => setIncForm(p => ({ ...p, incidentType: v as IncidentReport["incidentType"] }))}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Patient Fall">Patient Fall</SelectItem>
                      <SelectItem value="Medication Error">Medication Error</SelectItem>
                      <SelectItem value="Allergic Reaction">Allergic Reaction</SelectItem>
                      <SelectItem value="Equipment Failure">Equipment Failure</SelectItem>
                      <SelectItem value="Needle Stick">Needle Stick</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Severity *</Label>
                  <Select value={incForm.severity} onValueChange={v => setIncForm(p => ({ ...p, severity: v as IncidentReport["severity"] }))}>
                    <SelectTrigger><SelectValue placeholder="Select severity" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Minor">Minor</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Severe">Severe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Description *</Label><Textarea value={incForm.description} onChange={e => setIncForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Describe what happened..." /></div>
              <div className="space-y-2"><Label>Immediate Action Taken *</Label><Textarea value={incForm.immediateAction} onChange={e => setIncForm(p => ({ ...p, immediateAction: e.target.value }))} rows={3} placeholder="What was done immediately..." /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setIncidentOpen(false)}>Cancel</Button><Button onClick={handleNewIncident}>File Report</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Incident Detail Dialog */}
        <Dialog open={incidentDetailOpen} onOpenChange={setIncidentDetailOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Incident Report — {selectedIncident?.id}</DialogTitle></DialogHeader>
            {selectedIncident && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><Label className="text-muted-foreground">Date / Time</Label><p>{selectedIncident.incidentDate} {selectedIncident.incidentTime}</p></div>
                  <div><Label className="text-muted-foreground">Ward</Label><p>{selectedIncident.ward}</p></div>
                  <div><Label className="text-muted-foreground">Patient</Label><p>{selectedIncident.patientName ?? "N/A"}</p></div>
                  <div><Label className="text-muted-foreground">Reported By</Label><p>{selectedIncident.reportedBy}</p></div>
                  <div><Label className="text-muted-foreground">Type</Label><Badge variant="outline">{selectedIncident.incidentType}</Badge></div>
                  <div><Label className="text-muted-foreground">Severity</Label><Badge variant={selectedIncident.severity === "Severe" ? "destructive" : "secondary"}>{selectedIncident.severity}</Badge></div>
                </div>
                <div><Label className="text-muted-foreground">Description</Label><div className="mt-1 rounded-lg border p-3 text-sm">{selectedIncident.description}</div></div>
                <div><Label className="text-muted-foreground">Immediate Action</Label><div className="mt-1 rounded-lg border p-3 text-sm">{selectedIncident.immediateAction}</div></div>
                <div className="flex items-center gap-2 text-sm"><Label className="text-muted-foreground">Physician Notified:</Label><Badge variant={selectedIncident.physicianNotified ? "default" : "destructive"}>{selectedIncident.physicianNotified ? "Yes" : "No"}</Badge></div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
