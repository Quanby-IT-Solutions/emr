"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/lib/auth/context"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { ITServiceRequest, RequestStatus, RequestType, PriorityLevel } from "@/app/(dashboard)/dummy-data/dummy-it-requests"
import { IconSearch, IconEye, IconPlus, IconSend, IconTicket, IconClock, IconCircleCheck } from "@tabler/icons-react"

const requestTypes: RequestType[] = [
  "Equipment Repair",
  "Preventive Maintenance",
  "Network/Internet",
  "Network Cabling",
  "Teleconferencing",
  "VPN/Synapse",
  "Zoom Webinar",
  "HDTV/Website Posting",
]

function getStatusColor(status: RequestStatus): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "Received": return "secondary"
    case "In Progress": return "default"
    case "Resolved": return "outline"
    case "Closed": return "outline"
  }
}

function getPriorityColor(priority: PriorityLevel): "default" | "secondary" | "outline" | "destructive" {
  switch (priority) {
    case "Critical": return "destructive"
    case "High": return "default"
    case "Medium": return "secondary"
    case "Low": return "outline"
  }
}

// User-submitted IT requests (separate from admin's full queue)
const initialUserRequests: ITServiceRequest[] = [
  {
    id: "MY-001",
    ticketNumber: "SR-2026-015",
    requestType: "Equipment Repair",
    subject: "Monitor flickering on workstation",
    description: "The monitor at my workstation keeps flickering intermittently, making it difficult to read patient charts.",
    requestingDepartment: "Current Department",
    requestedBy: "Current User",
    status: "In Progress",
    priority: "Medium",
    assignedTechnician: "Carlos Reyes",
    dateSubmitted: "2026-04-05",
    dueDate: "2026-04-10",
    resolvedDate: null,
    resolutionNotes: null,
    equipmentDescription: "Dell 24\" Monitor - Workstation #12",
  },
  {
    id: "MY-002",
    ticketNumber: "SR-2026-016",
    requestType: "Network/Internet",
    subject: "Cannot access EMR from ward tablet",
    description: "The ward tablet is unable to connect to the EMR system. Shows connection timeout error.",
    requestingDepartment: "Current Department",
    requestedBy: "Current User",
    status: "Received",
    priority: "High",
    assignedTechnician: null,
    dateSubmitted: "2026-04-08",
    dueDate: null,
    resolvedDate: null,
    resolutionNotes: null,
    equipmentDescription: "iPad Pro - Asset #PGH-TAB-0089",
  },
  {
    id: "MY-003",
    ticketNumber: "SR-2026-010",
    requestType: "VPN/Synapse",
    subject: "VPN disconnects frequently when working remote",
    description: "VPN connection drops every 15-20 minutes requiring manual reconnection.",
    requestingDepartment: "Current Department",
    requestedBy: "Current User",
    status: "Resolved",
    priority: "Medium",
    assignedTechnician: "Mark Tan",
    dateSubmitted: "2026-03-28",
    dueDate: "2026-04-01",
    resolvedDate: "2026-03-30",
    resolutionNotes: "Updated VPN client to latest version and adjusted timeout settings.",
    equipmentDescription: null,
  },
]

