// MedRecVerify.tsx
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react"
import { Patient, MedicationOrder, AdministrationStatus, VerificationChecks } from '@/components/shared/nurse/medication/types'

interface MedRecVerifyProps {
    patient: Patient
    selectedOrder: MedicationOrder
    administrationStatus: AdministrationStatus
    dosageAdministered: string
    verificationChecks: VerificationChecks
    onVerificationChange: (checks: VerificationChecks) => void
}

export function MedRecVerify({
    patient,
    selectedOrder,
    administrationStatus,
    dosageAdministered,
    verificationChecks,
    onVerificationChange
}: MedRecVerifyProps) {
    const allChecksComplete = Object.values(verificationChecks).every(check => check)
    
    const handleCheckChange = (key: keyof VerificationChecks, checked: boolean) => {
        onVerificationChange({ ...verificationChecks, [key]: checked })
    }

    if (administrationStatus !== "administered") {
        return (
            <div className="text-center py-8">
                <XCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-muted-foreground">
                    Verification not required for refused medications
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                    Click &quot;Next&quot; to proceed to notes
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
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
                    {/* Right Patient */}
                    <div 
                        className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleCheckChange('rightPatient', !verificationChecks.rightPatient)}
                    >
                        <Checkbox
                            id="right-patient"
                            checked={verificationChecks.rightPatient}
                            onCheckedChange={(checked) => handleCheckChange('rightPatient', checked as boolean)}
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

                    {/* Right Medication */}
                    <div 
                        className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleCheckChange('rightMedication', !verificationChecks.rightMedication)}
                    >
                        <Checkbox
                            id="right-medication"
                            checked={verificationChecks.rightMedication}
                            onCheckedChange={(checked) => handleCheckChange('rightMedication', checked as boolean)}
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

                    {/* Right Dose */}
                    <div 
                        className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleCheckChange('rightDose', !verificationChecks.rightDose)}
                    >
                        <Checkbox
                            id="right-dose"
                            checked={verificationChecks.rightDose}
                            onCheckedChange={(checked) => handleCheckChange('rightDose', checked as boolean)}
                        />
                        <div className="flex-1">
                            <Label htmlFor="right-dose" className="font-semibold cursor-pointer">
                                Right Dose
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                                Verified dosage: **{dosageAdministered}** (Ordered: {selectedOrder.orderedDosage})
                            </p>
                        </div>
                    </div>

                    {/* Right Route */}
                    <div 
                        className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleCheckChange('rightRoute', !verificationChecks.rightRoute)}
                    >
                        <Checkbox
                            id="right-route"
                            checked={verificationChecks.rightRoute}
                            onCheckedChange={(checked) => handleCheckChange('rightRoute', checked as boolean)}
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

                    {/* Right Time */}
                    <div 
                        className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleCheckChange('rightTime', !verificationChecks.rightTime)}
                    >
                        <Checkbox
                            id="right-time"
                            checked={verificationChecks.rightTime}
                            onCheckedChange={(checked) => handleCheckChange('rightTime', checked as boolean)}
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
        </div>
    )
}