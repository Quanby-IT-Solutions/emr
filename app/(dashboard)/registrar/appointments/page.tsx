"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { SearchPatient } from "./components/searchPatient"
import { AppointmentList } from "./components/appointmentList"
import { PatientModal } from "./components/patientModal"
import { ScheduleModal } from "./components/schedule"
import { WalkInModal, WalkInData } from "./components/walkin"
import { TriageWizard } from "./components/triageWizard"
import { PatientProvider, usePatientContext } from "./context/PatientContext"
import { dummyAppointments, Appointment } from "./components/dummy"
import {
  Calendar,
  UserCheck,
  Clock,
  XCircle,
  UserPlus,
  CalendarDays,
  AlertCircle,
  ArrowRight,
  Activity
} from "lucide-react"
import { NoShowModal } from "./components/noShowModal"

function CheckInPageContent() {
  const { state, dispatch, createEncounter } = usePatientContext()
  const [triageMode, setTriageMode] = useState(false)  // ✅ Changed from erMode
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [appointments, setAppointments] = useState(dummyAppointments)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [isWalkInOpen, setIsWalkInOpen] = useState(false)
  const [isTriageOpen, setIsTriageOpen] = useState(false)
  const [isNoShowOpen, setIsNoShowOpen] = useState(false)
  const [selectedNoShow, setSelectedNoShow] = useState<Appointment | null>(null)
  const [currentPatientId, setCurrentPatientId] = useState<string>("")

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch =
      apt.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment = departmentFilter === "all" || apt.department === departmentFilter
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter

    return matchesSearch && matchesDepartment && matchesStatus
  })

  // Calculate statistics
  const totalScheduled = appointments.filter(a => a.status === "SCHEDULED").length
  const totalCheckedIn = appointments.filter(a => a.status === "CHECKED_IN").length
  const totalArrived = appointments.filter(a => a.status === "ARRIVED").length
  const totalCancelled = appointments.filter(a => a.status === "CANCELLED" || a.status === "NO_SHOW").length
  const totalInTriage = state.patients.filter(p => p.status === "InTriage").length
  const totalReferred = state.patients.filter(p => p.status === "Referred").length

  // Mock real-time updates (simulating patient status changes)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random status updates for demo
      if (Math.random() > 0.9 && state.patients.length > 0) {
        const randomIndex = Math.floor(Math.random() * state.patients.length)
        const patient = state.patients[randomIndex]
        
        console.log('Mock update:', patient.name, 'status changed')
      }
    }, 10000) // Every 10 seconds

    return () => clearInterval(interval)
  }, [state.patients])

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsModalOpen(true)
  }

  const handleCheckIn = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsModalOpen(true)
  }

  const handleConfirmCheckIn = (notes: string, paymentType: string) => {
    if (selectedAppointment) {
      // Update appointment status
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === selectedAppointment.id
            ? { ...apt, status: "CHECKED_IN" as const }
            : apt
        )
      )
      
      // Create encounter
      const encounterId = createEncounter(selectedAppointment.patientId)
      
      // If ER mode, open triage wizard
      if (triageMode) {
        setCurrentPatientId(selectedAppointment.patientId)
        setIsTriageOpen(true)
      }
      
      setIsModalOpen(false)
      setSelectedAppointment(null)
    }
  }

  const handleNoShow = (appointmentId: string) => {
    setSelectedNoShow(appointments.find(apt => apt.id === appointmentId) || null)
    setIsNoShowOpen(true)
  }

  const handleConfirmNoShow = () => {
    if (selectedNoShow) {
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === selectedNoShow.id
            ? { ...apt, status: "NO_SHOW" as const }
            : apt
        )
      )
      setIsNoShowOpen(false)
      setSelectedNoShow(null)
    }
  }

  const handleWalkInSubmit = (data: WalkInData) => {
    // Create new walk-in appointment
    const newAppointment: Appointment = {
      id: `APT-2024-${String(appointments.length + 1).padStart(4, '0')}`,
      patientId: data.patientId || `PAT-2024-${String(appointments.length + 1).padStart(4, '0')}`,
      patientName: `${data.lastName}, ${data.firstName} ${data.middleName}`,
      age: data.age,
      gender: data.gender,
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      department: data.department,
      physician: data.physician,
      visitType: data.visitType === "FOLLOW_UP" ? "FOLLOWUP" : data.visitType,
      status: "CHECKED_IN",
      reasonForVisit: data.reasonForVisit
    }

    setAppointments(prev => [...prev, newAppointment])
    setIsWalkInOpen(false)
    
    // If ER mode, open triage wizard
    if (triageMode) {
      setCurrentPatientId(newAppointment.patientId)
      setIsTriageOpen(true)
    }
  }

  const handleTriageComplete = () => {
    console.log('Triage completed for patient:', currentPatientId)
  }

  const handleRefresh = () => {
    console.log("Refreshing appointments...")
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
                {/* ER Mode Toggle */}
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
            
            {/* ER Mode Banner */}
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
                  <CardTitle className="text-sm font-medium">
                    Total Scheduled
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalScheduled}</div>
                  <p className="text-xs text-muted-foreground">
                    Appointments today
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Arrived
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalArrived}</div>
                  <p className="text-xs text-muted-foreground">
                    Waiting to check in
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Checked In
                  </CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCheckedIn}</div>
                  <p className="text-xs text-muted-foreground">
                    Ready for consultation
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-900">
                    In Triage
                  </CardTitle>
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">{totalInTriage}</div>
                  <p className="text-xs text-blue-700">
                    Being assessed
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-900">
                    Referred
                  </CardTitle>
                  <ArrowRight className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">{totalReferred}</div>
                  <p className="text-xs text-green-700">
                    To departments
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Cancelled
                  </CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCancelled}</div>
                  <p className="text-xs text-muted-foreground">
                    No shows today
                  </p>
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
              triageMode={triageMode}  // ✅ Changed from erMode
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