"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { useState, useMemo, useCallback } from "react"
import { PatientDataTable } from "@/app/(dashboard)/scheduler/schedule/components/data-table-filtered"
import { Patient, PatientEntry } from "@/app/(dashboard)/dummy-data/dummy-patients"
import { Departments, mockWeeklyAvailability } from "@/app/(dashboard)/dummy-data/dummy-providers"
import { ConfirmBookingModal } from "./components/modals/confirm-booking"
import { CreateNewPatientModal } from "./components/modals/create-new-patient"
import { GenerateBookingModal } from "./components/modals/generate-booking"
import { Combobox } from "@/components/ui/combo-box"
import { Input } from "@/components/ui/input"
import { CirclePlus } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function ScheduleAppointmentPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const [open, setOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined)
  const [selectedProvider, setSelectedProvider] = useState<string | undefined>(undefined)
  const [selectedDeptLocation, setSelectedDeptLocation] = useState<string | undefined>(undefined)
  const [selectedOfficeLocation, setSelectedOfficeLocation] = useState<string | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)

  const [openNewPatient, setOpenNewPatient] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [purpose, setPurpose] = useState<string | undefined>("")
  const [telephone, setTelephone] = useState<string | undefined>("")
  const [openGenerateDetails, setOpenGenerateDetails] = useState(false)

  // Patient list state
  const [patients, setPatients] = useState<Patient[]>(PatientEntry)

  // Handlers
  const handleBookClick = () => { 
    console.log("Booking appointment...") 
    setOpen(true) 
  }
  
  const handleCreateNewPatient = () => { 
    console.log("Creating new patient...") 
    setOpenNewPatient(true) 
  }
  
  const handleConfirmBooking = () => { 
    console.log("Confirming booking...") 
    setOpen(false) 
    setOpenGenerateDetails(true) 
  }
  
  const handlePatientSelect = (patient: Patient | null) => { 
    setSelectedPatient(patient) 
  }

  // Handle creating new patient
  const handleCreatePatient = useCallback((patientData: {
    firstName: string
    middleName?: string
    lastName: string
    address?: string
    birthday?: string
    age?: number
    phone?: string
    telephone?: string
    email?: string
    emergencyName?: string
    emergencyNumber?: string
    emergencyRelation?: string
    emergencyRelationOther?: string
  }) => {
    // Generate new patient ID
    const newId = `P${String(patients.length + 1).padStart(3, '0')}`
    
    // Create new patient object matching the Patient interface
    const newPatient: Patient = {
      id: newId,
      firstName: patientData.firstName,
      middleName: patientData.middleName || "",
      lastName: patientData.lastName,
      mobileNumber: patientData.phone || "",
      birthday: patientData.birthday || "",
      age: patientData.age || 0,
    }
    
    console.log("Creating new patient:", newPatient)
    
    // Add to patient list
    setPatients(prev => [...prev, newPatient])
    
    // Automatically select the new patient
    setSelectedPatient(newPatient)
    setOpenNewPatient(false)
  }, [patients.length])

  // Check if booking is valid
  const isBookingValid = useMemo(() => {
    return !!(selectedPatient && selectedProvider && date && selectedTime)
  }, [selectedPatient, selectedProvider, date, selectedTime])

  // Appointment Details - Available Options
  
  const availableDepartments = useMemo(() => 
    Departments.map((d) => d.department), 
    []
  )

  const availableProviders = useMemo(() => {
    if (!selectedDepartment) return Departments.flatMap((d) => d.providers)
    const dept = Departments.find((d) => d.department === selectedDepartment)
    return dept?.providers || []
  }, [selectedDepartment])

  // Get available time slots based on selected provider and date
  const availableTimeSlots = useMemo(() => {
    if (!selectedProvider || !date) return []
    
    // Get day of week from selected date
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const dayOfWeek = dayNames[date.getDay()]
    
    // Get time slots for this provider on this day
    const providerSchedule = mockWeeklyAvailability[selectedProvider]
    if (!providerSchedule) return []
    
    return providerSchedule[dayOfWeek] || []
  }, [selectedProvider, date])

  // Appointment Detail Handlers
  const handleDepartmentChange = (dept: string) => {
    if (!dept) {
      setSelectedDepartment(undefined)
      setSelectedDeptLocation(undefined)
      return
    }
    
    setSelectedDepartment(dept)
    
    const deptData = Departments.find((d) => d.department === dept)
    setSelectedDeptLocation(deptData?.clinicLocation)

    // If current provider doesn't belong to this department, clear it
    if (selectedProvider) {
      const providerStillValid = deptData?.providers.some((p) => p.name === selectedProvider)
      if (!providerStillValid) {
        setSelectedProvider(undefined)
        setSelectedOfficeLocation(undefined)
      }
    }
  }

  const handleProviderChange = (providerName: string) => {
    if (!providerName) {
      setSelectedProvider(undefined)
      setSelectedOfficeLocation(undefined)
      return
    }
    
    setSelectedProvider(providerName)
    
    // Find the provider and fill in ALL related fields
    for (const dept of Departments) {
      const provider = dept.providers.find((p) => p.name === providerName)
      if (provider) {
        setSelectedDepartment(provider.department)
        setSelectedDeptLocation(dept.clinicLocation)
        setSelectedOfficeLocation(provider.officeLocation)
        break
      }
    }
  }

  return (
    <ProtectedRoute requiredRole={UserRole.SCHEDULER}>
      <DashboardLayout role={UserRole.SCHEDULER}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Schedule Appointment</h1>
            <p className="text-muted-foreground">Book a new appointment for a patient</p>
          </div>

          <div className="grid gap-4 px-4 lg:px-6 md:grid-cols-2">
            <Card>
              <CardHeader className="grid md:grid-cols-[2fr_1fr]">
                <div>
                  <CardTitle>Patient Information</CardTitle>
                  <CardDescription>Search or create patient</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" 
                  onClick={handleCreateNewPatient}
                >
                  <CirclePlus className="h-4 w-4" />
                  Create New Patient
                </Button>
              </CardHeader>
              <CardContent>
                <PatientDataTable 
                  data={patients} 
                  onPatientSelect={handlePatientSelect} 
                  selectedPatientId={selectedPatient?.id || null} 
                />
              </CardContent>
            </Card>

            <div className="grid row-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Details</CardTitle>
                  <CardDescription>Select department, provider, location, and purpose</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-1 ml-4 mr-4">
                    <Separator className="mb-4" />
                    <div className="grid gap-4 mb-2">
                      <Label className="font-semibold">Health Provider Details</Label>
                      <div className="space-y-1 m-1">
                        <Label>Specialty/Department</Label>
                          <Combobox 
                            options={availableDepartments.map((d) => ({ value: d, label: d }))} 
                            value={selectedDepartment} 
                            onChange={handleDepartmentChange} 
                            placeholder="Select department" 
                          />
                      </div>
                      <div className="space-y-1 m-1">
                        <Label>Department Location</Label>
                          <Input
                            type="text"
                            value={selectedDeptLocation || ""}
                            readOnly
                            className="w-full border rounded-md px-2 p-2 bg-muted text-sm"
                            placeholder="Department Building"
                          />
                      </div>
                    </div>
                      
                    <div className="grid gap-4">
                      <div className="space-y-1 m-1">
                        <Label>Physician</Label>
                        <Combobox 
                          options={availableProviders.map((p) => ({ value: p.name, label: p.name }))} 
                          value={selectedProvider} 
                          onChange={handleProviderChange} 
                          placeholder="Select provider" 
                        />
                      </div>

                      <div className="space-y-1 m-1">
                        <Label>Office Location</Label>
                        <Input
                          type="text"
                          value={selectedOfficeLocation || ""}
                          readOnly
                          className="w-full border rounded-md px-2 p-2 bg-muted text-sm"
                          placeholder="Office Room"
                        />
                      </div>
                    </div>
                  </div>                  
                  
                  
                  <div className="grid gap-1 m-4">
                    <Separator className="my-2" />
                    <Label htmlFor="appointmentPurpose" className="font-semibold mt-3 mb-3">Purpose of Appointment</Label>
                    <textarea 
                      id="appointmentPurpose" 
                      rows={15} 
                      maxLength={600} 
                      value={purpose} 
                      onChange={(e) => setPurpose(e.target.value)} 
                      className="border rounded-md p-2 resize-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-xs text-sm h-full" 
                      placeholder="Briefly describe the purpose" 
                    />
                    <p className="text-xs text-muted-foreground">Maximum 600 characters</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>
                  Schedule
                </CardTitle>
                <CardDescription>Select date and time</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-[2fr_2fr] gap-4">
                <Calendar 
                  mode="single" 
                  selected={date} 
                  onSelect={setDate} 
                  className="rounded-md border" 
                />
                <div className="space-y-2">
                  <Label>Available Time Slots:</Label>
                  {!selectedProvider ? (
                    <div className="flex items-center justify-center text-sm text-muted-foreground rounded-md p-4">
                      Please select a provider first to view available time slots
                    </div>
                  ) : availableTimeSlots.length === 0 ? (
                    <div className="flex items-center justify-center text-sm text-muted-foreground rounded-md p-4">
                      No available time slots for {date?.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-1">
                      {availableTimeSlots.map((slot) => (
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
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="px-4 lg:px-6">
            <div className="flex gap-2">
              <Button 
                onClick={handleBookClick} 
                disabled={!isBookingValid}
              >
                Book Appointment
              </Button>
              <Button variant="outline">Cancel</Button>
            </div>
            {!isBookingValid && (
              <p className="text-xs text-muted-foreground mt-2">
                {!selectedPatient && "Please select a patient. "}
                {!selectedProvider && "Please select a provider. "}
                {!date && "Please select a date. "}
                {!selectedTime && "Please select a time slot. "}
              </p>
            )}
          </div>

          <ConfirmBookingModal 
            open={open} 
            onOpenChange={setOpen} 
            selectedPatient={selectedPatient} 
            selectedProvider={selectedProvider} 
            selectedDepartment={selectedDepartment} 
            selectedDeptLocation={selectedDeptLocation} 
            selectedOfficeLocation={selectedOfficeLocation}
            date={date} 
            selectedTime={selectedTime} 
            purpose={purpose} 
            telephone={telephone} 
            onTelephoneChange={setTelephone} 
            onPurposeChange={setPurpose} 
            onConfirm={handleConfirmBooking} 
          />

          <GenerateBookingModal 
            open={openGenerateDetails} 
            onOpenChange={setOpenGenerateDetails} 
            selectedPatient={selectedPatient} 
            selectedProvider={selectedProvider} 
            selectedDepartment={selectedDepartment} 
            selectedDeptLocation={selectedDeptLocation} 
            selectedOfficeLocation={selectedOfficeLocation}
            date={date} 
            selectedTime={selectedTime} 
            purpose={purpose} 
          />

          <CreateNewPatientModal 
            open={openNewPatient} 
            onOpenChange={setOpenNewPatient} 
            onCreate={handleCreatePatient}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}