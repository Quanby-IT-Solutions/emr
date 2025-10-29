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
  const [open, setOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined)
  const [selectedProvider, setSelectedProvider] = useState<string | undefined>(undefined)
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined)
  const [patientName, setPatientName] = useState<string | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)

  // Create New Patient dialog state
  const [openNewPatient, setOpenNewPatient] = useState(false)

  // Patient info states
  const [firstName, setFirstName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [lastName, setLastName] = useState("")
  const [address, setAddress] = useState("")
  const [birthday, setBirthday] = useState("")
  const [age, setAge] = useState("")
  const [phone, setPhone] = useState("")
  const [telephone, setTelephone] = useState("")
  const [email, setEmail] = useState("")
  const [purpose, setPurpose] = useState("")

  // Emergency contact states
  const [emergencyName, setEmergencyName] = useState("")
  const [emergencyNumber, setEmergencyNumber] = useState("")
  const [emergencyRelation, setEmergencyRelation] = useState("")
  const [emergencyRelationOther, setEmergencyRelationOther] = useState("")

  // Emergency relationship options
  const EMERGENCY_RELATIONSHIP_OPTIONS = Object.freeze([
    { value: "parent", label: "Parent" },
    { value: "sibling", label: "Sibling" },
    { value: "spouse", label: "Spouse" },
    { value: "child", label: "Child" },
    { value: "grandparent", label: "Grandparent" },
    { value: "aunt", label: "Aunt" },
    { value: "uncle", label: "Uncle" },
    { value: "cousin", label: "Cousin" },
    { value: "niece", label: "Niece" },
    { value: "nephew", label: "Nephew" },
    { value: "other", label: "Other" },
  ])

  // Confirm Booking Modal Handler
  const handleBookClick = () => {
    console.log("Booking appointment...")
    setOpen(true)
  }

  // Create New Patient Handler
  const handleCreateNewPatient = () => {
    console.log("Creating new patient...")
    setOpenNewPatient(true)
    if (openNewPatient) resetNewPatientForm()
  }

  // Compute age automatically when birthday changes
  const handleBirthdayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setBirthday(value)
    if (value) {
      const today = new Date()
      const birthDate = new Date(value)
      let computedAge = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        computedAge--
      }
      setAge(computedAge >= 0 ? computedAge.toString() : "")
    } else {
      setAge("")
    }
  }

  // Reset all fields when modal closes
  const resetNewPatientForm = () => {
    setFirstName("")
    setMiddleName("")
    setLastName("")
    setAddress("")
    setBirthday("")
    setAge("")
    setPhone("")
    setTelephone("")
    setEmail("")
    setPurpose("")
    setEmergencyName("")
    setEmergencyNumber("")
    setEmergencyRelation("")
    setEmergencyRelationOther("")
    setOpenNewPatient(false)
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

          {/* ---------------- Patient and Schedule Details ---------------- */}
          <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2">
          {/* Search Patient */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
                <CardDescription>Search or create patient</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Search Patient</Label>
                  <Input
                    placeholder="Enter patient name or ID..."
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="w-full" onClick={handleCreateNewPatient}>
                  Create New Patient
                </Button>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule</CardTitle>
                <CardDescription>Select date and time</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-[2fr_2fr] gap-4">
                {/* Calendar */}
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />

                {/* Time Slots */}
                <div className="space-y-2">
                  <Label>Available Time Slots:</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedTime === slot ? "default" : "outline"}
                        onClick={() => setSelectedTime(slot)}
                        size="sm"
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ---------------- Appointment Details ---------------- */}
          <Card className="px-4 lg:px-6 mt-4">
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>
                Select department, provider, location, and purpose
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-[2fr_2fr]">
              <div className="grid gap-4">
                <div className="space-y-1">
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

                <div className="space-y-1">
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

                <div className="space-y-1">
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
              </div>

              {/* Purpose of Appointment */}
              <div className="grid gap-1">
                <Label htmlFor="appointmentPurpose">Purpose of Appointment</Label>
                <textarea
                  id="appointmentPurpose"
                  name="appointmentPurpose"
                  rows={6}
                  maxLength={600}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="border rounded-md p-2 resize-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-xs text-sm h-full"
                  placeholder="Briefly describe the purpose (e.g. consultation, annual checkup, lab interpretation)"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum 2 short paragraphs (600 characters)
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="px-4 lg:px-6">
            <div className="flex gap-2">
              <Button onClick={handleBookClick}>Book Appointment</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </div>

          {/* Confirm Booking Appointment Modal */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Confirm Appointment</DialogTitle>
                <DialogDescription className="mb-4">
                  Please review your appointment details before confirming.
                </DialogDescription>
              </DialogHeader>

            <div className="flex-1 overflow-y-auto pr-1 space-y-5">  
              {/* Patient Details */}
              <div className="grid gap-4">
                <Label className="font-semibold">Patient Details</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="grid gap-1">
                    <Label htmlFor="firstName" className="text-sm text-muted-foreground">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Juan"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="middleName" className="text-sm text-muted-foreground">Middle Name</Label>
                    <Input
                      id="middleName"
                      name="middleName"
                      placeholder="Santos"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="lastName" className="text-sm text-muted-foreground">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Dela Cruz"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="grid gap-1">
                    <Label htmlFor="contact" className="text-sm text-muted-foreground">Mobile Number</Label>
                    <Input
                      id="contact"
                      name="contact"
                      placeholder="09XXXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      inputMode="tel"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="telephone" className="text-sm text-muted-foreground">Telephone (optional)</Label>
                    <Input
                      id="telephone"
                      name="telephone"
                      placeholder="(02) XXXXXXX"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      inputMode="tel"
                    />
                  </div>
                </div>
              

                {/* Health Provider Details */}
                <Label className="font-semibold">Provider Details</Label>
                <div className="grid gap-1">
                  <Label htmlFor="provider" className="text-sm text-muted-foreground">Provider:</Label>
                  <Input id="provider" name="provider" value={selectedProvider} readOnly/>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="grid gap-1">
                    <Label htmlFor="department" className="text-sm text-muted-foreground">Specialty/Department:</Label>
                    <Input id="department" name="department" value={selectedDepartment} readOnly/>
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="location" className="text-sm text-muted-foreground">Location:</Label>
                    <Input id="location" name="location" value={selectedLocation} readOnly/>
                  </div>                
                </div>

                {/* Appointment Date and Time*/}
                <Label className="font-semibold">Appointment Details</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="grid gap-1">
                    <Label htmlFor="date" className="text-sm text-muted-foreground">Appointment Date:</Label>
                    <Input id="date" name="date" value={date ? date.toDateString() : ''} readOnly/>
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="time" className="text-sm text-muted-foreground">Appointment Time:</Label>
                    <Input id="time" name="time" value={selectedTime} readOnly/>
                  </div>
                </div>
              </div>

              {/* Appointment Purpose */}
              <div className="grid gap-1">
                <Label htmlFor="appointmentPurpose" className="text-sm text-muted-foreground">Purpose of Appointment</Label>
                <textarea
                  id="appointmentPurpose"
                  name="appointmentPurpose"
                  rows={3}
                  maxLength={600}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="border rounded-md p-2 resize-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-xs text-sm"
                  placeholder="Briefly describe the purpose (e.g. consultation, annual checkup, lab interpretation, etc.)"
                  readOnly
                />
                <p className="text-xs text-muted-foreground">
                  Maximum 2 short paragraphs (600 characters)
                </p>
              </div>
            
              <div className="mt-6 flex gap-2">
                <Button onClick={() => { setOpen(false); /* Logic to confirm booking */ }}>Confirm</Button>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              </div>
            </div>
            </DialogContent>
          </Dialog>

          {/* Create New Patient Modal */}
          <Dialog open={openNewPatient} onOpenChange={setOpenNewPatient}>
            <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Create New Patient Profile</DialogTitle>
                <DialogDescription className="mb-4">
                  Enter the patient&apos;s basic details to schedule their appointment.
                </DialogDescription>
              </DialogHeader>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-5">
                {/* Name Section */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="grid gap-1">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="Juan"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      name="middleName"
                      placeholder="Santos"
                      value={middleName}
                      onChange={(e) => setMiddleName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Dela Cruz"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Birthday + Age */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1">
                    <Label htmlFor="birthday">Birthday</Label>
                    <Input
                      id="birthday"
                      name="birthday"
                      type="date"
                      value={birthday}
                      onChange={handleBirthdayChange}
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      value={age || ""}
                      readOnly
                      className="bg-muted/10 cursor-default"
                      placeholder="Auto-calculated"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="grid gap-1">
                  <Label htmlFor="address">Current Address</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main St, City, Province"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1">
                    <Label htmlFor="contact">Mobile Number</Label>
                    <Input
                      id="contact"
                      name="contact"
                      placeholder="09XXXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      inputMode="tel"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="telephone">Telephone (optional)</Label>
                    <Input
                      id="telephone"
                      name="telephone"
                      placeholder="(02) XXXXXXX"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      inputMode="tel"
                    />
                  </div>
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="patient@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Divider */}
                <div className="border-t border-muted my-3"></div>

                {/* Emergency Contact */}
                <div className="grid gap-2">
                  <Label>Emergency Contact</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-1">
                      <Label htmlFor="emergencyName" className="text-sm text-muted-foreground">
                        Contact Name
                      </Label>
                      <Input
                        id="emergencyName"
                        name="emergencyName"
                        placeholder="Maria Dela Cruz"
                        value={emergencyName}
                        onChange={(e) => setEmergencyName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="emergencyNumber" className="text-sm text-muted-foreground">
                        Contact Number
                      </Label>
                      <Input
                        id="emergencyNumber"
                        name="emergencyNumber"
                        placeholder="09XXXXXXXXX"
                        value={emergencyNumber}
                        onChange={(e) => setEmergencyNumber(e.target.value)}
                        inputMode="tel"
                      />
                    </div>
                  </div>

                  {/* Relation */}
                  <div className="grid grid-cols-2 gap-3 items-end">
                    <div className="grid gap-1">
                      <Label htmlFor="emergencyRelation" className="text-sm text-muted-foreground">
                        Relationship
                      </Label>
                      <Select
                        value={emergencyRelation}
                        onValueChange={(value) => setEmergencyRelation(value)}
                      >
                        <SelectTrigger id="emergencyRelation" name="emergencyRelation" className="w-full">
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          {EMERGENCY_RELATIONSHIP_OPTIONS.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Conditional "Other" Relation Field */}
                    {emergencyRelation === "other" && (
                      <div className="grid gap-1">
                        <Label htmlFor="emergencyRelationOther" className="text-sm text-muted-foreground">
                          Please specify
                        </Label>
                        <Input
                          id="emergencyRelationOther"
                          name="emergencyRelationOther"
                          placeholder="e.g. friend, boss, neighbor"
                          value={emergencyRelationOther}
                          onChange={(e) => setEmergencyRelationOther(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 flex justify-end gap-2 border-t pt-3">
                <Button variant="outline" onClick={() => setOpenNewPatient(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    console.log("Creating new patient...");
                    setOpenNewPatient(false);
                    // Logic for creating new patient (to be added)
                  }}
                >
                  Create
                </Button>
              </div>
            </DialogContent>
          </Dialog>

        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
