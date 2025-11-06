"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {  ChevronsUpDown, Check } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { PatientDataTable } from "@/app/(dashboard)/scheduler/schedule/components/data-table-filtered"
import { Patient, mockPatients } from "@/app/(dashboard)/scheduler/dummy-data/dummy-patients"
import { Departments } from "@/app/(dashboard)/scheduler/dummy-data/dummy-providers"
import { ConfirmBookingModal } from "./components/modals/confirm-booking"
import { CreateNewPatientModal } from "./components/modals/create-new-patient"
import { GenerateBookingModal } from "./components/modals/generate-booking"

interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  emptyMessage?: string
}

function Combobox({ options, value, onChange, placeholder = "Select...", emptyMessage = "No results found." }: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const selectedLabel = options.find((option) => option.value === value)?.label || placeholder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 m-1">
        <Command>
          <CommandInput placeholder={`Search...`} />
          <CommandEmpty>{emptyMessage}</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem key={option.value} value={option.value} onSelect={(currentValue) => { onChange(currentValue === value ? "" : currentValue); setOpen(false) }}>
                <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default function ScheduleAppointmentPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const timeSlots = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "2:00 PM", "2:30 PM"]

  const [open, setOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>(undefined)
  const [selectedProvider, setSelectedProvider] = useState<string | undefined>(undefined)
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined)

  const [openNewPatient, setOpenNewPatient] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [purpose, setPurpose] = useState<string | undefined>("")
  const [telephone, setTelephone] = useState<string | undefined>("")
  const [openGenerateDetails, setOpenGenerateDetails] = useState(false)

  const handleBookClick = () => { console.log("Booking appointment..."); setOpen(true) }
  const handleCreateNewPatient = () => { console.log("Creating new patient..."); setOpenNewPatient(true) }
  const handleConfirmBooking = () => { console.log("Confirming booking..."); setOpen(false); setOpenGenerateDetails(true) }
  const handlePatientSelect = (patient: Patient | null) => { setSelectedPatient(patient) }

  const availableDepartments = useMemo(() => Departments.map((d) => d.department), [])
  const allLocations = useMemo(() => Array.from(new Set(Departments.map((d) => d.providers).flat().map((p) => p.officeLocation))), [])
  
  const availableProviders = useMemo(() => {
    if (!selectedDepartment) return Departments.flatMap((d) => d.providers)
    const dept = Departments.find((d) => d.department === selectedDepartment)
    return dept?.providers || []
  }, [selectedDepartment])

  const availableLocations = useMemo(() => {
    if (selectedProvider) {
      const provider = Departments.flatMap((d) => d.providers).find((p) => p.name === selectedProvider)
      return provider ? [provider.officeLocation] : allLocations
    }
    if (selectedDepartment) {
      const dept = Departments.find((d) => d.department === selectedDepartment)
      return dept ? [dept.clinicLocation] : allLocations
    }
    return allLocations
  }, [selectedDepartment, selectedProvider, allLocations])

  const handleDepartmentChange = (dept: string) => {
    setSelectedDepartment(dept)
    const deptData = Departments.find((d) => d.department === dept)
    if (selectedProvider) {
      const providerStillValid = deptData?.providers.some((p) => p.name === selectedProvider)
      if (!providerStillValid) setSelectedProvider("")
    }
  }
  const handleProviderChange = (providerName: string) => {
    setSelectedProvider(providerName)
    for (const dept of Departments) {
      const provider = dept.providers.find((p) => p.name === providerName)
      if (provider) {
        setSelectedDepartment(provider.department)
        setSelectedLocation(provider.officeLocation)
        break
      }
    }
  }
  const handleLocationChange = (loc: string) => {
    setSelectedLocation(loc)
    if (!selectedProvider) {
      const providerWithLocation = Departments.flatMap((d) => d.providers).find((p) => p.officeLocation === loc)
      if (providerWithLocation) {
        setSelectedProvider(providerWithLocation.name)
        setSelectedDepartment(providerWithLocation.department)
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
                <Button variant="outline" className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" onClick={handleCreateNewPatient}>
                  Create New Patient
                </Button>
              </CardHeader>
              <CardContent>
                <PatientDataTable data={mockPatients} onPatientSelect={handlePatientSelect} selectedPatientId={selectedPatient?.id || null} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule</CardTitle>
                <CardDescription>Select date and time</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-[2fr_2fr] gap-4">
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
                <div className="space-y-2">
                  <Label>Available Time Slots:</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {timeSlots.map((slot) => (
                      <Button key={slot} variant={selectedTime === slot ? "default" : "outline"} onClick={() => setSelectedTime(slot)} size="sm">{slot}</Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 px-4 lg:px-6 mb-4">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
                <CardDescription>Select department, provider, location, and purpose</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-[2fr_2fr]">
                <div className="grid gap-4">
                  <div className="space-y-1">
                    <Label>Specialty/Department</Label>
                    <Combobox 
                      options={availableDepartments.map((d) => ({ value: d, label: d }))} 
                      value={selectedDepartment} 
                      onChange={handleDepartmentChange} 
                      placeholder="Select department" 
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Provider</Label>
                    <Combobox 
                      options={availableProviders.map((p) => ({ value: p.name, label: p.name }))} 
                      value={selectedProvider} 
                      onChange={handleProviderChange} 
                      placeholder="Select provider" 
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Location</Label>
                    <Combobox 
                      options={availableLocations.map((loc) => ({ value: loc, label: loc }))} 
                      value={selectedLocation} 
                      onChange={handleLocationChange} 
                      placeholder="Select location" 
                    />
                  </div>
                </div>

                <div className="grid gap-1">
                  <Label htmlFor="appointmentPurpose">Purpose of Appointment</Label>
                  <textarea id="appointmentPurpose" rows={6} maxLength={600} value={purpose} onChange={(e) => setPurpose(e.target.value)} className="border rounded-md p-2 resize-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-xs text-sm h-full" placeholder="Briefly describe the purpose" />
                  <p className="text-xs text-muted-foreground">Maximum 600 characters</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="px-4 lg:px-6">
            <div className="flex gap-2">
              <Button onClick={handleBookClick} disabled={!selectedPatient}>Book Appointment</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </div>

          <ConfirmBookingModal 
            open={open} 
            onOpenChange={setOpen} 
            selectedPatient={selectedPatient} 
            selectedProvider={selectedProvider} 
            selectedDepartment={selectedDepartment} 
            selectedLocation={selectedLocation} 
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
            selectedLocation={selectedLocation} 
            date={date} 
            selectedTime={selectedTime} 
            purpose={purpose} 
          />

          <CreateNewPatientModal 
            open={openNewPatient} 
            onOpenChange={setOpenNewPatient} 
            onCreate={(patientData) => { 
              console.log("New patient created:", patientData); 
              setOpenNewPatient(false) 
            }} 
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
