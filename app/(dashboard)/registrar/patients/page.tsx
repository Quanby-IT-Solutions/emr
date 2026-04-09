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
import { dummyRetrievalRequests, RecordRetrievalRequest } from "@/app/(dashboard)/dummy-data/dummy-registrar"
import { toast } from "sonner"
import { IconSearch, IconEye, IconAlertTriangle } from "@tabler/icons-react"

const patientRecords = [
  { id: "P001", hospitalNumber: "PGH-2024-00145", name: "John Alexander Smith", dob: "1985-03-12", sex: "M", philhealth: "01-050678901-2", status: "Active", visits: 12, lastVisit: "2026-04-05" },
  { id: "P002", hospitalNumber: "PGH-2024-00230", name: "Maria Elena Garcia", dob: "1992-07-25", sex: "F", philhealth: "01-234567890-1", status: "Active", visits: 8, lastVisit: "2026-04-07" },
  { id: "P003", hospitalNumber: "PGH-2024-00312", name: "David Lee Anderson", dob: "1978-11-02", sex: "M", philhealth: "N/A", status: "Active", visits: 15, lastVisit: "2026-04-03" },
  { id: "P004", hospitalNumber: "PGH-2024-00456", name: "Sophia Grace Nguyen", dob: "1998-01-30", sex: "F", philhealth: "01-887766554-3", status: "Active", visits: 3, lastVisit: "2026-04-08" },
  { id: "P005", hospitalNumber: "PGH-2024-00567", name: "Michael James Brown", dob: "1990-09-18", sex: "M", philhealth: "01-556677889-0", status: "Active", visits: 6, lastVisit: "2026-04-02" },
  { id: "P006", hospitalNumber: "PGH-2024-00678", name: "Emily Elizabeth Wong", dob: "1983-05-10", sex: "F", philhealth: "01-998877665-4", status: "Active", visits: 20, lastVisit: "2026-04-06" },
  { id: "P001-DUP", hospitalNumber: "PGH-2024-00901", name: "John A. Smith", dob: "1985-03-12", sex: "M", philhealth: "01-050678901-2", status: "Possible Duplicate", visits: 1, lastVisit: "2026-04-01" },
]

const visitHistory = [
  { date: "2026-04-05", type: "OPD Consultation", department: "Internal Medicine", physician: "Dr. Jose Rivera", notes: "Follow-up for hypertension" },
  { date: "2026-03-20", type: "OPD Consultation", department: "Cardiology", physician: "Dr. David Kim", notes: "2D Echo ordered" },
  { date: "2026-02-10", type: "Emergency Admission", department: "Emergency Room", physician: "Dr. Ana Reyes", notes: "Chest pain evaluation. Discharged same day." },
  { date: "2025-12-15", type: "Inpatient Admission", department: "Internal Medicine", physician: "Dr. Jose Rivera", notes: "Pneumonia. Admitted for 5 days." },
]

