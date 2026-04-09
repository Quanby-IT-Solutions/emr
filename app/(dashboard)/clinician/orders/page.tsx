"use client"

import { useState, useMemo } from "react"
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

type OrderType = "Medication" | "Lab" | "Imaging" | "Admit" | "Discharge"
type OrderStatus = "Placed" | "In Progress" | "Completed" | "Cancelled"
type OrderPriority = "Routine" | "Urgent" | "STAT"

interface Order {
  id: number
  patient: string
  type: OrderType
  item: string
  status: OrderStatus
  priority: OrderPriority
  orderedBy: string
  date: string
}

const mockOrders: Order[] = [
  { id: 1, patient: "John Doe (MRN-001)", type: "Medication", item: "Metformin 500mg PO BID", status: "Placed", priority: "Routine", orderedBy: "Dr. Sarah Johnson", date: "2025-11-07" },
  { id: 2, patient: "John Doe (MRN-001)", type: "Lab", item: "HbA1c", status: "In Progress", priority: "Routine", orderedBy: "Dr. Sarah Johnson", date: "2025-11-07" },
  { id: 3, patient: "John Doe (MRN-001)", type: "Lab", item: "Basic Metabolic Panel", status: "Completed", priority: "STAT", orderedBy: "Dr. Sarah Johnson", date: "2025-11-06" },
  { id: 4, patient: "John Doe (MRN-001)", type: "Medication", item: "Lisinopril 10mg PO Daily", status: "Placed", priority: "Routine", orderedBy: "Dr. Sarah Johnson", date: "2025-11-06" },
  { id: 5, patient: "Jane Smith (MRN-002)", type: "Imaging", item: "Chest X-Ray PA/Lat", status: "Completed", priority: "Routine", orderedBy: "Dr. David Martinez", date: "2025-11-05" },
  { id: 6, patient: "Jane Smith (MRN-002)", type: "Medication", item: "Albuterol MDI 2 puffs PRN", status: "Placed", priority: "Routine", orderedBy: "Dr. David Martinez", date: "2025-11-07" },
  { id: 7, patient: "Bob Wilson (MRN-003)", type: "Lab", item: "CBC with Differential", status: "Completed", priority: "STAT", orderedBy: "Dr. Lisa Park", date: "2025-11-04" },
  { id: 8, patient: "Bob Wilson (MRN-003)", type: "Lab", item: "Comprehensive Metabolic Panel", status: "Completed", priority: "STAT", orderedBy: "Dr. Lisa Park", date: "2025-11-04" },
  { id: 9, patient: "Bob Wilson (MRN-003)", type: "Imaging", item: "CT Abdomen/Pelvis w/ Contrast", status: "In Progress", priority: "Urgent", orderedBy: "Dr. Lisa Park", date: "2025-11-05" },
  { id: 10, patient: "Bob Wilson (MRN-003)", type: "Discharge", item: "Discharge to Home", status: "Placed", priority: "Routine", orderedBy: "Dr. Lisa Park", date: "2025-11-07" },
  { id: 11, patient: "John Doe (MRN-001)", type: "Medication", item: "Aspirin 81mg PO Daily", status: "Cancelled", priority: "Routine", orderedBy: "Dr. Sarah Johnson", date: "2025-11-03" },
  { id: 12, patient: "Jane Smith (MRN-002)", type: "Lab", item: "Ferritin Level", status: "Placed", priority: "Routine", orderedBy: "Dr. David Martinez", date: "2025-11-07" },
  { id: 13, patient: "John Doe (MRN-001)", type: "Admit", item: "Admit to Medical Ward - Rm 301A", status: "Completed", priority: "Urgent", orderedBy: "Dr. Sarah Johnson", date: "2025-11-01" },
  { id: 14, patient: "Jane Smith (MRN-002)", type: "Medication", item: "Ferrous Sulfate 325mg PO Daily", status: "In Progress", priority: "Routine", orderedBy: "Dr. David Martinez", date: "2025-11-06" },
]

const typeBadgeClass: Record<OrderType, string> = {
  Medication: "bg-green-100 text-green-800 border-green-300",
  Lab: "bg-blue-100 text-blue-800 border-blue-300",
  Imaging: "bg-purple-100 text-purple-800 border-purple-300",
  Admit: "bg-orange-100 text-orange-800 border-orange-300",
  Discharge: "bg-gray-100 text-gray-800 border-gray-300",
}

const statusBadgeClass: Record<OrderStatus, string> = {
  Placed: "bg-blue-100 text-blue-800 border-blue-300",
  "In Progress": "bg-yellow-100 text-yellow-800 border-yellow-300",
  Completed: "bg-green-100 text-green-800 border-green-300",
  Cancelled: "bg-red-100 text-red-800 border-red-300",
}

const priorityBadgeClass: Record<OrderPriority, string> = {
  Routine: "bg-gray-100 text-gray-800 border-gray-300",
  Urgent: "bg-yellow-100 text-yellow-800 border-yellow-300",
  STAT: "bg-red-100 text-red-800 border-red-300",
}

export default function OrdersPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      // Tab filter
      if (activeTab === "medications" && order.type !== "Medication") return false
      if (activeTab === "lab" && order.type !== "Lab") return false
      if (activeTab === "imaging" && order.type !== "Imaging") return false
      if (activeTab === "admit-discharge" && order.type !== "Admit" && order.type !== "Discharge") return false
      if (activeTab === "active" && (order.status === "Completed" || order.status === "Cancelled")) return false
      if (activeTab === "completed" && order.status !== "Completed") return false

      // Status filter
      if (statusFilter !== "all" && order.status !== statusFilter) return false

      // Search
      if (search) {
        const q = search.toLowerCase()
        return (
          order.patient.toLowerCase().includes(q) ||
          order.item.toLowerCase().includes(q) ||
          order.orderedBy.toLowerCase().includes(q)
        )
      }

      return true
    })
  }, [activeTab, statusFilter, search])

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

              {/* Shared filter bar */}
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
                    <SelectItem value="Placed">Placed</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* All tab views share the same table */}
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
                                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                                  No orders found
                                </TableCell>
                              </TableRow>
                            ) : (
                              filteredOrders.map((order) => (
                                <TableRow key={order.id}>
                                  <TableCell className="font-medium">{order.patient}</TableCell>
                                  <TableCell>
                                    <Badge className={typeBadgeClass[order.type]}>{order.type}</Badge>
                                  </TableCell>
                                  <TableCell>{order.item}</TableCell>
                                  <TableCell className="text-muted-foreground">{order.orderedBy}</TableCell>
                                  <TableCell>
                                    <Badge className={priorityBadgeClass[order.priority]}>{order.priority}</Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge className={statusBadgeClass[order.status]}>{order.status}</Badge>
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">{order.date}</TableCell>
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

            {/* Order Sets */}
            <OrderSetSection />
          </div>
        </div>
        <PlaceOrderDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
