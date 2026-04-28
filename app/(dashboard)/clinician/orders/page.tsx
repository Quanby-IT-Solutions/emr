"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconPlus, IconSearch } from "@tabler/icons-react"
import { PlaceOrderDialog } from "./components/place-order-dialog"
import { OrderSetSection } from "./components/order-set-section"

interface ApiOrder {
  id: string
  orderType: string
  status: string
  priority: string
  details: Record<string, unknown>
  clinicalIndication: string | null
  createdAt: string
  placer: { id: string; firstName: string; lastName: string }
  encounter: {
    id: string
    patient: { id: string; mrn: string; firstName: string; lastName: string }
  }
}

function getItemDescription(order: ApiOrder): string {
  const d = order.details
  switch (order.orderType) {
    case "MEDICATION":
      return `${d.medicationName} ${d.dose} ${d.route} ${d.frequency}`
    case "LAB":
      return String(d.testName)
    case "IMAGING":
      return d.bodyPart ? `${d.study} - ${d.bodyPart}` : String(d.study)
    case "PROCEDURE":
      return String(d.procedureName)
    case "NURSING":
      return String(d.instruction)
    case "ADMIT_INPATIENT":
      return `Admit to ${d.unit}`
    case "REFERRAL":
      return `Referral to ${d.specialty}`
    case "DISCHARGE":
      return "Discharge"
    default:
      return order.orderType
  }
}

const typeBadgeClass: Record<string, string> = {
  MEDICATION: "bg-green-100 text-green-800 border-green-300",
  LAB: "bg-blue-100 text-blue-800 border-blue-300",
  IMAGING: "bg-purple-100 text-purple-800 border-purple-300",
  PROCEDURE: "bg-orange-100 text-orange-800 border-orange-300",
  NURSING: "bg-teal-100 text-teal-800 border-teal-300",
  ADMIT_INPATIENT: "bg-orange-100 text-orange-800 border-orange-300",
  REFERRAL: "bg-yellow-100 text-yellow-800 border-yellow-300",
  DISCHARGE: "bg-gray-100 text-gray-800 border-gray-300",
}

const typeLabel: Record<string, string> = {
  MEDICATION: "Medication",
  LAB: "Lab",
  IMAGING: "Imaging",
  PROCEDURE: "Procedure",
  NURSING: "Nursing",
  ADMIT_INPATIENT: "Admit",
  REFERRAL: "Referral",
  DISCHARGE: "Discharge",
}

const statusBadgeClass: Record<string, string> = {
  PLACED: "bg-blue-100 text-blue-800 border-blue-300",
  VERIFIED: "bg-purple-100 text-purple-800 border-purple-300",
  IN_PROGRESS: "bg-yellow-100 text-yellow-800 border-yellow-300",
  COMPLETED: "bg-green-100 text-green-800 border-green-300",
  CANCELLED: "bg-red-100 text-red-800 border-red-300",
}

const statusLabel: Record<string, string> = {
  PLACED: "Placed",
  VERIFIED: "Verified",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
}

const priorityBadgeClass: Record<string, string> = {
  ROUTINE: "bg-gray-100 text-gray-800 border-gray-300",
  URGENT: "bg-yellow-100 text-yellow-800 border-yellow-300",
  STAT: "bg-red-100 text-red-800 border-red-300",
}

export default function OrdersPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [orders, setOrders] = useState<ApiOrder[]>([])

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders")
      if (!res.ok) return
      const { data } = await res.json()
      setOrders(data ?? [])
    } catch { /* ignore */ }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (activeTab === "medications" && order.orderType !== "MEDICATION") return false
      if (activeTab === "lab" && order.orderType !== "LAB") return false
      if (activeTab === "imaging" && order.orderType !== "IMAGING") return false
      if (
        activeTab === "admit-discharge" &&
        order.orderType !== "ADMIT_INPATIENT" &&
        order.orderType !== "DISCHARGE"
      )
        return false
      if (activeTab === "active" && (order.status === "COMPLETED" || order.status === "CANCELLED"))
        return false
      if (activeTab === "completed" && order.status !== "COMPLETED") return false

      if (statusFilter !== "all" && order.status !== statusFilter) return false

      if (search) {
        const q = search.toLowerCase()
        const patientName =
          `${order.encounter.patient.firstName} ${order.encounter.patient.lastName}`.toLowerCase()
        const item = getItemDescription(order).toLowerCase()
        const orderedBy =
          `${order.placer.firstName} ${order.placer.lastName}`.toLowerCase()
        return patientName.includes(q) || item.includes(q) || orderedBy.includes(q)
      }

      return true
    })
  }, [activeTab, statusFilter, search, orders])

  return (
    <ProtectedRoute requiredRole={UserRole.CLINICIAN}>
      <DashboardLayout role={UserRole.CLINICIAN}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-between px-4 lg:px-6">
            <div>
              <h1 className="text-2xl font-bold">Orders / CPOE</h1>
              <p className="text-muted-foreground">
                Computerized Physician Order Entry — manage all patient orders
              </p>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <IconPlus className="h-4 w-4 mr-2" />
              Place Order
            </Button>
          </div>

          <div className="px-4 lg:px-6 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="lab">Lab</TabsTrigger>
                <TabsTrigger value="imaging">Imaging</TabsTrigger>
                <TabsTrigger value="admit-discharge">Admit/Discharge</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-4 mt-4">
                <div className="relative flex-1 max-w-sm">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search orders by patient, item, or provider..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="PLACED">Placed</SelectItem>
                    <SelectItem value="VERIFIED">Verified</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {["all", "medications", "lab", "imaging", "admit-discharge", "active", "completed"].map(
                (tab) => (
                  <TabsContent key={tab} value={tab}>
                    <Card>
                      <CardContent className="pt-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Patient</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Order Item</TableHead>
                              <TableHead>Ordered By</TableHead>
                              <TableHead>Priority</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredOrders.length === 0 ? (
                              <TableRow>
                                <TableCell
                                  colSpan={7}
                                  className="text-center text-muted-foreground py-8"
                                >
                                  No orders found
                                </TableCell>
                              </TableRow>
                            ) : (
                              filteredOrders.map((order) => (
                                <TableRow key={order.id}>
                                  <TableCell className="font-medium">
                                    {order.encounter.patient.firstName}{" "}
                                    {order.encounter.patient.lastName} (
                                    {order.encounter.patient.mrn})
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      className={
                                        typeBadgeClass[order.orderType] ??
                                        "bg-gray-100 text-gray-800"
                                      }
                                    >
                                      {typeLabel[order.orderType] ?? order.orderType}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{getItemDescription(order)}</TableCell>
                                  <TableCell className="text-muted-foreground">
                                    Dr. {order.placer.firstName} {order.placer.lastName}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      className={
                                        priorityBadgeClass[order.priority] ??
                                        "bg-gray-100 text-gray-800"
                                      }
                                    >
                                      {order.priority}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      className={
                                        statusBadgeClass[order.status] ??
                                        "bg-gray-100 text-gray-800"
                                      }
                                    >
                                      {statusLabel[order.status] ?? order.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                )
              )}
            </Tabs>

            <OrderSetSection />
          </div>
        </div>
        <PlaceOrderDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onOrderPlaced={fetchOrders}
        />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
