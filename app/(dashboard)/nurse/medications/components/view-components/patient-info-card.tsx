// components/view-components/patient-info-card.tsx
import { User, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface MedicationProfilePatient {
  patientId: string
  patientName: string
  ageSex: string
  currentPhysician: string
  currentWard: string
  currentRoom: string
  chiefComplaint: string
  diagnosis: string
  allergies: string
}

interface PatientInfoCardProps {
  patientData: MedicationProfilePatient
  medicationOrdersCount: number
  showHeader?: boolean 
}

export function PatientInfoCard({ patientData, medicationOrdersCount, showHeader = true }: PatientInfoCardProps) {
  return (
    <div className="space-y-4 ml-2 mr-6">
      {showHeader && (
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Patient Information</h3>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
        <p className="text-xs text-blue-800">
          This patient has <strong>{medicationOrdersCount}</strong> medication order(s) on file.
        </p>
      </div>

      <Card className="border-blue-200 bg-blue-50/30">
        <CardContent className="space-y-1 mb-2">
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Patient ID</Label>
              <p className="font-medium text-sm">{patientData.patientId}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Name</Label>
                <p className="font-medium text-sm">{patientData.patientName}</p>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Age/Sex</Label>
                <p className="font-medium text-sm">{patientData.ageSex}</p>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Ward</Label>
                <p className="font-medium text-sm">{patientData.currentWard}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Room</Label>
                <p className="font-medium text-sm">{patientData.currentRoom}</p>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Physician</Label>
              <p className="font-medium text-sm">{patientData.currentPhysician}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Chief Complaint</Label>
              <p className="font-medium text-sm">{patientData.chiefComplaint}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Diagnosis</Label>
              <p className="font-medium text-sm">{patientData.diagnosis}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Allergies</Label>
              <Badge variant="destructive" className="mt-1">{patientData.allergies}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}