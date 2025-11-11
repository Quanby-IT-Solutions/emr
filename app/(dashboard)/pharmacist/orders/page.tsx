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
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { IconCheck, IconX } from "@tabler/icons-react"
import { ApproveModal } from "./components/approve-modal"
import { FlagModal } from "./components/flag-modal"

interface Order {
  id: number
  patient: string
  medication: string
  prescriber: string
  status: string
}

const mockOrders: Order[] = [
  { id: 1, patient: "John Doe", medication: "Atorvastatin 40mg", prescriber: "Dr. Smith", status: "Pending" },
  { id: 2, patient: "Jane Smith", medication: "Amlodipine 5mg", prescriber: "Dr. Johnson", status: "Pending" },
  { id: 3, patient: "Bob Wilson", medication: "Warfarin 5mg", prescriber: "Dr. Smith", status: "Flagged" },
  { id: 4, patient: "Alice Brown", medication: "Metformin 500mg", prescriber: "Dr. Davis", status: "Approved" },
]

export default function PharmacyOrdersPage() {
  const [approveOpen, setApproveOpen] = useState(false)
  const [flagOpen, setFlagOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(undefined)

  function openApprove(order: Order) {
    setSelectedOrder(order)
    setApproveOpen(true)
  }

  function openFlag(order: Order) {
    setSelectedOrder(order)
    setFlagOpen(true)
  }

  return (
    <ProtectedRoute requiredRole={UserRole.PHARMACIST}>
      <DashboardLayout role={UserRole.PHARMACIST}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Medication Orders</h1>
            <p className="text-muted-foreground">
              Review and verify medication orders
            </p>
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
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Medication</TableHead>
                      <TableHead>Prescriber</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.patient}</TableCell>
                        <TableCell>{order.medication}</TableCell>
                        <TableCell>{order.prescriber}</TableCell>
                        <TableCell>
                          <Badge variant="default">{order.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {order.status === "Pending" && (
                            <div className="flex gap-2 justify-end">
                              <Tooltip>
                                <TooltipTrigger>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => openApprove(order)}
                                    aria-label="Approve order"
                                  >
                                    <IconCheck className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent sideOffset={4}>Approve Order</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => openFlag(order)}
                                    aria-label="Flag order"
                                  >
                                    <IconX className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent sideOffset={4}>Flag Order</TooltipContent>
                              </Tooltip>
                            </div>
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

        <ApproveModal open={approveOpen} onOpenChange={setApproveOpen} order={selectedOrder} />
        <FlagModal open={flagOpen} onOpenChange={setFlagOpen} order={selectedOrder} />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
