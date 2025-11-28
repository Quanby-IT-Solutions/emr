import { Card, CardContent } from "@/components/ui/card"
import { ClipboardList, ClipboardPenLine, Clock, Pill, Ruler } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"


interface MedicationOrderDetails {
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

interface MedicationOrderDetailsProps {
    medicationOrder: MedicationOrderDetails | null
    showHeader?: boolean
}

export function MedicationOrderDetails ({ medicationOrder, showHeader }: MedicationOrderDetailsProps) {
    const formatTime = (timeStr: string): string => {
        const match = timeStr.match(/(\d{1,2}):?(\d{2})/)
        if (match) {
        const hours = match[1].padStart(2, '0')
        const minutes = match[2]
        return `${hours}:${minutes}`
        }
        return timeStr
    }

    const calculateDuration = (startDate: Date | undefined, stopDate: Date | undefined): string => {
        if (!startDate || !stopDate) return "N/A"
        
        const diffTime = Math.abs(stopDate.getTime() - startDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 0) return "Same day"
        if (diffDays === 1) return "1 day"
        if (diffDays < 7) return `${diffDays} days`
        
        const weeks = Math.floor(diffDays / 7)
        if (weeks === 1) return "1 week"
        if (diffDays < 30) return `${weeks} weeks`
        
        const months = Math.floor(diffDays / 30)
        return months === 1 ? "1 month" : `${months} months`
    }

    return (
        <div className="space-y-4 ml-2 mr-6">
            {showHeader && (
                <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-blue-700" />
                <h3 className="text-lg font-semibold">Medication Order Details</h3>
                </div>
            )}

            <Card className="border-blue-300 bg-blue-50/20">
                <CardContent className="space-y-4">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between p-2">
                            <div className="flex items-center gap-2">
                                <ClipboardPenLine className="h-5 w-5" />
                                <Label className="font-semibold text-md">{medicationOrder?.medicationOrderId}</Label>
                            </div>
                            <Badge>{medicationOrder?.status}</Badge>
                        </div>
                    </div>

                    <Separator />

                    {/* Medication Details */}
                    <Label className="font-semibold">Medication Details</Label>
                    <div>
                        <Label className="text-xs text-muted-foreground">Medication</Label>
                        <div className="flex items-start gap-2 mt-1">
                            <Pill className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="font-medium text-sm leading-tight">{medicationOrder && medicationOrder.medicationDetails.medicationGenericName.charAt(0).toUpperCase() + medicationOrder.medicationDetails.medicationGenericName.slice(1)} ({medicationOrder?.medicationDetails.medicationBrandName})</p>
                                <p className="text-xs text-muted-foreground mt-1">{medicationOrder?.medicationDetails.medicationClassification}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs text-muted-foreground">Dosage Form</Label>
                            <div className="flex items-center gap-1.5"> 
                                <p className="font-medium text-sm">{medicationOrder?.medicationDetails.dosageForm}</p>
                            </div>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Dosage Unit</Label>
                            <div className="flex items-center gap-1.5">
                                <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                                <p className="font-medium text-sm truncate">{medicationOrder?.medicationDetails.dosageUnit}</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Order Details */}
                    <Label className="font-semibold">Order Details</Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs text-muted-foreground">Ordered Dosage</Label>
                            <p className="font-medium text-sm">{medicationOrder?.orderedDosage}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Intake Route</Label>
                            <p className="font-medium text-sm">{medicationOrder?.routeOfAdministration}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Frequency</Label>
                            <p className="font-medium text-sm">{medicationOrder?.orderedFrequency}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Administer Time</Label>
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                <p className="font-medium text-sm">{medicationOrder?.timeAdminSchedule?.map(formatTime).join(', ')}</p>
                            </div>
                            
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label className="text-xs text-muted-foreground">Start Date</Label>
                            <p className="font-medium text-sm">{medicationOrder?.startDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Stop Date</Label>
                            <p className="font-medium text-sm">{medicationOrder?.stopDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Duration</Label>
                            <p className="font-medium text-sm">{calculateDuration(medicationOrder?.startDate, medicationOrder?.stopDate)}</p>
                        </div>
                    </div>
                    
                    <div>
                        <Label className="text-xs text-muted-foreground">Ordered by</Label>
                        <p className="font-medium text-sm">{medicationOrder?.physician}</p>
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">Special Instructions</Label>
                        <div className="bg-white/50 border rounded-md p-3 text-sm italic text-muted-foreground flex gap-2 mt-2">
                            {medicationOrder?.specialInstructions}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}