"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Appointment } from "./dummy"
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react"
import { format } from "date-fns"

interface ScheduleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointments: Appointment[]
}

export function ScheduleModal({ open, onOpenChange, appointments }: ScheduleModalProps) {
  // Group appointments by time
  const morningAppointments = appointments.filter(apt => {
    const hour = parseInt(apt.appointmentTime.split(':')[0])
    const isPM = apt.appointmentTime.includes('PM')
    const time24 = isPM && hour !== 12 ? hour + 12 : hour
    return time24 < 12
  })

  const afternoonAppointments = appointments.filter(apt => {
    const hour = parseInt(apt.appointmentTime.split(':')[0])
    const isPM = apt.appointmentTime.includes('PM')
    const time24 = isPM && hour !== 12 ? hour + 12 : hour
    return time24 >= 12
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CHECKED_IN":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "ARRIVED":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      SCHEDULED: { variant: "outline", label: "Scheduled" },
      ARRIVED: { variant: "secondary", label: "Arrived" },
      CHECKED_IN: { variant: "default", label: "Checked In" },
      CANCELLED: { variant: "destructive", label: "Cancelled" }
    }
    const status_info = variants[status] || variants.SCHEDULED
    return <Badge variant={status_info.variant}>{status_info.label}</Badge>
  }

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="mb-3">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(appointment.status)}
            <CardTitle className="text-base">{appointment.appointmentTime}</CardTitle>
          </div>
          {getStatusBadge(appointment.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{appointment.patientName}</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{appointment.patientId}</span>
        </div>
        <div className="flex items-center gap-2">
          <Stethoscope className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {appointment.department} • Dr. {appointment.physician}
          </span>
        </div>
        <div className="mt-2 pt-2 border-t">
          <p className="text-xs text-muted-foreground">Chief Complaint:</p>
          <p className="text-sm">{appointment.reasonForVisit}</p>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today&apos;s Appointment Schedule
          </DialogTitle>
          <DialogDescription>
            {format(new Date(), "EEEE, MMMM d, yyyy")} • {appointments.length} total appointments
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Morning Appointments */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Morning ({morningAppointments.length})
            </h3>
            <ScrollArea className="h-[500px] pr-4">
              {morningAppointments.length > 0 ? (
                morningAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No morning appointments scheduled
                  </CardContent>
                </Card>
              )}
            </ScrollArea>
          </div>

          {/* Afternoon Appointments */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Afternoon ({afternoonAppointments.length})
            </h3>
            <ScrollArea className="h-[500px] pr-4">
              {afternoonAppointments.length > 0 ? (
                afternoonAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    No afternoon appointments scheduled
                  </CardContent>
                </Card>
              )}
            </ScrollArea>
          </div>
        </div>

        <Separator />

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-500">
              {appointments.filter(a => a.status === "SCHEDULED").length}
            </p>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-500">
              {appointments.filter(a => a.status === "ARRIVED").length}
            </p>
            <p className="text-xs text-muted-foreground">Arrived</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-500">
              {appointments.filter(a => a.status === "CHECKED_IN").length}
            </p>
            <p className="text-xs text-muted-foreground">Checked In</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-500">
              {appointments.filter(a => a.status === "CANCELLED").length}
            </p>
            <p className="text-xs text-muted-foreground">Cancelled</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}