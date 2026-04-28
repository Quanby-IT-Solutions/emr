"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useMemo } from "react"
import type { AppointmentEntry } from "@/lib/api/appointments-client"
import { AppointmentsFilters } from "./components/appointment-filters"
import { AppointmentsTable } from "./components/appointments-table"
import { CancelBookingModal } from "./components/cancel-booking-modal"
import { EditBookingModal } from "./components/edit-booking-modal"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Calendar, CalendarFold, CircleCheckBig, CircleX, Clock, RefreshCcw, Trash2 } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { appointmentsClient, type ApiAppointment } from "@/lib/api/appointments-client"

function calcAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return Math.max(0, age)
}

function mapStatus(status: string): "Confirmed" | "Pending" | "Cancelled" {
  if (status === "CONFIRMED" || status === "CHECKED_IN" || status === "COMPLETED") return "Confirmed"
  if (status === "CANCELLED" || status === "NO_SHOW") return "Cancelled"
  return "Pending"
}

function toAppointmentEntry(appt: ApiAppointment): AppointmentEntry {
  const start = new Date(appt.startTime)
  return {
    id: appt.id,
    patientId: appt.patient.mrn,
    patientName: `${appt.patient.lastName}, ${appt.patient.firstName}`,
    ageSex: `${calcAge(appt.patient.dateOfBirth)}/${appt.patient.gender?.[0] ?? "-"}`,
    appointmentDate: start.toISOString().split("T")[0],
    appointmentTime: start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    department: appt.appointmentType || "General",
    departmentLocation: "-",
    provider: `${appt.provider.firstName} ${appt.provider.lastName}`,
    officeLocation: "-",
    visitType: "New",
    bookingStatus: mapStatus(appt.status),
  }
}

export default function AppointmentsPage() {
  const queryClient = useQueryClient()

  const { data: apiAppointments = [], isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => appointmentsClient.list(),
  })

  const appointments = useMemo(() => apiAppointments.map(toAppointmentEntry), [apiAppointments])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedVisitType, setSelectedVisitType] = useState("all")
  const [openEdit, setOpenEdit] = useState(false)
  const [openCancel, setOpenCancel] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentEntry | null>(null)

  const today = new Date().toISOString().split("T")[0]

  const cancelMutation = useMutation({
    mutationFn: (appt: AppointmentEntry) => appointmentsClient.cancel(appt.id!),
    onSuccess: (_, appt) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      toast.error("Appointment cancelled", {
        description: `${appt.patientName}'s appointment has been cancelled.`,
        icon: <Trash2 className="mr-2 h-4 w-4" />,
        style: { background: "#ef4444", color: "white", border: "none" },
        duration: 3000,
      })
    },
    onError: () => toast.error("Failed to cancel appointment"),
  })

  const confirmMutation = useMutation({
    mutationFn: (appt: AppointmentEntry) => appointmentsClient.confirm(appt.id!),
    onSuccess: (_, appt) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      toast.success("Appointment confirmed!", {
        description: `${appt.patientName}'s appointment has been confirmed.`,
        style: { background: "#10b981", color: "white", border: "none" },
        duration: 3000,
      })
    },
    onError: () => toast.error("Failed to confirm appointment"),
  })

  const totalAppointments = appointments.length
  const totalAppointmentsToday = appointments.filter((apt) => apt.appointmentDate === today).length
  const totalPending = appointments.filter((apt) => apt.bookingStatus === "Pending" && apt.appointmentDate === today).length
  const totalConfirmed = appointments.filter((apt) => apt.bookingStatus === "Confirmed" && apt.appointmentDate === today).length
  const totalCancelled = appointments.filter((apt) => apt.bookingStatus === "Cancelled" && apt.appointmentDate === today).length

  const departments = useMemo(
    () => Array.from(new Set(appointments.map((apt) => apt.department))),
    [appointments]
  )

  const filteredAppointments = useMemo(
    () =>
      appointments.filter((apt) => {
        const matchesSearch =
          searchQuery === "" ||
          apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.patientId.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesDepartment = selectedDepartment === "all" || apt.department === selectedDepartment
        const matchesStatus = selectedStatus === "all" || apt.bookingStatus === selectedStatus
        const matchesVisitType = selectedVisitType === "all" || apt.visitType === selectedVisitType
        const matchesDate =
          !selectedDate ||
          new Date(apt.appointmentDate).toDateString() === selectedDate.toDateString()
        return matchesSearch && matchesDepartment && matchesStatus && matchesDate && matchesVisitType
      }),
    [appointments, searchQuery, selectedDepartment, selectedStatus, selectedDate, selectedVisitType]
  )

  const handleEditBooking = (appointment: AppointmentEntry) => {
    setSelectedAppointment(appointment)
    setOpenEdit(true)
  }

  const handleConfirmBooking = (appointment: AppointmentEntry) => {
    if (!appointment.id) return
    confirmMutation.mutate(appointment)
  }

  const handleCancelBooking = (appointment: AppointmentEntry) => {
    setSelectedAppointment(appointment)
    setOpenCancel(true)
  }

  const handleConfirmCancel = (appointment: AppointmentEntry) => {
    if (!appointment.id) return
    cancelMutation.mutate(appointment)
  }

  const handleConfirmUpdate = (_updatedAppointment: AppointmentEntry) => {
    setOpenEdit(false)
    queryClient.invalidateQueries({ queryKey: ["appointments"] })
  }

  return (
    <ProtectedRoute requiredRole={UserRole.SCHEDULER}>
      <DashboardLayout role={UserRole.SCHEDULER}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Appointments</h1>
            <p className="text-muted-foreground">View and manage all appointments</p>
          </div>

          <div className="px-4 lg:px-6">
            <div className="grid gap-4 md:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Scheduled</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAppointments}</div>
                  <p className="text-xs text-muted-foreground">Total appointments scheduled</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-900">Scheduled</CardTitle>
                  <CalendarFold className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{totalAppointmentsToday}</div>
                  <p className="text-xs text-purple-700">Appointments today</p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-900">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{totalPending}</div>
                  <p className="text-xs text-blue-700">Appointments today</p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-800">Confirmed</CardTitle>
                  <CircleCheckBig className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{totalConfirmed}</div>
                  <p className="text-xs text-green-700">Appointments today</p>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-red-900">Cancelled</CardTitle>
                  <CircleX className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{totalCancelled}</div>
                  <p className="text-xs text-red-700">Appointments today</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader className="grid md:grid-cols-6">
                <div className="md:col-span-5">
                  <CardTitle className="mb-1">Appointment Filters</CardTitle>
                  <CardDescription>
                    Search by Patient Name or ID, Department, Appointment Date or Status
                  </CardDescription>
                </div>
                {searchQuery ||
                selectedDepartment !== "all" ||
                selectedStatus !== "all" ||
                selectedVisitType !== "all" ||
                selectedDate ? (
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

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Appointments ({isLoading ? "..." : filteredAppointments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Loading appointments...</p>
                ) : (
                  <AppointmentsTable
                    data={filteredAppointments}
                    onEdit={handleEditBooking}
                    onConfirm={handleConfirmBooking}
                    onCancel={handleCancelBooking}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {selectedAppointment && (
          <EditBookingModal
            key={`${selectedAppointment.patientId}-${selectedAppointment.appointmentDate}-${selectedAppointment.appointmentTime}`}
            selectedAppointment={selectedAppointment}
            open={openEdit}
            onOpenChange={setOpenEdit}
            onConfirmUpdate={handleConfirmUpdate}
          />
        )}

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
