// MedRecOrderSelect.tsx
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Pill, AlertTriangle } from "lucide-react"
import { MedicationOrder } from '@/components/shared/medication/types'

interface MedRecOrderSelectProps {
    activeOrders: MedicationOrder[]
    selectedOrder: MedicationOrder | null
    onSelectOrder: (order: MedicationOrder | null) => void
}

export function MedRecOrderSelect({ activeOrders, selectedOrder, onSelectOrder }: MedRecOrderSelectProps) {
    
    
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <Pill className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Select Medication to Administer</h3>
            </div>

            {activeOrders.length === 0 ? (
                <Card className="border-amber-200 bg-amber-50/30">
                    <CardContent className="pt-6 text-center">
                        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
                        <p className="text-sm text-amber-900">
                            No active medication orders found for this patient.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Select the medication you wish to administer ({activeOrders.length} active order{activeOrders.length !== 1 ? 's' : ''})
                    </p>

                    <RadioGroup
                        value={selectedOrder?.medicationOrderId || ""}
                        onValueChange={(value) => {
                            const order = activeOrders.find(o => o.medicationOrderId === value)
                            onSelectOrder(order || null)
                        }}
                        className="space-y-3"
                    >
                        {activeOrders.map((order) => (
                            <div
                                key={order.medicationOrderId}
                                className={`flex items-start space-x-3 border-2 rounded-lg p-4 hover:bg-green-50 cursor-pointer transition-all ${
                                    selectedOrder?.medicationOrderId === order.medicationOrderId ? 'border-green-500' : 'border-gray-200'
                                }`}
                                onClick={() => onSelectOrder(order)}
                            >
                                <RadioGroupItem
                                    value={order.medicationOrderId}
                                    id={order.medicationOrderId}
                                    className="mt-1"
                                />
                                <Label
                                    htmlFor={order.medicationOrderId}
                                    className="flex-1 cursor-pointer"
                                >
                                    <div className="space-y-2">
                                        <div>
                                            <p className="font-bold text-base">
                                                {order.medicationDetails.medicationGenericName}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {order.medicationDetails.medicationBrandName}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3 text-sm">
                                            <div>
                                                <Label className="text-xs text-muted-foreground">Dosage</Label>
                                                <p className="font-semibold">{order.orderedDosage}</p>
                                            </div>
                                            <div>
                                                <Label className="text-xs text-muted-foreground">Route</Label>
                                                <p className="font-semibold capitalize">{order.routeOfAdministration}</p>
                                            </div>
                                            <div>
                                                <Label className="text-xs text-muted-foreground">Frequency</Label>
                                                <p className="font-semibold">{order.orderedFrequency}</p>
                                            </div>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            <p>Schedule: {order.timeAdminSchedule.join(', ')}</p>
                                            {order.specialInstructions && (
                                                <p className="mt-1 text-amber-700">⚠️ {order.specialInstructions}</p>
                                            )}
                                        </div>
                                        <Badge variant={order.status === "ACTIVE" ? "default" : "secondary"} className="text-xs">
                                            {order.status}
                                        </Badge>
                                    </div>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            )}
        </div>
    )
}