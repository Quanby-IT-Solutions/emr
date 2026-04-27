"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
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
// API type (shape returned by /api/orders/pharmacy-queue)
// ---------------------------------------------------------------------------

interface PharmacyQueueOrder {
  id: string
  orderType: string
  status: string
  priority: string
  clinicalIndication: string | null
  createdAt: string
  details: {
    orderType: string
    medicationName?: string
    dose?: string
    route?: string
    frequency?: string
  }
  placer: { id: string; firstName: string; lastName: string; jobTitle: string | null }
  encounter: {
    patient: {
      id: string
      mrn: string
      firstName: string
      lastName: string
      dateOfBirth: string
      allergies: Array<{
        substance: string
        severity: string | null
        status: string
      }>
      patientHistories: Array<{
        entry: string
        type: string
        status: string
      }>
    }
  }
  clinicalChecks: {
    allergyAlert: boolean
    drugInteraction: boolean
    renalDosing: boolean
  }
}

// ---------------------------------------------------------------------------
// Mapper: DB order → VerificationOrder
// ---------------------------------------------------------------------------

function calcAge(dob: string): number {
  const birth = new Date(dob)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--
  return age
}

function mapSeverity(s: string | null): "Mild" | "Moderate" | "Severe" {
  switch (s) {
    case "MODERATE": return "Moderate"
    case "SEVERE": return "Severe"
    default: return "Mild"
  }
}

function mapPriority(p: string): "STAT" | "Urgent" | "Routine" {
  if (p === "STAT") return "STAT"
  if (p === "URGENT") return "Urgent"
  return "Routine"
}

function toVerificationOrder(o: PharmacyQueueOrder): VerificationOrder {
  const patient = o.encounter.patient
  const allergies = (patient.allergies ?? [])
    .filter((a) => a.status === "ACTIVE")
    .map((a) => ({ substance: a.substance, severity: mapSeverity(a.severity) }))

  const activeProblems = (patient.patientHistories ?? [])
    .filter((h) => h.status === "ACTIVE")
    .map((h) => h.entry)

  const checks = o.clinicalChecks

  return {
    id: o.id,
    patient: `${patient.firstName} ${patient.lastName}`,
    mrn: patient.mrn,
    age: calcAge(patient.dateOfBirth),
    weight: 0,
    allergies,
    renalFunction: "Unknown",
    eGFR: 0,
    activeProblems,
    medication: o.details.medicationName ?? "—",
    dose: o.details.dose ?? "—",
    route: o.details.route ?? "—",
    frequency: o.details.frequency ?? "—",
    indication: o.clinicalIndication ?? "",
    prescriber: `${o.placer.firstName} ${o.placer.lastName}`,
    priority: mapPriority(o.priority),
    orderTime: new Date(o.createdAt).toLocaleString(),
    isHighRisk: false,
    isProspective: false,
    clinicalChecks: {
      allergyCheck: checks.allergyAlert ? "Warning" : "Pass",
      doseRangeCheck: "Pass",
      drugInteraction: checks.drugInteraction ? "Minor" : "None",
      renalDosing: checks.renalDosing ? "Adjustment Needed" : "N/A",
    },
  }
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function VerificationPage() {
  const [orders, setOrders] = useState<VerificationOrder[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<VerificationOrder | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders/pharmacy-queue")
      if (!res.ok) return
      const { data } = await res.json()
      setOrders((data ?? []).map(toVerificationOrder))
    } catch { /* ignore */ }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

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

  async function handleVerify(orderId: string) {
    try {
      const res = await fetch(`/api/orders/${orderId}/verify`, { method: "POST" })
      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error?.message ?? "Failed to verify order")
        return
      }
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
      toast.success("Order verified successfully")
    } catch {
      toast.error("Failed to verify order")
    }
  }

  async function handleReturn(orderId: string, reason: string) {
    try {
      const res = await fetch(`/api/orders/${orderId}/return`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      })
      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error?.message ?? "Failed to return order")
        return
      }
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
      toast.success("Order returned to prescriber", { description: reason })
    } catch {
      toast.error("Failed to return order")
    }
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
