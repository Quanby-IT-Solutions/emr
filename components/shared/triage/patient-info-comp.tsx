// PatientInfoComp with shadow added to checkbox and radio option containers

"use client"

import { useState, useId } from "react"
import { ChevronDownIcon, Clock, Ambulance, Bus, Car, Footprints, Hospital, Bike, CalendarClock } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface PatientInfoForm {
  firstName: string
  middleName: string
  lastName: string
  age: string
  occupation: string
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
  department: string
  departmentOther: string
}

interface PatientInfoCompProps {
  form: PatientInfoForm
  setForm: React.Dispatch<React.SetStateAction<PatientInfoForm>>
}

const arrivalModes = [
  { value: "ambulance", label: "Ambulance", icon: Ambulance },
  { value: "private-vehicle", label: "Private Vehicle", icon: Car },
  { value: "public-transport", label: "Public Transport", icon: Bus },
  { value: "walk-in", label: "Walk-in", icon: Footprints },
  { value: "transfer", label: "Transfer", icon: Hospital },
  { value: "other", label: "Other", icon: Bike },
]

const departments = [
  { value: "EMERGENCY", label: "Emergency" },
  { value: "OPD", label: "OPD" }, 
  { value: "WALK_IN", label: "Walk-in" },
  { value: "REFERRAL", label: "Referral" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "OTHER", label: "Other" },
]

const symptomsList = [
  { key: "fever", label: "Fever" },
  { key: "weakness", label: "Weakness" },
  { key: "chestPain", label: "Chest Pain" },
  { key: "difficultyBreathing", label: "Difficulty Breathing" },
  { key: "lossOfConsciousness", label: "Loss of Consciousness" },
  { key: "bleeding", label: "Bleeding" },
  { key: "others", label: "Others" },
]

export function PatientInfoComp({ form, setForm }: PatientInfoCompProps) {
  const id = useId()
  const [dateOpen, setDateOpen] = useState(false)

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

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Patient Information</h3>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="mb-1">First Name</Label>
          <Input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} placeholder="Juan" />
        </div>

        <div>
          <Label className="mb-1">Middle Name</Label>
          <Input value={form.middleName} onChange={e => setForm(f => ({ ...f, middleName: e.target.value }))} placeholder="Santos" />
        </div>

        <div>
          <Label className="mb-1">Last Name</Label>
          <Input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Dela Cruz" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="mb-1">Age</Label>
          <Input value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} placeholder="Age" />
        </div>

        <div>
          <Label className="mb-1">Occupation</Label>
          <Input value={form.occupation} onChange={e => setForm(f => ({ ...f, occupation: e.target.value }))} placeholder="Occupation" />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label className="text-base font-semibold">Arrival Details</Label>

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
            {arrivalModes.map((mode) => {
              const Icon = mode.icon
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

                  <Icon className="h-5 w-5 text-muted-foreground" />
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
          {symptomsList.map(symptom => (
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

        {/* Department --> to be editted */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground mt-6 mb-2">Department</Label>

          <RadioGroup value={form.department} onValueChange={(value) => setForm(f => ({ ...f, department: value }))} className="grid grid-cols-2 gap-3">
            {departments.map((dept) => {
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
      </div>  
    </div>
  )
}