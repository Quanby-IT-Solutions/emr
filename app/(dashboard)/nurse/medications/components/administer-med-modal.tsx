// administer-med-modal.tsx
"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react"

// Import types
import { Patient, MedicationOrder, AdministrationData, AdministrationStatus, VerificationChecks } from "@/components/shared/nurse/medication/types"

// Import Step Components
import { MedRecPatientInfo } from "./administer-components/med-rec-patient-info"
import { MedRecOrderSelect } from './administer-components/med-rec-order-select'
import { MedRecAdminister } from './administer-components/med-rec-administer'
import { MedRecVerify } from './administer-components/med-rec-verify'
import { MedRecSummary } from './administer-components/med-rec-summary'


interface AdministerMedicineWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: Patient | null
  selectedOrder?: MedicationOrder | null
  onSubmit?: (data: AdministrationData, medOrder: MedicationOrder) => void
}

const initialChecks: VerificationChecks = {
  rightPatient: false,
  rightMedication: false,
  rightDose: false,
  rightRoute: false,
  rightTime: false
}

export function AdministerMedicineWizard({ open, onOpenChange, patient,  selectedOrder: initialSelectedOrder, onSubmit }: AdministerMedicineWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedOrder, setSelectedOrder] = useState<MedicationOrder | null>(initialSelectedOrder || null)
  const [administrationStatus, setAdministrationStatus] = useState<AdministrationStatus>(null)
  const [refusalReason, setRefusalReason] = useState("")
  const [dosageAdministered, setDosageAdministered] = useState("")
  const [nurseNotes, setNurseNotes] = useState("")
  const [verificationChecks, setVerificationChecks] = useState<VerificationChecks>(initialChecks)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const totalSteps = 5

  // Scroll to top when step changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentStep])

  // Reset form when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen === false) {
      // Reset all state when closing
      setCurrentStep(1)
      setSelectedOrder(initialSelectedOrder || null)
      setAdministrationStatus(null)
      setRefusalReason("")
      setDosageAdministered("")
      setNurseNotes("")
      setVerificationChecks(initialChecks)
    }
    onOpenChange(newOpen)
  }

  const allChecksComplete = Object.values(verificationChecks).every(check => check)
  const canProceedToStep3 = administrationStatus === "refused" || (administrationStatus === "administered" && dosageAdministered)

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClose = () => {
    handleOpenChange(false)
  }

  const handleSubmit = () => {
    if (!selectedOrder || !patient) return

    const now = new Date()

    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const timeAdministered = `${hours}:${minutes}`

    const data: AdministrationData = {
      medicationOrderId: selectedOrder.medicationOrderId,
      dosageAdministered: administrationStatus === "administered" ? dosageAdministered : "0",
      timeAdministered: timeAdministered,
      dateAdministered: now,
      isAdministered: administrationStatus === "administered" ? true : false,
      refusalReason: administrationStatus === "refused" ? refusalReason : "",
      nurseNotes,
      verificationChecks
    }

    const medOrder: MedicationOrder = {
      ...selectedOrder,
      attemptAdministerToday: true,
    }

    onSubmit?.(data, medOrder)
    console.log(data)
    handleClose()
  }

  const renderStep = () => {
    if (!patient) return null
    
    switch (currentStep) {
      case 1:
        return <MedRecPatientInfo patient={patient} />
      case 2:
        const activeOrders = patient.medicationOrders.filter(
          order => order.status === "ACTIVE" || order.status === "PENDING"
        )
        return (
          <MedRecOrderSelect 
            activeOrders={activeOrders} 
            selectedOrder={selectedOrder} 
            onSelectOrder={setSelectedOrder}
          />
        )
      case 3:
        if (!selectedOrder) return null
        return (
          <MedRecAdminister 
            selectedOrder={selectedOrder}
            administrationStatus={administrationStatus}
            onStatusChange={setAdministrationStatus}
            dosageAdministered={dosageAdministered}
            onDosageChange={setDosageAdministered}
            refusalReason={refusalReason}
            onRefusalReasonChange={setRefusalReason}
          />
        )
      case 4:
        if (!selectedOrder) return null
        return (
          <MedRecVerify
            patient={patient}
            selectedOrder={selectedOrder}
            administrationStatus={administrationStatus}
            dosageAdministered={dosageAdministered}
            verificationChecks={verificationChecks}
            onVerificationChange={setVerificationChecks}
          />
        )
      case 5:
        if (!selectedOrder) return null
        return (
          <MedRecSummary
            selectedOrder={selectedOrder}
            administrationStatus={administrationStatus}
            dosageAdministered={dosageAdministered}
            nurseNotes={nurseNotes}
            onNurseNotesChange={setNurseNotes}
            refusalReason={refusalReason}
          />
        )
      default:
        return null
    }
  }

  const isNextButtonDisabled = useMemo(() => {
    if (currentStep === 2 && !selectedOrder) return true
    if (currentStep === 3 && !canProceedToStep3) return true
    if (currentStep === 4 && administrationStatus === "administered" && !allChecksComplete) return true
    return false
  }, [currentStep, selectedOrder, canProceedToStep3, administrationStatus, allChecksComplete])

  const isSubmitButtonDisabled = useMemo(() => {
    if (currentStep !== totalSteps) return true
    if (administrationStatus === "administered") {
        // Submit requires all checks to be complete (logic moved to step 4)
        // If they reached step 5, we only need to ensure the initial checks passed
        return false 
    } else if (administrationStatus === "refused") {
        return !refusalReason.trim()
    }
    return true // Should not happen if flow is correct
  }, [currentStep, totalSteps, administrationStatus, refusalReason])

  if (!patient) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Administer Medication</DialogTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Step {currentStep} of {totalSteps}
              </Badge>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4" ref={scrollContainerRef}>
          {renderStep()}
        </div>

        <DialogFooter className="border-t px-6 py-4 flex justify-between">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? handleClose : handleBack}
            disabled={currentStep === 4 && administrationStatus === "administered" && !allChecksComplete} // Disable back from step 4 if checks are not complete
          >
            {currentStep === 1 ? (
              "Cancel"
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </>
            )}
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={isNextButtonDisabled}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitButtonDisabled}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Complete Administration
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}