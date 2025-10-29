"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { IconSearch } from "@tabler/icons-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useState } from "react"
import { format } from "date-fns"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { cn } from "@/lib/utils"
import { DateTimePicker } from "@/components/ui/date-time-picker"

interface Appointment {
  id: number;
  patient: string;
  provider: string;
  date: string;
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
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Produce a Date from selectedAppointment.date + selectedAppointment.time
  const getSelectedDate = () => {
    if (!selectedAppointment?.date) return undefined
    // try to build an ISO datetime using stored date and time
    try {
      const datePart = selectedAppointment.date // expected yyyy-MM-dd
      const timePart = selectedAppointment.time ? selectedAppointment.time : "00:00"
      // if time is in "hh:mm AM/PM" convert to 24h by parsing via Date
      const parsed = new Date(`${datePart} ${timePart}`)
      if (isNaN(parsed.getTime())) return undefined
      return parsed
    } catch {
      return undefined
    }
  }

  const handleDateTimeChange = (date: Date | null) => {
    if (!date) return
    setSelectedAppointment(prev =>
      prev ? {
        ...prev,
        date: format(date, "yyyy-MM-dd"),
        time: format(date, "hh:mm a")
      } : null
    )
  }

  // Edit Booking Appointment Modal Handler
  const handleEditBooking = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setOpenEdit(true);
  }

  const handleCancelBooking = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setOpenCancel(true);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedAppointment(prev => 
      prev ? { ...prev, [name]: value } : null
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
                    {mockAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">{appointment.patient}</TableCell>
                        <TableCell>{appointment.provider}</TableCell>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>
                          <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleEditBooking(appointment)}>Edit</Button>
                            <Button variant="ghost" size="sm" onClick={() => handleCancelBooking(appointment)}>Cancel</Button>
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
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Appointment</DialogTitle>
              <DialogDescription>
                Modify the details of the selected appointment.
              </DialogDescription>
            </DialogHeader>
            
            {/* Patient Details */}
            <div className="grid gap-4 mt-4">
              <div className="grid gap-1 mb-4">
                <Label htmlFor="patientName"><strong>Patient Name:</strong></Label>
                <Input 
                  id="patient" 
                  name="patient" 
                  value={selectedAppointment?.patient || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* Health Provider Details */}                
              <div className="grid gap-1 mb-4">
                <Label htmlFor="provider"><strong>Provider:</strong></Label>
                <Input 
                  id="provider" 
                  name="provider" 
                  value={selectedAppointment?.provider || ""}
                  onChange={handleInputChange}
                />
              </div>

              {/* Appointment Date and Time - used DateTimePicker component */}
              <div className="grid gap-1">
                <Label htmlFor="datetime"><strong>Appointment Date and Time:</strong></Label>
                <DateTimePicker
                  // id="datetime"
                  value={getSelectedDate() || null}
                  onChange={handleDateTimeChange}
                />
              </div>
            </div>
          
            <div className="mt-6 flex gap-2">
              <Button onClick={() => { 
                setOpenEdit(false); 
                setSelectedAppointment(null);
              }}>
                Confirm
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setOpenEdit(false);
                  setSelectedAppointment(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Cancel Booking Appointment Modal */}
          <Dialog open={openCancel} onOpenChange={setOpenCancel}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Appointment</DialogTitle>
              <DialogDescription className="mt-4">
                Are you sure you want to <strong>cancel the appointment</strong> for <strong>{selectedAppointment?.patient}</strong> with <strong>{selectedAppointment?.provider}</strong> on <strong>{selectedAppointment?.date}</strong> at <strong>{selectedAppointment?.time}</strong>?
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2 flex gap-2">
              <Button variant="destructive" onClick={() => {
                setOpenCancel(false);
                setSelectedAppointment(null);
              }}>              
                Confirm
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setOpenCancel(false);
                  setSelectedAppointment(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
    
      </DashboardLayout>
    </ProtectedRoute>
  )
}