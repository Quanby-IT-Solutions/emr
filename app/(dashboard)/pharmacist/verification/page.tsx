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
  IconClock,
  IconUrgent,
  IconShieldCheck,
  IconCalendarEvent,
  IconAlertTriangle,
  IconEye,
} from "@tabler/icons-react"
import { toast } from "sonner"
import {
  VerificationDetailSheet,
  type VerificationOrder,
} from "./components/verification-detail-sheet"

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const mockOrders: VerificationOrder[] = [
  {
    id: 1,
    patient: "John Doe",
    mrn: "MRN-001234",
    age: 62,
    weight: 78,
    allergies: [{ substance: "Penicillin", severity: "Severe" }],
    renalFunction: "Mild impairment",
    eGFR: 55,
    activeProblems: ["Hypertension", "Type 2 Diabetes", "CKD Stage 3a"],
    medication: "Heparin Sodium",
    dose: "5,000 units",
    route: "IV",
    frequency: "Every 12 hours",
    indication: "DVT Prophylaxis",
    prescriber: "Dr. Smith",
    priority: "STAT",
    orderTime: "2026-04-09 08:15",
    isHighRisk: true,
    isProspective: false,
    clinicalChecks: {
      allergyCheck: "Pass",
      doseRangeCheck: "Pass",
      drugInteraction: "Minor",
      drugInteractionDetail: "Concurrent aspirin — monitor for bleeding",
      renalDosing: "Adjustment Needed",
      renalDosingDetail: "eGFR 55 — consider dose reduction per protocol",
    },
  },
  {
    id: 2,
    patient: "Jane Smith",
    mrn: "MRN-002345",
    age: 45,
    weight: 65,
    allergies: [],
    renalFunction: "Normal",
    eGFR: 95,
    activeProblems: ["Hyperlipidemia"],
    medication: "Atorvastatin",
    dose: "40 mg",
    route: "PO",
    frequency: "Once daily at bedtime",
    indication: "Hyperlipidemia",
    prescriber: "Dr. Johnson",
    priority: "Routine",
    orderTime: "2026-04-09 09:30",
    isHighRisk: false,
    isProspective: false,
    clinicalChecks: {
      allergyCheck: "Pass",
      doseRangeCheck: "Pass",
      drugInteraction: "None",
      renalDosing: "N/A",
    },
  },
  {
    id: 3,
    patient: "Bob Wilson",
    mrn: "MRN-003456",
    age: 71,
    weight: 82,
    allergies: [
      { substance: "Sulfa", severity: "Moderate" },
      { substance: "Codeine", severity: "Mild" },
    ],
    renalFunction: "Moderate impairment",
    eGFR: 38,
    activeProblems: ["Atrial Fibrillation", "CHF", "CKD Stage 3b"],
    medication: "Warfarin Sodium",
    dose: "5 mg",
    route: "PO",
    frequency: "Once daily",
    indication: "Atrial Fibrillation — stroke prevention",
    prescriber: "Dr. Davis",
    priority: "Urgent",
    orderTime: "2026-04-09 07:45",
    isHighRisk: true,
    isProspective: false,
    clinicalChecks: {
      allergyCheck: "Pass",
      doseRangeCheck: "Warning",
      doseRangeDetail: "INR trending high — verify target range",
      drugInteraction: "Major",
      drugInteractionDetail: "Concurrent Amiodarone — increased bleeding risk",
      renalDosing: "Adjustment Needed",
      renalDosingDetail: "eGFR 38 — monitor coagulation closely",
    },
  },
  {
    id: 4,
    patient: "Alice Brown",
    mrn: "MRN-004567",
    age: 56,
    weight: 91,
    allergies: [{ substance: "Latex", severity: "Severe" }],
    renalFunction: "Normal",
    eGFR: 88,
    activeProblems: ["Type 2 Diabetes", "Obesity"],
    medication: "Insulin Glargine",
    dose: "30 units",
    route: "SubQ",
    frequency: "Once daily at bedtime",
    indication: "Type 2 Diabetes — uncontrolled on oral agents",
    prescriber: "Dr. Martinez",
    priority: "Routine",
    orderTime: "2026-04-09 10:00",
    isHighRisk: true,
    isProspective: false,
    clinicalChecks: {
      allergyCheck: "Pass",
      doseRangeCheck: "Pass",
      doseRangeDetail: "Within range for body weight",
      drugInteraction: "Minor",
      drugInteractionDetail: "Metformin — beneficial combination",
      renalDosing: "N/A",
    },
  },
  {
    id: 5,
    patient: "Charlie Davis",
    mrn: "MRN-005678",
    age: 34,
    weight: 68,
    allergies: [],
    renalFunction: "Normal",
    eGFR: 110,
    activeProblems: ["Appendectomy — scheduled"],
    medication: "Cefazolin",
    dose: "2 g",
    route: "IV",
    frequency: "Single dose — 30 min pre-op",
    indication: "Surgical prophylaxis — appendectomy",
    prescriber: "Dr. Wilson",
    priority: "Routine",
    orderTime: "2026-04-08 16:20",
    isHighRisk: false,
    isProspective: true,
    clinicalChecks: {
      allergyCheck: "Pass",
      doseRangeCheck: "Pass",
      drugInteraction: "None",
      renalDosing: "N/A",
    },
  },
  {
    id: 6,
    patient: "Diana Evans",
    mrn: "MRN-006789",
    age: 29,
    weight: 58,
    allergies: [{ substance: "Aspirin", severity: "Moderate" }],
    renalFunction: "Normal",
    eGFR: 105,
    activeProblems: ["Migraine", "Anxiety"],
    medication: "Sumatriptan",
    dose: "50 mg",
    route: "PO",
    frequency: "As needed — max 200 mg/day",
    indication: "Acute migraine",
    prescriber: "Dr. Thompson",
    priority: "Urgent",
    orderTime: "2026-04-09 11:10",
    isHighRisk: false,
    isProspective: false,
    clinicalChecks: {
      allergyCheck: "Pass",
      doseRangeCheck: "Pass",
      drugInteraction: "Moderate",
      drugInteractionDetail: "Concurrent SSRI (Sertraline) — serotonin syndrome risk",
      renalDosing: "N/A",
    },
  },
  {
    id: 7,
    patient: "Edward Kim",
    mrn: "MRN-007890",
    age: 68,
    weight: 75,
    allergies: [{ substance: "Iodine", severity: "Mild" }],
    renalFunction: "Normal",
    eGFR: 78,
    activeProblems: ["Hypertension", "BPH"],
    medication: "Amlodipine",
    dose: "10 mg",
    route: "PO",
    frequency: "Once daily",
    indication: "Hypertension",
    prescriber: "Dr. Smith",
    priority: "Routine",
    orderTime: "2026-04-09 08:50",
    isHighRisk: false,
    isProspective: false,
    clinicalChecks: {
      allergyCheck: "Pass",
      doseRangeCheck: "Pass",
      drugInteraction: "None",
      renalDosing: "N/A",
    },
  },
  {
    id: 8,
    patient: "Fiona Garcia",
    mrn: "MRN-008901",
    age: 48,
    weight: 70,
    allergies: [],
    renalFunction: "Normal",
    eGFR: 92,
    activeProblems: ["Knee replacement — scheduled"],
    medication: "Enoxaparin",
    dose: "40 mg",
    route: "SubQ",
    frequency: "Once daily — start 12h post-op",
    indication: "VTE prophylaxis — post total knee replacement",
    prescriber: "Dr. Wilson",
    priority: "Routine",
    orderTime: "2026-04-08 14:30",
    isHighRisk: true,
    isProspective: true,
    clinicalChecks: {
      allergyCheck: "Pass",
      doseRangeCheck: "Pass",
      drugInteraction: "Minor",
      drugInteractionDetail: "NSAIDs — monitor for bleeding",
      renalDosing: "N/A",
    },
  },
]

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function VerificationPage() {
  const [orders, setOrders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<VerificationOrder | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  // Derived counts
  const pendingCount = orders.length
  const statCount = orders.filter((o) => o.priority === "STAT").length
  const highRiskCount = orders.filter((o) => o.isHighRisk).length
  const prospectiveCount = orders.filter((o) => o.isProspective).length

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.prescriber.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "stat" && order.priority === "STAT") ||
        (activeTab === "high-risk" && order.isHighRisk) ||
        (activeTab === "prospective" && order.isProspective)

      return matchesSearch && matchesTab
    })
  }, [orders, searchTerm, activeTab])

  function handleReview(order: VerificationOrder) {
    setSelectedOrder(order)
    setSheetOpen(true)
  }

  function handleVerify(orderId: number) {
    setOrders((prev) => prev.filter((o) => o.id !== orderId))
    toast.success("Order verified successfully")
  }

  function handleReturn(orderId: number, reason: string) {
    setOrders((prev) => prev.filter((o) => o.id !== orderId))
    toast.success("Order returned to prescriber", {
      description: reason,
    })
  }

  const priorityBadge = (priority: "STAT" | "Urgent" | "Routine") => {
    switch (priority) {
      case "STAT":
        return <Badge variant="destructive">{priority}</Badge>
      case "Urgent":
        return <Badge variant="warning">{priority}</Badge>
      case "Routine":
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <ProtectedRoute requiredRole={UserRole.PHARMACIST}>
      <DashboardLayout role={UserRole.PHARMACIST}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Order Verification</h1>
            <p className="text-muted-foreground">
              Review and verify medication orders for clinical appropriateness
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <IconClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingCount}</div>
                <p className="text-xs text-muted-foreground">Unverified orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">STAT Priority</CardTitle>
                <IconUrgent className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{statCount}</div>
                <p className="text-xs text-muted-foreground">Requires immediate review</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High-Risk Meds</CardTitle>
                <IconAlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{highRiskCount}</div>
                <p className="text-xs text-muted-foreground">Requires double verification</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prospective</CardTitle>
                <IconCalendarEvent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{prospectiveCount}</div>
                <p className="text-xs text-muted-foreground">Pre-operative orders</p>
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
                      placeholder="Search patient, medication, prescriber..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="all">
                      All Pending ({orders.length})
                    </TabsTrigger>
                    <TabsTrigger value="stat">
                      STAT ({statCount})
                    </TabsTrigger>
                    <TabsTrigger value="high-risk">
                      High-Risk ({highRiskCount})
                    </TabsTrigger>
                    <TabsTrigger value="prospective">
                      Prospective ({prospectiveCount})
                    </TabsTrigger>
                  </TabsList>

                  {/* Shared table for all tabs */}
                  <TabsContent value={activeTab} className="mt-4">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Medication</TableHead>
                            <TableHead>Dose / Route / Freq</TableHead>
                            <TableHead>Prescriber</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Order Time</TableHead>
                            <TableHead>Flags</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOrders.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                No orders match the current filter
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredOrders.map((order) => (
                              <TableRow
                                key={order.id}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => handleReview(order)}
                              >
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{order.patient}</div>
                                    <div className="text-xs text-muted-foreground">{order.mrn}</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1.5">
                                    {order.medication}
                                    {order.isHighRisk && (
                                      <IconAlertTriangle className="h-3.5 w-3.5 text-orange-500" />
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm">
                                  {order.dose} / {order.route} / {order.frequency}
                                </TableCell>
                                <TableCell>{order.prescriber}</TableCell>
                                <TableCell>{priorityBadge(order.priority)}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {order.orderTime}
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    {order.allergies.length > 0 && (
                                      <Badge variant="destructive" className="text-xs">
                                        Allergies
                                      </Badge>
                                    )}
                                    {order.isProspective && (
                                      <Badge variant="secondary" className="text-xs">
                                        Pre-op
                                      </Badge>
                                    )}
                                    {order.clinicalChecks.drugInteraction === "Major" && (
                                      <Badge variant="destructive" className="text-xs">
                                        Interaction
                                      </Badge>
                                    )}
                                    {order.clinicalChecks.renalDosing === "Adjustment Needed" && (
                                      <Badge variant="warning" className="text-xs">
                                        Renal
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleReview(order)
                                    }}
                                  >
                                    <IconEye className="h-4 w-4 mr-1" />
                                    Review
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Verification Detail Sheet */}
        <VerificationDetailSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          order={selectedOrder}
          onVerify={handleVerify}
          onReturn={handleReturn}
        />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
