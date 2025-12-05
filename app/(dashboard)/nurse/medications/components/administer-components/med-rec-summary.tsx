// MedRecSummary.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"
import { MedicationOrder, AdministrationStatus } from '@/components/shared/nurse/medication/types'

interface MedRecSummaryProps {
    selectedOrder: MedicationOrder
    administrationStatus: AdministrationStatus
    dosageAdministered: string
    refusalReason: string
    nurseNotes: string
    onNurseNotesChange: (notes: string) => void
}

export function MedRecSummary({ selectedOrder, administrationStatus, dosageAdministered, refusalReason, nurseNotes, onNurseNotesChange}: MedRecSummaryProps) {
    const now = new Date()

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Administration Notes & Summary</h3>
            </div>

            <Card>
                <CardContent className="pt-2">
                    <div>
                        <Label htmlFor="nurse-notes" className="text-sm font-semibold">
                            Nurse Notes
                        </Label>
                        <Textarea
                            id="nurse-notes"
                            placeholder="Add any additional observations, patient response, or relevant information..."
                            value={nurseNotes}
                            onChange={(e) => onNurseNotesChange(e.target.value)}
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
                    {administrationStatus === "refused" && (
                         <div className="flex justify-between items-start">
                            <span className="text-muted-foreground">Refusal Reason:</span>
                            <span className="font-medium max-w-[60%] text-right">{refusalReason}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-medium">{now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{now.toLocaleDateString()}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}