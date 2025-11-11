"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { IconLoader, IconCheck } from "@tabler/icons-react"
import { InProgressModal } from "./components/in-progress"
import { CompleteModal } from "./components/complete"

interface Order {
  id: number
  patient: string
  type: string
  item: string
  status: string
  date: string
  priority: string
}

const dummyOrders: Order[] = [
  { id: 1, patient: "John Doe (MRN-001)", type: "Laboratory", item: "CBC", status: "Pending", date: "2025-11-07", priority: "Routine" },
  { id: 2, patient: "Jane Smith (MRN-002)", type: "Laboratory", item: "BMP", status: "In Progress", date: "2025-11-06", priority: "Urgent" },
  { id: 3, patient: "Bob Johnson (MRN-003)", type: "Laboratory", item: "Blood Culture", status: "Completed", date: "2025-11-05", priority: "STAT" }
]

export default function QueuePage() {
  const [inProgressOpen, setInProgressOpen] = useState(false)
  const [completeOpen, setCompleteOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(undefined)

  function openInProgress(order: Order) {
    setSelectedOrder(order)
    setInProgressOpen(true)
  }

  function openComplete(order: Order) {
    setSelectedOrder(order)
    setCompleteOpen(true)
  }

  return (
    <ProtectedRoute requiredRole={UserRole.LAB_TECH}>
      <DashboardLayout role={UserRole.LAB_TECH}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Order Queue</h1>
            <p className="text-muted-foreground">View pending lab orders</p>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Queue</CardTitle>
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
                      {/* <TableHead>Type</TableHead> */}
                      <TableHead>Item</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dummyOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.patient}</TableCell>
                        {/* <TableCell><Badge variant="secondary">{order.type}</Badge></TableCell> */}
                        <TableCell>{order.item}</TableCell>
                        <TableCell><Badge variant="outline">{order.priority}</Badge></TableCell>
                        <TableCell><Badge variant="default">{order.status}</Badge></TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell className="text-right">
                          {order.status === "Pending" && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="border-2"
                                  onClick={() => openInProgress(order)}
                                  aria-label="Mark in progress"
                                >
                                  <IconLoader className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent sideOffset={4}>Mark In Progress</TooltipContent>
                            </Tooltip>
                          )}

                          {order.status === "In Progress" && (
                            <Tooltip>
                              <TooltipTrigger>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="border-2"
                                  onClick={() => openComplete(order)}
                                  aria-label="Mark complete"
                                >
                                  <IconCheck className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent sideOffset={4}>Mark Test Complete</TooltipContent>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        <InProgressModal open={inProgressOpen} onOpenChange={setInProgressOpen} order={selectedOrder} />
        <CompleteModal open={completeOpen} onOpenChange={setCompleteOpen} order={selectedOrder} />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
