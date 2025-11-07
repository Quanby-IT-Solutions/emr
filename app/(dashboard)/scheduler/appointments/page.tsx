"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useMemo, useCallback } from "react"
import { dummyAppointments, AppointmentEntry } from "@/app/(dashboard)/scheduler/dummy-data/dummy-appointments"
import { AppointmentsFilters } from "./components/appointment-filters"
import { AppointmentsTable } from "./components/appointments-table"
import { CancelBookingModal } from "./components/cancel-booking-modal"
import { EditBookingModal } from "./components/edit-booking-modal"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Calendar, CalendarFold, CircleCheckBig, CircleX, Clock, RefreshCcw} from "lucide-react"
import { startOfToday } from "date-fns"

export default function AppointmentsPage() {
  // State for appointments
  const [appointments, setAppointments] = useState<AppointmentEntry[]>(dummyAppointments)
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedVisitType, setSelectedVisitType] = useState("all")

  // State for modals
  const [openEdit, setOpenEdit] = useState(false)
  const [openCancel, setOpenCancel] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentEntry | null>(null)

  // Statistics
  const totalAppointments = appointments.length
  const totalAppointmentsToday = appointments.filter(apt => apt.appointmentDate === startOfToday().toLocaleDateString()).length
  const totalPending = appointments.filter(apt => apt.bookingStatus === "Pending" && apt.appointmentDate === startOfToday().toLocaleDateString()).length
  const totalConfirmed = appointments.filter(apt => apt.bookingStatus === "Confirmed" && apt.appointmentDate === startOfToday().toLocaleDateString()).length
  const totalCancelled = appointments.filter(apt => apt.bookingStatus === "Cancelled" && apt.appointmentDate === startOfToday().toLocaleDateString()).length

  // Get unique departments for filter
  const departments = useMemo(() => {
    return Array.from(new Set(appointments.map((apt) => apt.department)))
  }, [appointments])

  // Filtered appointments based on search and filters
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Search filter (patient name or patient ID)
      const matchesSearch =
        searchQuery === "" ||
        apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.patientId.toLowerCase().includes(searchQuery.toLowerCase())

      // Department filter
      const matchesDepartment =
        selectedDepartment === "all" || apt.department === selectedDepartment

      // Status filter
      const matchesStatus =
        selectedStatus === "all" || apt.bookingStatus === selectedStatus

      // Visit type filter
      const matchesVisitType =
        selectedVisitType === "all" || apt.visitType === selectedVisitType

      // Date filter
      const matchesDate = 
        !selectedDate || new Date(apt.appointmentDate).toDateString() === selectedDate.toDateString()

      return matchesSearch && matchesDepartment && matchesStatus && matchesDate && matchesVisitType
    })
  }, [appointments, searchQuery, selectedDepartment, selectedStatus, selectedDate, selectedVisitType])

  // Handler for editing appointment
  const handleEditBooking = useCallback((appointment: AppointmentEntry) => {
    setSelectedAppointment(appointment)
    setOpenEdit(true)
  }, [])

  // Handler for confirming appointment
  const handleConfirmBooking = useCallback((appointment: AppointmentEntry) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.patientId === appointment.patientId &&
        apt.appointmentDate === appointment.appointmentDate &&
        apt.appointmentTime === appointment.appointmentTime
          ? { ...apt, bookingStatus: "Confirmed" }
          : apt
      )
    )

    toast.success('Appointment confirmed!', {
      description: `${appointment.patientName}'s appointment has been confirmed.`,
      style: {
        background: '#0891b2',
        color: 'white',
        border: 'none',
      },
      duration: 3000,
    })
  }, [])

  // Handler for canceling appointment
  const handleCancelBooking = useCallback((appointment: AppointmentEntry) => {
    setSelectedAppointment(appointment)
    setOpenCancel(true)
  }, [])

  // Confirm cancel from modal
  const handleConfirmCancel = useCallback((appointment: AppointmentEntry) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.patientId === appointment.patientId &&
        apt.appointmentDate === appointment.appointmentDate &&
        apt.appointmentTime === appointment.appointmentTime
          ? { ...apt, bookingStatus: "Cancelled" }
          : apt
      )
    )
    
    toast.error('Appointment cancelled', {
      description: `${appointment.patientName}'s appointment has been cancelled.`,
      style: {
        background: '#ef4444',
        color: 'white',
        border: 'none',
      },
      duration: 3000,
    })
  }, [])

  // Confirm update from modal
  const handleConfirmUpdate = useCallback((updatedAppointment: AppointmentEntry) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.patientId === selectedAppointment?.patientId &&
        apt.appointmentDate === selectedAppointment?.appointmentDate &&
        apt.appointmentTime === selectedAppointment?.appointmentTime
          ? updatedAppointment
          : apt
      )
    )

    toast.success('Appointment updated!', {
      description: `${updatedAppointment.patientName}'s appointment has been updated.`,
      style: {
        background: '#10b981',
        color: 'white',
        border: 'none',
      },
      className: 'custom-toast',
      duration: 2000,
    })
  }, [selectedAppointment])

  return (
    <ProtectedRoute requiredRole={UserRole.SCHEDULER}>
      <DashboardLayout role={UserRole.SCHEDULER}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Page Header */}
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Appointments</h1>
            <p className="text-muted-foreground">
              View and manage all appointments
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="px-4 lg:px-6">
            <div className="grid gap-4 md:grid-cols-5">
              {/* Total Appointments */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Scheduled
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAppointments}</div>
                  <p className="text-xs text-muted-foreground">
                    Total appointments scheduled
                  </p>
                </CardContent>
              </Card>

              {/* Total Appointments for Today */}
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-900">
                    Scheduled
                  </CardTitle>
                  <CalendarFold className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold  text-purple-600">{totalAppointmentsToday}</div>
                  <p className="text-xs  text-purple-700">
                    Appointments today
                  </p>
                </CardContent>
              </Card>

              {/* Total Pending */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-900">
                    Pending
                  </CardTitle>
                  <Clock className="h-4 w-4  text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold  text-blue-600">{totalPending}</div>
                  <p className="text-xs  text-blue-700">
                    Appointments today
                  </p>
                </CardContent>
              </Card>

              {/* Total Confirmed */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-800">
                    Confirmed
                  </CardTitle>
                  <CircleCheckBig className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{totalConfirmed}</div>
                  <p className="text-xs text-green-700">
                    Appointments today
                  </p>
                </CardContent>
              </Card>

              {/* Total Cancelled */}
              <Card className="border-red-200 bg-red-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-900">
                    Cancelled
                  </CardTitle>
                  <CircleX className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{totalCancelled}</div>
                  <p className="text-xs text-red-700">
                    Appointments today
                  </p>
                </CardContent>
              </Card>
              
            </div>
          </div>

          {/* Filters Section */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader className="grid md:grid-cols-6">
                <div className="md:col-span-5">
                  <CardTitle className="mb-1">Appointment Filters</CardTitle>
                  <CardDescription>Search by Patient Name or ID, Department, Appointment Date or Status</CardDescription>
                </div>
                {/* Clear Filters Button */}
                { searchQuery || selectedDepartment !== "all" || selectedStatus !== "all" || selectedVisitType !== "all" ||selectedDate ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary bg-white text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedDepartment("all")
                      setSelectedStatus("all")
                      setSelectedDate(null)
                      setSelectedVisitType("all")
                    }}
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                ) : (
                  <Button
                    disabled
                    variant="outline"
                    size="sm"
                    className="border-primary bg-white text-primary hover:bg-primary hover:text-primary-foreground"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedDepartment("all")
                      setSelectedStatus("all")
                      setSelectedDate(null)
                      setSelectedVisitType("all")
                    }}
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
                
              </CardHeader>
              <CardContent>
                <AppointmentsFilters
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedDepartment={selectedDepartment}
                  onDepartmentChange={setSelectedDepartment}
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
                  selectedVisitType={selectedVisitType}
                  onVisitTypeChange={setSelectedVisitType}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  
                  departments={departments}
                />
              </CardContent>
            </Card>
          </div>

          {/* Appointments Table */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Appointments ({filteredAppointments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AppointmentsTable
                  data={filteredAppointments}
                  onEdit={handleEditBooking}
                  onConfirm={handleConfirmBooking}
                  onCancel={handleCancelBooking}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Booking Modal */}
        {selectedAppointment && (
          <EditBookingModal
            // key={`${selectedAppointment.patientId}-${selectedAppointment.appointmentDate}-${selectedAppointment.appointmentTime}`}
            selectedAppointment={selectedAppointment}
            open={openEdit}
            onOpenChange={setOpenEdit}
            onConfirmUpdate={handleConfirmUpdate}
          />
        )}

        {/* Cancel Booking Modal */}
        {selectedAppointment && (
          <CancelBookingModal
            selectedAppointment={selectedAppointment}
            open={openCancel}
            onOpenChange={setOpenCancel}
            onConfirmCancel={handleConfirmCancel}
          />
        )}
      </DashboardLayout>
    </ProtectedRoute>
  )
}