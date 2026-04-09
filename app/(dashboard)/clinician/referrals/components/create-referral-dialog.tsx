"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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

interface CreateReferralDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const patientOptions = [
  { value: "p1", label: "John Doe (MRN-001)" },
  { value: "p2", label: "Jane Smith (MRN-002)" },
  { value: "p3", label: "Bob Wilson (MRN-003)" },
  { value: "p4", label: "Maria Garcia (MRN-004)" },
]

const specialtyOptions = [
  "Cardiology",
  "Endocrinology",
  "Gastroenterology",
  "Nephrology",
  "Neurology",
  "Oncology",
  "Orthopedics",
  "Pulmonology",
  "Rheumatology",
  "Surgery",
]

const providerOptions: Record<string, { value: string; label: string }[]> = {
  Cardiology: [
    { value: "card1", label: "Dr. Amanda Rivera" },
    { value: "card2", label: "Dr. Thomas Nguyen" },
  ],
  Endocrinology: [
    { value: "endo1", label: "Dr. Rachel Kim" },
  ],
  Gastroenterology: [
    { value: "gi1", label: "Dr. Henry Ito" },
  ],
  Nephrology: [
    { value: "neph1", label: "Dr. Fatima Al-Rashid" },
  ],
  Neurology: [
    { value: "neuro1", label: "Dr. Brian O'Connor" },
  ],
  Oncology: [
    { value: "onc1", label: "Dr. Clara Vasquez" },
  ],
  Orthopedics: [
    { value: "ortho1", label: "Dr. James Miller" },
  ],
  Pulmonology: [
    { value: "pulm1", label: "Dr. Angela Peters" },
  ],
  Rheumatology: [
    { value: "rheum1", label: "Dr. Kenji Tanaka" },
  ],
  Surgery: [
    { value: "surg1", label: "Dr. Elizabeth Grant" },
    { value: "surg2", label: "Dr. Omar Hassan" },
  ],
}

const attachableNotes = [
  { id: "n1", label: "Progress Note — Nov 7, 2025" },
  { id: "n2", label: "H&P — Nov 1, 2025" },
  { id: "n3", label: "Lab Results — Nov 6, 2025" },
  { id: "n4", label: "Imaging Report — Nov 5, 2025" },
]

export function CreateReferralDialog({ open, onOpenChange }: CreateReferralDialogProps) {
  const [selectedPatient, setSelectedPatient] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [selectedProvider, setSelectedProvider] = useState("")
  const [reason, setReason] = useState("")
  const [priority, setPriority] = useState("Routine")
  const [attachedNotes, setAttachedNotes] = useState<string[]>([])

  const currentProviders = specialty ? (providerOptions[specialty] ?? []) : []

  const resetForm = () => {
    setSelectedPatient("")
    setSpecialty("")
    setSelectedProvider("")
    setReason("")
    setPriority("Routine")
    setAttachedNotes([])
  }

  const toggleNote = (id: string) => {
    setAttachedNotes((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    )
  }

  const handleSubmit = () => {
    if (!selectedPatient || !specialty || !reason) {
      toast.error("Please fill in required fields")
      return
    }
    const patient = patientOptions.find((p) => p.value === selectedPatient)
    toast.success("Referral created", {
      description: `${patient?.label} → ${specialty}`,
    })
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Referral</DialogTitle>
          <DialogDescription>
            Refer a patient to a specialist or service
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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Specialty *</Label>
              <Select
                value={specialty}
                onValueChange={(v) => {
                  setSpecialty(v)
                  setSelectedProvider("")
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialtyOptions.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Provider</Label>
              <Combobox
                options={currentProviders}
                value={selectedProvider}
                onChange={setSelectedProvider}
                placeholder="Search provider..."
                emptyMessage="No providers for this specialty."
                disabled={!specialty}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Reason for Referral *</Label>
            <Textarea
              placeholder="Clinical indication and specific questions for the consultant..."
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <RadioGroup value={priority} onValueChange={setPriority} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Routine" id="pri-routine" />
                <Label htmlFor="pri-routine" className="font-normal">Routine</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Urgent" id="pri-urgent" />
                <Label htmlFor="pri-urgent" className="font-normal">Urgent</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Attach Notes</Label>
            <div className="space-y-2">
              {attachableNotes.map((note) => (
                <div key={note.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={note.id}
                    checked={attachedNotes.includes(note.id)}
                    onCheckedChange={() => toggleNote(note.id)}
                  />
                  <Label htmlFor={note.id} className="font-normal text-sm">
                    {note.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedPatient || !specialty || !reason}>
            Create Referral
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
