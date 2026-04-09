"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Combobox } from "@/components/ui/combo-box"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface AdmissionOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const patientOptions = [
  { value: "p1", label: "John Doe (MRN-001)" },
  { value: "p2", label: "Jane Smith (MRN-002)" },
  { value: "p3", label: "Bob Wilson (MRN-003)" },
  { value: "p4", label: "Maria Garcia (MRN-004)" },
]

const attendingOptions = [
  { value: "dr1", label: "Dr. Sarah Johnson" },
  { value: "dr2", label: "Dr. David Martinez" },
  { value: "dr3", label: "Dr. Lisa Park" },
  { value: "dr4", label: "Dr. Michael Chen" },
]

export function AdmissionOrderDialog({ open, onOpenChange }: AdmissionOrderDialogProps) {
  const [selectedPatient, setSelectedPatient] = useState("")
  const [admittingDiagnosis, setAdmittingDiagnosis] = useState("")
  const [preferredUnit, setPreferredUnit] = useState("")
  const [levelOfCare, setLevelOfCare] = useState("")
  const [selectedAttending, setSelectedAttending] = useState("")
  const [additionalNotes, setAdditionalNotes] = useState("")

  const resetForm = () => {
    setSelectedPatient("")
    setAdmittingDiagnosis("")
    setPreferredUnit("")
    setLevelOfCare("")
    setSelectedAttending("")
    setAdditionalNotes("")
  }

  const handleSubmit = () => {
    if (!selectedPatient || !admittingDiagnosis || !preferredUnit) {
      toast.error("Please fill in required fields")
      return
    }
    const patient = patientOptions.find((p) => p.value === selectedPatient)
    toast.success("Admission order placed", {
      description: `${patient?.label} — ${admittingDiagnosis}`,
    })
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Place Admission Order</DialogTitle>
          <DialogDescription>
            Create a new admission order for a patient
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Patient *</Label>
            <Combobox
              options={patientOptions}
              value={selectedPatient}
              onChange={setSelectedPatient}
              placeholder="Search patient..."
              emptyMessage="No patients found."
            />
          </div>

          <div className="space-y-2">
            <Label>Admitting Diagnosis *</Label>
            <Input
              placeholder="e.g., Acute chest pain, Rule out MI"
              value={admittingDiagnosis}
              onChange={(e) => setAdmittingDiagnosis(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Preferred Unit *</Label>
              <Select value={preferredUnit} onValueChange={setPreferredUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ICU">ICU</SelectItem>
                  <SelectItem value="MED_SURG">Medical-Surgical</SelectItem>
                  <SelectItem value="TELEMETRY">Telemetry</SelectItem>
                  <SelectItem value="PEDIATRICS">Pediatrics</SelectItem>
                  <SelectItem value="CARDIAC">Cardiac Care</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Level of Care</Label>
              <Select value={levelOfCare} onValueChange={setLevelOfCare}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="STEP_DOWN">Step-Down</SelectItem>
                  <SelectItem value="INTENSIVE">Intensive</SelectItem>
                  <SelectItem value="OBSERVATION">Observation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Attending Provider</Label>
            <Combobox
              options={attendingOptions}
              value={selectedAttending}
              onChange={setSelectedAttending}
              placeholder="Search provider..."
              emptyMessage="No providers found."
            />
          </div>

          <div className="space-y-2">
            <Label>Additional Notes</Label>
            <Textarea
              placeholder="Special instructions, isolation precautions, etc."
              rows={3}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedPatient || !admittingDiagnosis || !preferredUnit}>
            Place Admission Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
