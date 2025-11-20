"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

import { InitialAssessComp } from "@/components/shared/triage/initial-assess-comp"
import { RapidAssessmentComp } from "@/components/shared/triage/rapid-assess-comp"
import { VitalSignsComp } from "@/components/shared/triage/vital-signs-comp"
import { TriageSummaryComp } from "@/components/shared/triage/triage-summary-comp"
import { ChevronLeft, ChevronRight, User } from "lucide-react"
import { TriageAssessment } from "@/app/(dashboard)/dummy-data/dummy-triage"

interface FollowUpWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRecord: (record: FollowUpWizardOutput) => void
  selectedPatient: TriageAssessment | null
}

export interface FollowUpWizardOutput {
  patientId: string
  form: FollowUpTriageForm
  rapidAssessment: RapidAssessment
  initialAssessment: InitialAssessment
}

interface FollowUpTriageForm {
  // Vital Signs
  bpSystolic: string
  bpDiastolic: string
  temperature: string
  pulseRate: string
  respirationRate: string
  oxygenSaturation: string
  weight: string
  height: string
  
  // Pain Assessment
  painScale: string
  painLocation: string
  painDuration: string
  painCharacteristics: string
  painAggravatingFactors: string
  painRelievingFactors: string
  
  // Glasgow Coma Scale
  gcsEyeOpening: string
  gcsVerbalResponse: string
  gcsMotorResponse: string
  
  // Triage Decision
  triagePriority: string
  triageNotes: string
  disposition: string
  dispositionOther: string
}

interface RapidAssessment {
  airway: { obs: string; intv: string }
  breathing: { obs: string; intv: string }
  circulation: { obs: string; intv: string }
}

interface InitialAssessment {
  conscious: boolean
  breathing: boolean
  circulation: boolean
  bleeding: boolean
}

const initialFormState: FollowUpTriageForm = {
  // Vital Signs
  bpSystolic: "",
  bpDiastolic: "",
  temperature: "",
  pulseRate: "",
  respirationRate: "",
  oxygenSaturation: "",
  weight: "",
  height: "",
  
  // Pain Assessment
  painScale: "",
  painLocation: "",
  painDuration: "",
  painCharacteristics: "",
  painAggravatingFactors: "",
  painRelievingFactors: "",
  
  // Glasgow Coma Scale
  gcsEyeOpening: "",
  gcsVerbalResponse: "",
  gcsMotorResponse: "",
  
  // Triage Decision
  triagePriority: "",
  triageNotes: "",
  disposition: "",
  dispositionOther: "",
}

const initialRapidAssessment: RapidAssessment = {
  airway: { obs: "", intv: "" },
  breathing: { obs: "", intv: "" },
  circulation: { obs: "", intv: "" },
}

const initialAssessmentState: InitialAssessment = {
  conscious: false,
  breathing: false,
  circulation: false,
  bleeding: false,
}

