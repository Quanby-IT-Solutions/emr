"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { 
    CalendarIcon, 
    User, 
    Phone, 
    Mail, 
    MapPin, 
    AlertCircle,
    Save,
    UserPlus,
    X,
    Heart,
    Briefcase,
    Shield,
    FileText,
    Stethoscope
} from "lucide-react"
import { format } from "date-fns"

interface RegistrationFormProps {
    onClose: () => void
}

export function RegistrationForm({ onClose }: RegistrationFormProps) {
    const [dateOfBirth, setDateOfBirth] = useState<Date>()
    const [hasInsurance, setHasInsurance] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission
        console.log("Form submitted")
        onClose()
    }

    const handleSaveAsDraft = () => {
        // Handle save as draft
        console.log("Saved as draft")
        onClose()
    }

    return (
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
                            <Label htmlFor="lastName">Last Name *</Label>
                            <Input id="lastName" placeholder="Dela Cruz" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name *</Label>
                            <Input id="firstName" placeholder="Juan" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="middleName">Middle Name</Label>
                            <Input id="middleName" placeholder="Santos" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="suffix">Suffix</Label>
                            <Input id="suffix" placeholder="Jr., Sr., III" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender *</Label>
                            <Select required>
                                <SelectTrigger id="gender">
                                    <SelectValue placeholder="Select gender" />
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
                                        {dateOfBirth ? format(dateOfBirth, "PPP") : "Pick a date"}
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
                            <Label htmlFor="birthPlace">Place of Birth</Label>
                            <Input id="birthPlace" placeholder="Quezon City, Metro Manila" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nationality">Nationality</Label>
                            <Input id="nationality" placeholder="Filipino" defaultValue="Filipino" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="civilStatus">Civil Status *</Label>
                            <Select required>
                                <SelectTrigger id="civilStatus">
                                    <SelectValue placeholder="Select status" />
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
                            <Label htmlFor="religion">Religion</Label>
                            <Input id="religion" placeholder="Roman Catholic" />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2 text-lg">
                        <Phone className="h-5 w-5" />
                        Contact Information
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="mobileNumber">Mobile Number *</Label>
                            <Input 
                                id="mobileNumber" 
                                type="tel"
                                placeholder="+63 917 123 4567" 
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="landline">Landline</Label>
                            <Input 
                                id="landline" 
                                type="tel"
                                placeholder="(02) 8123-4567" 
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="email">
                                <Mail className="inline h-4 w-4 mr-1" />
                                Email Address
                            </Label>
                            <Input 
                                id="email" 
                                type="email"
                                placeholder="juan.delacruz@email.com" 
                            />
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2 text-lg">
                        <MapPin className="h-5 w-5" />
                        Current Address
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="street">Street Address / House No. *</Label>
                            <Input 
                                id="street" 
                                placeholder="Block 1 Lot 2, 123 Rizal Street" 
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="barangay">Barangay *</Label>
                            <Input id="barangay" placeholder="Barangay Commonwealth" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city">City/Municipality *</Label>
                            <Input id="city" placeholder="Quezon City" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="province">Province *</Label>
                            <Input id="province" placeholder="Metro Manila" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="zipCode">Zip Code</Label>
                            <Input id="zipCode" placeholder="1121" />
                        </div>
                    </div>
                </div>

                {/* Occupation & Employer */}
                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2 text-lg">
                        <Briefcase className="h-5 w-5" />
                        Occupation & Employment
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="occupation">Occupation</Label>
                            <Input id="occupation" placeholder="Software Engineer" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="employer">Employer</Label>
                            <Input id="employer" placeholder="ABC Corporation" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="employerAddress">Employer Address</Label>
                            <Input id="employerAddress" placeholder="Makati City, Metro Manila" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="employerContact">Employer Contact</Label>
                            <Input id="employerContact" type="tel" placeholder="+63 2 8888 8888" />
                        </div>
                    </div>
                </div>

                {/* Emergency Contact */}
                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2 text-lg">
                        <AlertCircle className="h-5 w-5" />
                        Emergency Contact Information
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="emergencyContactName">Contact Person Name *</Label>
                            <Input id="emergencyContactName" placeholder="Maria Dela Cruz" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emergencyRelationship">Relationship *</Label>
                            <Select required>
                                <SelectTrigger id="emergencyRelationship">
                                    <SelectValue placeholder="Select relationship" />
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
                            <Label htmlFor="emergencyContactNumber">Contact Number *</Label>
                            <Input 
                                id="emergencyContactNumber" 
                                type="tel"
                                placeholder="+63 918 234 5678" 
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emergencyAddress">Address</Label>
                            <Input id="emergencyAddress" placeholder="Same as patient" />
                        </div>
                    </div>
                </div>

                {/* Insurance Information */}
                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2 text-lg">
                        <Shield className="h-5 w-5" />
                        Insurance Information
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="philhealthNumber">PhilHealth Number</Label>
                            <Input 
                                id="philhealthNumber" 
                                placeholder="12-345678901-2" 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="philhealthType">PhilHealth Member Type</Label>
                            <Select>
                                <SelectTrigger id="philhealthType">
                                    <SelectValue placeholder="Select type" />
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
                                    id="hasPrivateInsurance"
                                    checked={hasInsurance}
                                    onCheckedChange={(checked) => setHasInsurance(checked as boolean)}
                                />
                                <Label 
                                    htmlFor="hasPrivateInsurance" 
                                    className="text-sm font-normal cursor-pointer"
                                >
                                    Has Private Health Insurance / HMO
                                </Label>
                            </div>
                        </div>
                        {hasInsurance && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="hmoProvider">Insurance Provider / HMO</Label>
                                    <Input id="hmoProvider" placeholder="Maxicare, Medicard, Pacific Cross, etc." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hmoNumber">Card Number</Label>
                                    <Input id="hmoNumber" placeholder="HMO-123456789" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hmoPlanType">Plan Type</Label>
                                    <Input id="hmoPlanType" placeholder="Gold, Platinum, etc." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hmoValidity">Validity Date</Label>
                                    <Input id="hmoValidity" type="date" />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Medical History */}
                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2 text-lg">
                        <Stethoscope className="h-5 w-5" />
                        Medical History
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="bloodType">Blood Type</Label>
                            <Select>
                                <SelectTrigger id="bloodType">
                                    <SelectValue placeholder="Select blood type" />
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
                            <Label htmlFor="height">Height (cm)</Label>
                            <Input id="height" type="number" placeholder="170" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input id="weight" type="number" placeholder="65" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="allergies">Known Allergies</Label>
                            <Textarea 
                                id="allergies" 
                                placeholder="List any known allergies (e.g., Penicillin, Aspirin, Shellfish, Peanuts, Latex)"
                                rows={2}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="medicalHistory">Medical History / Chronic Conditions</Label>
                            <Textarea 
                                id="medicalHistory" 
                                placeholder="List any chronic conditions or past medical history (e.g., Hypertension, Diabetes, Asthma)"
                                rows={2}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="currentMedications">Current Medications</Label>
                            <Textarea 
                                id="currentMedications" 
                                placeholder="List current medications and dosages"
                                rows={2}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="surgicalHistory">Previous Surgeries</Label>
                            <Textarea 
                                id="surgicalHistory" 
                                placeholder="List any previous surgeries and dates"
                                rows={2}
                            />
                        </div>
                    </div>
                </div>

                {/* Lifestyle & Social History */}
                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2 text-lg">
                        <Heart className="h-5 w-5" />
                        Lifestyle & Social History
                    </h3>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="smokingStatus">Smoking Status</Label>
                            <Select>
                                <SelectTrigger id="smokingStatus">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NEVER">Never Smoked</SelectItem>
                                    <SelectItem value="FORMER">Former Smoker</SelectItem>
                                    <SelectItem value="CURRENT">Current Smoker</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="alcoholConsumption">Alcohol Consumption</Label>
                            <Select>
                                <SelectTrigger id="alcoholConsumption">
                                    <SelectValue placeholder="Select frequency" />
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
                            <Label htmlFor="exerciseFrequency">Exercise Frequency</Label>
                            <Select>
                                <SelectTrigger id="exerciseFrequency">
                                    <SelectValue placeholder="Select frequency" />
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

                {/* Additional Notes */}
                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2 text-lg">
                        <FileText className="h-5 w-5" />
                        Additional Information
                    </h3>
                    <div className="space-y-2">
                        <Label htmlFor="specialNeeds">Special Needs / Disabilities</Label>
                        <Textarea 
                            id="specialNeeds" 
                            placeholder="e.g., Wheelchair access, Visual/Hearing impairment, Language preference"
                            rows={2}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Registration Notes</Label>
                        <Textarea 
                            id="notes" 
                            placeholder="Any additional information or special instructions"
                            rows={2}
                        />
                    </div>
                </div>
            </div>

            <DialogFooter className="mt-6 gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                </Button>
                <Button type="button" variant="secondary" onClick={handleSaveAsDraft}>
                    <Save className="mr-2 h-4 w-4" />
                    Save as Draft
                </Button>
                <Button type="submit">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register Patient
                </Button>
            </DialogFooter>
        </form>
    )
}