"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { SearchPatient } from "./components/searchPatient"
import { AppointmentList } from "./components/appointmentList"
import { PatientModal } from "./components/patientModal"
import { ScheduleModal } from "./components/schedule"
import { WalkInModal, WalkInData } from "./components/walkin"
import { dummyAppointments, Appointment } from "./components/dummy"
import { 
  Calendar, 
  UserCheck, 
  Clock, 
  XCircle, 
  UserPlus,
  CalendarDays
} from "lucide-react"

export default function CheckInPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [appointments, setAppointments] = useState(dummyAppointments)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [isWalkInOpen, setIsWalkInOpen] = useState(false)

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
  const totalCancelled = appointments.filter(a => a.status === "CANCELLED").length

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
      setIsModalOpen(false)
      setSelectedAppointment(null)
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
      visitType: data.visitType,
      status: "CHECKED_IN",
      reasonForVisit: data.reasonForVisit
    }

    setAppointments(prev => [...prev, newAppointment])
    console.log("Walk-in patient registered:", data)
  }

  const handleRefresh = () => {
    // Refresh appointments list
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
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsScheduleOpen(true)}>
                  <CalendarDays className="mr-2 h-4 w-4" />
                  View Schedule
                </Button>
                <Button onClick={() => setIsWalkInOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Walk-In
                </Button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="px-4 lg:px-6">
            <div className="grid gap-4 md:grid-cols-4">
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
      </DashboardLayout>
    </ProtectedRoute>
  )
}