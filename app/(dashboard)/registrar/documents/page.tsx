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
import { dummyDocumentRequests, DocumentRequest, DocumentType } from "@/app/(dashboard)/dummy-data/dummy-registrar"
import { toast } from "sonner"
import { IconPlus, IconEye, IconPrinter } from "@tabler/icons-react"
import { printDocument } from "@/lib/export-utils"

const documentTypes = [
  "Medical Certificate",
  "Clinical Abstract",
  "Discharge Summary",
  "Birth Certificate (COLB)",
  "Death Certificate",
  "Medico-Legal Certificate",
]

const feeSchedule: Record<string, number> = {
  "Medical Certificate": 100,
  "Clinical Abstract": 200,
  "Discharge Summary": 150,
  "Birth Certificate (COLB)": 0,
  "Death Certificate": 0,
  "Medico-Legal Certificate": 300,
}

const verificationChecklist = [
  "Patient identity verified (valid ID presented)",
  "Authorization letter verified (if representative)",
  "Requesting physician signature on file",
  "Records reviewed for completeness",
  "Fee payment receipt attached",
  "Document quality check completed",
]

export default function DocumentIssuancePage() {
  const [requests, setRequests] = useState<DocumentRequest[]>(dummyDocumentRequests)
  const [newOpen, setNewOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<DocumentRequest | null>(null)
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [checklist, setChecklist] = useState<boolean[]>(new Array(verificationChecklist.length).fill(false))

  // New request form state
  const [formData, setFormData] = useState({
    patientName: "", hospitalNumber: "", documentType: "", purpose: "", urgency: "Routine" as "Routine" | "Urgent",
  })

  const filtered = requests.filter(r => {
    const matchesFilter = filter === "all" || r.status === filter
    const matchesSearch = r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || r.hospitalNumber.includes(searchQuery) || r.documentType.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleNewRequest = () => {
    if (!formData.patientName || !formData.hospitalNumber || !formData.documentType) {
      toast.error("Please fill in all required fields")
      return
    }
    const newReq: DocumentRequest = {
      id: `DOC-${Date.now()}`,
      patientId: `P-${Date.now()}`,
      patientName: formData.patientName,
      hospitalNumber: formData.hospitalNumber,
      documentType: formData.documentType as DocumentType,
      purpose: formData.purpose,
      requestedBy: formData.patientName,
      requestedDate: new Date().toISOString().split("T")[0],
      status: "Pending",
      releasedDate: null,
      releasedTo: null,
      feeAmount: feeSchedule[formData.documentType] ?? 0,
      isPaid: false,
      verificationComplete: false,
    }
    setRequests(prev => [newReq, ...prev])
    setNewOpen(false)
    setFormData({ patientName: "", hospitalNumber: "", documentType: "", purpose: "", urgency: "Routine" })
    toast.success("Document request created successfully")
  }

  const handleStatusUpdate = (id: string, newStatus: DocumentRequest["status"]) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus, releasedDate: newStatus === "Released" ? new Date().toISOString().split("T")[0] : r.releasedDate } : r))
    toast.success(`Request ${id} updated to ${newStatus}`)
    setDetailOpen(false)
  }

  const statusCounts = {
    pending: requests.filter(r => r.status === "Pending").length,
    processing: requests.filter(r => r.status === "Processing").length,
    ready: requests.filter(r => r.status === "Ready for Release").length,
    released: requests.filter(r => r.status === "Released").length,
  }

  return (
    <ProtectedRoute requiredRole={UserRole.REGISTRAR}>
      <DashboardLayout role={UserRole.REGISTRAR}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-between px-4 lg:px-6">
            <div>
              <h1 className="text-2xl font-bold">Document Issuance</h1>
              <p className="text-muted-foreground">Manage medical document requests, verification, and release.</p>
            </div>
            <Button onClick={() => setNewOpen(true)}><IconPlus className="h-4 w-4 mr-2" />New Request</Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 px-4 lg:px-6">
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Pending</p><p className="text-3xl font-bold">{statusCounts.pending}</p></CardContent></Card>
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Processing</p><p className="text-3xl font-bold text-blue-600">{statusCounts.processing}</p></CardContent></Card>
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Ready for Release</p><p className="text-3xl font-bold text-green-600">{statusCounts.ready}</p></CardContent></Card>
            <Card><CardContent className="pt-6"><p className="text-sm text-muted-foreground">Released Today</p><p className="text-3xl font-bold">{statusCounts.released}</p></CardContent></Card>
          </div>

          <div className="px-4 lg:px-6">
            <Tabs defaultValue="queue">
              <TabsList>
                <TabsTrigger value="queue">Request Queue</TabsTrigger>
                <TabsTrigger value="fees">Fee Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="queue" className="space-y-4">
                {/* Filters */}
                <div className="flex gap-4">
                  <Input placeholder="Search patient, hospital #, or document type..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="max-w-sm" />
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Ready for Release">Ready for Release</SelectItem>
                      <SelectItem value="Released">Released</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Request ID</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Hospital #</TableHead>
                          <TableHead>Document Type</TableHead>
                          <TableHead>Request Date</TableHead>
                          <TableHead>Fee</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.map(r => (
                          <TableRow key={r.id}>
                            <TableCell className="font-mono text-sm">{r.id}</TableCell>
                            <TableCell className="font-medium">{r.patientName}</TableCell>
                            <TableCell className="font-mono text-sm">{r.hospitalNumber}</TableCell>
                            <TableCell>{r.documentType}</TableCell>
                            <TableCell>{r.requestedDate}</TableCell>
                            <TableCell>{r.feeAmount > 0 ? `₱${r.feeAmount.toFixed(2)}` : "Free"}</TableCell>
                            <TableCell>
                              <Badge variant={r.status === "Released" ? "outline" : r.status === "Ready for Release" ? "default" : r.status === "Processing" ? "secondary" : "destructive"}>{r.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost" onClick={() => { setSelectedRequest(r); setDetailOpen(true); setChecklist(new Array(verificationChecklist.length).fill(false)) }}><IconEye className="h-4 w-4" /></Button>
                                {r.status === "Ready for Release" && (
                                  <Button size="sm" variant="ghost" onClick={() => printDocument({
                                    title: r.documentType,
                                    fields: [
                                      { label: "Request ID", value: r.id },
                                      { label: "Patient Name", value: r.patientName },
                                      { label: "Hospital Number", value: r.hospitalNumber },
                                      { label: "Document Type", value: r.documentType },
                                      { label: "Request Date", value: r.requestedDate },
                                      { label: "Fee", value: r.feeAmount > 0 ? `₱${r.feeAmount.toFixed(2)}` : "Free" },
                                      { label: "Status", value: r.status },
                                      { label: "Requested By", value: r.requestedBy },
                                    ],
                                    footer: "This is a system-generated document. Please verify authenticity with the Medical Records Section."
                                  })}><IconPrinter className="h-4 w-4" /></Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fees">
                <Card>
                  <CardHeader><CardTitle>Document Fee Schedule</CardTitle></CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader><TableRow><TableHead>Document Type</TableHead><TableHead>Fee</TableHead><TableHead>Notes</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {documentTypes.map(dt => (
                          <TableRow key={dt}>
                            <TableCell className="font-medium">{dt}</TableCell>
                            <TableCell>{feeSchedule[dt] > 0 ? `₱${feeSchedule[dt].toFixed(2)}` : "Free"}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{feeSchedule[dt] === 0 ? "Government-mandated free issuance" : "Subject to PGH pricing policy"}</TableCell>
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

        {/* New Request Dialog */}
        <Dialog open={newOpen} onOpenChange={setNewOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>New Document Request</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Patient Name *</Label><Input value={formData.patientName} onChange={e => setFormData(p => ({ ...p, patientName: e.target.value }))} /></div>
                <div className="space-y-2"><Label>Hospital Number *</Label><Input value={formData.hospitalNumber} onChange={e => setFormData(p => ({ ...p, hospitalNumber: e.target.value }))} placeholder="PGH-YYYY-XXXXX" /></div>
              </div>
              <div className="space-y-2"><Label>Document Type *</Label>
                <Select value={formData.documentType} onValueChange={v => setFormData(p => ({ ...p, documentType: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select document type" /></SelectTrigger>
                  <SelectContent>{documentTypes.map(dt => <SelectItem key={dt} value={dt}>{dt}{feeSchedule[dt] > 0 ? ` (₱${feeSchedule[dt]})` : " (Free)"}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Purpose / Requested By</Label><Input value={formData.purpose} onChange={e => setFormData(p => ({ ...p, purpose: e.target.value }))} placeholder="e.g., Employment, Insurance claim" /></div>
              <div className="space-y-2"><Label>Urgency</Label>
                <Select value={formData.urgency} onValueChange={v => setFormData(p => ({ ...p, urgency: v as "Routine" | "Urgent" }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Routine">Routine (3-5 working days)</SelectItem><SelectItem value="Urgent">Urgent (within 24 hours)</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button><Button onClick={handleNewRequest}>Submit Request</Button></DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Detail / Verification Dialog */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Request Details — {selectedRequest?.id}</DialogTitle></DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><Label className="text-muted-foreground">Patient</Label><p className="font-medium">{selectedRequest.patientName}</p></div>
                  <div><Label className="text-muted-foreground">Hospital #</Label><p className="font-mono">{selectedRequest.hospitalNumber}</p></div>
                  <div><Label className="text-muted-foreground">Document</Label><p>{selectedRequest.documentType}</p></div>
                  <div><Label className="text-muted-foreground">Fee</Label><p>{selectedRequest.feeAmount > 0 ? `₱${selectedRequest.feeAmount.toFixed(2)}` : "Free"}</p></div>
                </div>
                {selectedRequest.status !== "Released" && (
                  <>
                    <hr />
                    <div>
                      <h3 className="font-semibold mb-2">Verification Checklist</h3>
                      <div className="space-y-2">
                        {verificationChecklist.map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Checkbox checked={checklist[i]} onCheckedChange={v => setChecklist(prev => prev.map((c, idx) => idx === i ? !!v : c))} id={`check-${i}`} />
                            <label htmlFor={`check-${i}`} className="text-sm">{item}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
            <DialogFooter>
              {selectedRequest?.status === "Pending" && <Button onClick={() => handleStatusUpdate(selectedRequest.id, "Processing")}>Start Processing</Button>}
              {selectedRequest?.status === "Processing" && <Button onClick={() => handleStatusUpdate(selectedRequest.id, "Ready for Release")} disabled={!checklist.every(Boolean)}>Mark Ready</Button>}
              {selectedRequest?.status === "Ready for Release" && <Button onClick={() => handleStatusUpdate(selectedRequest.id, "Released")}>Release Document</Button>}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
