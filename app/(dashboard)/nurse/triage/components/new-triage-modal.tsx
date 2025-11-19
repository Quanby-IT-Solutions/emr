"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { PatientInfoComp } from "@/components/shared/triage/patient-info-comp"
import { InitialAssessComp } from "@/components/shared/triage/initial-assess-comp"
import { RapidAssessmentComp } from "@/components/shared/triage/rapid-assess-comp"
import { VitalSignsComp } from "@/components/shared/triage/vital-signs-comp"
import { TriageSummaryComp } from "@/components/shared/triage/triage-summary-comp"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { TriageEntry } from "@/app/(dashboard)/dummy-data/dummy-triage"

interface TriageWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRecord: (record: TriageWizardOutput) => void
}

export interface TriageWizardOutput {
  form: TriageForm
  rapidAssessment: RapidAssessment
  initialAssessment: InitialAssessment
}

interface TriageForm {
  // Patient Demographics
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
  
  // Companion Information
  companionName: string
  companionContact: string
  companionRelation: string
  
  // Arrival Details
  arrivalStatus: string
  arrivalDate: Date | undefined
  arrivalTime: string
  arrivalMode: string
  arrivalModeOther: string
  transferredFrom: string
  department: string
  departmentOther: string
  referredBy: string
  
  // Chief Complaint & Symptoms
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
  
  // ABC Assessment
  airwayAssessment: string
  airwayNotes: string
  airwayInterventions: string
  breathingAssessment: string
  breathingNotes: string
  breathingInterventions: string
  circulationAssessment: string
  circulationNotes: string
  circulationInterventions: string
  
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

const initialFormState: TriageForm = {
  // Patient Demographics
  patientId: "",
  patientName: "",
  firstName: "",
  middleName: "",
  lastName: "",
  age: "",
  sex: "",
  phoneNumber: "",
  address: "",
  occupation: "",
  
  // Companion Information
  companionName: "",
  companionContact: "",
  companionRelation: "",
  
  // Arrival Details
  arrivalStatus: "alive",
  arrivalDate: undefined,
  arrivalTime: "",
  arrivalMode: "",
  arrivalModeOther: "",
  transferredFrom: "",
  department: "",
  departmentOther: "",
  referredBy: "",
  
  // Chief Complaint & Symptoms
  complaint: "",
  symptoms: {
    chestPain: false,
    difficultyBreathing: false,
    fever: false,
    weakness: false,
    lossOfConsciousness: false,
    bleeding: false,
    others: false,
  },
  symptomsOther: "",
  
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
  
  // ABC Assessment
  airwayAssessment: "",
  airwayNotes: "",
  airwayInterventions: "",
  breathingAssessment: "",
  breathingNotes: "",
  breathingInterventions: "",
  circulationAssessment: "",
  circulationNotes: "",
  circulationInterventions: "",
  
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

export function TriageWizard({ open, onOpenChange, onRecord }: TriageWizardProps) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<TriageForm>(initialFormState)
  const [rapidAssessment, setRapidAssessment] = useState<RapidAssessment>(initialRapidAssessment)
  const [initialAssessment, setInitialAssessment] = useState<InitialAssessment>(initialAssessmentState)

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
    // Handle arrival status routing from step 0
    if (step === 0) {
      if (form.arrivalStatus === "dead-on-arrival") {
        // Auto-select DEAD priority and Died disposition when moving to step 4
        setForm(f => ({
          ...f,
          triagePriority: "DEAD",
          disposition: "Died"
        }))
        return setStep(4) // Go directly to Triage Summary
      }
      // If "alive", continue to step 1 (Initial Assessment)
    }

    // Handle initial assessment routing from step 1
    if (step === 1) {
      const allNormal = Object.values(initialAssessment).every(Boolean)
      if (allNormal) return setStep(3) // skip rapid assessment → go to vitals
    }

    // Complete button - close modal
    if (step === 4) {
      console.log('Form data:', { form, rapidAssessment, initialAssessment })
      const payload: TriageWizardOutput = {
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
    // Handle back button for special cases
    if (step === 4 && form.arrivalStatus === "dead-on-arrival") {
      return setStep(0) // Go back to Patient Info
    }
    setStep(prev => Math.max(prev - 1, 0))
  }

  const steps = [
    "Patient Info",
    "Initial Assessment",
    "Rapid Assessment",
    "Vital Signs",
    "Triage Summary",
  ]

  // Generate existing patients list from TriageEntry
  const existingPatients = TriageEntry.map(entry => ({
    id: entry.patient.id,
    name: entry.patient.name
  }))

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl flex flex-col max-h-[90vh] overflow-hidden" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="px-4 pt-6">
          <DialogTitle>{steps[step]}</DialogTitle>
        </DialogHeader>

        {/* PROGRESS BAR */}
        <div className="space-y-2 px-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Step {step + 1} of {steps.length}</span>
            <span className="text-blue-600 font-semibold">{steps[step]}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP CONTENT */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {step === 0 && (
            <PatientInfoComp 
              form={form}
              setForm={setForm}
              existingPatients={existingPatients}
            />
          )}
          {step === 1 && (
            <InitialAssessComp 
              assessment={initialAssessment} 
              setAssessment={setInitialAssessment} 
            />
          )}
          {step === 2 && (
            <RapidAssessmentComp
              airway={rapidAssessment.airway}
              breathing={rapidAssessment.breathing}
              circulation={rapidAssessment.circulation}
              onChange={handleRapidAssessmentChange}
            />
          )}
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
            <Button onClick={next}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {step === 4 && (
            <Button onClick={next}>Record Assessment</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}