export default function ITSupportPage() {
  const { user } = useAuth()
  const role = (user?.role as UserRole) || UserRole.NURSE

  const [requests, setRequests] = useState<ITServiceRequest[]>(initialUserRequests)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [viewOpen, setViewOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<ITServiceRequest | null>(null)

  // New request form
  const [newSubject, setNewSubject] = useState("")
  const [newType, setNewType] = useState<RequestType>("Equipment Repair")
  const [newPriority, setNewPriority] = useState<PriorityLevel>("Medium")
  const [newDescription, setNewDescription] = useState("")
  const [newEquipment, setNewEquipment] = useState("")

  const filtered = requests.filter((r) => {
    const matchStatus = filterStatus === "all" || r.status === filterStatus
    const matchSearch =
      r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())
    return matchStatus && matchSearch
  })

  const openCount = requests.filter((r) => r.status === "Received").length
  const inProgressCount = requests.filter((r) => r.status === "In Progress").length
  const resolvedCount = requests.filter((r) => r.status === "Resolved" || r.status === "Closed").length

  const handleViewRequest = (req: ITServiceRequest) => {
    setSelectedRequest(req)
    setViewOpen(true)
  }

  const handleCreateRequest = () => {
    if (!newSubject.trim() || !newDescription.trim()) {
      toast.error("Please fill in the subject and description")
      return
    }

    const ticketNum = `SR-2026-${String(requests.length + 20).padStart(3, "0")}`
    const newRequest: ITServiceRequest = {
      id: `MY-${String(requests.length + 1).padStart(3, "0")}`,
      ticketNumber: ticketNum,
      requestType: newType,
      subject: newSubject,
      description: newDescription,
      requestingDepartment: getDepartmentForRole(role),
      requestedBy: user?.username || "Current User",
      status: "Received",
      priority: newPriority,
      assignedTechnician: null,
      dateSubmitted: new Date().toISOString().split("T")[0],
      dueDate: null,
      resolvedDate: null,
      resolutionNotes: null,
      equipmentDescription: newEquipment || null,
    }

    setRequests((prev) => [newRequest, ...prev])
    toast.success(`IT Support ticket ${ticketNum} submitted successfully!`)
    setCreateOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setNewSubject("")
    setNewType("Equipment Repair")
    setNewPriority("Medium")
    setNewDescription("")
    setNewEquipment("")
  }

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-2xl font-bold">IT Support</h1>
            <p className="text-muted-foreground">
              Submit and track your IT service requests — report bugs, request equipment fixes, or get help.
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)}>
            <IconPlus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 px-4 md:grid-cols-3 lg:px-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Submitted</CardTitle>
              <IconTicket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{openCount}</div>
              <p className="text-xs text-muted-foreground">Awaiting assignment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <IconClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{inProgressCount}</div>
              <p className="text-xs text-muted-foreground">Being worked on</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <IconCircleCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{resolvedCount}</div>
              <p className="text-xs text-muted-foreground">Completed requests</p>
            </CardContent>
          </Card>
        </div>

        {/* Request Table */}
        <div className="px-4 lg:px-6">
          <Card>
            <CardHeader>
              <CardTitle>My Requests</CardTitle>
              <CardDescription>Track the status of your submitted IT support tickets.</CardDescription>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center pt-2">
                <div className="relative flex-1">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ticket # or subject..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Received">Submitted</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <IconTicket className="h-12 w-12 mb-3 opacity-30" />
                  <p className="text-sm">No requests found</p>
                  <Button variant="link" size="sm" onClick={() => setCreateOpen(true)}>
                    Submit a new request
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ticket #</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((req) => (
                      <TableRow key={req.id}>
                        <TableCell className="font-mono text-sm">{req.ticketNumber}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {req.requestType}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium max-w-[250px] truncate">{req.subject}</TableCell>
                        <TableCell>
                          <Badge variant={getPriorityColor(req.priority)}>{req.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(req.status)}>{req.status}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {req.assignedTechnician || (
                            <span className="text-muted-foreground italic">Pending</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{req.dateSubmitted}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleViewRequest(req)}>
                            <IconEye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* View Request Detail Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request Detail — {selectedRequest?.ticketNumber}</DialogTitle>
            <DialogDescription>{selectedRequest?.subject}</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium">{selectedRequest.requestType}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Priority</Label>
                  <p>
                    <Badge variant={getPriorityColor(selectedRequest.priority)}>
                      {selectedRequest.priority}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <p>
                    <Badge variant={getStatusColor(selectedRequest.status)}>
                      {selectedRequest.status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date Submitted</Label>
                  <p className="font-medium">{selectedRequest.dateSubmitted}</p>
                </div>
                {selectedRequest.assignedTechnician && (
                  <div>
                    <Label className="text-muted-foreground">Assigned Technician</Label>
                    <p className="font-medium">{selectedRequest.assignedTechnician}</p>
                  </div>
                )}
                {selectedRequest.dueDate && (
                  <div>
                    <Label className="text-muted-foreground">Target Date</Label>
                    <p className="font-medium">{selectedRequest.dueDate}</p>
                  </div>
                )}
                {selectedRequest.equipmentDescription && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Equipment</Label>
                    <p className="font-medium">{selectedRequest.equipmentDescription}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="font-medium">{selectedRequest.description}</p>
                </div>
                {selectedRequest.resolutionNotes && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Resolution Notes</Label>
                    <p className="font-medium text-green-700">{selectedRequest.resolutionNotes}</p>
                  </div>
                )}
                {selectedRequest.resolvedDate && (
                  <div>
                    <Label className="text-muted-foreground">Resolved Date</Label>
                    <p className="font-medium">{selectedRequest.resolvedDate}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create New Request Dialog */}
      <Dialog open={createOpen} onOpenChange={(open) => { setCreateOpen(open); if (!open) resetForm() }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Submit IT Support Request</DialogTitle>
            <DialogDescription>
              Describe your issue and our IT team will get back to you.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="Brief description of the issue"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Request Type</Label>
                <Select value={newType} onValueChange={(v) => setNewType(v as RequestType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {requestTypes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={newPriority} onValueChange={(v) => setNewPriority(v as PriorityLevel)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the issue in detail — what happened, when it started, error messages, etc."
                rows={4}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipment">Equipment / Asset (optional)</Label>
              <Input
                id="equipment"
                placeholder="e.g., HP LaserJet Pro - Asset #PGH-PRN-0342"
                value={newEquipment}
                onChange={(e) => setNewEquipment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateOpen(false); resetForm() }}>
              Cancel
            </Button>
            <Button onClick={handleCreateRequest}>
              <IconSend className="mr-2 h-4 w-4" />
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}

function getDepartmentForRole(role: UserRole): string {
  switch (role) {
    case UserRole.NURSE: return "Division of Nursing"
    case UserRole.CLINICIAN: return "Medical Staff"
    case UserRole.PHARMACIST: return "Pharmacy Department"
    case UserRole.LAB_TECH: return "Laboratory Department"
    case UserRole.REGISTRAR: return "Registration / Admissions"
    case UserRole.SCHEDULER: return "Scheduling Department"
    case UserRole.HIM_CODER: return "Health Information Management"
    case UserRole.BILLER: return "Billing Department"
    case UserRole.AUDITOR: return "Audit / Compliance"
    case UserRole.PATIENT: return "Patient Services"
    default: return "General"
  }
}
