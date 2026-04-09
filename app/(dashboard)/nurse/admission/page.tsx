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
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { dummyWardPatients, WardPatient, AdmissionType } from "@/app/(dashboard)/dummy-data/dummy-nurse-ward"
import { toast } from "sonner"
import { IconPlus, IconEye } from "@tabler/icons-react"

const admissionChecklist = [
  "Patient identity band applied",
  "Vital signs recorded (baseline)",
  "Height and weight measured",
  "Allergies verified and tagged",
  "Fall risk assessment completed",
  "Skin integrity assessment done",
  "Pain assessment completed",
  "Orientation to ward (call bell, bathroom, visiting hours)",
  "Admission orders reviewed",
  "Diet order confirmed with kitchen",
  "Medications reconciled",
  "IV access established (if ordered)",
  "Personal belongings inventory",
  "Consent forms signed",
  "Code status verified",
]

const wards = ["Ward 3B - Internal Medicine", "Ward 5A - Oncology", "Ward 6 - Surgery", "PACU", "ICU", "ER"]
const bedOptions: Record<string, string[]> = {
  "Ward 3B - Internal Medicine": ["3B-01", "3B-02", "3B-03", "3B-04", "3B-05", "3B-06", "3B-07", "3B-08"],
  "Ward 5A - Oncology": ["5A-01", "5A-02", "5A-03", "5A-04"],
  "PACU": ["PACU-01", "PACU-02", "PACU-03"],
  "ICU": ["ICU-01", "ICU-02", "ICU-03", "ICU-04"],
  "Ward 6 - Surgery": ["6-01", "6-02", "6-03", "6-04", "6-05", "6-06"],
  "ER": ["ER-01", "ER-02", "ER-03", "ER-04", "ER-05"],
}

