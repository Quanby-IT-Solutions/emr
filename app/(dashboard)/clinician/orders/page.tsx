"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CreateOrderModal } from "./components/create"

const dummyOrders = [
  {
    id: 1,
    patient: "John Doe (MRN-001)",
    type: "Medication",
    item: "Aspirin 81mg",
    status: "Pending",
    date: "2025-11-07",
    priority: "Routine"
  },
  {
    id: 2,
    patient: "Jane Smith (MRN-002)",
    type: "Laboratory",
    item: "CBC",
    status: "Completed",
    date: "2025-11-06",
    priority: "Urgent"
  },
  {
    id: 3,
    patient: "Bob Johnson (MRN-003)",
    type: "Imaging",
    item: "Chest X-Ray",
    status: "In Progress",
    date: "2025-11-05",
    priority: "STAT"
  }
]

export default function OrdersPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <ProtectedRoute requiredRole={UserRole.CLINICIAN}>
      <DashboardLayout role={UserRole.CLINICIAN}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex items-center justify-between px-4 lg:px-6">
            <div>
              <h1 className="text-2xl font-bold">Orders</h1>
              <p className="text-muted-foreground">
                View and manage patient orders
              </p>
            </div>
            <Button onClick={() => setModalOpen(true)}>Create Order</Button>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1">
                    <Input placeholder="Search orders..." />
                  </div>
                  <Select>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dummyOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.patient}</TableCell>
                        <TableCell><Badge variant="secondary">{order.type}</Badge></TableCell>
                        <TableCell>{order.item}</TableCell>
                        <TableCell><Badge variant="outline">{order.priority}</Badge></TableCell>
                        <TableCell><Badge variant="default">{order.status}</Badge></TableCell>
                        <TableCell>{order.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
        <CreateOrderModal open={modalOpen} onOpenChange={setModalOpen} />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
