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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { dummyITRequests, itTechnicians, ITServiceRequest, RequestStatus, RequestType, PriorityLevel } from "@/app/(dashboard)/dummy-data/dummy-it-requests"
import { IconSearch, IconEye } from "@tabler/icons-react"

const requestTypes: RequestType[] = ["Equipment Repair", "Preventive Maintenance", "Network/Internet", "Network Cabling", "Teleconferencing", "VPN/Synapse", "Zoom Webinar", "HDTV/Website Posting"]
const statuses: RequestStatus[] = ["Received", "In Progress", "Resolved", "Closed"]

function getStatusColor(status: RequestStatus) {
  switch (status) {
    case "Received": return "secondary"
    case "In Progress": return "default"
    case "Resolved": return "outline"
    case "Closed": return "outline"
  }
}

function getPriorityColor(priority: PriorityLevel) {
  switch (priority) {
    case "Critical": return "destructive"
    case "High": return "default"
    case "Medium": return "secondary"
    case "Low": return "outline"
  }
}

export default function ITServiceRequestsPage() {
  const [requests, setRequests] = useState<ITServiceRequest[]>(dummyITRequests)
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRequest, setSelectedRequest] = useState<ITServiceRequest | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [assignTech, setAssignTech] = useState("")
  const [updateStatus, setUpdateStatus] = useState<RequestStatus>("Received")
  const [resolutionNotes, setResolutionNotes] = useState("")

  const filtered = requests.filter(r => {
    const matchType = filterType === "all" || r.requestType === filterType
    const matchStatus = filterStatus === "all" || r.status === filterStatus
    const matchSearch = r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.requestingDepartment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())
    return matchType && matchStatus && matchSearch
  })

  const openCount = requests.filter(r => r.status === "Received").length
  const inProgressCount = requests.filter(r => r.status === "In Progress").length
  const resolvedCount = requests.filter(r => r.status === "Resolved" || r.status === "Closed").length

  const handleViewRequest = (req: ITServiceRequest) => {
    setSelectedRequest(req)
    setAssignTech(req.assignedTechnician || "")
    setUpdateStatus(req.status)
    setResolutionNotes(req.resolutionNotes || "")
    setViewOpen(true)
  }

  const handleUpdateRequest = () => {
    if (!selectedRequest) return
    setRequests(prev => prev.map(r => r.id === selectedRequest.id ? {
      ...r,
      status: updateStatus,
      assignedTechnician: assignTech || r.assignedTechnician,
      resolutionNotes: resolutionNotes || r.resolutionNotes,
      resolvedDate: (updateStatus === "Resolved" || updateStatus === "Closed") ? new Date().toISOString().split("T")[0] : r.resolvedDate,
    } : r))
    toast.success(`Request ${selectedRequest.ticketNumber} updated successfully`)
    setViewOpen(false)
  }

  return (
    <ProtectedRoute requiredRole={UserRole.SYSTEM_ADMIN}>
      <DashboardLayout role={UserRole.SYSTEM_ADMIN}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">IT Service Request Management</h1>
            <p className="text-muted-foreground">Manage all IT service requests from hospital departments.</p>
          </div>

          <div className="grid gap-4 px-4 md:grid-cols-3 lg:px-6">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Open Requests</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold text-yellow-600">{openCount}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">In Progress</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold text-blue-600">{inProgressCount}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Resolved / Closed</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold text-green-600">{resolvedCount}</div></CardContent>
            </Card>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>Request Queue</CardTitle>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center pt-2">
                  <div className="relative flex-1">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by ticket, subject, or department..." className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[200px]"><SelectValue placeholder="Request Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {requestTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket #</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(req => (
                      <TableRow key={req.id}>
                        <TableCell className="font-mono text-sm">{req.ticketNumber}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{req.requestType}</Badge></TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">{req.subject}</TableCell>
                        <TableCell className="text-sm">{req.requestingDepartment}</TableCell>
                        <TableCell><Badge variant={getPriorityColor(req.priority)}>{req.priority}</Badge></TableCell>
                        <TableCell className="text-sm">{req.assignedTechnician || <span className="text-muted-foreground italic">Unassigned</span>}</TableCell>
                        <TableCell><Badge variant={getStatusColor(req.status)}>{req.status}</Badge></TableCell>
                        <TableCell className="text-sm">{req.dateSubmitted}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleViewRequest(req)}><IconEye className="h-4 w-4" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Request Detail / Update Dialog */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Detail — {selectedRequest?.ticketNumber}</DialogTitle>
              <DialogDescription>{selectedRequest?.subject}</DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><Label className="text-muted-foreground">Type</Label><p className="font-medium">{selectedRequest.requestType}</p></div>
                  <div><Label className="text-muted-foreground">Department</Label><p className="font-medium">{selectedRequest.requestingDepartment}</p></div>
                  <div><Label className="text-muted-foreground">Requested By</Label><p className="font-medium">{selectedRequest.requestedBy}</p></div>
                  <div><Label className="text-muted-foreground">Date Submitted</Label><p className="font-medium">{selectedRequest.dateSubmitted}</p></div>
                  {selectedRequest.equipmentDescription && (
                    <div className="col-span-2"><Label className="text-muted-foreground">Equipment</Label><p className="font-medium">{selectedRequest.equipmentDescription}</p></div>
                  )}
                  <div className="col-span-2"><Label className="text-muted-foreground">Description</Label><p className="font-medium">{selectedRequest.description}</p></div>
                </div>
                <hr />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Assign Technician</Label>
                    <Select value={assignTech} onValueChange={setAssignTech}>
                      <SelectTrigger><SelectValue placeholder="Select technician" /></SelectTrigger>
                      <SelectContent>
                        {itTechnicians.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Update Status</Label>
                    <Select value={updateStatus} onValueChange={(v) => setUpdateStatus(v as RequestStatus)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Resolution Notes</Label>
                  <Textarea value={resolutionNotes} onChange={e => setResolutionNotes(e.target.value)} rows={3} placeholder="Enter resolution details..." />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateRequest}>Update Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
