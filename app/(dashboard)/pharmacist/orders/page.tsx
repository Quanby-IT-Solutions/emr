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
import { IconCheck, IconX, IconClock, IconShieldCheck, IconPackage } from "@tabler/icons-react"
import { ApproveModal } from "./components/approve-modal"
import { FlagModal } from "./components/flag-modal"

interface Order {
  id: number
  patient: string
  medication: string
  prescriber: string
  status: string
  orderDate?: string
  dosage?: string
  frequency?: string
  quantity?: string
  verifiedBy?: string
  verifiedDate?: string
  approvedBy?: string
  approvedDate?: string
}

const mockOrders: Order[] = [
  { 
    id: 1, 
    patient: "John Doe", 
    medication: "Atorvastatin 40mg", 
    prescriber: "Dr. Smith", 
    status: "Pending",
    orderDate: "2024-11-26",
    dosage: "40mg",
    frequency: "Once daily",
    quantity: "30 tablets"
  },
  { 
    id: 2, 
    patient: "Jane Smith", 
    medication: "Amlodipine 5mg", 
    prescriber: "Dr. Johnson", 
    status: "Pending",
    orderDate: "2024-11-26",
    dosage: "5mg",
    frequency: "Once daily",
    quantity: "30 tablets"
  },
  { 
    id: 3, 
    patient: "Bob Wilson", 
    medication: "Warfarin 5mg", 
    prescriber: "Dr. Smith", 
    status: "Flagged",
    orderDate: "2024-11-25",
    dosage: "5mg",
    frequency: "Once daily",
    quantity: "30 tablets"
  },
  { 
    id: 4, 
    patient: "Alice Brown", 
    medication: "Metformin 500mg", 
    prescriber: "Dr. Davis", 
    status: "Approved",
    orderDate: "2024-11-25",
    dosage: "500mg",
    frequency: "Twice daily",
    quantity: "60 tablets",
    verifiedBy: "Pharmacist B",
    verifiedDate: "2024-11-26",
    approvedBy: "Chief Pharmacist",
    approvedDate: "2024-11-26"
  },
  { 
    id: 5, 
    patient: "Charlie Davis", 
    medication: "Lisinopril 10mg", 
    prescriber: "Dr. Wilson", 
    status: "Approved",
    orderDate: "2024-11-24",
    dosage: "10mg",
    frequency: "Once daily",
    quantity: "30 tablets",
    verifiedBy: "Pharmacist A",
    verifiedDate: "2024-11-25",
    approvedBy: "Chief Pharmacist",
    approvedDate: "2024-11-25"
  }
]