export default function PatientAdmissionPage() {
  const [newOpen, setNewOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<WardPatient | null>(null)
  const [checklist, setChecklist] = useState<boolean[]>(new Array(admissionChecklist.length).fill(false))
  const [selectedWard, setSelectedWard] = useState("")

  const recentAdmissions = dummyWardPatients.sort((a, b) => new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime())

  const [formData, setFormData] = useState({
    patientName: "", hospitalNumber: "", age: "", sex: "", ward: "", bedNumber: "",
    admissionType: "" as AdmissionType | "", admittingPhysician: "", diagnosis: "",
    allergies: "", dietOrders: "", isolationPrecautions: "", codeStatus: "Full Code",
  })

  const handleAdmit = () => {
    if (!formData.patientName || !formData.hospitalNumber || !formData.ward || !formData.bedNumber) {
      toast.error("Please fill in all required fields")
      return
    }
    const completedItems = checklist.filter(Boolean).length
    if (completedItems < 10) {
      toast.error(`Please complete at least 10 checklist items (currently ${completedItems}/${admissionChecklist.length})`)
      return
    }
    toast.success(`Patient ${formData.patientName} admitted to ${formData.bedNumber}`)
    setNewOpen(false)
    setFormData({ patientName: "", hospitalNumber: "", age: "", sex: "", ward: "", bedNumber: "", admissionType: "", admittingPhysician: "", diagnosis: "", allergies: "", dietOrders: "", isolationPrecautions: "", codeStatus: "Full Code" })
    setChecklist(new Array(admissionChecklist.length).fill(false))
  }

  return (
    <ProtectedRoute requiredRole={UserRole.NURSE}>
      <DashboardLayout role={UserRole.NURSE}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-between px-4 lg:px-6">
            <div>
              <h1 className="text-2xl font-bold">Patient Admission</h1>
              <p className="text-muted-foreground">Nursing admission assessment, bed assignment, and admission checklist.</p>
            </div>
            <Button onClick={() => { setNewOpen(true); setChecklist(new Array(admissionChecklist.length).fill(false)) }}><IconPlus className="h-4 w-4 mr-2" />New Admission</Button>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-4 px-4 lg:px-6">
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Total Admitted (Ward)</p><p className="text-3xl font-bold">{dummyWardPatients.length}</p></CardContent></Card>
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Emergency</p><p className="text-3xl font-bold text-red-600">{dummyWardPatients.filter(p => p.admissionType === "Emergency").length}</p></CardContent></Card>
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Elective</p><p className="text-3xl font-bold text-blue-600">{dummyWardPatients.filter(p => p.admissionType === "Elective").length}</p></CardContent></Card>
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Transfer</p><p className="text-3xl font-bold">{dummyWardPatients.filter(p => p.admissionType === "Transfer").length}</p></CardContent></Card>
          </div>

          {/* Recent Admissions Table */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader><CardTitle>Recent Admissions</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bed</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Hospital #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Physician</TableHead>
                      <TableHead>Diagnosis</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentAdmissions.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-mono text-sm">{p.bedNumber}</TableCell>
                        <TableCell className="font-medium">{p.patientName}</TableCell>
                        <TableCell className="font-mono text-sm">{p.hospitalNumber}</TableCell>
                        <TableCell>{p.admissionDate}</TableCell>
                        <TableCell><Badge variant={p.admissionType === "Emergency" ? "destructive" : "outline"}>{p.admissionType}</Badge></TableCell>
                        <TableCell className="text-sm">{p.admittingPhysician}</TableCell>
                        <TableCell className="text-sm max-w-48 truncate">{p.diagnosis}</TableCell>
                        <TableCell><Badge variant={p.status === "Critical" ? "destructive" : p.status === "For Discharge" ? "default" : "secondary"}>{p.status}</Badge></TableCell>
                        <TableCell><Button size="sm" variant="ghost" onClick={() => { setSelectedPatient(p); setDetailOpen(true) }}><IconEye className="h-4 w-4" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Admission Detail Dialog */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Patient Details — {selectedPatient?.bedNumber}</DialogTitle></DialogHeader>
            {selectedPatient && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><Label className="text-muted-foreground">Patient</Label><p className="font-medium">{selectedPatient.patientName}</p></div>
                  <div><Label className="text-muted-foreground">Hospital #</Label><p className="font-mono">{selectedPatient.hospitalNumber}</p></div>
                  <div><Label className="text-muted-foreground">Age / Sex</Label><p>{selectedPatient.age} / {selectedPatient.sex === "M" ? "Male" : "Female"}</p></div>
                  <div><Label className="text-muted-foreground">Ward / Bed</Label><p>{selectedPatient.ward} — {selectedPatient.bedNumber}</p></div>
                  <div><Label className="text-muted-foreground">Admission Type</Label><Badge variant={selectedPatient.admissionType === "Emergency" ? "destructive" : "outline"}>{selectedPatient.admissionType}</Badge></div>
                  <div><Label className="text-muted-foreground">Physician</Label><p>{selectedPatient.admittingPhysician}</p></div>
                  <div className="col-span-2"><Label className="text-muted-foreground">Diagnosis</Label><p>{selectedPatient.diagnosis}</p></div>
                  <div><Label className="text-muted-foreground">Allergies</Label><p>{selectedPatient.allergies.length > 0 ? selectedPatient.allergies.join(", ") : "NKDA"}</p></div>
                  <div><Label className="text-muted-foreground">Diet</Label><p>{selectedPatient.dietOrders}</p></div>
                  <div><Label className="text-muted-foreground">Code Status</Label><Badge variant={selectedPatient.codeStatus === "DNR" ? "destructive" : "outline"}>{selectedPatient.codeStatus}</Badge></div>
                  {selectedPatient.isolationPrecautions && <div><Label className="text-muted-foreground">Isolation</Label><Badge variant="secondary">{selectedPatient.isolationPrecautions}</Badge></div>}
                </div>
                <hr />
                <div><Label className="text-muted-foreground">Current Medications</Label>
                  <ul className="list-disc list-inside text-sm mt-1">{selectedPatient.currentMedications.map((m, i) => <li key={i}>{m}</li>)}</ul>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* New Admission Dialog */}
        <Dialog open={newOpen} onOpenChange={setNewOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>New Patient Admission</DialogTitle></DialogHeader>
            <div className="space-y-6">
              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Patient Name *</Label><Input value={formData.patientName} onChange={e => setFormData(p => ({ ...p, patientName: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Hospital Number *</Label><Input value={formData.hospitalNumber} onChange={e => setFormData(p => ({ ...p, hospitalNumber: e.target.value }))} placeholder="PGH-YYYY-XXXXX" /></div>
                <div className="space-y-2"><Label>Age</Label><Input type="number" value={formData.age} onChange={e => setFormData(p => ({ ...p, age: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Sex</Label>
                  <Select value={formData.sex} onValueChange={v => setFormData(p => ({ ...p, sex: v }))}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="M">Male</SelectItem><SelectItem value="F">Female</SelectItem></SelectContent></Select>
                </div>
              </div>

              {/* Bed Assignment */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Ward *</Label>
                  <Select value={formData.ward} onValueChange={v => { setFormData(p => ({ ...p, ward: v, bedNumber: "" })); setSelectedWard(v) }}>
                    <SelectTrigger><SelectValue placeholder="Select ward" /></SelectTrigger>
                    <SelectContent>{wards.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Bed Number *</Label>
                  <Select value={formData.bedNumber} onValueChange={v => setFormData(p => ({ ...p, bedNumber: v }))} disabled={!selectedWard}>
                    <SelectTrigger><SelectValue placeholder="Select bed" /></SelectTrigger>
                    <SelectContent>{(bedOptions[selectedWard] ?? []).map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Admission Type</Label>
                  <Select value={formData.admissionType} onValueChange={v => setFormData(p => ({ ...p, admissionType: v as AdmissionType }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent><SelectItem value="Emergency">Emergency</SelectItem><SelectItem value="Elective">Elective</SelectItem><SelectItem value="Transfer">Transfer</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Admitting Physician</Label><Input value={formData.admittingPhysician} onChange={e => setFormData(p => ({ ...p, admittingPhysician: e.target.value }))} /></div>
              </div>

              {/* Clinical */}
              <div className="space-y-4">
                <div className="space-y-2"><Label>Admitting Diagnosis</Label><Textarea value={formData.diagnosis} onChange={e => setFormData(p => ({ ...p, diagnosis: e.target.value }))} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Allergies</Label><Input value={formData.allergies} onChange={e => setFormData(p => ({ ...p, allergies: e.target.value }))} placeholder="Separate with commas, or NKDA" /></div>
                  <div className="space-y-2"><Label>Diet Orders</Label><Input value={formData.dietOrders} onChange={e => setFormData(p => ({ ...p, dietOrders: e.target.value }))} placeholder="e.g., Regular, NPO, Diabetic 1800 kcal" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Isolation Precautions</Label><Input value={formData.isolationPrecautions} onChange={e => setFormData(p => ({ ...p, isolationPrecautions: e.target.value }))} placeholder="e.g., Droplet, Contact, Neutropenic" /></div>
                  <div className="space-y-2"><Label>Code Status</Label>
                    <Select value={formData.codeStatus} onValueChange={v => setFormData(p => ({ ...p, codeStatus: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Full Code">Full Code</SelectItem><SelectItem value="DNR">DNR</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Admission Checklist */}
              <div>
                <h3 className="font-semibold mb-2">Admission Checklist ({checklist.filter(Boolean).length}/{admissionChecklist.length})</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {admissionChecklist.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Checkbox checked={checklist[i]} onCheckedChange={v => setChecklist(prev => prev.map((c, idx) => idx === i ? !!v : c))} id={`ac-${i}`} />
                      <label htmlFor={`ac-${i}`} className="text-sm">{item}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button><Button onClick={handleAdmit}>Complete Admission</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
