"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { IconSearch } from "@tabler/icons-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"

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

  const [date, setDate] = useState<Date | undefined>(new Date());

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
          <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Edit Appointment</DialogTitle>
              <DialogDescription>
                Modify the details of the selected appointment.
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto pr-1 space-y-5">
              {/* Patient Details */}
              <div className="grid gap-4 mt-4">
                <Label className="font-semibold">Patient Details</Label>
                <div className="grid gap-1">
                  <Label htmlFor="patientName" className="text-muted-foreground">Patient Name</Label>
                  <Input 
                    id="patient" 
                    name="patient" 
                    value={selectedAppointment?.patient || ""}
                    onChange={handleInputChange}
                  />
                </div>
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="grid gap-1">
                    <Label htmlFor="contact" className="text-sm text-muted-foreground">Mobile Number</Label>
                    <Input
                      id="contact"
                      name="contact"
                      placeholder="09XXXXXXXXX"
                      inputMode="tel"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="telephone" className="text-sm text-muted-foreground">Telephone (optional)</Label>
                    <Input
                      id="telephone"
                      name="telephone"
                      placeholder="(02) XXXXXXX"
                      inputMode="tel"
                    />
                  </div>
                </div>

                {/* Health Provider Details */}    
                <Label className="font-semibold">Health Provider Details</Label>            
                <div className="grid gap-1">
                  <Label htmlFor="provider" className="text-muted-foreground">Provider</Label>
                  <Input 
                    id="provider" 
                    name="provider" 
                    value={selectedAppointment?.provider || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="grid gap-1">
                    <Label htmlFor="department" className="text-sm text-muted-foreground">Specialty/Department:</Label>
                    <Input id="department" name="department" defaultValue="Cardiology" readOnly/>
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="location" className="text-sm text-muted-foreground">Location:</Label>
                    <Input id="location" name="location" defaultValue="North Clinic" readOnly/>
                  </div>                
                </div>
                
                <Label><strong>Appointment Details</strong></Label>
                <div className="grid md:grid-cols-[2fr_2fr] gap-3">
                  {/* Appointment Date and Time*/}
                  <div className="grid gap-1 ">
                    <Label htmlFor="datetime" className="text-muted-foreground">Scheduled Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {date ? date.toDateString() : "Select date"}
                          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger> 
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          className="rounded-md border"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Label htmlFor="time-picker" className="text-muted-foreground">Scheduled Time</Label>
                    <Input
                      type="time"
                      id="time-picker"
                      step="1"
                      defaultValue={selectedAppointment?.time ?
                        // Convert "hh:mm AM/PM" to "HH:MM:SS" 24h format
                        (() => {
                          const [time, period] = selectedAppointment.time.split(" ");
                          const [hours, minutes] = time.split(":");
                          const hours24 = period === "AM" ? Number(hours) : Number(hours) + 12;
                          return `${hours24.toString().padStart(2, "0")}:${minutes}:00`;
                        })() : ""}
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </div>
                  
                  {/* Appointment Status*/}
                  <div className="grid gap-1 ">
                    <Label htmlFor="datetime" className="text-muted-foreground">Booking Status</Label>
                    <Select
                      name="status"
                      defaultValue={selectedAppointment?.status || "pending"}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="canceled">Canceled</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                </div>
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