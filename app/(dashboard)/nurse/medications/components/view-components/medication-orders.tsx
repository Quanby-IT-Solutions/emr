import { Card, CardContent } from "@/components/ui/card"
import { Info, Pill, Stethoscope } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface MedicationOrders {
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
        timeAdminSchedule: string[] 
        startDate: Date
        stopDate: Date
        physician: string
        specialInstructions: string
        status: "PENDING" |"ACTIVE" | "ON HOLD" | "FLAGGED" | "EXPIRED" | "DISCONTINUED" | "COMPLETED" | "CANCELLED"
}

interface MedicationOrdersCardProps {
    medicationOrders: MedicationOrders[]
    showHeader?: boolean
    onRecordClick: (medicationOrderId: string) => void
}

export function MedicationOrdersCard ({ medicationOrders, showHeader, onRecordClick }: MedicationOrdersCardProps) {
    const formatTime = (timeStr: string): string => {
        const match = timeStr.match(/(\d{1,2}):?(\d{2})/)
        if (match) {
        const hours = match[1].padStart(2, '0')
        const minutes = match[2]
        return `${hours}:${minutes}`
        }
        return timeStr
    }

    return (
        <div className="space-y-4 ml-2 mr-6">
        {showHeader && (
            <div className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Medication Orders </h3>
            </div>
        )}
        {medicationOrders.length === 0 ? (
            <Card className="flex items-center justify-center">
                <p className="text-sm text-muted-foreground">No medication orders found.</p>
            </Card>
        ) : (
            medicationOrders.map((medicationOrder) => (
                <Card key={medicationOrder.medicationOrderId} className="border-blue-300 bg-blue-50/20" onClick={() => onRecordClick(medicationOrder.medicationOrderId)}>
                    <CardContent className="space-y-1 mb-2">
                        <div className="space-y-3">
                            <div>
                                <div className="flex items-start justify-between mt-1">
                                    <div className="space-y-1">
                                        <Label className="font-semibold leading-tight">{medicationOrder?.medicationDetails.medicationGenericName.charAt(0).toUpperCase() + medicationOrder?.medicationDetails.medicationGenericName.slice(1)} ({medicationOrder?.medicationDetails.medicationBrandName})</Label>
                                        <p className="text-xs text-muted-foreground">{medicationOrder?.medicationDetails.medicationClassification}</p>
                                    </div>
                                    <Badge>{medicationOrder?.status}</Badge>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div>
                                <p className="text-xs font-semibold">{medicationOrder?.medicationDetails.dosageForm.charAt(0).toUpperCase() + medicationOrder?.medicationDetails.dosageForm.slice(1)} - {medicationOrder?.orderedDosage}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold">{medicationOrder?.orderedFrequency} - {medicationOrder?.timeAdminSchedule?.map(formatTime).join(', ')}</p>
                            </div>
                        </div>
                        <Separator className="my-2"/>

                        <div>
                            <Label className="text-xs text-muted-foreground">Physician</Label>
                            <p className="text-sm">{medicationOrder?.physician}</p>
                        </div>

                    </CardContent>
                </Card>
        )))}
        </div>
      )
}