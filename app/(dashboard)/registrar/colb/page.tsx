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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { dummyCOLBRecords, COLBRecord } from "@/app/(dashboard)/dummy-data/dummy-registrar"
import { toast } from "sonner"
import { IconPlus, IconEye, IconSend } from "@tabler/icons-react"

const supportingDocsChecklist = [
  "Attendant's worksheet / delivery record",
  "Mother's valid ID (photocopy)",
  "Father's valid ID (photocopy) — if married",
  "Marriage Certificate (if applicable)",
  "Affidavit of Acknowledgment/Paternity (if unwed)",
  "PSA Advisory on negative birth record (for delayed registration)",
  "Barangay Captain certification (for delayed registration)",
]

type COLBStatus = COLBRecord["status"]

const statusFlow: COLBStatus[] = ["Prepared", "Signed", "Transmitted", "Registered at LCR"]

export default function COLBProcessingPage() {
  const [records, setRecords] = useState<COLBRecord[]>(dummyCOLBRecords)
  const [newOpen, setNewOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<COLBRecord | null>(null)
  const [docsChecklist, setDocsChecklist] = useState<boolean[]>(new Array(supportingDocsChecklist.length).fill(false))
  const [filter, setFilter] = useState("all")

  const [formData, setFormData] = useState({
    childName: "", motherName: "", fatherName: "", dateOfBirth: "", timeOfBirth: "", sex: "", placeOfBirth: "Philippine General Hospital", registrationType: "Timely" as "Timely" | "Delayed",
  })

  const filteredRecords = records.filter(r => filter === "all" || r.status === filter)

  const handleNewRecord = () => {
    if (!formData.childName || !formData.motherName || !formData.dateOfBirth || !formData.sex) {
      toast.error("Please fill in all required fields")
      return
    }
    const newRec: COLBRecord = {
      id: `COLB-${Date.now()}`,
      babyName: formData.childName,
      motherName: formData.motherName,
      fatherName: formData.fatherName || "N/A",
      dateOfBirth: formData.dateOfBirth,
      timeOfBirth: formData.timeOfBirth,
      sex: formData.sex as "Male" | "Female",
      placeOfBirth: formData.placeOfBirth,
      motherPhilHealth: null,
      attendingPhysician: "Dr. Santos",
      registrationType: formData.registrationType,
      status: "Prepared",
      preparedDate: new Date().toISOString().split("T")[0],
      transmittalDate: null,
      lcrReferenceNumber: null,
      supportingDocsComplete: false,
    }
    setRecords(prev => [newRec, ...prev])
    setNewOpen(false)
    setFormData({ childName: "", motherName: "", fatherName: "", dateOfBirth: "", timeOfBirth: "", sex: "", placeOfBirth: "Philippine General Hospital", registrationType: "Timely" })
    toast.success("COLB record created successfully")
  }

  const advanceStatus = (id: string) => {
    setRecords(prev => prev.map(r => {
      if (r.id !== id) return r
      const currentIdx = statusFlow.indexOf(r.status)
      if (currentIdx < statusFlow.length - 1) {
        const nextStatus = statusFlow[currentIdx + 1]
        return {
          ...r,
          status: nextStatus,
          transmittalDate: nextStatus === "Transmitted" ? new Date().toISOString().split("T")[0] : r.transmittalDate,
          lcrReferenceNumber: nextStatus === "Registered at LCR" ? `LCR-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000) + 10000}` : r.lcrReferenceNumber,
        }
      }
      return r
    }))
    toast.success("Status updated")
    setDetailOpen(false)
  }

  const statusCounts = {
    prepared: records.filter(r => r.status === "Prepared").length,
    forSigning: records.filter(r => r.status === "Signed").length,
    transmitted: records.filter(r => r.status === "Transmitted").length,
    registered: records.filter(r => r.status === "Registered at LCR").length,
  }

  return (
    <ProtectedRoute requiredRole={UserRole.REGISTRAR}>
      <DashboardLayout role={UserRole.REGISTRAR}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-between px-4 lg:px-6">
            <div>
              <h1 className="text-2xl font-bold">Certificate of Live Birth (COLB) Processing</h1>
              <p className="text-muted-foreground">Manage birth registrations for PGH-born newborns per PSA and LCR guidelines.</p>
            </div>
            <Button onClick={() => setNewOpen(true)}><IconPlus className="h-4 w-4 mr-2" />New COLB</Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 px-4 lg:px-6">
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Prepared</p><p className="text-3xl font-bold">{statusCounts.prepared}</p></CardContent></Card>
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">For Signing</p><p className="text-3xl font-bold text-yellow-600">{statusCounts.forSigning}</p></CardContent></Card>
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Transmitted to LCR</p><p className="text-3xl font-bold text-blue-600">{statusCounts.transmitted}</p></CardContent></Card>
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Registered (PSA)</p><p className="text-3xl font-bold text-green-600">{statusCounts.registered}</p></CardContent></Card>
          </div>

          <div className="px-4 lg:px-6">
            <Tabs defaultValue="records">
              <TabsList>
                <TabsTrigger value="records">COLB Records</TabsTrigger>
                <TabsTrigger value="transmittal">Transmittal Log</TabsTrigger>
              </TabsList>

              <TabsContent value="records" className="space-y-4">
                <div className="flex gap-4">
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {statusFlow.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>COLB ID</TableHead>
                          <TableHead>Child Name</TableHead>
                          <TableHead>Mother</TableHead>
                          <TableHead>DOB</TableHead>
                          <TableHead>Sex</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>LCR Reg #</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRecords.map(r => (
                          <TableRow key={r.id}>
                            <TableCell className="font-mono text-sm">{r.id}</TableCell>
                            <TableCell className="font-medium">{r.babyName}</TableCell>
                            <TableCell>{r.motherName}</TableCell>
                            <TableCell>{r.dateOfBirth}</TableCell>
                            <TableCell>{r.sex}</TableCell>
                            <TableCell><Badge variant={r.registrationType === "Delayed" ? "destructive" : "outline"}>{r.registrationType}</Badge></TableCell>
                            <TableCell>
                              <Badge variant={r.status === "Registered at LCR" ? "default" : r.status === "Transmitted" ? "secondary" : "outline"}>{r.status}</Badge>
                            </TableCell>
                            <TableCell className="font-mono text-xs">{r.lcrReferenceNumber ?? "—"}</TableCell>
                            <TableCell>
                              <Button size="sm" variant="ghost" onClick={() => { setSelectedRecord(r); setDetailOpen(true); setDocsChecklist(new Array(supportingDocsChecklist.length).fill(false)) }}><IconEye className="h-4 w-4" /></Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transmittal">
                <Card>
                  <CardHeader><CardTitle>Transmittal Log to Local Civil Registrar</CardTitle></CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader><TableRow><TableHead>COLB ID</TableHead><TableHead>Child Name</TableHead><TableHead>Transmitted Date</TableHead><TableHead>LCR Reg #</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {records.filter(r => r.transmittalDate).map(r => (
                          <TableRow key={r.id}>
                            <TableCell className="font-mono text-sm">{r.id}</TableCell>
                            <TableCell className="font-medium">{r.babyName}</TableCell>
                            <TableCell>{r.transmittalDate}</TableCell>
                            <TableCell className="font-mono">{r.lcrReferenceNumber ?? "Pending"}</TableCell>
                            <TableCell><Badge variant={r.status === "Registered at LCR" ? "default" : "secondary"}>{r.status}</Badge></TableCell>
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

        {/* New COLB Dialog */}
        <Dialog open={newOpen} onOpenChange={setNewOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>New Certificate of Live Birth</DialogTitle></DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="space-y-2"><Label>Child&apos;s Full Name *</Label><Input value={formData.childName} onChange={e => setFormData(p => ({ ...p, childName: e.target.value }))} placeholder="Last, First Middle" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Date of Birth *</Label><Input type="date" value={formData.dateOfBirth} onChange={e => setFormData(p => ({ ...p, dateOfBirth: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Time of Birth</Label><Input type="time" value={formData.timeOfBirth} onChange={e => setFormData(p => ({ ...p, timeOfBirth: e.target.value }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Sex *</Label>
                  <Select value={formData.sex} onValueChange={v => setFormData(p => ({ ...p, sex: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label>Registration Type</Label>
                  <Select value={formData.registrationType} onValueChange={v => setFormData(p => ({ ...p, registrationType: v as "Timely" | "Delayed" }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="Timely">Timely (within 30 days)</SelectItem><SelectItem value="Delayed">Delayed (after 30 days)</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Place of Birth</Label><Input value={formData.placeOfBirth} onChange={e => setFormData(p => ({ ...p, placeOfBirth: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Mother&apos;s Full Name *</Label><Input value={formData.motherName} onChange={e => setFormData(p => ({ ...p, motherName: e.target.value }))} /></div>
              <div className="space-y-2"><Label>Father&apos;s Full Name</Label><Input value={formData.fatherName} onChange={e => setFormData(p => ({ ...p, fatherName: e.target.value }))} /></div>

              <hr />
              <div>
                <h3 className="font-semibold mb-2">Supporting Documents Checklist</h3>
                <div className="space-y-2">
                  {supportingDocsChecklist.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Checkbox checked={docsChecklist[i]} onCheckedChange={v => setDocsChecklist(prev => prev.map((c, idx) => idx === i ? !!v : c))} id={`doc-${i}`} />
                      <label htmlFor={`doc-${i}`} className="text-sm">{item}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button><Button onClick={handleNewRecord}>Create COLB Record</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Detail Dialog */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>COLB Details — {selectedRecord?.id}</DialogTitle></DialogHeader>
            {selectedRecord && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><Label className="text-muted-foreground">Child</Label><p className="font-medium">{selectedRecord.babyName}</p></div>
                  <div><Label className="text-muted-foreground">DOB / Time</Label><p>{selectedRecord.dateOfBirth} {selectedRecord.timeOfBirth}</p></div>
                  <div><Label className="text-muted-foreground">Mother</Label><p>{selectedRecord.motherName}</p></div>
                  <div><Label className="text-muted-foreground">Father</Label><p>{selectedRecord.fatherName}</p></div>
                  <div><Label className="text-muted-foreground">Sex</Label><p>{selectedRecord.sex}</p></div>
                  <div><Label className="text-muted-foreground">Type</Label><Badge variant={selectedRecord.registrationType === "Delayed" ? "destructive" : "outline"}>{selectedRecord.registrationType}</Badge></div>
                </div>
                {/* Status Progress */}
                <div>
                  <h3 className="font-semibold mb-2">Status Progress</h3>
                  <div className="flex items-center gap-2">
                    {statusFlow.map((s, i) => {
                      const currentIdx = statusFlow.indexOf(selectedRecord.status)
                      const isCompleted = i <= currentIdx
                      return (
                        <div key={s} className="flex items-center gap-2">
                          <div className={`rounded-full px-3 py-1 text-xs font-medium ${isCompleted ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-muted text-muted-foreground"}`}>{s}</div>
                          {i < statusFlow.length - 1 && <span className="text-muted-foreground">→</span>}
                        </div>
                      )
                    })}
                  </div>
                </div>
                {selectedRecord.lcrReferenceNumber && (
                  <div><Label className="text-muted-foreground">LCR Registration #</Label><p className="font-mono font-medium">{selectedRecord.lcrReferenceNumber}</p></div>
                )}
              </div>
            )}
            <DialogFooter>
              {selectedRecord && selectedRecord.status !== "Registered at LCR" && (
                <Button onClick={() => advanceStatus(selectedRecord.id)}>
                  <IconSend className="h-4 w-4 mr-2" />Advance to Next Status
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
