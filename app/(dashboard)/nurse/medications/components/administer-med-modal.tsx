"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { User, AlertTriangle,  CheckCircle2, XCircle,FileText,Activity,ChevronRight,ChevronLeft } from "lucide-react"

interface MedicationOrder {
  medicationOrderId: string
  medicationDetails: {
    medicationId: string
    medicationGenericName: string
    medicationBrandName: string
    medicationClassification: string
    dosageForm: string
    dosageUnit: string
  }
  orderedDosage: string
  orderedFrequency: string
  routeOfAdministration: string
  timeAdminSchedule: string 
  startDate: Date
  stopDate: Date
  physician: string
  specialInstructions: string
  status: "PENDING" | "ACTIVE" | "ON HOLD" | "FLAGGED" | "EXPIRED" | "DISCONTINUED" | "COMPLETED" | "CANCELLED"
}

interface Patient {
  patientId: string
  patientName: string
  ageSex: string
  currentPhysician: string
  currentWard: string
  currentRoom: string
  chiefComplaint: string
  diagnosis: string
  allergies: string
  lastAdministeredMedication: string
  lastTimeAdministered: string
  dosageGiven: string
  medicationOrders: MedicationOrder[]
}

interface AdministerMedicineWizardProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: Patient | null
  selectedOrder: MedicationOrder | null
  onSubmit?: (data: AdministrationData) => void
}

interface AdministrationData {
  medicationOrderId: string
  dosageAdministered: string
  timeAdministered: string
  dateAdministered: Date
  isAdministered: boolean
  refusalReason?: string
  nurseNotes: string
  verificationChecks: {
    rightPatient: boolean
    rightMedication: boolean
    rightDose: boolean
    rightRoute: boolean
    rightTime: boolean
  }
}

