"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  IconSearch,
  IconFileCheck,
  IconCalendarStats,
  IconClock,
} from "@tabler/icons-react"

// ---------------------------------------------------------------------------
// Types & Mock Data
// ---------------------------------------------------------------------------

type DispensingStatus = "Dispensed" | "Awaiting Dispensing" | "Administered"

interface ApprovedOrder {
  id: number
  patient: string
  mrn: string
  medication: string
  dose: string
  route: string
  frequency: string
  prescriber: string
  verifiedBy: string
  verifiedDate: string
  approvedDate: string
  dispensingStatus: DispensingStatus
  verificationNotes: string
  coSignedBy?: string
}

const mockApprovedOrders: ApprovedOrder[] = [
  {
    id: 1,
    patient: "Alice Brown",
    mrn: "MRN-004567",
    medication: "Metformin 500 mg",
    dose: "500 mg",
    route: "PO",
    frequency: "Twice daily",
    prescriber: "Dr. Davis",
    verifiedBy: "Pharm. Rodriguez",
    verifiedDate: "2026-04-09 09:12",
    approvedDate: "2026-04-09 09:15",
    dispensingStatus: "Dispensed",
    verificationNotes: "Dose appropriate for renal function. No interactions found.",
  },
  {
    id: 2,
    patient: "Charlie Davis",
    mrn: "MRN-005678",
    medication: "Lisinopril 10 mg",
    dose: "10 mg",
    route: "PO",
    frequency: "Once daily",
    prescriber: "Dr. Wilson",
    verifiedBy: "Pharm. Lee",
    verifiedDate: "2026-04-09 08:30",
    approvedDate: "2026-04-09 08:32",
    dispensingStatus: "Administered",
    verificationNotes: "Standard dose. Patient tolerating well per chart review.",
  },
  {
    id: 3,
    patient: "Jane Smith",
    mrn: "MRN-002345",
    medication: "Atorvastatin 40 mg",
    dose: "40 mg",
    route: "PO",
    frequency: "Once daily at bedtime",
    prescriber: "Dr. Johnson",
    verifiedBy: "Pharm. Rodriguez",
    verifiedDate: "2026-04-09 10:05",
    approvedDate: "2026-04-09 10:08",
    dispensingStatus: "Awaiting Dispensing",
    verificationNotes: "No hepatic concerns. LFTs within normal limits.",
  },
  {
    id: 4,
    patient: "Edward Kim",
    mrn: "MRN-007890",
    medication: "Amlodipine 10 mg",
    dose: "10 mg",
    route: "PO",
    frequency: "Once daily",
    prescriber: "Dr. Smith",
    verifiedBy: "Pharm. Lee",
    verifiedDate: "2026-04-09 09:45",
    approvedDate: "2026-04-09 09:48",
    dispensingStatus: "Dispensed",
    verificationNotes: "Maximum dose; previously on 5 mg with inadequate control.",
  },
  {
    id: 5,
    patient: "Fiona Garcia",
    mrn: "MRN-008901",
    medication: "Enoxaparin 40 mg",
    dose: "40 mg",
    route: "SubQ",
    frequency: "Once daily",
    prescriber: "Dr. Wilson",
    verifiedBy: "Pharm. Rodriguez",
    verifiedDate: "2026-04-08 15:10",
    approvedDate: "2026-04-08 15:15",
    dispensingStatus: "Administered",
    verificationNotes: "Post-op VTE prophylaxis dose verified. Weight appropriate.",
    coSignedBy: "Pharm. Lee (high-risk co-sign)",
  },
  {
    id: 6,
    patient: "Diana Evans",
    mrn: "MRN-006789",
    medication: "Sumatriptan 50 mg",
    dose: "50 mg",
    route: "PO",
    frequency: "As needed (max 200 mg/day)",
    prescriber: "Dr. Thompson",
    verifiedBy: "Pharm. Lee",
    verifiedDate: "2026-04-09 11:30",
    approvedDate: "2026-04-09 11:32",
    dispensingStatus: "Awaiting Dispensing",
    verificationNotes:
      "Serotonin syndrome risk discussed with prescriber. Dose is appropriate. Patient counseled.",
  },
]

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function ApprovedPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState("today")
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  const filteredOrders = useMemo(() => {
    return mockApprovedOrders.filter((order) => {
      const matchesSearch =
        order.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.prescriber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.verifiedBy.toLowerCase().includes(searchTerm.toLowerCase())

      // Simple date-range filtering based on approved date
      const approvedDate = new Date(order.approvedDate)
      const now = new Date()
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const startOfWeek = new Date(startOfDay)
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      let matchesDate = true
      if (dateRange === "today") matchesDate = approvedDate >= startOfDay
      else if (dateRange === "week") matchesDate = approvedDate >= startOfWeek
      else if (dateRange === "month") matchesDate = approvedDate >= startOfMonth

      return matchesSearch && matchesDate
    })
  }, [searchTerm, dateRange])

  // Stats
  const todayCount = mockApprovedOrders.filter((o) => {
    const d = new Date(o.approvedDate)
    const now = new Date()
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    )
  }).length

  const weekCount = mockApprovedOrders.length
  const avgTAT = "18 min"

  const dispensingBadge = (status: DispensingStatus) => {
    switch (status) {
      case "Dispensed":
        return <Badge variant="default">{status}</Badge>
      case "Awaiting Dispensing":
        return <Badge variant="warning">{status}</Badge>
      case "Administered":
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <ProtectedRoute requiredRole={UserRole.PHARMACIST}>
      <DashboardLayout role={UserRole.PHARMACIST}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Approved Orders</h1>
            <p className="text-muted-foreground">
              View verified and approved medication orders
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid gap-4 px-4 md:grid-cols-3 lg:px-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
                <IconFileCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayCount}</div>
                <p className="text-xs text-muted-foreground">Orders verified and approved</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
                <IconCalendarStats className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{weekCount}</div>
                <p className="text-xs text-muted-foreground">Total approved orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Verification Time</CardTitle>
                <IconClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgTAT}</div>
                <p className="text-xs text-muted-foreground">Order to verification</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters & Table */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardContent className="pt-6">
                {/* Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patient, medication, prescriber..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Medication</TableHead>
                        <TableHead>Dose / Route</TableHead>
                        <TableHead>Prescriber</TableHead>
                        <TableHead>Verified By</TableHead>
                        <TableHead>Verified Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No approved orders found for the selected period
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredOrders.map((order) => (
                          <>
                            <TableRow
                              key={order.id}
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() =>
                                setExpandedRow(expandedRow === order.id ? null : order.id)
                              }
                            >
                              <TableCell>
                                <div>
                                  <div className="font-medium">{order.patient}</div>
                                  <div className="text-xs text-muted-foreground">{order.mrn}</div>
                                </div>
                              </TableCell>
                              <TableCell>{order.medication}</TableCell>
                              <TableCell className="text-sm">
                                {order.dose} / {order.route}
                              </TableCell>
                              <TableCell>{order.prescriber}</TableCell>
                              <TableCell>{order.verifiedBy}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {order.verifiedDate}
                              </TableCell>
                              <TableCell>{dispensingBadge(order.dispensingStatus)}</TableCell>
                            </TableRow>
                            {expandedRow === order.id && (
                              <TableRow key={`${order.id}-detail`}>
                                <TableCell colSpan={7} className="bg-muted/30">
                                  <div className="py-2 space-y-1 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">Frequency:</span>{" "}
                                      {order.frequency}
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Approved:</span>{" "}
                                      {order.approvedDate}
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">
                                        Verification Notes:
                                      </span>{" "}
                                      {order.verificationNotes}
                                    </div>
                                    {order.coSignedBy && (
                                      <div>
                                        <span className="text-muted-foreground">Co-Signed:</span>{" "}
                                        <Badge variant="secondary" className="text-xs">
                                          {order.coSignedBy}
                                        </Badge>
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
