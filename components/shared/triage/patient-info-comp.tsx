"use client"

import { useState, useId } from "react"
import { ChevronDownIcon, Ambulance, Bus, Car, Footprints, Hospital, Bike, CalendarClock, CheckIcon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ARRIVAL_MODES, ARRIVAL_STATUS, DEPARTMENTS, SYMPTOMS_LIST, TriageEntry } from "@/app/(dashboard)/dummy-data/dummy-triage"

type PatientInfoFields = {
  patientId: string
  patientName: string
  firstName: string
  middleName: string
  lastName: string
  age: string
  sex: string
  phoneNumber: string
  address: string
  occupation: string
  companionName: string
  companionContact: string
  companionRelation: string
  arrivalStatus: string
  complaint: string
  symptoms: {
    chestPain: boolean
    difficultyBreathing: boolean
    fever: boolean
    weakness: boolean
    lossOfConsciousness: boolean
    bleeding: boolean
    others: boolean
  }
  symptomsOther: string
  arrivalDate: Date | undefined
  arrivalTime: string
  arrivalMode: string
  arrivalModeOther: string
  transferredFrom: string
  department: string
  departmentOther: string
  referredBy: string
}

interface PatientInfoCompProps<T extends PatientInfoFields> {
  form: T
  setForm: React.Dispatch<React.SetStateAction<T>>
  existingPatients: Array<{ id: string; name: string }>
}