export function AdministerMedicineWizard({ 
  open, 
  onOpenChange, 
  patient, 
  selectedOrder,
  onSubmit 
}: AdministerMedicineWizardProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [administrationStatus, setAdministrationStatus] = useState<"administered" | "refused" | null>(null)
  const [refusalReason, setRefusalReason] = useState("")
  const [dosageAdministered, setDosageAdministered] = useState("")
  const [nurseNotes, setNurseNotes] = useState("")
  const [verificationChecks, setVerificationChecks] = useState({
    rightPatient: false,
    rightMedication: false,
    rightDose: false,
    rightRoute: false,
    rightTime: false
  })

  // Reset form when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen === false) {
      // Reset all state when closing
      setCurrentStep(1)
      setAdministrationStatus(null)
      setRefusalReason("")
      setDosageAdministered("")
      setNurseNotes("")
      setVerificationChecks({
        rightPatient: false,
        rightMedication: false,
        rightDose: false,
        rightRoute: false,
        rightTime: false
      })
    }
    onOpenChange(newOpen)
  }

  const totalSteps = 4
  const allChecksComplete = Object.values(verificationChecks).every(check => check)

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

  const handleSubmit = () => {
    if (!selectedOrder || !patient) return

    const now = new Date()
    const data: AdministrationData = {
      medicationOrderId: selectedOrder.medicationOrderId,
      dosageAdministered: administrationStatus === "administered" ? dosageAdministered : "0",
      timeAdministered: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      dateAdministered: now,
      isAdministered: administrationStatus === "administered",
      refusalReason: administrationStatus === "refused" ? refusalReason : undefined,
      nurseNotes,
      verificationChecks
    }

    onSubmit?.(data)
    handleClose()
  }

  const handleClose = () => {
    handleOpenChange(false)
  }

  const canProceedToStep3 = administrationStatus === "refused" || (administrationStatus === "administered" && dosageAdministered)
  const canSubmit = administrationStatus === "refused" ? refusalReason.trim() !== "" : allChecksComplete

  if (!patient || !selectedOrder) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} >
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

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* STEP 1: Patient & Medication Overview */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Patient & Medication Information</h3>
              </div>

              {/* Patient Info Card */}
              <Card className="border-blue-200 bg-blue-50/30">
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Patient ID</Label>
                      <p className="font-semibold text-sm">{patient.patientId}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Name</Label>
                      <p className="font-semibold text-sm">{patient.patientName}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Age/Sex</Label>
                      <p className="text-sm">{patient.ageSex}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Ward/Room</Label>
                      <p className="text-sm">{patient.currentWard} - {patient.currentRoom}</p>
                    </div>
                  </div>
                  {patient.allergies && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-2 mt-3">
                      <Label className="text-xs text-red-800 font-semibold flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Allergies: {patient.allergies}
                      </Label>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Medication Order Card - Compact and Clickable */}
              <Card 
                className="border-2 border-green-200 bg-green-50/50 cursor-pointer transition-all hover:bg-green-100/50 hover:border-green-400"
                onClick={() => handleNext()}
              >
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-green-700 font-semibold">MEDICATION TO ADMINISTER</p>
                      <p className="font-bold text-base mt-1">
                        {selectedOrder.medicationDetails.medicationGenericName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedOrder.medicationDetails.medicationBrandName}
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <Label className="text-xs text-muted-foreground">Dosage</Label>
                        <p className="font-semibold">{selectedOrder.orderedDosage}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Route</Label>
                        <p className="font-semibold capitalize">{selectedOrder.routeOfAdministration}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Frequency</Label>
                        <p className="font-semibold">{selectedOrder.orderedFrequency}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-green-200 flex items-center justify-between text-xs text-green-700">
                    <span>Click to proceed with administration</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* STEP 2: Administration Status */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Administration Status</h3>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <Label className="text-sm font-semibold mb-4 block">
                    Was the medication administered?
                  </Label>
                  <RadioGroup 
                    value={administrationStatus || ""} 
                    onValueChange={(value) => setAdministrationStatus(value as "administered" | "refused")}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-green-50 cursor-pointer">
                      <RadioGroupItem value="administered" id="administered" />
                      <Label 
                        htmlFor="administered" 
                        className="flex items-center gap-3 cursor-pointer flex-1"
                      >
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-semibold">Medication Administered</p>
                          <p className="text-xs text-muted-foreground">
                            Patient received the medication as ordered
                          </p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-red-50 cursor-pointer">
                      <RadioGroupItem value="refused" id="refused" />
                      <Label 
                        htmlFor="refused" 
                        className="flex items-center gap-3 cursor-pointer flex-1"
                      >
                        <XCircle className="h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-semibold">Medication Refused/Not Given</p>
                          <p className="text-xs text-muted-foreground">
                            Patient refused or medication could not be administered
                          </p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {administrationStatus === "administered" && (
                <Card className="border-green-200 bg-green-50/30">
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <Label htmlFor="dosage" className="text-sm font-semibold">
                        Dosage Administered <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="dosage"
                        placeholder={`e.g., ${selectedOrder.orderedDosage}`}
                        value={dosageAdministered}
                        onChange={(e) => setDosageAdministered(e.target.value)}
                        className="mt-2"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Ordered: {selectedOrder.orderedDosage}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {administrationStatus === "refused" && (
                <Card className="border-red-200 bg-red-50/30">
                  <CardContent className="pt-6">
                    <div>
                      <Label htmlFor="refusal-reason" className="text-sm font-semibold">
                        Reason for Refusal/Non-Administration <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="refusal-reason"
                        placeholder="Please document the reason (e.g., patient refused, patient vomiting, NPO status, etc.)"
                        value={refusalReason}
                        onChange={(e) => setRefusalReason(e.target.value)}
                        className="mt-2"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* STEP 3: Five Rights Verification (only if administered) */}
          {currentStep === 3 && (
            <div className="space-y-4">
              {administrationStatus === "administered" ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Five Rights of Medication Administration</h3>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-900">
                      <strong>Important:</strong> Please verify all five rights before proceeding. 
                      All checkboxes must be checked to complete administration.
                    </p>
                  </div>

                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <Checkbox
                          id="right-patient"
                          checked={verificationChecks.rightPatient}
                          onCheckedChange={(checked) => 
                            setVerificationChecks(prev => ({ ...prev, rightPatient: checked as boolean }))
                          }
                        />
                        <div className="flex-1">
                          <Label htmlFor="right-patient" className="font-semibold cursor-pointer">
                            Right Patient
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            Verified patient identity using two identifiers (Name: {patient.patientName}, ID: {patient.patientId})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <Checkbox
                          id="right-medication"
                          checked={verificationChecks.rightMedication}
                          onCheckedChange={(checked) => 
                            setVerificationChecks(prev => ({ ...prev, rightMedication: checked as boolean }))
                          }
                        />
                        <div className="flex-1">
                          <Label htmlFor="right-medication" className="font-semibold cursor-pointer">
                            Right Medication
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            Confirmed medication: {selectedOrder.medicationDetails.medicationGenericName} ({selectedOrder.medicationDetails.medicationBrandName})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <Checkbox
                          id="right-dose"
                          checked={verificationChecks.rightDose}
                          onCheckedChange={(checked) => 
                            setVerificationChecks(prev => ({ ...prev, rightDose: checked as boolean }))
                          }
                        />
                        <div className="flex-1">
                          <Label htmlFor="right-dose" className="font-semibold cursor-pointer">
                            Right Dose
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            Verified dosage: {dosageAdministered} (Ordered: {selectedOrder.orderedDosage})
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <Checkbox
                          id="right-route"
                          checked={verificationChecks.rightRoute}
                          onCheckedChange={(checked) => 
                            setVerificationChecks(prev => ({ ...prev, rightRoute: checked as boolean }))
                          }
                        />
                        <div className="flex-1">
                          <Label htmlFor="right-route" className="font-semibold cursor-pointer">
                            Right Route
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            Confirmed route: {selectedOrder.routeOfAdministration}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <Checkbox
                          id="right-time"
                          checked={verificationChecks.rightTime}
                          onCheckedChange={(checked) => 
                            setVerificationChecks(prev => ({ ...prev, rightTime: checked as boolean }))
                          }
                        />
                        <div className="flex-1">
                          <Label htmlFor="right-time" className="font-semibold cursor-pointer">
                            Right Time
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            Verified administration time is appropriate (Schedule: {selectedOrder.timeAdminSchedule})
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {!allChecksComplete && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-amber-900 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Please complete all verification checks to proceed
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <XCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Verification not required for refused medications
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Click &quot;Next&quot; to proceed to notes
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Nurse Notes */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Administration Notes</h3>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div>
                    <Label htmlFor="nurse-notes" className="text-sm font-semibold">
                      Nurse Notes (Optional)
                    </Label>
                    <Textarea
                      id="nurse-notes"
                      placeholder="Add any additional observations, patient response, or relevant information..."
                      value={nurseNotes}
                      onChange={(e) => setNurseNotes(e.target.value)}
                      className="mt-2"
                      rows={6}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Summary Card */}
              <Card className="border-blue-200 bg-blue-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Administration Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={administrationStatus === "administered" ? "default" : "destructive"}>
                      {administrationStatus === "administered" ? "Administered" : "Refused/Not Given"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Medication:</span>
                    <span className="font-medium">{selectedOrder.medicationDetails.medicationGenericName}</span>
                  </div>
                  {administrationStatus === "administered" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dosage:</span>
                      <span className="font-medium">{dosageAdministered}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <DialogFooter className="border-t px-6 py-4 flex justify-between">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? handleClose : handleBack}
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
              disabled={
                (currentStep === 2 && !canProceedToStep3) ||
                (currentStep === 3 && administrationStatus === "administered" && !allChecksComplete)
              }
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={administrationStatus === "administered" ? !canSubmit : !refusalReason.trim()}
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