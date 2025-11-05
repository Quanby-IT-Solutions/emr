"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { IconSearch } from "@tabler/icons-react"
import { useState } from "react"
import { CancelBookingModal } from "./components/cancelBookingModal"
import { EditBookingModal } from "./components/editBookingModal"

interface Appointment {
  id: number;
  patient: string;
  provider: string;
  date: Date;
  time: string;
  status: string;
}

const mockAppointments = [
  { id: 1, patient: "John Doe", provider: "Dr. Smith", date: "2025-10-28", time: "10:00 AM", status: "confirmed" },
  { id: 2, patient: "Jane Smith", provider: "Dr. Johnson", date: "2025-10-28", time: "11:30 AM", status: "pending" },
  { id: 3, patient: "Bob Wilson", provider: "Dr. Smith", date: "2025-10-29", time: "2:00 PM", status: "confirmed" },
]

export default function AppointmentsPage() {
  
  const [openEdit, setOpenEdit] = useState(false);
  const [openCancel, setOpenCancel] = useState(false);
  const [appointments, setAppointments] = useState(mockAppointments.map(apt => ({
    ...apt,
    date: new Date(apt.date)
  })));
  const [selectedAppointment, setSelectedAppointment] = useState<{
    id: number;
    patient: string;
    provider: string;
    date: Date;
    time: string;
    status: string;
  } | null>(null);

  // Edit Booking Appointment Modal Handler
  const handleEditBooking = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setOpenEdit(true);
  }

  const handleCancelBooking = (appointment: Appointment) => {
    setOpenCancel(true);
    setSelectedAppointment(appointment);
  }

    const handleConfirmCancel = (appointmentId: number) => {
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId 
            ? { ...apt, status: "cancelled" }
            : apt
        )
      );
    };

  const handleConfirmUpdate = (updatedAppointment: {
    id: number;
    patient: string;
    provider: string;
    date: Date;
    time: string;
    status: string;
  }) => {
    setAppointments(prev =>
      prev.map(apt =>
        apt.id === updatedAppointment.id
          ? updatedAppointment
          : apt
      )
    );
  };

  return (
    <ProtectedRoute requiredRole={UserRole.SCHEDULER}>
      <DashboardLayout role={UserRole.SCHEDULER}>
        {/* Page Header */}
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Appointments</h1>
            <p className="text-muted-foreground">
              View and manage all appointments
            </p>
          </div>

          {/* Appointments Table */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search appointments..." className="pl-8" />
                  </div>
                  <Button>Filter</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">{appointment.patient}</TableCell>
                        <TableCell>{appointment.provider}</TableCell>
                        <TableCell>{appointment.date.toLocaleTimeString()}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>
                          <Badge variant={appointment.status === "confirmed" ? "default" : appointment.status === "cancelled" ? "destructive" : "secondary"}>
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditBooking({...appointment, date: new Date(appointment.date)})}>Edit</Button>
                            <Button variant="ghost" size="sm" onClick={() => handleCancelBooking({...appointment, date: new Date(appointment.date)})}>Cancel</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Booking Modal */}
        <EditBookingModal 
          key={selectedAppointment?.id}
          selectedAppointment={selectedAppointment} 
          open={openEdit} 
          onOpenChange={setOpenEdit} 
          onConfirmUpdate={handleConfirmUpdate}
        />
        
        {/* Cancel Booking Appointment Modal */}
        <CancelBookingModal 
          selectedAppointment={selectedAppointment} 
          open={openCancel} 
          onOpenChange={setOpenCancel} 
          onConfirmCancel={handleConfirmCancel} 
        />

      </DashboardLayout>
    </ProtectedRoute>
  )
}