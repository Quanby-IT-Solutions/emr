import { Card, CardContent } from "@/components/ui/card"
import { ClipboardList, ClipboardPenLine, Clock, Pill} from "lucide-react"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"


export interface MedicationOrderDetails {
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
        // Remove any whitespace
        const cleaned = timeStr.trim()
        
        // Match 4-digit time format (HHMM) or time with colon (HH:MM)
        const match = cleaned.match(/^(\d{2})(\d{2})$|^(\d{1,2}):(\d{2})$/)
        if (match) {
            // If HHMM format (e.g., "0800")
            if (match[1] && match[2]) {
                return `${match[1]}:${match[2]}`
            }
            // If HH:MM format (e.g., "08:00")
            if (match[3] && match[4]) {
                const hours = match[3].padStart(2, '0')
                return `${hours}:${match[4]}`
            }
        }
        return timeStr
    }

    const categorizeTimesByPeriod = (times: string[] | undefined) => {
        if (!times || times.length === 0) return { morning: [], afternoon: [], evening: [] }
        
        // Handle case where times might be in a single string separated by comma
        const allTimes: string[] = []
        times.forEach(timeStr => {
            if (timeStr.includes(',')) {
                allTimes.push(...timeStr.split(',').map(t => t.trim()))
            } else {
                allTimes.push(timeStr)
            }
        })
        
        const morning: string[] = []
        const afternoon: string[] = []
        const evening: string[] = []
        
        allTimes.forEach(timeStr => {
            const formatted = formatTime(timeStr)
            // Extract hour from formatted time (HH:MM)
            const hour = parseInt(formatted.split(':')[0])
            
            if (hour >= 5 && hour < 12) {
                morning.push(formatted)
            } else if (hour >= 12 && hour < 17) {
                afternoon.push(formatted)
            } else {
                evening.push(formatted)
            }
        })
        
        return { morning, afternoon, evening }
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

    const timePeriods = categorizeTimesByPeriod(medicationOrder?.timeAdminSchedule)

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
                                <p className="font-medium text-sm leading-tight capitalize">{medicationOrder && medicationOrder.medicationDetails.medicationGenericName} ({medicationOrder?.medicationDetails.medicationBrandName})</p>
                                <p className="text-xs text-muted-foreground mt-1">{medicationOrder?.medicationDetails.medicationClassification}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs text-muted-foreground">Dosage Form</Label>
                            <div className="flex items-center gap-1.5"> 
                                <p className="font-medium text-sm capitalize">{medicationOrder?.medicationDetails.dosageForm}</p>
                            </div>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Dosage Unit</Label>
                            <div className="flex items-center gap-1.5">
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
                            <p className="font-medium text-sm capitalize">{medicationOrder?.routeOfAdministration}</p>
                        </div>
                    </div>

                    <div>
                        <Label className="text-xs text-muted-foreground">Frequency</Label>
                        <p className="font-medium text-sm">{medicationOrder?.orderedFrequency}</p>
                    </div>

                    <div>
                        <Label className="text-xs text-muted-foreground flex items-center gap-1.5 mb-2">
                            <Clock className="h-3.5 w-3.5" />
                            Administer Time
                        </Label>
                        <div className="bg-white/50 border rounded-md p-3 space-y-2">
                            {timePeriods.morning.length > 0 && (
                                <div className="flex items-start gap-2">
                                    <span className="text-xs font-semibold text-muted-foreground min-w-[70px]">Morning:</span>
                                    <span className="text-xs font-medium">{timePeriods.morning.join(', ')}</span>
                                </div>
                            )}
                            {timePeriods.afternoon.length > 0 && (
                                <div className="flex items-start gap-2">
                                    <span className="text-xs font-semibold text-muted-foreground min-w-[70px]">Afternoon:</span>
                                    <span className="text-xs font-medium">{timePeriods.afternoon.join(', ')}</span>
                                </div>
                            )}
                            {timePeriods.evening.length > 0 && (
                                <div className="flex items-start gap-2">
                                    <span className="text-xs font-semibold text-muted-foreground min-w-[70px]">Evening:</span>
                                    <span className="text-xs font-medium">{timePeriods.evening.join(', ')}</span>
                                </div>
                            )}
                            {timePeriods.morning.length === 0 && timePeriods.afternoon.length === 0 && timePeriods.evening.length === 0 && (
                                <span className="text-xs text-muted-foreground italic">No schedule</span>
                            )}
                        </div>
                    </div>
                    
                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs text-muted-foreground">Start Date</Label>
                            <p className="font-medium text-sm">{medicationOrder?.startDate.toDateString()}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Stop Date</Label>
                            <p className="font-medium text-sm">{medicationOrder?.stopDate.toDateString()}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Duration</Label>
                            <p className="font-medium text-sm">{calculateDuration(medicationOrder?.startDate, medicationOrder?.stopDate)}</p>
                        </div>
                    </div>
                    
                    <Separator />

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