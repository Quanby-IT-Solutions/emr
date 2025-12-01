import { Card, CardContent} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
    Pill, 
    Clock, 
    User, 
    Stethoscope,
    MoreHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Using the interfaces provided in your prompt
export interface MedicationOrderType {
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
    medicationOrders: MedicationOrderType[]
    showHeader?: boolean
    onRecordClick: (medicationOrderId: string) => void
}

export function MedicationOrdersCard ({ medicationOrders, showHeader, onRecordClick }: MedicationOrdersCardProps) {

    // Helper to color-code statuses
    const getStatusStyle = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200";
            case "ON HOLD":
                return "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200";
            case "DISCONTINUED":
            case "CANCELLED":
            case "EXPIRED":
                return "bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200";
            case "FLAGGED":
                return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
            default:
                return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
        }
    }

    return (
        <div className="space-y-4 w-full max-w-2xl">
            {showHeader && (
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Stethoscope className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Medication Orders</h3>
                            <p className="text-xs text-muted-foreground">Active prescriptions and schedule</p>
                        </div>
                    </div>
                </div>
            )}

            {medicationOrders.length === 0 ? (
                <Card className="flex flex-col items-center justify-center py-12 border-dashed">
                    <div className="p-4 rounded-full bg-slate-50 mb-3">
                        <Pill className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-900">No active orders</p>
                    <p className="text-xs text-muted-foreground">There are no medication orders for this patient.</p>
                </Card>
            ) : (
                <div className="grid gap-3">
                    {medicationOrders.map((order) => (
                        <Card 
                            key={order.medicationOrderId} 
                            className="group relative overflow-hidden transition-all hover:shadow-md border-slate-200 cursor-pointer bg-white"
                            onClick={() => onRecordClick(order.medicationOrderId)}
                        >
                            {/* Left colored accent bar based on status status - Optional flair */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                order.status === 'ACTIVE' ? 'bg-emerald-500' : 
                                order.status === 'ON HOLD' ? 'bg-amber-500' : 'bg-slate-300'
                            }`} />

                            <CardContent className="p-0">
                                {/* Main Content Area */}
                                <div className="p-3 pl-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-lg text-slate-900">
                                                    {order.medicationDetails.medicationGenericName}
                                                </h4>
                                                <Badge variant="outline" className="font-normal text-slate-500 bg-transparent">
                                                    {order.medicationDetails.medicationBrandName}
                                                </Badge>
                                            </div>
                                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                                {order.medicationDetails.medicationClassification}
                                            </p>
                                        </div>
                                        <Badge variant="secondary" className={`${getStatusStyle(order.status)} border px-3 py-1 rounded-full`}>
                                            {order.status}
                                        </Badge>
                                    </div>

                                    {/* Clinical Details Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                                        
                                        {/* Dosage Info */}
                                        <div className="flex items-start gap-3">
                                            <Pill className="h-3 w-3 text-slate-400 shrink-0" />
                                            <div>
                                                <span className="block text-xs text-muted-foreground font-medium">Dosage & Form</span>
                                                <span className="text-slate-600 font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded capitalize">
                                                    {order.orderedDosage} • {order.medicationDetails.dosageForm}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Frequency Info */}
                                        <div className="flex items-start gap-3">
                                            <Clock className="h-3 w-3 text-slate-400 mt-0.5 shrink-0" />
                                            <div>
                                                <span className="block text-xs text-muted-foreground font-medium">Frequency</span>
                                                <span className="text-slate-600 font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                                                    {order.orderedFrequency}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer / Meta Data */}
                                <div className="bg-slate-50/80 border-t border-slate-100 px-5 py-3 pl-6 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-4 text-slate-500">
                                        <span className="block text-xs text-muted-foreground font-medium">Ordered by:</span>
                                        <div className="flex items-center gap-1.5">
                                            <User className="h-3.5 w-3.5" />
                                            <span>{order.physician}</span>
                                        </div>
                                    </div>
                                    
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-blue-600">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}