export function PatientInfoComp<T extends PatientInfoFields>({ 
  form, 
  setForm,
  existingPatients 
}: PatientInfoCompProps<T>) {
  const id = useId()
  const [dateOpen, setDateOpen] = useState(false)
  const [comboOpen, setComboOpen] = useState(false)

  const handleSetToday = () => {
    const now = new Date()
    const timeString = now.toTimeString().slice(0, 8)
    setForm(f => ({ ...f, arrivalDate: now, arrivalTime: timeString }))
  }

  const toggleSymptom = (key: string) => {
    setForm(f => ({
      ...f,
      symptoms: { ...f.symptoms, [key]: !f.symptoms[key as keyof typeof f.symptoms] }
    }))
  }

  const handlePatientSelect = (selectedName: string) => {
    const patient = TriageEntry.find(entry => entry.patient.name === selectedName)
    
    if (patient) {
      setForm(f => ({
        ...f,
        patientId: patient.patient.id,
        patientName: patient.patient.name,
        firstName: patient.patient.firstName,
        middleName: patient.patient.middleName,
        lastName: patient.patient.lastName,
        age: patient.patient.age,
        sex: patient.patient.sex,
        phoneNumber: patient.patient.phoneNumber.toString(),
        address: patient.patient.address,
        occupation: patient.patient.occupation,
      }))
    }
    setComboOpen(false)
  }

  const handleManualNameChange = (name: string) => {
    setForm(f => ({
      ...f,
      patientName: name,
      patientId: "",
    }))
  }

  const getArrivalStatusClasses = (statusValue: string) => {
    if (statusValue === "alive") {
      return "has-data-[state=checked]:border-green-500 has-data-[state=checked]:bg-green-50"
    }
    if (statusValue === "dead-on-arrival") {
      return "has-data-[state=checked]:border-slate-500 has-data-[state=checked]:bg-slate-100"
    }
    return ""
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Patient Information</h3>

      {/* Patient Search Combobox */}
      <div className="space-y-2">
        <Label>Search Patient</Label>
        <Popover open={comboOpen} onOpenChange={setComboOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={comboOpen}
              className="w-full justify-between h-auto py-2"
            >
              {form.patientId ? (
                <span className="flex flex-col items-start">
                  <span className="font-medium">{form.patientName}</span>
                  <span className="text-xs text-muted-foreground">{form.patientId}</span>
                </span>
              ) : (
                <span className="text-muted-foreground">Search existing patient or enter new</span>
              )}
              <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput 
                placeholder="Search patient..." 
                value={form.patientName}
                onValueChange={handleManualNameChange}
              />
              <CommandList>
                <CommandEmpty>No patient found. Type to add new patient.</CommandEmpty>
                <CommandGroup>
                  {existingPatients.map((patient) => (
                    <CommandItem
                      key={patient.id}
                      value={patient.name}
                      onSelect={() => handlePatientSelect(patient.name)}
                    >
                      <span className="flex flex-col flex-1">
                        <span className="font-medium">{patient.name}</span>
                        <span className="text-xs text-muted-foreground">{patient.id}</span>
                      </span>
                      {form.patientId === patient.id && (
                        <CheckIcon className="ml-auto h-4 w-4" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Patient Name (Read-only or Manual Entry) */}
      <div>
        <Label className="mb-1">Patient Name</Label>
        <Input 
          value={form.patientName} 
          onChange={e => handleManualNameChange(e.target.value)}
          placeholder="Enter patient full name" 
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        <div>
          <Label className="mb-1">Age</Label>
          <Input value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} placeholder="Age" />
        </div>

        <div>
          <Label className="mb-1">Sex</Label>
          <Input value={form.sex} onChange={e => setForm(f => ({ ...f, sex: e.target.value }))} placeholder="M/F" />
        </div>

        <div className="col-span-2">
          <Label className="mb-1">Occupation</Label>
          <Input value={form.occupation} onChange={e => setForm(f => ({ ...f, occupation: e.target.value }))} placeholder="Occupation" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="mb-1">Phone Number</Label>
          <Input value={form.phoneNumber} onChange={e => setForm(f => ({ ...f, phoneNumber: e.target.value }))} placeholder="09171234567" />
        </div>

        <div>
          <Label className="mb-1">Address</Label>
          <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Complete Address" />
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label className="text-base font-semibold">Companion Information</Label>
        
        <div>
          <Label className="mb-1 text-sm text-muted-foreground">Companion Name</Label>
          <Input value={form.companionName} onChange={e => setForm(f => ({ ...f, companionName: e.target.value }))} placeholder="Full Name" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="mb-1 text-sm text-muted-foreground">Contact Number</Label>
            <Input value={form.companionContact} onChange={e => setForm(f => ({ ...f, companionContact: e.target.value }))} placeholder="09171234567" />
          </div>

          <div>
            <Label className="mb-1 text-sm text-muted-foreground">Relation</Label>
            <Input value={form.companionRelation} onChange={e => setForm(f => ({ ...f, companionRelation: e.target.value }))} placeholder="e.g., Spouse, Parent" />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-base font-semibold">Arrival Details</Label>

        {/* Arrival Status - 2 options only, wider */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium leading-none text-muted-foreground">Arrival Status</legend>
          <RadioGroup 
            className="grid grid-cols-2 gap-4" 
            value={form.arrivalStatus}
            onValueChange={(value) => setForm(f => ({ ...f, arrivalStatus: value }))}
          >
            {ARRIVAL_STATUS.map(status => (
              <label
                key={`${id}-status-${status.value}`}
                className={`border-input has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex flex-col items-center gap-2 rounded-md border px-4 py-4 text-center shadow-sm transition-all outline-none has-focus-visible:ring-[3px] cursor-pointer ${getArrivalStatusClasses(status.value)}`}
              >
                <RadioGroupItem
                  id={`${id}-status-${status.value}`}
                  value={status.value}
                  className="sr-only after:absolute after:inset-0"
                  aria-label={`arrival-status-${status.value}`}
                />
                <p className="text-sm leading-none font-medium">{status.label}</p>
              </label>
            ))}
          </RadioGroup>
        </fieldset>

        <div className="grid grid-cols-[auto_auto_0.5fr] gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="date-picker" className="text-sm text-muted-foreground">Arrival Date</Label>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" id="date-picker" className="w-full justify-between font-normal">
                  {form.arrivalDate ? form.arrivalDate.toLocaleDateString() : 'Pick a date'}
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar mode="single" selected={form.arrivalDate} onSelect={(selectedDate) => { setForm(f => ({ ...f, arrivalDate: selectedDate })); setDateOpen(false); }} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="time-picker" className="text-sm text-muted-foreground">Arrival Time</Label>
            <Input type="time" id="time-picker" step="1" value={form.arrivalTime} onChange={e => setForm(f => ({ ...f, arrivalTime: e.target.value }))} className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden" />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm text-muted-foreground">Set to Now</Label>
            <Button type="button" onClick={handleSetToday} className="w-full bg-blue-500 hover:bg-blue-600 text-white shadow-sm">
              <CalendarClock className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Arrival Mode</Label>

          <RadioGroup value={form.arrivalMode} onValueChange={(value) => setForm(f => ({ ...f, arrivalMode: value }))} className="grid grid-cols-2 gap-3">
            {ARRIVAL_MODES.map((mode) => {
              const IconComponent = mode.icon === "Ambulance" ? Ambulance : 
                                   mode.icon === "Car" ? Car :
                                   mode.icon === "Bus" ? Bus :
                                   mode.icon === "Footprints" ? Footprints :
                                   mode.icon === "Hospital" ? Hospital : Bike
              const checked = form.arrivalMode === mode.value

              return (
                <div
                  key={`${id}-${mode.value}`}
                  onClick={() => setForm(f => ({ ...f, arrivalMode: mode.value }))}
                  className={`flex items-center justify-between p-3 border rounded-sm cursor-pointer transition-colors shadow-sm hover:shadow-md ${
                    checked ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem id={`${id}-${mode.value}`} value={mode.value} className="pointer-events-none" />
                    <Label htmlFor={`${id}-${mode.value}`} className="cursor-pointer pointer-events-none">{mode.label}</Label>
                  </div>

                  <IconComponent className="h-5 w-5 text-muted-foreground" />
                </div>
              )
            })}
          </RadioGroup>
        </div>

        {form.arrivalMode === "other" && (
          <div className="space-y-2">
            <Label htmlFor="arrivalModeOther" className="text-sm text-muted-foreground">Please Specify:</Label>
            <Input id="arrivalModeOther" value={form.arrivalModeOther} onChange={e => setForm(f => ({ ...f, arrivalModeOther: e.target.value }))} placeholder="Enter mode of arrival" />
          </div>
        )}

        {form.arrivalMode === "transfer" && (
          <div className="space-y-2">
            <Label htmlFor="transferredFrom" className="text-sm text-muted-foreground">Transferred From (Hospital/Clinic):</Label>
            <Input id="transferredFrom" value={form.transferredFrom} onChange={e => setForm(f => ({ ...f, transferredFrom: e.target.value }))} placeholder="Enter hospital or clinic name" />
          </div>
        )}
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-base font-semibold">Health Concern Details</Label>
        <Label>Chief Complaint</Label>
        <Input value={form.complaint} onChange={e => setForm(f => ({ ...f, complaint: e.target.value }))} placeholder="Describe the concern" />
      </div>

      <div className="space-y-3">
        <Label className="text-sm text-muted-foreground">Symptoms</Label>
        <div className="grid grid-cols-2 gap-3">
          {SYMPTOMS_LIST.map(symptom => (
            <div
              key={symptom.key}
              onClick={() => toggleSymptom(symptom.key)}
              className={`flex items-center space-x-3 p-3 border rounded-sm cursor-pointer transition-colors shadow-sm hover:shadow-md ${
                form.symptoms[symptom.key as keyof typeof form.symptoms]
                  ? 'bg-blue-50 border-blue-200'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
            >
              <Checkbox id={`symptom-${symptom.key}`} checked={form.symptoms[symptom.key as keyof typeof form.symptoms]} onCheckedChange={() => {}} />
              <Label htmlFor={`symptom-${symptom.key}`} className="text-sm font-medium cursor-pointer flex-1 pointer-events-none">
                {symptom.label}
              </Label>
            </div>
          ))}
        </div>

        {form.symptoms.others && (
          <div className="space-y-2 mt-3">
            <Label htmlFor="symptomsOther" className="text-sm text-muted-foreground">Please Specify:</Label>
            <Input id="symptomsOther" value={form.symptomsOther} onChange={e => setForm(f => ({ ...f, symptomsOther: e.target.value }))} placeholder="Specify other symptoms" />
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground mt-6 mb-2">Department/Origin</Label>

          <RadioGroup value={form.department} onValueChange={(value) => setForm(f => ({ ...f, department: value }))} className="grid grid-cols-2 gap-3">
            {DEPARTMENTS.map((dept) => {
              const checked = form.department === dept.value

              return (
                <div
                  key={`${id}-${dept.value}`}
                  onClick={() => setForm(f => ({ ...f, department: dept.value }))}
                  className={`flex items-center justify-between p-3 border rounded-sm cursor-pointer transition-colors shadow-sm hover:shadow-md ${
                    checked ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem id={`${id}-${dept.value}`} value={dept.value} className="pointer-events-none" />
                    <Label htmlFor={`${id}-${dept.value}`} className="cursor-pointer pointer-events-none">{dept.label}</Label>
                  </div>
                </div>
              )
            })}
          </RadioGroup>
        </div>

        {form.department === "OTHER" && (
          <div className="space-y-2">
            <Label htmlFor="departmentOther" className="text-sm text-muted-foreground">Please Specify:</Label>
            <Input id="departmentOther" value={form.departmentOther} onChange={e => setForm(f => ({ ...f, departmentOther: e.target.value }))} placeholder="Specify the department" />
          </div>
        )}

        {form.department === "REFERRAL" && (
          <div className="space-y-2">
            <Label htmlFor="referredBy" className="text-sm text-muted-foreground">Referred By (Doctor/Facility):</Label>
            <Input id="referredBy" value={form.referredBy} onChange={e => setForm(f => ({ ...f, referredBy: e.target.value }))} placeholder="e.g., Dr. Juan Dela Cruz - City Health Center" />
          </div>
        )}
      </div>  
    </div>
  )
}