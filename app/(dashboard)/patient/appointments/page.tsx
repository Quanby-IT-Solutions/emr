"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconCalendar, IconClock, IconUser } from "@tabler/icons-react"

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

const MOCK_APPOINTMENTS: AppointmentData[] = [
  {
    id: "apt_001",
    patientId: "pat_123456789",
    providerId: "staff_001",
    startTime: "2026-05-12T09:00:00",
    endTime: "2026-05-12T09:30:00",
    status: "CONFIRMED",
    appointmentType: "Follow-up consultation",
    encounterId: null,
    provider: {
      id: "staff_001",
      firstName: "Maria",
      lastName: "Santos",
      jobTitle: "Endocrinologist",
    },
  },
  {
    id: "apt_002",
    patientId: "pat_123456789",
    providerId: "staff_002",
    startTime: "2026-05-20T14:00:00",
    endTime: "2026-05-20T14:30:00",
    status: "SCHEDULED",
    appointmentType: "Annual physical",
    encounterId: null,
    provider: {
      id: "staff_002",
      firstName: "Jose",
      lastName: "Reyes",
      jobTitle: "Family medicine",
    },
  },
  {
    id: "apt_004",
    patientId: "pat_123456789",
    providerId: "staff_001",
    startTime: "2026-03-15T09:00:00",
    endTime: "2026-03-15T09:30:00",
    status: "COMPLETED",
    appointmentType: "Diabetes management",
    encounterId: "enc_001",
    provider: {
      id: "staff_001",
      firstName: "Maria",
      lastName: "Santos",
      jobTitle: "Endocrinologist",
    },
  },
  {
    id: "apt_005",
    patientId: "pat_123456789",
    providerId: "staff_002",
    startTime: "2026-02-10T11:00:00",
    endTime: "2026-02-10T11:30:00",
    status: "COMPLETED",
    appointmentType: "Routine check-up",
    encounterId: "enc_002",
    provider: {
      id: "staff_002",
      firstName: "Jose",
      lastName: "Reyes",
      jobTitle: "Family medicine",
    },
  },
]

export default function AppointmentsPage() {
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState<AppointmentData[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      await new Promise((r) => setTimeout(r, 500))
      if (!cancelled) {
        setAppointments(MOCK_APPOINTMENTS)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const upcomingAppointments = appointments
    .filter(
      (apt) =>
        ["SCHEDULED", "CONFIRMED"].includes(apt.status) && new Date(apt.startTime) >= new Date(),
    )
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())

  const pastAppointments = appointments
    .filter(
      (apt) =>
        apt.status === "COMPLETED" ||
        apt.status === "CANCELLED" ||
        apt.status === "NO_SHOW" ||
        (["SCHEDULED", "CONFIRMED"].includes(apt.status) && new Date(apt.startTime) < new Date()),
    )
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <Badge variant="default" className="bg-green-600">
            Confirmed
          </Badge>
        )
      case "SCHEDULED":
        return <Badge variant="secondary">Scheduled</Badge>
      case "CHECKED_IN":
        return <Badge variant="default">Checked in</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">Cancelled</Badge>
      case "NO_SHOW":
        return <Badge variant="destructive">No show</Badge>
      case "COMPLETED":
        return <Badge variant="outline">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading && appointments.length === 0) {
    return (
      <ProtectedRoute requiredRole={UserRole.PATIENT}>
        <DashboardLayout role={UserRole.PATIENT}>
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
              <p className="text-muted-foreground">Loading appointments…</p>
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
            <h1 className="text-2xl font-bold">Appointments</h1>
            <p className="mt-1 max-w-3xl text-muted-foreground">
              Read-only list of your visits as booked in the system. Scheduling staff manage
              templates, slots, and bookings; registrars handle check-in. To book or change a visit,
              contact your clinic—this page only shows what is already on file.
            </p>
          </div>

          <div className="px-4 lg:px-6">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">
                  <IconCalendar className="mr-2 h-4 w-4" />
                  Upcoming ({upcomingAppointments.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  <IconClock className="mr-2 h-4 w-4" />
                  Past ({pastAppointments.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="mt-4">
                {upcomingAppointments.length === 0 ? (
                  <Card>
                    <CardContent className="py-16">
                      <div className="text-center">
                        <IconCalendar className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-semibold">No upcoming appointments</h3>
                        <p className="text-muted-foreground">
                          Contact your clinic or scheduling team to book a visit.
                        </p>
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
                            <div className="mb-4 flex items-start justify-between">
                              <div>
                                <div className="mb-1 flex items-center gap-2">
                                  <h3 className="text-xl font-bold">
                                    Dr. {appointment.provider.firstName} {appointment.provider.lastName}
                                  </h3>
                                  {getStatusBadge(appointment.status)}
                                </div>
                                <p className="text-muted-foreground">
                                  {appointment.provider.jobTitle ?? "Healthcare provider"}
                                </p>
                              </div>
                              {appointment.appointmentType && (
                                <Badge variant="outline">{appointment.appointmentType}</Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div className="flex items-start gap-3">
                                <IconCalendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Date & time</p>
                                  <p className="font-medium">{date}</p>
                                  <p className="text-sm">
                                    {time} – {endTime}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <IconUser className="mt-0.5 h-5 w-5 text-muted-foreground" />
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

              <TabsContent value="past" className="mt-4">
                {pastAppointments.length === 0 ? (
                  <Card>
                    <CardContent className="py-16">
                      <div className="text-center">
                        <IconClock className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-semibold">No past appointments</h3>
                        <p className="text-muted-foreground">History will appear here when available.</p>
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
                            <div className="mb-4 flex items-start justify-between">
                              <div>
                                <div className="mb-1 flex items-center gap-2">
                                  <h3 className="text-xl font-bold">
                                    Dr. {appointment.provider.firstName} {appointment.provider.lastName}
                                  </h3>
                                  {getStatusBadge(appointment.status)}
                                </div>
                                <p className="text-muted-foreground">
                                  {appointment.provider.jobTitle ?? "Healthcare provider"}
                                </p>
                              </div>
                              {appointment.appointmentType && (
                                <Badge variant="outline">{appointment.appointmentType}</Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div className="flex items-start gap-3">
                                <IconCalendar className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="text-sm text-muted-foreground">Date & time</p>
                                  <p className="font-medium">{date}</p>
                                  <p className="text-sm">{time}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <IconUser className="mt-0.5 h-5 w-5 text-muted-foreground" />
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
