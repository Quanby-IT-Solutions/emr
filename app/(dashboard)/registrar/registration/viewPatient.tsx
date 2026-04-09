"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { PatientRecord } from "./dummyregistration"
import { 
    User, 
    Phone, 
    Mail, 
    MapPin, 
    AlertCircle,
    Briefcase,
    Shield,
    Heart,
    Stethoscope,
    FileText
} from "lucide-react"
import { format } from "date-fns"

interface ViewPatientModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    patient: PatientRecord | null
}

export function ViewPatientModal({ open, onOpenChange, patient }: ViewPatientModalProps) {
    if (!patient) return null

    const _calculateAge = (dob: string) => {
        const birthDate = new Date(dob)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }
        return age
    }

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive"> = {
            ACTIVE: "default",
            PENDING: "secondary",
            INACTIVE: "destructive"
        }
        return <Badge variant={variants[status]}>{status}</Badge>
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>Patient Details</span>
                        {getStatusBadge(patient.status)}
                    </DialogTitle>
                    <DialogDescription>
                        Patient ID: {patient.id} | Registered on {format(new Date(patient.dateRegistered), "PPP")}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2 text-lg">
                            <User className="h-5 w-5" />
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                            <div>
                                <p className="text-muted-foreground">Full Name</p>
                                <p className="font-medium">
                                    {patient.lastName}, {patient.firstName} {patient.middleName}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Gender</p>
                                <p className="font-medium">{patient.gender}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Date of Birth</p>
                                <p className="font-medium">
                                    {format(new Date("1979-01-01"), "PPP")} ({patient.age} years old)
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Civil Status</p>
                                <p className="font-medium">Married</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Nationality</p>
                                <p className="font-medium">Filipino</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Religion</p>
                                <p className="font-medium">Roman Catholic</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Contact Information */}
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2 text-lg">
                            <Phone className="h-5 w-5" />
                            Contact Information
                        </h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                            <div>
                                <p className="text-muted-foreground">Mobile Number</p>
                                <p className="font-medium">{patient.contactNumber}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Landline</p>
                                <p className="font-medium">(02) 8123-4567</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-muted-foreground flex items-center gap-1">
                                    <Mail className="h-4 w-4" />
                                    Email Address
                                </p>
                                <p className="font-medium">{patient.firstName.toLowerCase()}.{patient.lastName.toLowerCase()}@email.com</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Address */}
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2 text-lg">
                            <MapPin className="h-5 w-5" />
                            Address
                        </h3>
                        <div className="text-sm">
                            <p className="font-medium">
                                123 Rizal Street, Brgy. Commonwealth, Quezon City, Metro Manila 1121
                            </p>
                        </div>
                    </div>

                    <Separator />

                    {/* Occupation & Employment */}
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2 text-lg">
                            <Briefcase className="h-5 w-5" />
                            Occupation & Employment
                        </h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                            <div>
                                <p className="text-muted-foreground">Occupation</p>
                                <p className="font-medium">Software Engineer</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Employer</p>
                                <p className="font-medium">ABC Corporation</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-muted-foreground">Employer Address</p>
                                <p className="font-medium">Makati City, Metro Manila</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Emergency Contact */}
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2 text-lg">
                            <AlertCircle className="h-5 w-5" />
                            Emergency Contact
                        </h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                            <div>
                                <p className="text-muted-foreground">Contact Person</p>
                                <p className="font-medium">Maria {patient.lastName}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Relationship</p>
                                <p className="font-medium">Spouse</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Contact Number</p>
                                <p className="font-medium">+63 918 234 5678</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Insurance Information */}
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2 text-lg">
                            <Shield className="h-5 w-5" />
                            Insurance Information
                        </h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                            <div>
                                <p className="text-muted-foreground">PhilHealth Number</p>
                                <p className="font-medium">12-345678901-2</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Member Type</p>
                                <p className="font-medium">Member</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">HMO Provider</p>
                                <p className="font-medium">Maxicare</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">HMO Card Number</p>
                                <p className="font-medium">MAX-987654321</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Medical History */}
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2 text-lg">
                            <Stethoscope className="h-5 w-5" />
                            Medical History
                        </h3>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                            <div>
                                <p className="text-muted-foreground">Blood Type</p>
                                <p className="font-medium">O+</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Height / Weight</p>
                                <p className="font-medium">170 cm / 65 kg</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-muted-foreground">Known Allergies</p>
                                <p className="font-medium">Penicillin, Shellfish</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-muted-foreground">Medical History</p>
                                <p className="font-medium">Hypertension (controlled)</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-muted-foreground">Current Medications</p>
                                <p className="font-medium">Losartan 50mg once daily</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Lifestyle */}
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2 text-lg">
                            <Heart className="h-5 w-5" />
                            Lifestyle & Social History
                        </h3>
                        <div className="grid grid-cols-3 gap-x-8 gap-y-3 text-sm">
                            <div>
                                <p className="text-muted-foreground">Smoking Status</p>
                                <p className="font-medium">Never Smoked</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Alcohol Consumption</p>
                                <p className="font-medium">Occasional</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Exercise Frequency</p>
                                <p className="font-medium">Regular (3+ times/week)</p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Additional Information */}
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2 text-lg">
                            <FileText className="h-5 w-5" />
                            Additional Information
                        </h3>
                        <div className="text-sm">
                            <p className="text-muted-foreground">Special Needs</p>
                            <p className="font-medium">None</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}