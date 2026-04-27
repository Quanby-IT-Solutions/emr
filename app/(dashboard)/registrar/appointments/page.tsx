"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState, useMemo } from "react"
import { SearchPatient } from "./components/searchPatient"
import { AppointmentList } from "./components/appointmentList"
import { PatientModal } from "./components/patientModal"
import { ScheduleModal } from "./components/schedule"
import { WalkInModal, WalkInData } from "./components/walkin"
import { TriageWizard } from "./components/triageWizard"
import { PatientProvider, usePatientContext } from "./context/PatientContext"
import { type Appointment, type AppointmentStatus } from "./components/dummy"
import {
  Calendar,
  UserCheck,
  Clock,
  XCircle,
  UserPlus,
  CalendarDays,
  AlertCircle,
  ArrowRight
} from "lucide-react"
import { NoShowModal } from "./components/noShowModal"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { appointmentsClient, type ApiAppointment, type WalkInBody } from "@/lib/api/appointments-client"
import { toast } from "sonner"

function calcAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return Math.max(0, age)
}

function mapStatus(status: string): AppointmentStatus {
  if (status === "CHECKED_IN") return "CHECKED_IN"
  if (status === "CANCELLED") return "CANCELLED"
  if (status === "NO_SHOW") return "NO_SHOW"
  if (status === "CONFIRMED") return "ARRIVED"
  if (status === "COMPLETED") return "CHECKED_IN"
  return "SCHEDULED"
}

function toAppointment(api: ApiAppointment): Appointment {
  const start = new Date(api.startTime)
  return {
    id: api.id,
    patientId: api.patient.mrn,
    patientName: `${api.patient.lastName}, ${api.patient.firstName}`,
    age: calcAge(api.patient.dateOfBirth),
    gender: (api.patient.gender?.toUpperCase() === "FEMALE" ? "FEMALE" : "MALE") as "MALE" | "FEMALE",
    appointmentDate: start.toISOString().split("T")[0],
    appointmentTime: start.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    department: api.appointmentType || "GENERAL",
    physician: api.provider.lastName,
    reasonForVisit: api.appointmentType || "",
    status: mapStatus(api.status),
    visitType: "NEW",
  }
}

