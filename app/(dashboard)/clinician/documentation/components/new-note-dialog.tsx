"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Combobox } from "@/components/ui/combo-box"

export type NoteTemplate =
  | "H&P"
  | "SOAP Progress Note"
  | "Consultation"
  | "Discharge Summary"
  | "Telephone Encounter"

interface NewNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (payload: {
    patientId: string
    patientName: string
    mrn: string
    template: NoteTemplate
    sections: Array<{ title: string; content: string }>
    status: "Draft" | "Signed"
  }) => void
}

const patientOptions = [
  { value: "1", label: "John Doe (MRN-001)" },
  { value: "2", label: "Jane Smith (MRN-002)" },
  { value: "3", label: "Bob Wilson (MRN-003)" },
  { value: "4", label: "Maria Garcia (MRN-004)" },
  { value: "5", label: "Emily Davis (MRN-011)" },
]

const patientMeta: Record<string, { name: string; mrn: string }> = {
  "1": { name: "John Doe", mrn: "MRN-001" },
  "2": { name: "Jane Smith", mrn: "MRN-002" },
  "3": { name: "Bob Wilson", mrn: "MRN-003" },
  "4": { name: "Maria Garcia", mrn: "MRN-004" },
  "5": { name: "Emily Davis", mrn: "MRN-011" },
}

const templateSections: Record<NoteTemplate, string[]> = {
  "H&P": [
    "Chief Complaint",
    "HPI",
    "Review of Systems",
    "Physical Exam",
    "Assessment",
    "Plan",
  ],
  "SOAP Progress Note": ["Subjective", "Objective", "Assessment", "Plan"],
  Consultation: ["Reason for Consultation", "HPI", "Findings", "Recommendations"],
  "Discharge Summary": [
    "Admission Diagnosis",
    "Hospital Course",
    "Discharge Diagnosis",
    "Discharge Medications",
    "Follow-Up",
    "Discharge Instructions",
  ],
  "Telephone Encounter": ["Reason for Call", "Discussion", "Plan"],
}

export function NewNoteDialog({ open, onOpenChange, onCreate }: NewNoteDialogProps) {
  const [selectedPatient, setSelectedPatient] = useState("")
  const [template, setTemplate] = useState<NoteTemplate | "">("")
  const [sectionValues, setSectionValues] = useState<Record<string, string>>({})

  const activeSections = useMemo(() => {
    return template ? templateSections[template] : []
  }, [template])

  const resetForm = () => {
    setSelectedPatient("")
    setTemplate("")
    setSectionValues({})
  }

  const handleTemplateChange = (value: string) => {
    const nextTemplate = value as NoteTemplate
    setTemplate(nextTemplate)
    setSectionValues(
      templateSections[nextTemplate].reduce<Record<string, string>>((acc, section) => {
        acc[section] = ""
        return acc
      }, {})
    )
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetForm()
    }
    onOpenChange(nextOpen)
  }

  const handleSubmit = (status: "Draft" | "Signed") => {
    if (!selectedPatient || !template) {
      toast.error("Please select a patient and template")
      return
    }

    const meta = patientMeta[selectedPatient]
    onCreate({
      patientId: selectedPatient,
      patientName: meta.name,
      mrn: meta.mrn,
      template,
      status,
      sections: activeSections.map((title) => ({
        title,
        content: sectionValues[title]?.trim() || "No content entered.",
      })),
    })

    toast.success(status === "Draft" ? "Note saved as draft" : "Note signed successfully", {
      description: `${template} for ${meta.name}`,
    })

    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[760px] max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Note</DialogTitle>
          <DialogDescription>
            Start a new clinical note using a structured template.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Patient</Label>
              <Combobox
                options={patientOptions}
                value={selectedPatient}
                onChange={setSelectedPatient}
                placeholder="Search patient..."
                emptyMessage="No patients found."
              />
            </div>
            <div className="space-y-2">
              <Label>Template</Label>
              <Select value={template} onValueChange={handleTemplateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(templateSections).map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {template && (
            <div className="space-y-4 rounded-lg border p-4">
              <div>
                <p className="font-medium">Template Sections</p>
                <p className="text-sm text-muted-foreground">
                  Complete each structured section before saving or signing.
                </p>
              </div>
              {activeSections.map((section) => (
                <div key={section} className="space-y-2">
                  <Label>{section}</Label>
                  <Textarea
                    rows={3}
                    value={sectionValues[section] ?? ""}
                    onChange={(event) =>
                      setSectionValues((current) => ({
                        ...current,
                        [section]: event.target.value,
                      }))
                    }
                    placeholder={`Enter ${section.toLowerCase()}...`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleSubmit("Draft")}>
            Save as Draft
          </Button>
          <Button onClick={() => handleSubmit("Signed")}>
            Sign Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
