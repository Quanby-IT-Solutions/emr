"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface InterventionNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientName: string
  activeMedications: string[]
  onSave: (note: {
    type: string
    medication: string
    note: string
    severity: string
  }) => void
}

export function InterventionNoteDialog({
  open,
  onOpenChange,
  patientName,
  activeMedications,
  onSave,
}: InterventionNoteDialogProps) {
  const [type, setType] = useState("")
  const [medication, setMedication] = useState("")
  const [note, setNote] = useState("")
  const [severity, setSeverity] = useState("")

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setType("")
      setMedication("")
      setNote("")
      setSeverity("")
    }
    onOpenChange(isOpen)
  }

  function handleSave() {
    if (!type || !note.trim() || !severity) {
      toast.error("Please fill in all required fields")
      return
    }
    onSave({ type, medication, note, severity })
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add Pharmacist Intervention Note</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="rounded-lg border p-3 bg-muted/30 text-sm">
            <span className="text-muted-foreground">Patient:</span>{" "}
            <span className="font-medium">{patientName}</span>
          </div>

          {/* Intervention Type */}
          <div className="space-y-2">
            <Label>Intervention Type *</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select intervention type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dose-adjustment">Dose Adjustment</SelectItem>
                <SelectItem value="drug-interaction">Drug Interaction</SelectItem>
                <SelectItem value="allergy-alert">Allergy Alert</SelectItem>
                <SelectItem value="formulary-substitution">
                  Formulary Substitution
                </SelectItem>
                <SelectItem value="renal-dosing">Renal Dosing</SelectItem>
                <SelectItem value="therapeutic-duplication">
                  Therapeutic Duplication
                </SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Related Medication */}
          <div className="space-y-2">
            <Label>Related Medication</Label>
            <Select value={medication} onValueChange={setMedication}>
              <SelectTrigger>
                <SelectValue placeholder="Select medication (optional)..." />
              </SelectTrigger>
              <SelectContent>
                {activeMedications.map((med) => (
                  <SelectItem key={med} value={med}>
                    {med}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label>Intervention Note *</Label>
            <Textarea
              placeholder="Describe the clinical intervention and recommendation..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <Label>Clinical Significance *</Label>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Select significance level..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="informational">Informational</SelectItem>
                <SelectItem value="significant">Significant</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!type || !note.trim() || !severity}
          >
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
