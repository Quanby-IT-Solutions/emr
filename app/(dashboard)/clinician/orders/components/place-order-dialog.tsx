"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
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

interface PlaceOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOrderPlaced?: () => void
}

interface PatientOption {
  id: string
  label: string
  encounterId: string | null
}

type OrderType = "MEDICATION" | "LAB" | "IMAGING" | "ADMIT_INPATIENT" | "DISCHARGE"

export function PlaceOrderDialog({ open, onOpenChange, onOrderPlaced }: PlaceOrderDialogProps) {
  const [patients, setPatients] = useState<PatientOption[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState("")
  const [orderType, setOrderType] = useState<OrderType | "">("")
  const [priority, setPriority] = useState("ROUTINE")
  const [instructions, setInstructions] = useState("")
  const [loading, setLoading] = useState(false)

  // Medication fields
  const [medication, setMedication] = useState("")
  const [dose, setDose] = useState("")
  const [route, setRoute] = useState("")
  const [frequency, setFrequency] = useState("")

  // Lab fields
  const [labTest, setLabTest] = useState("")
  const [specimen, setSpecimen] = useState("")

  // Imaging fields
  const [imagingStudy, setImagingStudy] = useState("")
  const [bodyPart, setBodyPart] = useState("")
  const [contrast, setContrast] = useState("")

  // Admit / Discharge fields
  const [admitUnit, setAdmitUnit] = useState("")
  const [admitReason, setAdmitReason] = useState("")

  useEffect(() => {
    if (!open) return
    fetch("/api/patients?withEncounters=true")
      .then((r) => r.json())
      .then(({ data }) => {
        const opts: PatientOption[] = (data ?? []).map((p: any) => {
          const activeEnc = (p.encounters ?? []).find((e: any) => e.status === "ACTIVE")
          return {
            id: p.id,
            label: `${p.firstName} ${p.lastName} (${p.mrn})`,
            encounterId: activeEnc?.id ?? null,
          }
        })
        setPatients(opts)
      })
      .catch(() => {})
  }, [open])

  const selectedPatient = patients.find((p) => p.id === selectedPatientId)

  const resetForm = () => {
    setSelectedPatientId("")
    setOrderType("")
    setPriority("ROUTINE")
    setInstructions("")
    setMedication("")
    setDose("")
    setRoute("")
    setFrequency("")
    setLabTest("")
    setSpecimen("")
    setImagingStudy("")
    setBodyPart("")
    setContrast("")
    setAdmitUnit("")
    setAdmitReason("")
  }

  const buildDetails = (): Record<string, unknown> | null => {
    switch (orderType) {
      case "MEDICATION":
        if (!medication || !dose || !route || !frequency) return null
        return { orderType: "MEDICATION", medicationName: medication, dose, route, frequency }
      case "LAB":
        if (!labTest) return null
        return { orderType: "LAB", testName: labTest, ...(specimen ? { specimen } : {}) }
      case "IMAGING":
        if (!imagingStudy) return null
        return {
          orderType: "IMAGING",
          study: imagingStudy,
          ...(bodyPart ? { bodyPart } : {}),
          ...(contrast ? { contrast } : {}),
        }
      case "ADMIT_INPATIENT":
        if (!admitUnit) return null
        return { orderType: "ADMIT_INPATIENT", unit: admitUnit, ...(admitReason ? { reason: admitReason } : {}) }
      case "DISCHARGE":
        return { orderType: "DISCHARGE", ...(admitReason ? { instructions: admitReason } : {}) }
      default:
        return null
    }
  }

  const handleSubmit = async () => {
    if (!selectedPatientId || !orderType) {
      toast.error("Please select a patient and order type")
      return
    }
    if (!selectedPatient?.encounterId) {
      toast.error("Selected patient has no active encounter")
      return
    }
    const details = buildDetails()
    if (!details) {
      toast.error("Please fill in all required order fields")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/encounters/${selectedPatient.encounterId}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType,
          details,
          priority,
          ...(instructions ? { clinicalIndication: instructions } : {}),
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error?.message ?? "Failed to place order")
        return
      }

      toast.success("Order placed successfully", {
        description: `${orderType} order for ${selectedPatient.label}`,
      })
      onOrderPlaced?.()
      resetForm()
      onOpenChange(false)
    } catch {
      toast.error("Failed to place order")
    } finally {
      setLoading(false)
    }
  }

  const patientComboOptions = patients.map((p) => ({ value: p.id, label: p.label }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Place Order (CPOE)</DialogTitle>
          <DialogDescription>
            Computerized Physician Order Entry — place medication, lab, imaging, or admit/discharge orders
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Patient & Type Row */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Patient</Label>
              <Combobox
                options={patientComboOptions}
                value={selectedPatientId}
                onChange={setSelectedPatientId}
                placeholder="Search patient..."
                emptyMessage="No patients found."
              />
            </div>
            <div className="space-y-2">
              <Label>Order Type</Label>
              <Select value={orderType} onValueChange={(v) => setOrderType(v as OrderType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEDICATION">Medication</SelectItem>
                  <SelectItem value="LAB">Laboratory</SelectItem>
                  <SelectItem value="IMAGING">Imaging</SelectItem>
                  <SelectItem value="ADMIT_INPATIENT">Admit / Transfer</SelectItem>
                  <SelectItem value="DISCHARGE">Discharge</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* No active encounter warning */}
          {selectedPatientId && selectedPatient && !selectedPatient.encounterId && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-300 rounded px-3 py-2">
              This patient has no active encounter. Orders require an active encounter.
            </p>
          )}

          {/* Medication Fields */}
          {orderType === "MEDICATION" && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Medication Name</Label>
                  <Input
                    placeholder="e.g., Metformin 500mg"
                    value={medication}
                    onChange={(e) => setMedication(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dose</Label>
                  <Input
                    placeholder="e.g., 500mg"
                    value={dose}
                    onChange={(e) => setDose(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Route</Label>
                  <Select value={route} onValueChange={setRoute}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PO">Oral (PO)</SelectItem>
                      <SelectItem value="IV">Intravenous (IV)</SelectItem>
                      <SelectItem value="IM">Intramuscular (IM)</SelectItem>
                      <SelectItem value="SC">Subcutaneous (SC)</SelectItem>
                      <SelectItem value="TOPICAL">Topical</SelectItem>
                      <SelectItem value="INH">Inhalation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONCE">Once</SelectItem>
                      <SelectItem value="BID">Twice daily (BID)</SelectItem>
                      <SelectItem value="TID">Three times daily (TID)</SelectItem>
                      <SelectItem value="QID">Four times daily (QID)</SelectItem>
                      <SelectItem value="Q4H">Every 4 hours</SelectItem>
                      <SelectItem value="Q6H">Every 6 hours</SelectItem>
                      <SelectItem value="Q8H">Every 8 hours</SelectItem>
                      <SelectItem value="DAILY">Daily</SelectItem>
                      <SelectItem value="PRN">As needed (PRN)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* Lab Fields */}
          {orderType === "LAB" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Lab Test</Label>
                <Select value={labTest} onValueChange={setLabTest}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select test" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CBC">Complete Blood Count (CBC)</SelectItem>
                    <SelectItem value="BMP">Basic Metabolic Panel (BMP)</SelectItem>
                    <SelectItem value="CMP">Comprehensive Metabolic Panel (CMP)</SelectItem>
                    <SelectItem value="LIPID">Lipid Panel</SelectItem>
                    <SelectItem value="HBA1C">Hemoglobin A1c</SelectItem>
                    <SelectItem value="TSH">Thyroid Stimulating Hormone</SelectItem>
                    <SelectItem value="UA">Urinalysis</SelectItem>
                    <SelectItem value="PT_INR">PT/INR</SelectItem>
                    <SelectItem value="TROPONIN">Troponin</SelectItem>
                    <SelectItem value="BLOOD_CULTURE">Blood Culture</SelectItem>
                    <SelectItem value="LACTATE">Lactate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Specimen Type</Label>
                <Select value={specimen} onValueChange={setSpecimen}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specimen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BLOOD">Blood</SelectItem>
                    <SelectItem value="URINE">Urine</SelectItem>
                    <SelectItem value="CSF">Cerebrospinal Fluid</SelectItem>
                    <SelectItem value="SPUTUM">Sputum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Imaging Fields */}
          {orderType === "IMAGING" && (
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Study</Label>
                <Select value={imagingStudy} onValueChange={setImagingStudy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select study" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XRAY">X-Ray</SelectItem>
                    <SelectItem value="CT">CT Scan</SelectItem>
                    <SelectItem value="MRI">MRI</SelectItem>
                    <SelectItem value="US">Ultrasound</SelectItem>
                    <SelectItem value="ECHO">Echocardiogram</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Body Part / Region</Label>
                <Input
                  placeholder="e.g., Chest, Abdomen"
                  value={bodyPart}
                  onChange={(e) => setBodyPart(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Contrast</Label>
                <Select value={contrast} onValueChange={setContrast}>
                  <SelectTrigger>
                    <SelectValue placeholder="Contrast?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">Without Contrast</SelectItem>
                    <SelectItem value="WITH">With Contrast</SelectItem>
                    <SelectItem value="BOTH">With &amp; Without</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Admit Fields */}
          {orderType === "ADMIT_INPATIENT" && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Admitting Unit</Label>
                <Select value={admitUnit} onValueChange={setAdmitUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MED_WARD">Medical Ward</SelectItem>
                    <SelectItem value="SURG_WARD">Surgical Ward</SelectItem>
                    <SelectItem value="ICU">ICU</SelectItem>
                    <SelectItem value="CCU">Cardiac Care Unit</SelectItem>
                    <SelectItem value="PEDS">Pediatrics</SelectItem>
                    <SelectItem value="OB">OB/GYN</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Reason for Admission</Label>
                <Input
                  placeholder="e.g., Chest pain, Rule out MI"
                  value={admitReason}
                  onChange={(e) => setAdmitReason(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Discharge Fields */}
          {orderType === "DISCHARGE" && (
            <div className="space-y-2">
              <Label>Discharge Instructions / Disposition</Label>
              <Textarea
                placeholder="Discharge instructions, follow-up appointments, medication changes..."
                rows={3}
                value={admitReason}
                onChange={(e) => setAdmitReason(e.target.value)}
              />
            </div>
          )}

          {/* Priority & Instructions (shared) */}
          {orderType && (
            <>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROUTINE">Routine</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                    <SelectItem value="STAT">STAT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Clinical Notes / Instructions</Label>
                <Textarea
                  placeholder="Additional clinical context or instructions..."
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedPatientId || !orderType || loading}
          >
            {loading ? "Placing..." : "Submit Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
