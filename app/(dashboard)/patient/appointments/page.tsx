"use client"
import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconCalendar, IconClock, IconUser, IconPlus, IconX } from "@tabler/icons-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

// Types matching Prisma schema
type AppointmentData = {
  id: string
  patientId: string
  providerId: string
  startTime: string
  endTime: string
  status: "SCHEDULED" | "CONFIRMED" | "CHECKED_IN" | "CANCELLED" | "NO_SHOW" | "COMPLETED"
  appointmentType: string | null
  encounterId: string | null
  provider: {
    id: string
    firstName: string
    lastName: string
    jobTitle: string | null
  }
}

// 🎭 MOCK DATA
const MOCK_APPOINTMENTS: AppointmentData[] = [
  // UPCOMING APPOINTMENTS
  {
    id: "apt_001",
    patientId: "pat_123456789",
    providerId: "staff_001",
    startTime: "2024-11-25T09:00:00",
    endTime: "2024-11-25T09:30:00",
    status: "CONFIRMED",
    appointmentType: "Follow-up Consultation",
    encounterId: null,
    provider: {
      id: "staff_001",
      firstName: "Maria",
      lastName: "Santos",
      jobTitle: "Endocrinologist"
    }
  },
  {
    id: "apt_002",
    patientId: "pat_123456789",
    providerId: "staff_002",
    startTime: "2024-12-02T14:00:00",
    endTime: "2024-12-02T14:30:00",
    status: "SCHEDULED",
    appointmentType: "Annual Physical Exam",
    encounterId: null,
    provider: {
      id: "staff_002",
      firstName: "Jose",
      lastName: "Reyes",
      jobTitle: "Family Medicine Physician"
    }
  },
  {
    id: "apt_003",
    patientId: "pat_123456789",
    providerId: "staff_003",
    startTime: "2024-12-10T10:30:00",
    endTime: "2024-12-10T11:00:00",
    status: "SCHEDULED",
    appointmentType: "Cardiology Consultation",
    encounterId: null,
    provider: {
      id: "staff_003",
      firstName: "Ana",
      lastName: "Fernandez",
      jobTitle: "Cardiologist"
    }
  },
  // PAST APPOINTMENTS
  {
    id: "apt_004",
    patientId: "pat_123456789",
    providerId: "staff_001",
    startTime: "2024-10-15T09:00:00",
    endTime: "2024-10-15T09:30:00",
    status: "COMPLETED",
    appointmentType: "Diabetes Management",
    encounterId: "enc_001",
    provider: {
      id: "staff_001",
      firstName: "Maria",
      lastName: "Santos",
      jobTitle: "Endocrinologist"
    }
  },
  {
    id: "apt_005",
    patientId: "pat_123456789",
    providerId: "staff_002",
    startTime: "2024-09-20T11:00:00",
    endTime: "2024-09-20T11:30:00",
    status: "COMPLETED",
    appointmentType: "Routine Check-up",
    encounterId: "enc_002",
    provider: {
      id: "staff_002",
      firstName: "Jose",
      lastName: "Reyes",
      jobTitle: "Family Medicine Physician"
    }
  },
  {
    id: "apt_006",
    patientId: "pat_123456789",
    providerId: "staff_004",
    startTime: "2024-08-05T15:30:00",
    endTime: "2024-08-05T16:00:00",
    status: "COMPLETED",
    appointmentType: "Blood Pressure Monitoring",
    encounterId: "enc_003",
    provider: {
      id: "staff_004",
      firstName: "Roberto",
      lastName: "Cruz",
      jobTitle: "Internal Medicine Physician"
    }
  },
  {
    id: "apt_007",
    patientId: "pat_123456789",
    providerId: "staff_002",
    startTime: "2024-07-12T10:00:00",
    endTime: "2024-07-12T10:30:00",
    status: "COMPLETED",
    appointmentType: "Lab Results Review",
    encounterId: "enc_004",
    provider: {
      id: "staff_002",
      firstName: "Jose",
      lastName: "Reyes",
      jobTitle: "Family Medicine Physician"
    }
  },
  {
    id: "apt_008",
    patientId: "pat_123456789",
    providerId: "staff_005",
    startTime: "2024-06-18T13:00:00",
    endTime: "2024-06-18T13:30:00",
    status: "CANCELLED",
    appointmentType: "Dental Check-up",
    encounterId: null,
    provider: {
      id: "staff_005",
      firstName: "Carmen",
      lastName: "Lopez",
      jobTitle: "Dentist"
    }
  }
]

