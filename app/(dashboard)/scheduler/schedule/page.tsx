"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function ScheduleAppointmentPage() {
  // Date and time state
  const [date, setDate] = useState<Date | undefined>(new Date())
  const timeSlots = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "2:00 PM", "2:30 PM"]

  // Confirmation dialog state
  const [open, setOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined);
  const [selectedProvider, setSelectedProvider] = useState<string | undefined>(undefined);
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined);
  const [patientName, setPatientName] = useState<string | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  // date and time is defined above

  // Create New Patient dialog state
  const [openNewPatient, setOpenNewPatient] = useState(false);
  const [newPatientName, setNewPatientName] = useState<string | undefined>("");
  const [newPatientAge, setNewPatientAge] = useState<number | undefined>(undefined);
  const [newPatientGender, setNewPatientGender] = useState<string | undefined>(undefined);
  const [newPatientContact, setNewPatientContact] = useState<string | undefined>(undefined);
  const [newPatientAddress, setNewPatientAddress] = useState<string | undefined>(undefined);
  const [newPatientEmergencyContact, setNewPatientEmergencyContact] = useState<string | undefined>(undefined);

  // Confirm Booking Modal Handler
  const handleBookClick = () => {
    console.log("Booking appointment...")

    // Open confirmation dialog
    setOpen(true);
  }

  const handleCreateNewPatient = () => {
    console.log("Creating new patient...")
    
    // Open new patient dialog
    setOpenNewPatient(true);
  }

  return (
    <ProtectedRoute requiredRole={UserRole.SCHEDULER}>
      <DashboardLayout role={UserRole.SCHEDULER}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Schedule Appointment</h1>
            <p className="text-muted-foreground">
              Book a new appointment for a patient
            </p>
          </div>

          <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
                <CardDescription>Search or create patient</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Search Patient</Label>
                  <Input placeholder="Enter patient name or ID..." value={patientName} onChange={(e) => setPatientName(e.target.value)} />
                </div>
                <Button variant="outline" className="w-full" onClick={handleCreateNewPatient}>
                  Create New Patient
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
                <CardDescription>Select date, time, and provider</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Specialty/Department</Label>
                  <Select onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Neurology">Neurology</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Provider</Label>
                  <Select onValueChange={setSelectedProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr. John Smith">Dr. John Smith</SelectItem>
                      <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Main Hospital">Main Hospital</SelectItem>
                      <SelectItem value="North Clinic">North Clinic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Select Date & Time</CardTitle>
                <CardDescription>Choose available slot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Available Time Slots</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((availableSlots) => (
                        <Button key={availableSlots} 
                            variant={selectedTime === availableSlots ? "default" : "outline"}
                            onClick={() => setSelectedTime(availableSlots)} 
                            size="sm" >
                              {availableSlots}
                          </Button>
                      ))}
                      {/* 
                        <Button variant="outline" size="sm">9:00 AM</Button>
                        <Button variant="outline" size="sm">9:30 AM</Button>
                        <Button variant="outline" size="sm">10:00 AM</Button>
                        <Button variant="outline" size="sm">10:30 AM</Button>
                        <Button variant="outline" size="sm">2:00 PM</Button>
                        <Button variant="outline" size="sm">2:30 PM</Button> */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="px-4 lg:px-6">
            <div className="flex gap-2">
              <Button onClick={handleBookClick}>Book Appointment</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </div>

          {/* Confirm Booking Appointment Modal */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Appointment</DialogTitle>
                <DialogDescription className="mb-4">
                  Please review your appointment details before confirming.
                </DialogDescription>
              </DialogHeader>
              
              {/* Patient Details */}
              <div className="grid gap-4">
                <div className="grid gap-1 mb-4">
                  <Label htmlFor="patientName"><strong>Patient Name:</strong></Label>
                  <Input id="patientName" name="patientName" value={patientName} defaultValue="Juan Dela Cruz" readOnly/>
                </div>
              

                {/* Health Provider Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="grid gap-1">
                    <Label htmlFor="department"><strong>Specialty/Department:</strong></Label>
                    <Input id="department" name="department" value={selectedDepartment} readOnly/>
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="provider"><strong>Provider:</strong></Label>
                    <Input id="provider" name="provider" value={selectedProvider} readOnly/>
                  </div>                
                </div>
                
                <div className="grid gap-1 mb-4">
                  <Label htmlFor="location"><strong>Location:</strong></Label>
                  <Input id="location" name="location" value={selectedLocation} readOnly/>
                </div>

                {/* Appointment Date and Time*/}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="grid gap-1">
                    <Label htmlFor="date"><strong>Appointment Date:</strong></Label>
                    <Input id="date" name="date" value={date ? date.toDateString() : ''} readOnly/>
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="time"><strong>Appointment Time:</strong></Label>
                    <Input id="time" name="time" value={selectedTime} readOnly/>
                  </div>
                </div>
              </div>
            
              <div className="mt-6 flex gap-2">
                <Button onClick={() => { setOpen(false); /* Logic to confirm booking */ }}>Confirm</Button>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              </div>

            </DialogContent>
          </Dialog>

          {/* Create New Patient Modal */}
          <Dialog open={openNewPatient} onOpenChange={setOpenNewPatient}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Patient</DialogTitle>
                <DialogDescription className="mb-4">
                  Fill in the details below to create a new patient record.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="name">Patient Name</Label>
                  <Input id="name" name="name" placeholder="Enter patient name" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" placeholder="Enter patient email" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input id="contact" name="contact" placeholder="Enter contact number" />
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="birthday" >Birthday</Label>
                  <Input id="birthday" name="birthday" placeholder="Enter patient birthday" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="age">Age</Label>
                  <Input id="age" name="age" placeholder="Enter patient age" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="gender">Gender</Label>
                  <Input id="gender" name="gender" placeholder="Enter patient gender" />
                </div>
                <div className="mt-6 flex gap-2">
                  <Button onClick={() => { setOpenNewPatient(false); /* Logic to create new patient */ }}>Create</Button>
                  <Button variant="outline" onClick={() => setOpenNewPatient(false)}>Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
