"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IconPlus, IconSearch } from "@tabler/icons-react"
import { CreateReferralDialog } from "./components/create-referral-dialog"
import { ReferralDetailSheet, type ReferralDetail, type ReferralTimelineEntry } from "./components/referral-detail-sheet"

// --- Mock Data ---

const mockReferrals: ReferralDetail[] = [
  {
    id: "REF-001",
    patient: "John Doe",
    mrn: "MRN-001",
    referredTo: "Dr. Amanda Rivera",
    specialty: "Cardiology",
    reason: "Persistent chest pain with elevated troponin levels. Evaluate for coronary artery disease.",
    priority: "Urgent",
    status: "Accepted",
    dateCreated: "2025-11-05",
    referringProvider: "Dr. Sarah Johnson",
    attachedNotes: ["Progress Note — Nov 5, 2025", "Lab Results — Nov 5, 2025"],
    timeline: [
      { label: "Referral Created", date: "Nov 5, 2025 9:15 AM", status: "done" },
      { label: "Sent to Cardiology", date: "Nov 5, 2025 9:16 AM", status: "done" },
      { label: "Accepted by Dr. Rivera", date: "Nov 5, 2025 11:30 AM", status: "done" },
      { label: "Consultation Completed", date: null, status: "current" },
    ],
  },
  {
    id: "REF-002",
    patient: "Jane Smith",
    mrn: "MRN-002",
    referredTo: "Dr. Rachel Kim",
    specialty: "Endocrinology",
    reason: "Uncontrolled thyroid function despite medication adjustment. TSH persistently elevated.",
    priority: "Routine",
    status: "Pending",
    dateCreated: "2025-11-06",
    referringProvider: "Dr. David Martinez",
    attachedNotes: ["Lab Results — Nov 6, 2025"],
    timeline: [
      { label: "Referral Created", date: "Nov 6, 2025 2:00 PM", status: "done" },
      { label: "Sent to Endocrinology", date: "Nov 6, 2025 2:01 PM", status: "done" },
      { label: "Accepted / Declined", date: null, status: "current" },
      { label: "Consultation Completed", date: null, status: "pending" },
    ],
  },
  {
    id: "REF-003",
    patient: "Bob Wilson",
    mrn: "MRN-003",
    referredTo: "Dr. Fatima Al-Rashid",
    specialty: "Nephrology",
    reason: "CKD Stage 3 with declining eGFR. Evaluate for further workup and management.",
    priority: "Routine",
    status: "Completed",
    dateCreated: "2025-10-28",
    referringProvider: "Dr. Lisa Park",
    attachedNotes: ["H&P — Oct 28, 2025", "Lab Results — Oct 28, 2025"],
    timeline: [
      { label: "Referral Created", date: "Oct 28, 2025 10:00 AM", status: "done" },
      { label: "Sent to Nephrology", date: "Oct 28, 2025 10:01 AM", status: "done" },
      { label: "Accepted by Dr. Al-Rashid", date: "Oct 28, 2025 3:45 PM", status: "done" },
      { label: "Consultation Completed", date: "Nov 2, 2025 1:30 PM", status: "done" },
    ],
  },
  {
    id: "REF-004",
    patient: "Maria Garcia",
    mrn: "MRN-004",
    referredTo: "Dr. Henry Ito",
    specialty: "Gastroenterology",
    reason: "Recurrent abdominal pain with elevated lipase. Rule out chronic pancreatitis.",
    priority: "Urgent",
    status: "Pending",
    dateCreated: "2025-11-07",
    referringProvider: "Dr. Sarah Johnson",
    attachedNotes: ["Progress Note — Nov 7, 2025"],
    timeline: [
      { label: "Referral Created", date: "Nov 7, 2025 8:30 AM", status: "done" },
      { label: "Sent to Gastroenterology", date: "Nov 7, 2025 8:31 AM", status: "current" },
      { label: "Accepted / Declined", date: null, status: "pending" },
      { label: "Consultation Completed", date: null, status: "pending" },
    ],
  },
  {
    id: "REF-005",
    patient: "Alice Wong",
    mrn: "MRN-007",
    referredTo: "Dr. Angela Peters",
    specialty: "Pulmonology",
    reason: "Persistent bilateral infiltrates on CXR. Evaluate for pulmonary fibrosis.",
    priority: "Urgent",
    status: "Accepted",
    dateCreated: "2025-11-04",
    referringProvider: "Dr. Lisa Park",
    attachedNotes: ["Imaging Report — Nov 4, 2025", "Progress Note — Nov 4, 2025"],
    timeline: [
      { label: "Referral Created", date: "Nov 4, 2025 1:00 PM", status: "done" },
      { label: "Sent to Pulmonology", date: "Nov 4, 2025 1:01 PM", status: "done" },
      { label: "Accepted by Dr. Peters", date: "Nov 4, 2025 4:00 PM", status: "done" },
      { label: "Consultation Completed", date: null, status: "current" },
    ],
  },
  {
    id: "REF-006",
    patient: "Carlos Mendez",
    mrn: "MRN-008",
    referredTo: "Dr. Thomas Nguyen",
    specialty: "Cardiology",
    reason: "New-onset atrial fibrillation. Evaluate for ablation candidacy.",
    priority: "Routine",
    status: "Accepted",
    dateCreated: "2025-11-05",
    referringProvider: "Dr. Michael Chen",
    attachedNotes: ["ECG Report — Nov 5, 2025"],
    timeline: [
      { label: "Referral Created", date: "Nov 5, 2025 3:00 PM", status: "done" },
      { label: "Sent to Cardiology", date: "Nov 5, 2025 3:01 PM", status: "done" },
      { label: "Accepted by Dr. Nguyen", date: "Nov 6, 2025 9:00 AM", status: "done" },
      { label: "Consultation Completed", date: null, status: "current" },
    ],
  },
  {
    id: "REF-007",
    patient: "James Brown",
    mrn: "MRN-010",
    referredTo: "Dr. Elizabeth Grant",
    specialty: "Surgery",
    reason: "Recurrent pleural effusion. Evaluate for thoracentesis vs chest tube placement.",
    priority: "Urgent",
    status: "Declined",
    dateCreated: "2025-11-03",
    referringProvider: "Dr. Sarah Johnson",
    attachedNotes: ["Imaging Report — Nov 3, 2025"],
    timeline: [
      { label: "Referral Created", date: "Nov 3, 2025 11:00 AM", status: "done" },
      { label: "Sent to Surgery", date: "Nov 3, 2025 11:01 AM", status: "done" },
      { label: "Declined by Dr. Grant", date: "Nov 3, 2025 4:30 PM", status: "declined" },
      { label: "Consultation Completed", date: null, status: "pending" },
    ],
  },
  {
    id: "REF-008",
    patient: "Priya Patel",
    mrn: "MRN-009",
    referredTo: "Dr. Brian O'Connor",
    specialty: "Neurology",
    reason: "New-onset seizure activity. EEG and neurological evaluation recommended.",
    priority: "Urgent",
    status: "Pending",
    dateCreated: "2025-11-07",
    referringProvider: "Dr. David Martinez",
    attachedNotes: [],
    timeline: [
      { label: "Referral Created", date: "Nov 7, 2025 10:45 AM", status: "done" },
      { label: "Sent to Neurology", date: "Nov 7, 2025 10:46 AM", status: "current" },
      { label: "Accepted / Declined", date: null, status: "pending" },
      { label: "Consultation Completed", date: null, status: "pending" },
    ],
  },
]

