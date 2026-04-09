"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { IconPlus, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"

export interface DischargePatient {
  id: string
  patient: string
  mrn: string
  unitBed: string
  admissionDate: string
  lengthOfStay: number
  primaryDiagnosis: string
  attending: string
}

interface DischargeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: DischargePatient | null
}

interface MedRecRow {
  id: string
  name: string
  dose: string
  route: string
  frequency: string
  action: "Continue" | "Discontinue" | "Modify"
  modifiedDose: string
}

interface FollowUpRow {
  id: string
  specialty: string
  timeframe: string
}

const instructionTemplates = [
  { value: "general", label: "General Discharge Instructions" },
  { value: "cardiac", label: "Cardiac Discharge Instructions" },
  { value: "surgical", label: "Post-Surgical Instructions" },
  { value: "diabetes", label: "Diabetes Management Instructions" },
]

const templateText: Record<string, string> = {
  general: "Rest at home. Follow up with your primary care provider within 7 days. Take all prescribed medications as directed. Return to the emergency department if symptoms worsen.",
  cardiac: "Avoid strenuous activity for 2 weeks. Follow low-sodium diet. Take all cardiac medications as prescribed. Call 911 if you experience chest pain, shortness of breath, or dizziness.",
  surgical: "Keep surgical site clean and dry. Change dressings as instructed. No heavy lifting (>10 lbs) for 6 weeks. Follow up with surgeon in 2 weeks. Watch for signs of infection.",
  diabetes: "Monitor blood glucose levels as instructed. Follow diabetic diet plan. Take insulin/medications as prescribed. Follow up with endocrinology within 2 weeks.",
}

