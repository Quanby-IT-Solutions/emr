"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  IconAlertCircle,
  IconClockPause,
  IconCheck,
  IconArrowUp,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { ResolveDialog, type FlaggedOrder } from "./components/resolve-dialog"

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const initialFlaggedOrders: FlaggedOrder[] = [
  {
    id: 1,
    patient: "Bob Wilson",
    mrn: "MRN-003456",
    medication: "Warfarin Sodium",
    dose: "5 mg PO daily",
    prescriber: "Dr. Davis",
    flaggedBy: "Pharm. Rodriguez",
    flagDate: "2026-04-09 08:00",
    flagReason:
      "Patient is on concurrent Amiodarone which significantly increases Warfarin effect. INR trending high at 3.8 (target 2.0–3.0). Recommend dose reduction or hold.",
    flagCategory: "Drug Interaction",
    resolutionStatus: "Pending",
  },
  {
    id: 2,
    patient: "Grace Hopper",
    mrn: "MRN-009012",
    medication: "Gentamicin",
    dose: "240 mg IV q8h",
    prescriber: "Dr. Smith",
    flaggedBy: "Pharm. Lee",
    flagDate: "2026-04-09 07:30",
    flagReason:
      "Dose exceeds recommended range for patient's body weight (58 kg). Calculated dose: 120–180 mg q8h. Risk of nephrotoxicity and ototoxicity.",
    flagCategory: "Dose Too High",
    resolutionStatus: "Pending",
  },
  {
    id: 3,
    patient: "Henry Ford",
    mrn: "MRN-010123",
    medication: "Amoxicillin 500 mg",
    dose: "500 mg PO TID",
    prescriber: "Dr. Johnson",
    flaggedBy: "Pharm. Rodriguez",
    flagDate: "2026-04-09 09:15",
    flagReason:
      "Patient has documented Penicillin allergy (Severity: Severe — anaphylaxis). Cross-reactivity risk with Amoxicillin. Alternative antibiotic recommended.",
    flagCategory: "Allergy Conflict",
    resolutionStatus: "Pending",
  },
  {
    id: 4,
    patient: "Irene Curie",
    mrn: "MRN-011234",
    medication: "Voriconazole",
    dose: "200 mg PO BID",
    prescriber: "Dr. Martinez",
    flaggedBy: "Pharm. Lee",
    flagDate: "2026-04-08 14:00",
    flagReason:
      "Voriconazole is not on the hospital formulary. Non-formulary justification form not submitted by prescriber.",
    flagCategory: "Non-Formulary",
    resolutionStatus: "Resolved",
    resolutionOutcome: "Prescriber Modified Order",
    resolutionNotes:
      "Prescriber submitted non-formulary justification. Approved by pharmacy committee. Switched to Fluconazole 400 mg PO daily as formulary alternative.",
    resolvedDate: "2026-04-08 16:30",
    resolvedBy: "Pharm. Lee",
  },
  {
    id: 5,
    patient: "Jack Chen",
    mrn: "MRN-012345",
    medication: "Metformin 1000 mg",
    dose: "1000 mg PO BID",
    prescriber: "Dr. Thompson",
    flaggedBy: "Pharm. Rodriguez",
    flagDate: "2026-04-08 11:00",
    flagReason:
      "Patient eGFR is 28 mL/min (CKD Stage 4). Metformin is contraindicated when eGFR < 30 mL/min due to risk of lactic acidosis.",
    flagCategory: "Renal Contraindication",
    resolutionStatus: "Resolved",
    resolutionOutcome: "Order Cancelled",
    resolutionNotes:
      "Prescriber acknowledged contraindication. Order cancelled and switched to Sitagliptin 25 mg PO daily (renal-adjusted dose).",
    resolvedDate: "2026-04-08 13:45",
    resolvedBy: "Pharm. Rodriguez",
  },
]

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function FlaggedPage() {
  const [orders, setOrders] = useState(initialFlaggedOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [resolveOpen, setResolveOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<FlaggedOrder | null>(null)

  // Counts
  const pendingCount = orders.filter((o) => o.resolutionStatus === "Pending").length
  const resolvedCount = orders.filter((o) => o.resolutionStatus === "Resolved").length

  // Filtered
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.prescriber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.flagCategory.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "pending" && order.resolutionStatus === "Pending") ||
        (activeTab === "resolved" && order.resolutionStatus === "Resolved")

      return matchesSearch && matchesTab
    })
  }, [orders, searchTerm, activeTab])

  function handleOpenResolve(order: FlaggedOrder) {
    setSelectedOrder(order)
    setResolveOpen(true)
  }

  function handleEscalate(order: FlaggedOrder) {
    toast.success(`Escalated to Department Head`, {
      description: `${order.medication} for ${order.patient}`,
    })
  }

  function handleResolve(orderId: number, outcome: string, notes: string) {
    const outcomeLabels: Record<string, string> = {
      "prescriber-modified": "Prescriber Modified Order",
      "order-cancelled": "Order Cancelled",
      "override-approved": "Override Approved with Justification",
    }
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              resolutionStatus: "Resolved" as const,
              resolutionOutcome: outcomeLabels[outcome] ?? outcome,
              resolutionNotes: notes,
              resolvedDate: new Date().toISOString().slice(0, 16).replace("T", " "),
              resolvedBy: "Current Pharmacist",
            }
          : o
      )
    )
    toast.success("Flag resolved successfully")
  }

  const categoryBadge = (category: string) => {
    const map: Record<string, "destructive" | "warning" | "secondary"> = {
      "Allergy Conflict": "destructive",
      "Drug Interaction": "destructive",
      "Dose Too High": "warning",
      "Renal Contraindication": "destructive",
      "Non-Formulary": "secondary",
    }
    return <Badge variant={map[category] ?? "outline"}>{category}</Badge>
  }

  return (
    <ProtectedRoute requiredRole={UserRole.PHARMACIST}>
      <DashboardLayout role={UserRole.PHARMACIST}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Flagged Orders</h1>
            <p className="text-muted-foreground">
              Review and resolve flagged medication orders
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid gap-4 px-4 md:grid-cols-3 lg:px-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Flagged</CardTitle>
                <IconAlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{orders.length}</div>
                <p className="text-xs text-muted-foreground">All flagged orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Resolution</CardTitle>
                <IconClockPause className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{pendingCount}</div>
                <p className="text-xs text-muted-foreground">Awaiting action</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <IconCheck className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{resolvedCount}</div>
                <p className="text-xs text-muted-foreground">Completed resolutions</p>
              </CardContent>
            </Card>
          </div>

          {/* Search & Table */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardContent className="pt-6">
                {/* Search */}
                <div className="mb-4">
                  <div className="relative max-w-sm">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search patient, medication, category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="all">All ({orders.length})</TabsTrigger>
                    <TabsTrigger value="pending">
                      Pending ({pendingCount})
                    </TabsTrigger>
                    <TabsTrigger value="resolved">
                      Resolved ({resolvedCount})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value={activeTab} className="mt-4">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Medication</TableHead>
                            <TableHead>Prescriber</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Flagged By</TableHead>
                            <TableHead>Flag Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOrders.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={8}
                                className="text-center py-8 text-muted-foreground"
                              >
                                No flagged orders match the current filter
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredOrders.map((order) => (
                              <TableRow key={order.id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{order.patient}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {order.mrn}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div>{order.medication}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {order.dose}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>{order.prescriber}</TableCell>
                                <TableCell>{categoryBadge(order.flagCategory)}</TableCell>
                                <TableCell className="text-sm">{order.flaggedBy}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {order.flagDate}
                                </TableCell>
                                <TableCell>
                                  {order.resolutionStatus === "Pending" ? (
                                    <Badge variant="warning">Pending</Badge>
                                  ) : (
                                    <Badge variant="default">Resolved</Badge>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  {order.resolutionStatus === "Pending" ? (
                                    <div className="flex gap-1 justify-end">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleOpenResolve(order)}
                                      >
                                        <IconCheck className="h-3.5 w-3.5 mr-1" />
                                        Resolve
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleEscalate(order)}
                                      >
                                        <IconArrowUp className="h-3.5 w-3.5 mr-1" />
                                        Escalate
                                      </Button>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">
                                      {order.resolutionOutcome}
                                    </span>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Expanded flag details under table for pending items */}
                    {filteredOrders.some(
                      (o) => o.resolutionStatus === "Pending"
                    ) && (
                      <div className="mt-4 space-y-2">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                          Flag Details
                        </p>
                        {filteredOrders
                          .filter((o) => o.resolutionStatus === "Pending")
                          .map((order) => (
                            <div
                              key={order.id}
                              className="rounded-lg border p-3 text-sm space-y-1"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{order.patient}</span>
                                <span className="text-muted-foreground">—</span>
                                <span>{order.medication}</span>
                                {categoryBadge(order.flagCategory)}
                              </div>
                              <p className="text-muted-foreground">{order.flagReason}</p>
                            </div>
                          ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Resolve Dialog */}
        <ResolveDialog
          open={resolveOpen}
          onOpenChange={setResolveOpen}
          order={selectedOrder}
          onResolve={handleResolve}
        />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
