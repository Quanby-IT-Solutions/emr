"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, UserCheck, ArrowRight, XCircle, UserX, MoreVertical, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Appointment } from "./dummy"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"

interface AppointmentListProps {
  appointments: Appointment[]
  onViewDetails: (appointment: Appointment) => void
  onCheckIn: (appointment: Appointment) => void
  onCancel?: (appointmentId: string) => void
  onNoShow?: (appointmentId: string) => void
  onRefer?: (appointmentId: string, department: string) => void
  triageMode?: boolean
}

export function AppointmentList({ 
  appointments, 
  onViewDetails, 
  onCheckIn, 
  onCancel,
  onNoShow,
  onRefer,
  triageMode = false 
}: AppointmentListProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [noShowDialogOpen, setNoShowDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Calculate pagination
  const totalPages = Math.ceil(appointments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentAppointments = appointments.slice(startIndex, endIndex)

  // Reset to page 1 when appointments change
  const resetPagination = () => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      SCHEDULED: { variant: "outline", label: "Scheduled" },
      ARRIVED: { variant: "secondary", label: "Arrived" },
      CHECKED_IN: { variant: "default", label: "Checked In" },
      CANCELLED: { variant: "destructive", label: "Cancelled" },
      NO_SHOW: { variant: "destructive", label: "No Show" },
      IN_TRIAGE: { variant: "outline", label: "In Triage" },
      REFERRED: { variant: "secondary", label: "Referred" }
    }
    const status_info = variants[status] || variants.SCHEDULED
    return <Badge variant={status_info.variant}>{status_info.label}</Badge>
  }

  const getVisitTypeBadge = (type: string) => {
    return type === "NEW" 
      ? <Badge variant="default">New</Badge>
      : <Badge variant="secondary">Follow-up</Badge>
  }

  const handleRefer = (appointmentId: string, department: string) => {
    if (onRefer) {
      onRefer(appointmentId, department)
    }
  }

  const handleCancelClick = (appointmentId: string) => {
    setSelectedAppointment(appointmentId)
    setCancelDialogOpen(true)
  }

  const handleNoShowClick = (appointmentId: string) => {
    setSelectedAppointment(appointmentId)
    setNoShowDialogOpen(true)
  }

  const confirmCancel = () => {
    if (selectedAppointment && onCancel) {
      onCancel(selectedAppointment)
    }
    setCancelDialogOpen(false)
    setSelectedAppointment(null)
  }

  const confirmNoShow = () => {
    if (selectedAppointment && onNoShow) {
      onNoShow(selectedAppointment)
    }
    setNoShowDialogOpen(false)
    setSelectedAppointment(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Today's Appointments</CardTitle>
              <CardDescription>
                Showing {startIndex + 1}-{Math.min(endIndex, appointments.length)} of {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value))
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Age/Sex</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Physician</TableHead>
                  <TableHead>Visit Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentAppointments.length > 0 ? (
                  currentAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">{appointment.patientId}</TableCell>
                      <TableCell>{appointment.patientName}</TableCell>
                      <TableCell>{appointment.age} / {appointment.gender === "MALE" ? "M" : "F"}</TableCell>
                      <TableCell>{appointment.appointmentTime}</TableCell>
                      <TableCell>{appointment.department}</TableCell>
                      <TableCell>Dr. {appointment.physician}</TableCell>
                      <TableCell>{getVisitTypeBadge(appointment.visitType)}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            {/* View Details - Always Available */}
                            <DropdownMenuItem onClick={() => onViewDetails(appointment)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>

                            {/* Check In - Only for Scheduled/Arrived */}
                            {(appointment.status === "SCHEDULED" || appointment.status === "ARRIVED") && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => onCheckIn(appointment)}
                                  className="text-green-600 focus:text-green-600"
                                >
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Check In Patient
                                </DropdownMenuItem>
                              </>
                            )}

                            {/* Refer - Only for Checked In */}
                            {appointment.status === "CHECKED_IN" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger>
                                    <ArrowRight className="mr-2 h-4 w-4" />
                                    Refer to Department
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuSubContent>
                                    <DropdownMenuItem onClick={() => handleRefer(appointment.id, "EMERGENCY")}>
                                      Emergency
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRefer(appointment.id, "GENERAL")}>
                                      General Medicine
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRefer(appointment.id, "PEDIATRICS")}>
                                      Pediatrics
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRefer(appointment.id, "CARDIOLOGY")}>
                                      Cardiology
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRefer(appointment.id, "ORTHOPEDICS")}>
                                      Orthopedics
                                    </DropdownMenuItem>
                                  </DropdownMenuSubContent>
                                </DropdownMenuSub>
                              </>
                            )}

                            {/* Cancel & No-Show - Only for Scheduled/Arrived */}
                            {(appointment.status === "SCHEDULED" || appointment.status === "ARRIVED") && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleNoShowClick(appointment.id)}
                                  className="text-orange-600 focus:text-orange-600"
                                >
                                  <UserX className="mr-2 h-4 w-4" />
                                  Mark as No-Show
                                </DropdownMenuItem>
                              </>
                            )}

                            {appointment.status === "SCHEDULED" && (
                              <DropdownMenuItem 
                                onClick={() => handleCancelClick(appointment.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel Appointment
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      No appointments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {appointments.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first page, last page, current page, and pages around current
                      return (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                      )
                    })
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-muted-foreground">...</span>
                        )}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="min-w-[40px]"
                        >
                          {page}
                        </Button>
                      </div>
                    ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancel Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Cancel Appointment
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
              The patient will need to reschedule if they wish to visit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep Appointment</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancel}
              className="bg-red-600 hover:bg-red-700"
            >
              Yes, Cancel Appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* No-Show Dialog */}
      <AlertDialog open={noShowDialogOpen} onOpenChange={setNoShowDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <UserX className="h-5 w-5 text-orange-600" />
              Mark as No-Show
            </AlertDialogTitle>
            <AlertDialogDescription>
              Mark this appointment as "No-Show"? This indicates the patient did not arrive
              at their scheduled time. This may affect future appointment privileges.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmNoShow}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Yes, Mark as No-Show
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}