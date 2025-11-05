"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, UserCheck } from "lucide-react"
import { Appointment } from "./dummy"

interface AppointmentListProps {
  appointments: Appointment[]
  onViewDetails: (appointment: Appointment) => void
  onCheckIn: (appointment: Appointment) => void
}

export function AppointmentList({ appointments, onViewDetails, onCheckIn }: AppointmentListProps) {
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

  const getVisitTypeBadge = (type: string) => {
    return type === "NEW" 
      ? <Badge variant="default">New</Badge>
      : <Badge variant="secondary">Follow-up</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Appointments</CardTitle>
        <CardDescription>
          {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} found
        </CardDescription>
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
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
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
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onViewDetails(appointment)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onCheckIn(appointment)}
                          disabled={appointment.status === "CHECKED_IN" || appointment.status === "CANCELLED"}
                          title="Check In"
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                      </div>
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
      </CardContent>
    </Card>
  )
}