export default function PatientSearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<typeof patientRecords[0] | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [retrievalRequests, setRetrievalRequests] = useState(dummyRetrievalRequests)
  const [retrievalOpen, setRetrievalOpen] = useState(false)

  const filtered = patientRecords.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.hospitalNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.philhealth.includes(searchQuery) ||
    p.dob.includes(searchQuery)
  )

  const handleLogRetrieval = () => {
    if (!selectedPatient) return
    const newReq: RecordRetrievalRequest = {
      id: `RR-${Date.now()}`, patientId: selectedPatient.id, patientName: selectedPatient.name,
      hospitalNumber: selectedPatient.hospitalNumber, requestedDate: new Date().toISOString().split("T")[0],
      requestedBy: "OPD Registrar Counter", purpose: "OPD Consultation", status: "Requested",
      retrievedDate: null, returnedDate: null,
    }
    setRetrievalRequests(prev => [newReq, ...prev])
    setRetrievalOpen(false)
    toast.success(`Record retrieval request logged for ${selectedPatient.name}`)
  }

  return (
    <ProtectedRoute requiredRole={UserRole.REGISTRAR}>
      <DashboardLayout role={UserRole.REGISTRAR}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Patient Search & Record Retrieval</h1>
            <p className="text-muted-foreground">Find patient records and manage health record retrieval for OPD consultations.</p>
          </div>

          {/* Search Bar */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input placeholder="Search by hospital number, full name, date of birth, or PhilHealth number..." className="pl-11 text-lg h-12" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient Results */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader><CardTitle>Patient Records ({filtered.length})</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hospital #</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>DOB</TableHead>
                      <TableHead>Sex</TableHead>
                      <TableHead>PhilHealth</TableHead>
                      <TableHead>Visits</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(p => (
                      <TableRow key={p.id} className={p.status === "Possible Duplicate" ? "bg-yellow-50 dark:bg-yellow-950/20" : ""}>
                        <TableCell className="font-mono text-sm">{p.hospitalNumber}</TableCell>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{p.dob}</TableCell>
                        <TableCell>{p.sex}</TableCell>
                        <TableCell className="font-mono text-xs">{p.philhealth}</TableCell>
                        <TableCell>{p.visits}</TableCell>
                        <TableCell>{p.lastVisit}</TableCell>
                        <TableCell>
                          {p.status === "Possible Duplicate" ? (
                            <Badge variant="destructive" className="flex items-center gap-1"><IconAlertTriangle className="h-3 w-3" />Duplicate?</Badge>
                          ) : (
                            <Badge variant="outline">{p.status}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => { setSelectedPatient(p); setDetailOpen(true) }}><IconEye className="h-4 w-4" /></Button>
                            <Button size="sm" variant="outline" onClick={() => { setSelectedPatient(p); setRetrievalOpen(true) }}>Retrieve Record</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Record Retrieval Tracker */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader><CardTitle>Record Retrieval Tracker</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Patient</TableHead><TableHead>Hospital #</TableHead><TableHead>Requested By</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {retrievalRequests.map(r => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.patientName}</TableCell>
                        <TableCell className="font-mono text-sm">{r.hospitalNumber}</TableCell>
                        <TableCell>{r.requestedBy}</TableCell>
                        <TableCell>{r.requestedDate}</TableCell>
                        <TableCell>
                          <Badge variant={r.status === "Returned" ? "outline" : r.status === "Missing" ? "destructive" : r.status === "Retrieved" ? "default" : "secondary"}>{r.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Patient Detail Dialog */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Patient Record — {selectedPatient?.name}</DialogTitle></DialogHeader>
            {selectedPatient && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><Label className="text-muted-foreground">Hospital Number</Label><p className="font-mono font-medium">{selectedPatient.hospitalNumber}</p></div>
                  <div><Label className="text-muted-foreground">Date of Birth</Label><p className="font-medium">{selectedPatient.dob}</p></div>
                  <div><Label className="text-muted-foreground">Sex</Label><p className="font-medium">{selectedPatient.sex === "M" ? "Male" : "Female"}</p></div>
                  <div><Label className="text-muted-foreground">PhilHealth #</Label><p className="font-mono font-medium">{selectedPatient.philhealth}</p></div>
                  <div><Label className="text-muted-foreground">Total Visits</Label><p className="font-medium">{selectedPatient.visits}</p></div>
                  <div><Label className="text-muted-foreground">Last Visit</Label><p className="font-medium">{selectedPatient.lastVisit}</p></div>
                </div>
                <hr />
                <div>
                  <h3 className="font-semibold mb-2">Visit History</h3>
                  <Table>
                    <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Department</TableHead><TableHead>Notes</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {visitHistory.map((v, i) => (
                        <TableRow key={i}><TableCell>{v.date}</TableCell><TableCell><Badge variant="outline">{v.type}</Badge></TableCell><TableCell>{v.department}</TableCell><TableCell className="text-sm">{v.notes}</TableCell></TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Retrieval Request Dialog */}
        <Dialog open={retrievalOpen} onOpenChange={setRetrievalOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>Log Record Retrieval Request</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <p>Request retrieval of health records for:</p>
              <div className="rounded-lg border p-3">
                <p className="font-medium">{selectedPatient?.name}</p>
                <p className="text-sm text-muted-foreground">{selectedPatient?.hospitalNumber}</p>
              </div>
              <p className="text-sm text-muted-foreground">This will notify the medical records room to pull the physical/electronic file for the upcoming consultation.</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRetrievalOpen(false)}>Cancel</Button>
              <Button onClick={handleLogRetrieval}>Submit Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