// --- Helpers ---

const statusBadgeClass: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  Accepted: "bg-blue-100 text-blue-800 border-blue-300",
  Completed: "bg-green-100 text-green-800 border-green-300",
  Declined: "bg-red-100 text-red-800 border-red-300",
}

const priorityBadgeClass: Record<string, string> = {
  Routine: "bg-gray-100 text-gray-800 border-gray-300",
  Urgent: "bg-yellow-100 text-yellow-800 border-yellow-300",
}

// --- Page ---

export default function ReferralsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedReferral, setSelectedReferral] = useState<ReferralDetail | null>(null)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredReferrals = useMemo(() => {
    return mockReferrals.filter((ref) => {
      if (statusFilter !== "all" && ref.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          ref.patient.toLowerCase().includes(q) ||
          ref.mrn.toLowerCase().includes(q) ||
          ref.referredTo.toLowerCase().includes(q) ||
          ref.specialty.toLowerCase().includes(q) ||
          ref.id.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [search, statusFilter])

  const handleRowClick = (ref: ReferralDetail) => {
    setSelectedReferral(ref)
    setSheetOpen(true)
  }

  return (
    <ProtectedRoute requiredRole={UserRole.CLINICIAN}>
      <DashboardLayout role={UserRole.CLINICIAN}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="flex items-center justify-between px-4 lg:px-6">
            <div>
              <h1 className="text-2xl font-bold">Referrals</h1>
              <p className="text-muted-foreground">
                Manage specialist referrals and track consultation status
              </p>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <IconPlus className="h-4 w-4 mr-2" />
              Create Referral
            </Button>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Referrals</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by patient, MRN, specialist..."
                        className="pl-9 w-72"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Accepted">Accepted</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Declined">Declined</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Referral ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>MRN</TableHead>
                      <TableHead>Referred To</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReferrals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          No referrals found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredReferrals.map((ref) => (
                        <TableRow
                          key={ref.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleRowClick(ref)}
                        >
                          <TableCell className="font-medium">{ref.id}</TableCell>
                          <TableCell>{ref.patient}</TableCell>
                          <TableCell className="text-muted-foreground">{ref.mrn}</TableCell>
                          <TableCell>{ref.referredTo}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{ref.reason}</TableCell>
                          <TableCell>
                            <Badge className={priorityBadgeClass[ref.priority]}>{ref.priority}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={statusBadgeClass[ref.status]}>{ref.status}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{ref.dateCreated}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        <CreateReferralDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        <ReferralDetailSheet open={sheetOpen} onOpenChange={setSheetOpen} referral={selectedReferral} />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