export default function AppointmentsPage() {
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [appointments, setAppointments] = useState<AppointmentData[]>([])

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      // 🎭 MOCK: Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 900))
      
      // 🎭 MOCK: Use mock data
      setAppointments(MOCK_APPOINTMENTS)
      
      // 🔴 TODO: Replace with real API call when backend is ready
      // const response = await fetch('/api/patients/appointments')
      // if (response.ok) {
      //   const data = await response.json()
      //   setAppointments(data)
      // } else {
      //   toast.error("Failed to load appointments")
      // }
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast.error("Failed to load appointments")
    } finally {
      setLoading(false)
    }
  }

  // Filter appointments by status
  const upcomingAppointments = appointments.filter(apt => 
    ['SCHEDULED', 'CONFIRMED'].includes(apt.status) &&
    new Date(apt.startTime) >= new Date()
  ).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  const pastAppointments = appointments.filter(apt => 
    apt.status === 'COMPLETED' || apt.status === 'CANCELLED' ||
    (['SCHEDULED', 'CONFIRMED'].includes(apt.status) && new Date(apt.startTime) < new Date())
  ).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge variant="default" className="bg-green-600">Confirmed</Badge>
      case 'SCHEDULED':
        return <Badge variant="secondary">Scheduled</Badge>
      case 'CHECKED_IN':
        return <Badge variant="default">Checked In</Badge>
      case 'CANCELLED':
        return <Badge variant="destructive">Cancelled</Badge>
      case 'NO_SHOW':
        return <Badge variant="destructive">No Show</Badge>
      case 'COMPLETED':
        return <Badge variant="outline">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return

    setLoading(true)
    try {
      // 🎭 MOCK: Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 🎭 MOCK: Update local state
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: 'CANCELLED' as const }
            : apt
        )
      )
      toast.success("Appointment cancelled successfully")
      
      // 🔴 TODO: Replace with real API call when backend is ready
      // const response = await fetch(`/api/appointments/${appointmentId}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: 'CANCELLED' })
      // })
      // if (response.ok) {
      //   toast.success("Appointment cancelled successfully")
      //   fetchAppointments()
      // } else {
      //   toast.error("Failed to cancel appointment")
      // }
    } catch (error) {
      console.error('Error cancelling appointment:', error)
      toast.error("Failed to cancel appointment")
    } finally {
      setLoading(false)
    }
  }

  const handleRequestAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    const _formData = new FormData(e.currentTarget)
    
    try {
      // 🎭 MOCK: Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Appointment request submitted successfully. Our staff will contact you to confirm.")
      setIsDialogOpen(false)
      
      // 🔴 TODO: Replace with real API call when backend is ready
      // const response = await fetch('/api/appointments/request', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     appointmentType: formData.get('appointmentType'),
      //     preferredDate: formData.get('preferredDate'),
      //     preferredTime: formData.get('preferredTime'),
      //     reason: formData.get('reason')
      //   })
      // })
      // if (response.ok) {
      //   toast.success("Appointment request submitted successfully")
      //   setIsDialogOpen(false)
      //   fetchAppointments()
      // } else {
      //   toast.error("Failed to submit appointment request")
      // }
    } catch (error) {
      console.error('Error submitting request:', error)
      toast.error("Failed to submit appointment request")
    } finally {
      setLoading(false)
    }
  }

  if (loading && appointments.length === 0) {
    return (
      <ProtectedRoute requiredRole={UserRole.PATIENT}>
        <DashboardLayout role={UserRole.PATIENT}>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading appointments...</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole={UserRole.PATIENT}>
      <DashboardLayout role={UserRole.PATIENT}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Appointments</h1>
                <p className="text-muted-foreground">
                  View and manage your appointments
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <IconPlus className="h-4 w-4 mr-2" />
                    Request Appointment
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <form onSubmit={handleRequestAppointment}>
                    <DialogHeader>
                      <DialogTitle>Request New Appointment</DialogTitle>
                      <DialogDescription>
                        Fill out the form to request a new appointment
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label htmlFor="appointmentType">Appointment Type</Label>
                        <Input
                          id="appointmentType"
                          name="appointmentType"
                          placeholder="e.g., Follow-up, Consultation"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="preferredDate">Preferred Date</Label>
                        <Input
                          id="preferredDate"
                          name="preferredDate"
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="preferredTime">Preferred Time</Label>
                        <Input
                          id="preferredTime"
                          name="preferredTime"
                          type="time"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="reason">Reason for Visit</Label>
                        <Textarea 
                          id="reason"
                          name="reason"
                          placeholder="Describe your symptoms or reason for visit"
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit Request"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="px-4 lg:px-6">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">
                  <IconCalendar className="h-4 w-4 mr-2" />
                  Upcoming ({upcomingAppointments.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  <IconClock className="h-4 w-4 mr-2" />
                  Past ({pastAppointments.length})
                </TabsTrigger>
              </TabsList>

              {/* Upcoming Appointments Tab */}
              <TabsContent value="upcoming">
                {upcomingAppointments.length === 0 ? (
                  <Card>
                    <CardContent className="py-16">
                      <div className="text-center">
                        <IconCalendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Upcoming Appointments</h3>
                        <p className="text-muted-foreground mb-4">
                          You don&apos;t have any scheduled appointments
                        </p>
                        <Button onClick={() => setIsDialogOpen(true)}>
                          <IconPlus className="h-4 w-4 mr-2" />
                          Request Appointment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => {
                      const { date, time } = formatDateTime(appointment.startTime)
                      const endTime = formatDateTime(appointment.endTime).time
                      
                      return (
                        <Card key={appointment.id}>
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-xl font-bold">
                                    Dr. {appointment.provider.firstName} {appointment.provider.lastName}
                                  </h3>
                                  {getStatusBadge(appointment.status)}
                                </div>
                                <p className="text-muted-foreground">
                                  {appointment.provider.jobTitle || 'Healthcare Provider'}
                                </p>
                              </div>
                              {appointment.appointmentType && (
                                <Badge variant="outline">{appointment.appointmentType}</Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="flex items-start gap-3">
                                <IconCalendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Date & Time</p>
                                  <p className="font-medium">{date}</p>
                                  <p className="text-sm">{time} - {endTime}</p>
                                </div>
                              </div>

                              <div className="flex items-start gap-3">
                                <IconUser className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Provider</p>
                                  <p className="font-medium">
                                    Dr. {appointment.provider.firstName} {appointment.provider.lastName}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-4 border-t">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleCancelAppointment(appointment.id)}
                                disabled={loading}
                              >
                                <IconX className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </TabsContent>

              {/* Past Appointments Tab */}
              <TabsContent value="past">
                {pastAppointments.length === 0 ? (
                  <Card>
                    <CardContent className="py-16">
                      <div className="text-center">
                        <IconClock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Past Appointments</h3>
                        <p className="text-muted-foreground">
                          Your appointment history will appear here
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {pastAppointments.map((appointment) => {
                      const { date, time } = formatDateTime(appointment.startTime)
                      
                      return (
                        <Card key={appointment.id} className="opacity-90">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-xl font-bold">
                                    Dr. {appointment.provider.firstName} {appointment.provider.lastName}
                                  </h3>
                                  {getStatusBadge(appointment.status)}
                                </div>
                                <p className="text-muted-foreground">
                                  {appointment.provider.jobTitle || 'Healthcare Provider'}
                                </p>
                              </div>
                              {appointment.appointmentType && (
                                <Badge variant="outline">{appointment.appointmentType}</Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-start gap-3">
                                <IconCalendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Date & Time</p>
                                  <p className="font-medium">{date}</p>
                                  <p className="text-sm">{time}</p>
                                </div>
                              </div>

                              <div className="flex items-start gap-3">
                                <IconUser className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Provider</p>
                                  <p className="font-medium">
                                    Dr. {appointment.provider.firstName} {appointment.provider.lastName}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}