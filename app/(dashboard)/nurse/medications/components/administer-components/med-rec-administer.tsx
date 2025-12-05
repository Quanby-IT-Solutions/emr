// MedRecAdminister.tsx
import { useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Activity, CheckCircle2, XCircle } from "lucide-react"
import { MedicationOrder, AdministrationStatus } from '@/components/shared/nurse/medication/types'

interface MedRecAdministerProps {
    selectedOrder: MedicationOrder
    administrationStatus: AdministrationStatus
    onStatusChange: (status: AdministrationStatus) => void
    dosageAdministered: string
    onDosageChange: (dosage: string) => void
    refusalReason: string
    onRefusalReasonChange: (reason: string) => void
}

export function MedRecAdminister({ selectedOrder, administrationStatus, onStatusChange, dosageAdministered, onDosageChange, refusalReason, onRefusalReasonChange }: MedRecAdministerProps) {
    const dosageCardRef = useRef<HTMLDivElement>(null)
    const refusalCardRef = useRef<HTMLDivElement>(null)

    // Scroll to the appropriate section when administration status changes
    useEffect(() => {
        if (administrationStatus) {
            // Small delay to ensure the DOM has rendered
            setTimeout(() => {
                if (administrationStatus === "administered" && dosageCardRef.current) {
                    dosageCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                } else if (administrationStatus === "refused" && refusalCardRef.current) {
                    refusalCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                }
            }, 100)
        }
    }, [administrationStatus])


    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Activity className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Administration Status</h3>
            </div>

            {/* Selected Medication Summary */}
            <Card className="border-green-200 bg-green-50/30">
                <CardContent className="pt-4">
                    <p className="text-xs text-green-700 font-semibold mb-2">SELECTED MEDICATION</p>
                    <p className="font-bold text-base">
                        {selectedOrder.medicationDetails.medicationGenericName} ({selectedOrder.medicationDetails.medicationBrandName})
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {selectedOrder.orderedDosage} - {selectedOrder.routeOfAdministration}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <Label className="text-sm font-semibold mb-4 block">
                        Was the medication administered?
                    </Label>
                    <RadioGroup
                        value={administrationStatus || ""}
                        onValueChange={(value) => onStatusChange(value as AdministrationStatus)}
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
                <Card className="border-green-200 bg-green-50/30" ref={dosageCardRef}>
                    <CardContent className="pt-6 space-y-4">
                        <div>
                            <Label htmlFor="dosage" className="text-sm font-semibold">
                                Dosage Administered <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="dosage"
                                placeholder={`e.g., ${selectedOrder.orderedDosage}`}
                                value={dosageAdministered}
                                onChange={(e) => onDosageChange(e.target.value)}
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
                <Card className="border-red-200 bg-red-50/30" ref={refusalCardRef}>
                    <CardContent className="pt-6">
                        <div>
                            <Label htmlFor="refusal-reason" className="text-sm font-semibold">
                                Reason for Refusal/Non-Administration <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="refusal-reason"
                                placeholder="Please document the reason (e.g., patient refused, patient vomiting, NPO status, etc.)"
                                value={refusalReason}
                                onChange={(e) => onRefusalReasonChange(e.target.value)}
                                className="mt-2"
                                rows={4}
                            />
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}