function CheckInPageContent() {
  const queryClient = useQueryClient()
  const { state } = usePatientContext()
  const [triageMode, setTriageMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [isWalkInOpen, setIsWalkInOpen] = useState(false)
  const [isTriageOpen, setIsTriageOpen] = useState(false)
  const [isNoShowOpen, setIsNoShowOpen] = useState(false)
  const [selectedNoShow, setSelectedNoShow] = useState<Appointment | null>(null)
  const [currentPatientId, setCurrentPatientId] = useState<string>("")

  const { data: apiAppointments = [], isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => appointmentsClient.list(),
  })

  const appointments = useMemo(() => apiAppointments.map(toAppointment), [apiAppointments])

  const checkInMutation = useMutation({
    mutationFn: (id: string) => appointmentsClient.checkIn(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      const appt = appointments.find((a) => a.id === id)
      if (triageMode && appt) {
        setCurrentPatientId(appt.patientId)
        setIsTriageOpen(true)
      }
      toast.success("Patient checked in")
    },
    onError: (err: Error) => toast.error(`Check-in failed: ${err.message}`),
  })

  const noShowMutation = useMutation({
    mutationFn: (id: string) => appointmentsClient.noShow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      setIsNoShowOpen(false)
      setSelectedNoShow(null)
    },
    onError: (err: Error) => toast.error(`No-show failed: ${err.message}`),
  })

  const walkInMutation = useMutation({
    mutationFn: (body: WalkInBody) => appointmentsClient.createWalkIn(body),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      setIsWalkInOpen(false)
      if (triageMode) {
        const patientMrn = result.appointment.patient.mrn
        setCurrentPatientId(patientMrn)
        setIsTriageOpen(true)
      }
      toast.success("Walk-in registered")
    },
    onError: (err: Error) => toast.error(`Walk-in failed: ${err.message}`),
  })

  const filteredAppointments = useMemo(
    () =>
      appointments.filter((apt) => {
        const matchesSearch =
          apt.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          apt.id.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesDepartment = departmentFilter === "all" || apt.department === departmentFilter
        const matchesStatus = statusFilter === "all" || apt.status === statusFilter
        return matchesSearch && matchesDepartment && matchesStatus
      }),
    [appointments, searchQuery, departmentFilter, statusFilter]
  )

  const totalScheduled = appointments.filter((a) => a.status === "SCHEDULED").length
  const totalCheckedIn = appointments.filter((a) => a.status === "CHECKED_IN").length
  const totalArrived = appointments.filter((a) => a.status === "ARRIVED").length
  const totalCancelled = appointments.filter((a) => a.status === "CANCELLED" || a.status === "NO_SHOW").length
  const totalInTriage = state.patients.filter((p) => p.status === "InTriage").length
  const totalReferred = state.patients.filter((p) => p.status === "Referred").length

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsModalOpen(true)
  }

  const handleCheckIn = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsModalOpen(true)
  }

  const handleConfirmCheckIn = (_notes: string, _paymentType: string) => {
    if (selectedAppointment) {
      checkInMutation.mutate(selectedAppointment.id)
      setIsModalOpen(false)
      setSelectedAppointment(null)
    }
  }

  const handleNoShow = (appointmentId: string) => {
    setSelectedNoShow(appointments.find((apt) => apt.id === appointmentId) || null)
    setIsNoShowOpen(true)
  }

  const handleConfirmNoShow = () => {
    if (selectedNoShow) {
      noShowMutation.mutate(selectedNoShow.id)
    }
  }

  const handleWalkInSubmit = (data: WalkInData) => {
    const body: WalkInBody = {
      patientId: data.patientId,
      firstName: data.patientId ? undefined : data.firstName,
      lastName: data.patientId ? undefined : data.lastName,
      gender: data.gender,
      contactPhone: data.contactNumber || undefined,
      providerName: data.physician || undefined,
      appointmentType: data.department || undefined,
    }
    walkInMutation.mutate(body)
  }

  const handleTriageComplete = () => {
    setIsTriageOpen(false)
    setCurrentPatientId("")
  }

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["appointments"] })
  }

  return (
    <ProtectedRoute requiredRole={UserRole.REGISTRAR}>
      <DashboardLayout role={UserRole.REGISTRAR}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header */}
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Patient Check-In</h1>
                <p className="text-muted-foreground">
                  Manage patient arrivals and appointments
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-3 bg-white border rounded-lg p-3 shadow-sm">
                  <Switch
                    id="er-mode"
                    checked={triageMode}
                    onCheckedChange={setTriageMode}
                    className="data-[state=checked]:bg-red-600"
                  />
                  <Label htmlFor="er-mode" className="cursor-pointer font-semibold flex items-center gap-2">
                    <AlertCircle className={`h-4 w-4 ${triageMode ? 'text-red-600' : 'text-muted-foreground'}`} />
                    {triageMode ? (
                      <span className="text-red-600">Triage Mode Active</span>
                    ) : (
                      <span>Triage Mode</span>
                    )}
                  </Label>
                </div>

                <Button variant="outline" onClick={() => setIsScheduleOpen(true)}>
                  <CalendarDays className="mr-2 h-4 w-4" />
                  View Schedule
                </Button>
                <Button onClick={() => setIsWalkInOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Walk-In
                </Button>
              </div>
            </div>

            {triageMode && (
              <div className="mt-4 p-4 bg-red-50 border-2 border-orange-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-orange-600 animate-pulse" />
                  <div>
                    <p className="font-bold text-orange-900">Triage Mode Enabled</p>
                    <p className="text-sm text-orange-700">All check-ins will include triage workflow</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Statistics Cards */}
          <div className="px-4 lg:px-6">
            <div className="grid gap-4 md:grid-cols-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Scheduled</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoading ? "..." : totalScheduled}</div>
                  <p className="text-xs text-muted-foreground">Appointments today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Arrived</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoading ? "..." : totalArrived}</div>
                  <p className="text-xs text-muted-foreground">Waiting to check in</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Checked In</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoading ? "..." : totalCheckedIn}</div>
                  <p className="text-xs text-muted-foreground">Ready for consultation</p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-900">In Triage</CardTitle>
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">{totalInTriage}</div>
                  <p className="text-xs text-blue-700">Being assessed</p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-900">Referred</CardTitle>
                  <ArrowRight className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">{totalReferred}</div>
                  <p className="text-xs text-green-700">To departments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoading ? "..." : totalCancelled}</div>
                  <p className="text-xs text-muted-foreground">No shows today</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Search Section */}
          <div className="px-4 lg:px-6">
            <SearchPatient
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              departmentFilter={departmentFilter}
              setDepartmentFilter={setDepartmentFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onRefresh={handleRefresh}
            />
          </div>

          {/* Appointments List */}
          <div className="px-4 lg:px-6">
            <AppointmentList
              appointments={filteredAppointments}
              onViewDetails={handleViewDetails}
              onCheckIn={handleCheckIn}
              onNoShow={handleNoShow}
              triageMode={triageMode}
            />
          </div>
        </div>

        {/* Modals */}
        <PatientModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          appointment={selectedAppointment}
          onConfirmCheckIn={handleConfirmCheckIn}
        />

        <ScheduleModal
          open={isScheduleOpen}
          onOpenChange={setIsScheduleOpen}
          appointments={appointments}
        />

        <WalkInModal
          open={isWalkInOpen}
          onOpenChange={setIsWalkInOpen}
          onSubmit={handleWalkInSubmit}
        />

        <TriageWizard
          open={isTriageOpen}
          onOpenChange={setIsTriageOpen}
          patientId={currentPatientId}
          onComplete={handleTriageComplete}
        />

        <NoShowModal
          open={isNoShowOpen}
          onOpenChange={setIsNoShowOpen}
          appointment={selectedNoShow}
          onConfirmNoShow={handleConfirmNoShow}
        />
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default function CheckInPage() {
  return (
    <PatientProvider>
      <CheckInPageContent />
    </PatientProvider>
  )
}