export function DischargeDialog({ open, onOpenChange, patient }: DischargeDialogProps) {
  const router = useRouter()

  const [disposition, setDisposition] = useState("")
  const [instructions, setInstructions] = useState("")
  const [followUps, setFollowUps] = useState<FollowUpRow[]>([
    { id: "fu1", specialty: "", timeframe: "" },
  ])

  const [medications, setMedications] = useState<MedRecRow[]>([
    { id: "m1", name: "Metformin", dose: "500mg", route: "PO", frequency: "BID", action: "Continue", modifiedDose: "" },
    { id: "m2", name: "Lisinopril", dose: "10mg", route: "PO", frequency: "Daily", action: "Continue", modifiedDose: "" },
    { id: "m3", name: "Aspirin", dose: "81mg", route: "PO", frequency: "Daily", action: "Continue", modifiedDose: "" },
    { id: "m4", name: "Heparin", dose: "5000U", route: "SC", frequency: "Q8H", action: "Discontinue", modifiedDose: "" },
    { id: "m5", name: "Atorvastatin", dose: "40mg", route: "PO", frequency: "Daily", action: "Continue", modifiedDose: "" },
  ])

  const updateMedAction = (id: string, action: MedRecRow["action"]) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, action, modifiedDose: "" } : m))
    )
  }

  const updateModifiedDose = (id: string, modifiedDose: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, modifiedDose } : m))
    )
  }

  const addMedication = () => {
    const newId = `m${Date.now()}`
    setMedications((prev) => [
      ...prev,
      { id: newId, name: "", dose: "", route: "PO", frequency: "", action: "Continue", modifiedDose: "" },
    ])
  }

  const removeMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id))
  }

  const updateMedField = (id: string, field: keyof MedRecRow, value: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    )
  }

  const addFollowUp = () => {
    setFollowUps((prev) => [...prev, { id: `fu${Date.now()}`, specialty: "", timeframe: "" }])
  }

  const removeFollowUp = (id: string) => {
    setFollowUps((prev) => prev.filter((f) => f.id !== id))
  }

  const updateFollowUp = (id: string, field: keyof FollowUpRow, value: string) => {
    setFollowUps((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    )
  }

  const handleTemplateSelect = (value: string) => {
    setInstructions(templateText[value] ?? "")
  }

  const handleWriteSummary = () => {
    onOpenChange(false)
    router.push("/clinician/documentation")
  }

  const handlePlaceOrder = () => {
    if (!disposition) {
      toast.error("Please select a disposition")
      return
    }
    toast.success("Discharge order placed", {
      description: `${patient?.patient} — ${disposition}`,
    })
    onOpenChange(false)
  }

  if (!patient) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Discharge — {patient.patient}</DialogTitle>
          <DialogDescription>
            MRN: {patient.mrn} | Unit: {patient.unitBed} | LOS: {patient.lengthOfStay} days | Dx: {patient.primaryDiagnosis}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Disposition */}
          <div className="space-y-2">
            <Label>Disposition *</Label>
            <Select value={disposition} onValueChange={setDisposition}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select disposition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Home">Home</SelectItem>
                <SelectItem value="Home with Services">Home with Home Health Services</SelectItem>
                <SelectItem value="Transfer">Transfer to Another Facility</SelectItem>
                <SelectItem value="SNF">Skilled Nursing Facility</SelectItem>
                <SelectItem value="AMA">Against Medical Advice (AMA)</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Follow-Up Appointments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Follow-Up Appointments</Label>
              <Button type="button" variant="outline" size="sm" onClick={addFollowUp}>
                <IconPlus className="h-3.5 w-3.5 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {followUps.map((fu) => (
                <div key={fu.id} className="flex items-center gap-3">
                  <Input
                    placeholder="Specialty (e.g., Primary Care)"
                    value={fu.specialty}
                    onChange={(e) => updateFollowUp(fu.id, "specialty", e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Timeframe (e.g., 7 days)"
                    value={fu.timeframe}
                    onChange={(e) => updateFollowUp(fu.id, "timeframe", e.target.value)}
                    className="w-44"
                  />
                  {followUps.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFollowUp(fu.id)}
                      className="shrink-0"
                    >
                      <IconTrash className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Medication Reconciliation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Medication Reconciliation</Label>
              <Button type="button" variant="outline" size="sm" onClick={addMedication}>
                <IconPlus className="h-3.5 w-3.5 mr-1" />
                Add New Medication
              </Button>
            </div>
            <div className="border rounded-md overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dose</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead className="w-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medications.map((med) => (
                    <TableRow key={med.id}>
                      <TableCell>
                        {med.name ? (
                          <span className="font-medium">{med.name}</span>
                        ) : (
                          <Input
                            placeholder="Medication name"
                            value={med.name}
                            onChange={(e) => updateMedField(med.id, "name", e.target.value)}
                            className="h-8"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {med.action === "Modify" ? (
                          <Input
                            placeholder="New dose"
                            value={med.modifiedDose}
                            onChange={(e) => updateModifiedDose(med.id, e.target.value)}
                            className="h-8 w-24"
                          />
                        ) : (
                          <span className={med.action === "Discontinue" ? "line-through text-muted-foreground" : ""}>
                            {med.dose || (
                              <Input
                                placeholder="Dose"
                                value={med.dose}
                                onChange={(e) => updateMedField(med.id, "dose", e.target.value)}
                                className="h-8 w-24"
                              />
                            )}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={med.action === "Discontinue" ? "line-through text-muted-foreground" : ""}>
                          {med.route || (
                            <Input
                              placeholder="Route"
                              value={med.route}
                              onChange={(e) => updateMedField(med.id, "route", e.target.value)}
                              className="h-8 w-20"
                            />
                          )}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={med.action === "Discontinue" ? "line-through text-muted-foreground" : ""}>
                          {med.frequency || (
                            <Input
                              placeholder="Freq"
                              value={med.frequency}
                              onChange={(e) => updateMedField(med.id, "frequency", e.target.value)}
                              className="h-8 w-24"
                            />
                          )}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={med.action}
                          onValueChange={(v) => updateMedAction(med.id, v as MedRecRow["action"])}
                        >
                          <SelectTrigger className="h-8 w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Continue">
                              <Badge className="bg-green-100 text-green-800 border-green-300">Continue</Badge>
                            </SelectItem>
                            <SelectItem value="Discontinue">
                              <Badge className="bg-red-100 text-red-800 border-red-300">Discontinue</Badge>
                            </SelectItem>
                            <SelectItem value="Modify">
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Modify</Badge>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => removeMedication(med.id)}
                        >
                          <IconTrash className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <Separator />

          {/* Discharge Instructions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Discharge Instructions</Label>
              <Select onValueChange={handleTemplateSelect}>
                <SelectTrigger className="w-64 h-8">
                  <SelectValue placeholder="Load template..." />
                </SelectTrigger>
                <SelectContent>
                  {instructionTemplates.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="Enter discharge instructions for the patient..."
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleWriteSummary}>
            Write Discharge Summary
          </Button>
          <Button onClick={handlePlaceOrder} disabled={!disposition}>
            Place Discharge Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