export function FollowUpWizard({ open, onOpenChange, onRecord, selectedPatient }: FollowUpWizardProps) {
  const [step, setStep] = useState(0)
  const [rapidAssessment, setRapidAssessment] = useState<RapidAssessment>(initialRapidAssessment)
  const [initialAssessment, setInitialAssessment] = useState<InitialAssessment>(initialAssessmentState)

  // Initialize form with patient data using useMemo - recalculates when selectedPatient changes
  const initializedForm = useMemo(() => {
    if (selectedPatient && selectedPatient.patient.triageDetails.length > 0) {
      const firstRecord = selectedPatient.patient.triageDetails[0]
      return {
        ...initialFormState,
        weight: firstRecord.vitalSigns.weight.toString(),
        height: firstRecord.vitalSigns.height.toString()
      }
    }
    return initialFormState
  }, [selectedPatient])

  const [form, setForm] = useState<FollowUpTriageForm>(initializedForm)

  // Update form when initializedForm changes (when modal opens with new patient)
  if (open && form.weight === "" && form.height === "" && initializedForm.weight !== "") {
    setForm(initializedForm)
  }

  const handleRapidAssessmentChange = (section: string, field: string, value: string) => {
    setRapidAssessment(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof RapidAssessment],
        [field]: value
      }
    }))
  }

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset state when closing
      setStep(0)
      setForm(initialFormState)
      setRapidAssessment(initialRapidAssessment)
      setInitialAssessment(initialAssessmentState)
    }
    onOpenChange(isOpen)
  }

  const next = () => {
    // Handle initial assessment routing from step 1
    if (step === 1) {
      const allNormal = Object.values(initialAssessment).every(Boolean)
      if (allNormal) return setStep(3) // skip rapid assessment → go to vitals
    }

    // Complete button - close modal
    if (step === 4) {
      if (!selectedPatient) return

      const payload: FollowUpWizardOutput = {
        patientId: selectedPatient.patient.id,
        form,
        rapidAssessment,
        initialAssessment,
      }

      onRecord(payload)
      handleClose(false)
      return
    }

    setStep(prev => prev + 1)
  }

  const prev = () => {
    setStep(prev => Math.max(prev - 1, 0))
  }

  const steps = [
    "Patient Review",
    "Initial Assessment",
    "Rapid Assessment",
    "Vital Signs",
    "Triage Summary",
  ]

  // Get category badge variant
  const getCategoryVariant = (category: string) => {
    if (category === "EMERGENT") return "destructive"
    if (category === "URGENT") return "warning"
    if (category === "DEAD") return "dimmed"
    return "default"
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl flex flex-col max-h-[90vh] overflow-hidden" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="px-4 pt-6">
          <DialogTitle>Follow-Up Triage Assessment - {steps[step]}</DialogTitle>
        </DialogHeader>

        {/* PROGRESS BAR */}
        <div className="space-y-2 px-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Step {step + 1} of {steps.length}</span>
            <span className="text-orange-600 font-semibold">{steps[step]}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP CONTENT */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* Step 0: Patient Review */}
          {step === 0 && selectedPatient && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-orange-600" />
                <h3 className="text-lg font-semibold">Patient Information</h3>
              </div>

              <Card className="border-orange-200 bg-orange-50/30">
                <CardContent className="pt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Patient ID</Label>
                      <p className="font-medium text-sm">{selectedPatient.patient.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Name</Label>
                      <p className="font-medium text-sm">{selectedPatient.patient.name}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Age/Sex</Label>
                      <p className="font-medium text-sm">{selectedPatient.patient.ageSex}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Current Status</Label>
                      <Badge variant={getCategoryVariant(selectedPatient.patient.currentTriageCategory)}>
                        {selectedPatient.patient.currentTriageCategory}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Arrival Date</Label>
                      <p className="font-medium text-sm">
                        {new Date(selectedPatient.patient.arrivalDetails.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Last Triage</Label>
                      <p className="font-medium text-sm">
                        {selectedPatient.patient.lastDateOfTriage
                          ? new Date(selectedPatient.patient.lastDateOfTriage).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }) + " " + selectedPatient.patient.lastTimeOfTriage
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">Chief Complaint (Last)</Label>
                    <p className="font-medium text-sm">
                      {selectedPatient.patient.triageDetails[selectedPatient.patient.triageDetails.length - 1]?.chiefComplaint || "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                <p className="text-sm text-orange-800">
                  <strong>Note:</strong> This is a follow-up assessment. The patient&apos;s existing information will be preserved, 
                  and a new triage record will be added to their history.
                </p>
              </div>
            </div>
          )}

          {/* Step 1: Initial Assessment */}
          {step === 1 && (
            <InitialAssessComp 
              assessment={initialAssessment} 
              setAssessment={setInitialAssessment} 
            />
          )}

          {/* Step 2: Rapid Assessment */}
          {step === 2 && (
            <RapidAssessmentComp
              airway={rapidAssessment.airway}
              breathing={rapidAssessment.breathing}
              circulation={rapidAssessment.circulation}
              onChange={handleRapidAssessmentChange}
            />
          )}

          {/* Step 3: Vital Signs */}
          {step === 3 && (
            <VitalSignsComp 
              form={{
                bpSystolic: form.bpSystolic,
                bpDiastolic: form.bpDiastolic,
                pulseRate: form.pulseRate,
                temperature: form.temperature,
                oxygenSaturation: form.oxygenSaturation,
                respirationRate: form.respirationRate,
                weight: form.weight,
                height: form.height,
              }} 
              setForm={(update) => {
                setForm(prev => {
                  const newState = typeof update === 'function' ? update(prev) : update
                  return { ...prev, ...newState }
                })
              }} 
            />
          )}

          {/* Step 4: Triage Summary */}
          {step === 4 && (
            <TriageSummaryComp 
              form={{
                triagePriority: form.triagePriority,
                triageNotes: form.triageNotes,
                disposition: form.disposition,
                dispositionOther: form.dispositionOther
              }} 
              setForm={(update) => {
                setForm(prev => {
                  const newState = typeof update === 'function' ? update(prev) : update
                  return { ...prev, ...newState }
                })
              }} 
            />
          )}
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2 border-t px-6 py-4">
          <Button variant="outline" onClick={prev} disabled={step === 0}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {step !== 4 && (
            <Button onClick={next} className="bg-orange-500 hover:bg-orange-600">
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {step === 4 && (
            <Button onClick={next} className="bg-orange-500 hover:bg-orange-600">
              Record Follow-Up Assessment
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}