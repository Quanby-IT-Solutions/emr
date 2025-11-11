"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Activity, FileText } from "lucide-react"
import { VitalsForm } from "./vitalsForm"
import { usePatientContext } from '../context/PatientContext'

interface TriageWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientId: string
  onComplete: () => void
}

export function TriageWizard({ open, onOpenChange, patientId, onComplete }: TriageWizardProps) {
  const { dispatch } = usePatientContext()
  const [currentStep, setCurrentStep] = useState(0)
  const [vitalsOpen, setVitalsOpen] = useState(false)
  const [assessmentChecks, setAssessmentChecks] = useState({
    consciousness: false,
    breathing: false,
    circulation: false,
    bleeding: false
  })

  const handleAssessmentNext = () => {
    // Just proceed to vitals - no emergency validation
    setCurrentStep(1)
    setVitalsOpen(true)
  }

  const handleVitalsComplete = () => {
    setVitalsOpen(false)
    setCurrentStep(2)
  }

  const handleNotesComplete = (notes: string) => {
    dispatch({ 
      type: 'UPDATE_TRIAGE_NOTES', 
      payload: { id: patientId, notes } 
    })

    setCurrentStep(3)
  }

  const handleComplete = () => {
    onComplete()
    onOpenChange(false)
  }

  const getProgressSteps = () => {
    return [
      { label: "Assessment", active: currentStep >= 0 },
      { label: "Vitals", active: currentStep >= 1 },
      { label: "Notes", active: currentStep >= 2 },
      { label: "Complete", active: currentStep >= 3 }
    ]
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent 
          className="max-w-3xl"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Triage Assessment
            </DialogTitle>
          </DialogHeader>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              {getProgressSteps().map((step, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center ${step.active ? 'text-blue-600 font-semibold' : ''}`}
                >
                  {step.label}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="mt-6">
            {/* Step 1: Assessment */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Rapid Assessment
                </h3>

                <div className="space-y-4">
                  {/* Consciousness Check */}
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-blue-50">
                    <Checkbox
                      id="consciousness"
                      checked={assessmentChecks.consciousness}
                      onCheckedChange={(checked) => 
                        setAssessmentChecks(prev => ({ ...prev, consciousness: checked as boolean }))
                      }
                    />
                    <Label htmlFor="consciousness" className="flex-1 cursor-pointer font-medium">
                      Patient is conscious and responsive
                    </Label>
                  </div>

                  {/* Breathing Check */}
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-blue-50">
                    <Checkbox
                      id="breathing"
                      checked={assessmentChecks.breathing}
                      onCheckedChange={(checked) => 
                        setAssessmentChecks(prev => ({ ...prev, breathing: checked as boolean }))
                      }
                    />
                    <Label htmlFor="breathing" className="flex-1 cursor-pointer font-medium">
                      Breathing is normal and adequate
                    </Label>
                  </div>

                  {/* Circulation Check */}
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-blue-50">
                    <Checkbox
                      id="circulation"
                      checked={assessmentChecks.circulation}
                      onCheckedChange={(checked) => 
                        setAssessmentChecks(prev => ({ ...prev, circulation: checked as boolean }))
                      }
                    />
                    <Label htmlFor="circulation" className="flex-1 cursor-pointer font-medium">
                      Circulation/pulse is present and stable
                    </Label>
                  </div>

                  {/* Bleeding Check */}
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-blue-50">
                    <Checkbox
                      id="bleeding"
                      checked={assessmentChecks.bleeding}
                      onCheckedChange={(checked) => 
                        setAssessmentChecks(prev => ({ ...prev, bleeding: checked as boolean }))
                      }
                    />
                    <Label htmlFor="bleeding" className="flex-1 cursor-pointer font-medium">
                      No active severe bleeding
                    </Label>
                  </div>
                </div>

                <Button 
                  onClick={handleAssessmentNext} 
                  className="w-full"
                >
                  Proceed to Vitals
                </Button>
              </div>
            )}

            {/* Step 2: Notes */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Triage Notes
                </h3>
                
                <Textarea
                  placeholder="Enter clinical observations, chief complaint details, and initial assessment..."
                  rows={8}
                  id="triage-notes"
                />
                
                <Button 
                  onClick={() => {
                    const notes = (document.getElementById('triage-notes') as HTMLTextAreaElement)?.value || ""
                    handleNotesComplete(notes)
                  }}
                  className="w-full"
                >
                  Complete Triage
                </Button>
              </div>
            )}

            {/* Step 3: Complete */}
            {currentStep === 3 && (
              <div className="text-center py-12 space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Triage Complete</h3>
                <p className="text-muted-foreground">
                  Patient assessment and vital signs have been recorded
                </p>
                <Button onClick={handleComplete} className="mt-4">
                  Close
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <VitalsForm
        open={vitalsOpen}
        onOpenChange={setVitalsOpen}
        patientId={patientId}
        onComplete={handleVitalsComplete}
      />
    </>
  )
}