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
import { RefreshCcw } from "lucide-react"

export default function AppointmentsPage() {
  // State for appointments
  const [appointments, setAppointments] = useState<AppointmentEntry[]>(dummyAppointments)
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // State for modals
  const [openEdit, setOpenEdit] = useState(false)
  const [openCancel, setOpenCancel] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentEntry | null>(null)

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

      // Date filter
      const matchesDate = 
        !selectedDate || new Date(apt.appointmentDate).toDateString() === selectedDate.toDateString()

      return matchesSearch && matchesDepartment && matchesStatus && matchesDate
    })
  }, [appointments, searchQuery, selectedDepartment, selectedStatus, selectedDate])

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

          {/* Filters Section */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader className="grid md:grid-cols-6">
                <div className="md:col-span-5">
                  <CardTitle className="mb-1">Appointment Filters</CardTitle>
                  <CardDescription>Search by Patient Name or ID, Department, Appointment Date or Status</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary bg-white text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedDepartment("all")
                    setSelectedStatus("all")
                    setSelectedDate(null)
                  }}
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </CardHeader>
              <CardContent>
                <AppointmentsFilters
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedDepartment={selectedDepartment}
                  onDepartmentChange={setSelectedDepartment}
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
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