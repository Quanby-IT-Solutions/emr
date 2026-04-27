"use client"

import { useMemo, useState, useEffect } from "react"
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
  | "H_AND_P"
  | "PROGRESS_NOTE"
  | "CONSULT_NOTE"
  | "DISCHARGE_SUMMARY"
  | "NURSING_NOTE"

const TEMPLATE_LABELS: Record<NoteTemplate, string> = {
  H_AND_P: "H&P",
  PROGRESS_NOTE: "SOAP Progress Note",
  CONSULT_NOTE: "Consultation",
  DISCHARGE_SUMMARY: "Discharge Summary",
  NURSING_NOTE: "Nursing Note",
}

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
    encounterId?: string
  }) => void
}

const templateSections: Record<NoteTemplate, string[]> = {
  H_AND_P: ["Chief Complaint", "HPI", "Review of Systems", "Physical Exam", "Assessment", "Plan"],
  PROGRESS_NOTE: ["Subjective", "Objective", "Assessment", "Plan"],
  CONSULT_NOTE: ["Reason for Consultation", "HPI", "Findings", "Recommendations"],
  DISCHARGE_SUMMARY: ["Admission Diagnosis", "Hospital Course", "Discharge Diagnosis", "Discharge Medications", "Follow-Up", "Discharge Instructions"],
  NURSING_NOTE: ["Assessment", "Intervention", "Response", "Plan"],
}

export function NewNoteDialog({ open, onOpenChange, onCreate }: NewNoteDialogProps) {
  const [patients, setPatients] = useState<any[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState("")
  const [activeEncounterId, setActiveEncounterId] = useState<string | undefined>()
  const [template, setTemplate] = useState<NoteTemplate | "">("")
  const [sectionValues, setSectionValues] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return
    fetch('/api/patients?withEncounters=true')
      .then((r) => r.json())
      .then((json) => {
        const list = Array.isArray(json?.data) ? json.data : []
        setPatients(list)
      })
      .catch(() => {})
  }, [open])

  useEffect(() => {
    if (!selectedPatientId) { setActiveEncounterId(undefined); return }
    const patient = patients.find((p) => p.id === selectedPatientId)
    const activeEnc = (patient?.encounters ?? []).find((e: any) => e.status === 'ACTIVE')
    setActiveEncounterId(activeEnc?.id)
  }, [selectedPatientId, patients])

  const patientOptions = useMemo(
    () => patients.map((p) => ({ value: p.id, label: `${p.firstName} ${p.lastName} (${p.mrn})` })),
    [patients]
  )

  const activeSections = useMemo(() => (template ? templateSections[template] : []), [template])

  const resetForm = () => {
    setSelectedPatientId("")
    setActiveEncounterId(undefined)
    setTemplate("")
    setSectionValues({})
  }

  const handleTemplateChange = (value: string) => {
    const next = value as NoteTemplate
    setTemplate(next)
    setSectionValues(
      templateSections[next].reduce<Record<string, string>>((acc, s) => { acc[s] = ""; return acc }, {})
    )
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetForm()
    onOpenChange(nextOpen)
  }

  const handleSubmit = (status: "Draft" | "Signed") => {
    if (!selectedPatientId || !template) {
      toast.error("Please select a patient and template")
      return
    }

    const patient = patients.find((p) => p.id === selectedPatientId)
    if (!patient) return

    onCreate({
      patientId: selectedPatientId,
      patientName: `${patient.firstName} ${patient.lastName}`,
      mrn: patient.mrn,
      template,
      status,
      encounterId: activeEncounterId,
      sections: activeSections.map((title) => ({
        title,
        content: sectionValues[title]?.trim() || "No content entered.",
      })),
    })

    toast.success(status === "Draft" ? "Note saved as draft" : "Note signed successfully", {
      description: `${TEMPLATE_LABELS[template]} for ${patient.firstName} ${patient.lastName}`,
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
                value={selectedPatientId}
                onChange={setSelectedPatientId}
                placeholder="Search patient..."
                emptyMessage="No patients found."
              />
              {selectedPatientId && !activeEncounterId && (
                <p className="text-xs text-amber-600">No active encounter found for this patient</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Template</Label>
              <Select value={template} onValueChange={handleTemplateChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(templateSections) as NoteTemplate[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {TEMPLATE_LABELS[key]}
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
                      setSectionValues((current) => ({ ...current, [section]: event.target.value }))
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
          <Button onClick={() => handleSubmit("Signed")} disabled={!activeEncounterId}>
            Sign Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
