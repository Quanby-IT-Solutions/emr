"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { PatientRecord } from "./dummyregistration"
import { useState } from "react"
import { 
    CalendarIcon, 
    User, 
    Phone, 
    Mail, 
    MapPin, 
    AlertCircle,
    Save,
    X,
    Heart,
    Briefcase,
    Shield,
    FileText,
    Stethoscope
} from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

interface EditPatientModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    patient: PatientRecord | null
}

export function EditPatientModal({ open, onOpenChange, patient }: EditPatientModalProps) {
    const [dateOfBirth, setDateOfBirth] = useState<Date>()
    const [hasInsurance, setHasInsurance] = useState(true)

    if (!patient) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        toast.success(`Patient ${patient.id} updated successfully`)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Patient Information</DialogTitle>
                    <DialogDescription>
                        Patient ID: {patient.id} | Update patient details below
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2 text-lg">
                                <User className="h-5 w-5" />
                                Personal Information
                            </h3>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-lastName">Last Name *</Label>
                                    <Input id="edit-lastName" defaultValue={patient.lastName} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-firstName">First Name *</Label>
                                    <Input id="edit-firstName" defaultValue={patient.firstName} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-middleName">Middle Name</Label>
                                    <Input id="edit-middleName" defaultValue={patient.middleName} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-suffix">Suffix</Label>
                                    <Input id="edit-suffix" placeholder="Jr., Sr., III" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-gender">Gender *</Label>
                                    <Select defaultValue={patient.gender} required>
                                        <SelectTrigger id="edit-gender">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MALE">Male</SelectItem>
                                            <SelectItem value="FEMALE">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Date of Birth *</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start text-left font-normal"
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {dateOfBirth ? format(dateOfBirth, "PPP") : format(new Date("1979-01-01"), "PPP")}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={dateOfBirth}
                                                onSelect={setDateOfBirth}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-birthPlace">Place of Birth</Label>
                                    <Input id="edit-birthPlace" defaultValue="Quezon City, Metro Manila" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-nationality">Nationality</Label>
                                    <Input id="edit-nationality" defaultValue="Filipino" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-civilStatus">Civil Status *</Label>
                                    <Select defaultValue="MARRIED" required>
                                        <SelectTrigger id="edit-civilStatus">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SINGLE">Single</SelectItem>
                                            <SelectItem value="MARRIED">Married</SelectItem>
                                            <SelectItem value="WIDOWED">Widowed</SelectItem>
                                            <SelectItem value="SEPARATED">Separated</SelectItem>
                                            <SelectItem value="DIVORCED">Divorced</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-religion">Religion</Label>
                                    <Input id="edit-religion" defaultValue="Roman Catholic" />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2 text-lg">
                                <Phone className="h-5 w-5" />
                                Contact Information
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-mobileNumber">Mobile Number *</Label>
                                    <Input 
                                        id="edit-mobileNumber" 
                                        type="tel"
                                        defaultValue={patient.contactNumber}
                                        required 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-landline">Landline</Label>
                                    <Input 
                                        id="edit-landline" 
                                        type="tel"
                                        defaultValue="(02) 8123-4567"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="edit-email">
                                        <Mail className="inline h-4 w-4 mr-1" />
                                        Email Address
                                    </Label>
                                    <Input 
                                        id="edit-email" 
                                        type="email"
                                        defaultValue={`${patient.firstName.toLowerCase()}.${patient.lastName.toLowerCase()}@email.com`}
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Address */}
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2 text-lg">
                                <MapPin className="h-5 w-5" />
                                Current Address
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="edit-street">Street Address / House No. *</Label>
                                    <Input 
                                        id="edit-street" 
                                        defaultValue="123 Rizal Street"
                                        required 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-barangay">Barangay *</Label>
                                    <Input id="edit-barangay" defaultValue="Barangay Commonwealth" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-city">City/Municipality *</Label>
                                    <Input id="edit-city" defaultValue="Quezon City" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-province">Province *</Label>
                                    <Input id="edit-province" defaultValue="Metro Manila" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-zipCode">Zip Code</Label>
                                    <Input id="edit-zipCode" defaultValue="1121" />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Occupation & Employer */}
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2 text-lg">
                                <Briefcase className="h-5 w-5" />
                                Occupation & Employment
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-occupation">Occupation</Label>
                                    <Input id="edit-occupation" defaultValue="Software Engineer" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-employer">Employer</Label>
                                    <Input id="edit-employer" defaultValue="ABC Corporation" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-employerAddress">Employer Address</Label>
                                    <Input id="edit-employerAddress" defaultValue="Makati City, Metro Manila" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-employerContact">Employer Contact</Label>
                                    <Input id="edit-employerContact" type="tel" defaultValue="+63 2 8888 8888" />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Emergency Contact */}
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2 text-lg">
                                <AlertCircle className="h-5 w-5" />
                                Emergency Contact Information
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-emergencyContactName">Contact Person Name *</Label>
                                    <Input id="edit-emergencyContactName" defaultValue={`Maria ${patient.lastName}`} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-emergencyRelationship">Relationship *</Label>
                                    <Select defaultValue="SPOUSE" required>
                                        <SelectTrigger id="edit-emergencyRelationship">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="SPOUSE">Spouse</SelectItem>
                                            <SelectItem value="PARENT">Parent</SelectItem>
                                            <SelectItem value="CHILD">Child</SelectItem>
                                            <SelectItem value="SIBLING">Sibling</SelectItem>
                                            <SelectItem value="RELATIVE">Other Relative</SelectItem>
                                            <SelectItem value="FRIEND">Friend</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-emergencyContactNumber">Contact Number *</Label>
                                    <Input 
                                        id="edit-emergencyContactNumber" 
                                        type="tel"
                                        defaultValue="+63 918 234 5678"
                                        required 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-emergencyAddress">Address</Label>
                                    <Input id="edit-emergencyAddress" defaultValue="Same as patient" />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Insurance Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2 text-lg">
                                <Shield className="h-5 w-5" />
                                Insurance Information
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-philhealthNumber">PhilHealth Number</Label>
                                    <Input 
                                        id="edit-philhealthNumber" 
                                        defaultValue="12-345678901-2"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-philhealthType">PhilHealth Member Type</Label>
                                    <Select defaultValue="MEMBER">
                                        <SelectTrigger id="edit-philhealthType">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MEMBER">Member</SelectItem>
                                            <SelectItem value="DEPENDENT">Dependent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox 
                                            id="edit-hasPrivateInsurance"
                                            checked={hasInsurance}
                                            onCheckedChange={(checked) => setHasInsurance(checked as boolean)}
                                        />
                                        <Label 
                                            htmlFor="edit-hasPrivateInsurance" 
                                            className="text-sm font-normal cursor-pointer"
                                        >
                                            Has Private Health Insurance / HMO
                                        </Label>
                                    </div>
                                </div>
                                {hasInsurance && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-hmoProvider">Insurance Provider / HMO</Label>
                                            <Input id="edit-hmoProvider" defaultValue="Maxicare" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-hmoNumber">Card Number</Label>
                                            <Input id="edit-hmoNumber" defaultValue="MAX-987654321" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-hmoPlanType">Plan Type</Label>
                                            <Input id="edit-hmoPlanType" defaultValue="Gold" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="edit-hmoValidity">Validity Date</Label>
                                            <Input id="edit-hmoValidity" type="date" defaultValue="2025-12-31" />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Medical History */}
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2 text-lg">
                                <Stethoscope className="h-5 w-5" />
                                Medical History
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-bloodType">Blood Type</Label>
                                    <Select defaultValue="O+">
                                        <SelectTrigger id="edit-bloodType">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A+">A+</SelectItem>
                                            <SelectItem value="A-">A-</SelectItem>
                                            <SelectItem value="B+">B+</SelectItem>
                                            <SelectItem value="B-">B-</SelectItem>
                                            <SelectItem value="AB+">AB+</SelectItem>
                                            <SelectItem value="AB-">AB-</SelectItem>
                                            <SelectItem value="O+">O+</SelectItem>
                                            <SelectItem value="O-">O-</SelectItem>
                                            <SelectItem value="UNKNOWN">Unknown</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-height">Height (cm)</Label>
                                    <Input id="edit-height" type="number" defaultValue="170" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-weight">Weight (kg)</Label>
                                    <Input id="edit-weight" type="number" defaultValue="65" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="edit-allergies">Known Allergies</Label>
                                    <Textarea 
                                        id="edit-allergies" 
                                        defaultValue="Penicillin, Shellfish"
                                        rows={2}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="edit-medicalHistory">Medical History / Chronic Conditions</Label>
                                    <Textarea 
                                        id="edit-medicalHistory" 
                                        defaultValue="Hypertension (controlled)"
                                        rows={2}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="edit-currentMedications">Current Medications</Label>
                                    <Textarea 
                                        id="edit-currentMedications" 
                                        defaultValue="Losartan 50mg once daily"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Lifestyle & Social History */}
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2 text-lg">
                                <Heart className="h-5 w-5" />
                                Lifestyle & Social History
                            </h3>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-smokingStatus">Smoking Status</Label>
                                    <Select defaultValue="NEVER">
                                        <SelectTrigger id="edit-smokingStatus">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NEVER">Never Smoked</SelectItem>
                                            <SelectItem value="FORMER">Former Smoker</SelectItem>
                                            <SelectItem value="CURRENT">Current Smoker</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-alcoholConsumption">Alcohol Consumption</Label>
                                    <Select defaultValue="OCCASIONAL">
                                        <SelectTrigger id="edit-alcoholConsumption">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NONE">None</SelectItem>
                                            <SelectItem value="OCCASIONAL">Occasional</SelectItem>
                                            <SelectItem value="MODERATE">Moderate</SelectItem>
                                            <SelectItem value="HEAVY">Heavy</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-exerciseFrequency">Exercise Frequency</Label>
                                    <Select defaultValue="REGULAR">
                                        <SelectTrigger id="edit-exerciseFrequency">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NONE">None</SelectItem>
                                            <SelectItem value="RARELY">Rarely</SelectItem>
                                            <SelectItem value="WEEKLY">1-2 times/week</SelectItem>
                                            <SelectItem value="REGULAR">3+ times/week</SelectItem>
                                            <SelectItem value="DAILY">Daily</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Patient Status */}
                        <div className="space-y-4">
                            <h3 className="font-semibold flex items-center gap-2 text-lg">
                                <FileText className="h-5 w-5" />
                                Patient Status
                            </h3>
                            <div className="space-y-2">
                                <Label htmlFor="edit-status">Registration Status</Label>
                                <Select defaultValue={patient.status}>
                                    <SelectTrigger id="edit-status">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-6 gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            <X className="mr-2 h-4 w-4" />
                            Cancel
                        </Button>
                        <Button type="submit">
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}