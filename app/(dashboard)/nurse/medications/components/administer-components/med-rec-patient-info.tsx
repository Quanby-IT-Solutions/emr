// MedRecPatientInfo.tsx
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { User, AlertTriangle } from "lucide-react"
import { Patient } from '@/components/shared/medication/types'

interface MedRecPatientInfoProps {
    patient: Patient
}

export function MedRecPatientInfo({ patient }: MedRecPatientInfoProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Patient Information</h3>
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
                        <div className="col-span-2">
                            <Label className="text-xs text-muted-foreground">Diagnosis</Label>
                            <p className="text-sm">{patient.diagnosis}</p>
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                    <strong>Next:</strong> Select which medication to administer from this patient&apos;s active orders in the next page.
                </p>
            </div>
        </div>
    )
}