export default function PharmacyOrdersPage() {
  const [approveOpen, setApproveOpen] = useState(false)
  const [flagOpen, setFlagOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      id: "pending",
      title: "Pending Orders",
      description: "Review new orders",
      icon: IconClock
    },
    {
      id: "approved",
      title: "Approved Orders",
      description: "Processed orders",
      icon: IconPackage
    }
  ]

  function openApprove(order: Order) {
    setSelectedOrder(order)
    setApproveOpen(true)
  }

  function openFlag(order: Order) {
    setSelectedOrder(order)
    setFlagOpen(true)
  }

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.prescriber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingOrders = filteredOrders.filter(order => order.status === "Pending" || order.status === "Flagged")
  const approvedOrders = filteredOrders.filter(order => order.status === "Approved")

  const renderOrdersTable = (orders: Order[], showActions = false) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Medication</TableHead>
          <TableHead>Prescriber</TableHead>
          <TableHead>Dosage</TableHead>
          <TableHead>Frequency</TableHead>
          <TableHead>Status</TableHead>
          {showActions && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.patient}</TableCell>
            <TableCell>{order.medication}</TableCell>
            <TableCell>{order.prescriber}</TableCell>
            <TableCell>{order.dosage}</TableCell>
            <TableCell>{order.frequency}</TableCell>
            <TableCell>
              <Badge 
                variant={
                  order.status === "Approved" ? "default" :
                  order.status === "Flagged" ? "destructive" :
                  order.status === "Verification" ? "secondary" :
                  "outline"
                }
              >
                {order.status}
              </Badge>
            </TableCell>
            {showActions && (
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
                {order.status === "Flagged" && (
                  <div className="flex gap-2 justify-end">
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => openApprove(order)}
                          aria-label="Resolve and approve"
                        >
                          <IconCheck className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={4}>Resolve & Approve</TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <ProtectedRoute requiredRole={UserRole.PHARMACIST}>
      <DashboardLayout role={UserRole.PHARMACIST}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Medication Order Management</h1>
            <p className="text-muted-foreground">
              Complete workflow for medication order processing
            </p>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1">
                    <Input 
                      placeholder="Search orders..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
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

{/* Stepper Navigation */}
                <Card className="bg-card/80 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      {steps.map((step, index) => {
                        const StepIcon = step.icon;
                        const isActive = currentStep === index;
                        const isCompleted = currentStep > index;
                        
                        return (
                          <div key={step.id} className="flex items-center">
                            <div className="flex flex-col items-center">
                              <Button
                                variant={isActive ? "default" : isCompleted ? "secondary" : "outline"}
                                className={`w-12 h-12 rounded-full p-0 ${
                                  isActive ? "bg-primary hover:bg-primary/90 text-primary-foreground" : 
                                  isCompleted ? "bg-primary/20 text-primary border-primary" : 
                                  "border-border text-muted-foreground hover:bg-accent"
                                }`}
                                onClick={() => setCurrentStep(index)}
                              >
                                <StepIcon className="w-5 h-5" />
                              </Button>
                              <div className="mt-3 text-center max-w-[120px]">
                                <p className={`text-sm font-medium ${
                                  isActive ? "text-primary" : 
                                  isCompleted ? "text-primary" : 
                                  "text-muted-foreground"
                                }`}>
                                  {step.title}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
                              </div>
                            </div>
                            {index < steps.length - 1 && (
                              <div className={`flex-1 h-0.5 mx-6 ${
                                isCompleted ? "bg-primary" : "bg-border"
                              }`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Step Content */}
                <div className="mt-6">
                  {currentStep === 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <IconClock className="h-5 w-5" />
                          Pending & Flagged Orders ({pendingOrders.length})
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Review new medication orders and resolve flagged items
                        </p>
                      </CardHeader>
                      <CardContent>
                        {pendingOrders.length > 0 ? (
                          renderOrdersTable(pendingOrders, true)
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            No pending orders found
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  
                  {currentStep === 1 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <IconPackage className="h-5 w-5" />
                          Approved Orders ({approvedOrders.length})
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Successfully processed and approved medication orders
                        </p>
                      </CardHeader>
                      <CardContent>
                        {approvedOrders.length > 0 ? (
                          <div className="space-y-4">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Patient</TableHead>
                                  <TableHead>Medication</TableHead>
                                  <TableHead>Prescriber</TableHead>
                                  <TableHead>Dosage</TableHead>
                                  <TableHead>Verified By</TableHead>
                                  <TableHead>Approved By</TableHead>
                                  <TableHead>Status</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {approvedOrders.map((order) => (
                                  <TableRow key={order.id}>
                                    <TableCell className="font-medium">{order.patient}</TableCell>
                                    <TableCell>{order.medication}</TableCell>
                                    <TableCell>{order.prescriber}</TableCell>
                                    <TableCell>{order.dosage}</TableCell>
                                    <TableCell>{order.verifiedBy || "-"}</TableCell>
                                    <TableCell>{order.approvedBy || "-"}</TableCell>
                                    <TableCell>
                                      <Badge variant="default">{order.status}</Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            <div className="mt-4 p-4 bg-green-50 rounded-lg border">
                              <h4 className="font-semibold mb-2">Approved Order Actions</h4>
                              <p className="text-sm text-muted-foreground">
                                Approved orders are ready for dispensing. Ensure all medications are properly labeled and patient counseling is completed.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            No approved orders found
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
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
