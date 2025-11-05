"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { 
  User, 
  Phone, 
  Calendar, 
  Stethoscope,
  FileText,
  CreditCard,
  Save,
  X,
  UserPlus
} from "lucide-react"

interface WalkInModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: WalkInData) => void
}

export interface WalkInData {
  // Patient Info
  patientId?: string
  lastName: string
  firstName: string
  middleName: string
  age: number
  gender: "MALE" | "FEMALE"
  contactNumber: string
  address: string
  
  // Visit Info
  department: string
  physician: string
  visitType: "NEW" | "FOLLOW_UP"
  reasonForVisit: string
  
  // Payment
  paymentType: string
  
  // Insurance (optional)
  hasInsurance: boolean
  philhealthNumber?: string
  hmoProvider?: string
}

export function WalkInModal({ open, onOpenChange, onSubmit }: WalkInModalProps) {
  const [isNewPatient, setIsNewPatient] = useState(true)
  const [hasInsurance, setHasInsurance] = useState(false)
  const [formData, setFormData] = useState<Partial<WalkInData>>({
    visitType: "NEW",
    paymentType: "CASH",
    hasInsurance: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (onSubmit) {
      onSubmit(formData as WalkInData)
    }
    
    // Reset form
    setFormData({
      visitType: "NEW",
      paymentType: "CASH",
      hasInsurance: false
    })
    setIsNewPatient(true)
    setHasInsurance(false)
    onOpenChange(false)
  }

  const handleInputChange = (field: keyof WalkInData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Walk-In Patient Registration
          </DialogTitle>
          <DialogDescription>
            Register a walk-in patient and create appointment
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Patient Type Selection */}
            <div className="space-y-3">
              <Label>Patient Type</Label>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={isNewPatient ? "default" : "outline"}
                  onClick={() => setIsNewPatient(true)}
                  className="flex-1"
                >
                  New Patient
                </Button>
                <Button
                  type="button"
                  variant={!isNewPatient ? "default" : "outline"}
                  onClick={() => setIsNewPatient(false)}
                  className="flex-1"
                >
                  Existing Patient
                </Button>
              </div>
            </div>

            <Separator />

            {/* Existing Patient Search */}
            {!isNewPatient && (
              <>
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Search Patient
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="patientSearch">Patient ID or Name</Label>
                    <Input
                      id="patientSearch"
                      placeholder="Enter patient ID or name..."
                      onChange={(e) => handleInputChange('patientId', e.target.value)}
                    />
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Patient Information */}
            {isNewPatient && (
              <>
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Patient Information
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        required
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        required
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input
                        id="middleName"
                        onChange={(e) => handleInputChange('middleName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        required
                        onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select
                        required
                        onValueChange={(value) => handleInputChange('gender', value)}
                      >
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
                      <Label htmlFor="contactNumber">Contact Number *</Label>
                      <Input
                        id="contactNumber"
                        type="tel"
                        placeholder="+63"
                        required
                        onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-3">
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        required
                        onChange={(e) => handleInputChange('address', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Visit Information */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Visit Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    required
                    onValueChange={(value) => handleInputChange('department', value)}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GENERAL">General Medicine</SelectItem>
                      <SelectItem value="PEDIATRICS">Pediatrics</SelectItem>
                      <SelectItem value="CARDIOLOGY">Cardiology</SelectItem>
                      <SelectItem value="ORTHOPEDICS">Orthopedics</SelectItem>
                      <SelectItem value="OB-GYN">OB-GYN</SelectItem>
                      <SelectItem value="ENT">ENT</SelectItem>
                      <SelectItem value="DERMATOLOGY">Dermatology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="physician">Attending Physician *</Label>
                  <Select
                    required
                    onValueChange={(value) => handleInputChange('physician', value)}
                  >
                    <SelectTrigger id="physician">
                      <SelectValue placeholder="Select physician" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maria Santos">Dr. Maria Santos</SelectItem>
                      <SelectItem value="Ana Rodriguez">Dr. Ana Rodriguez</SelectItem>
                      <SelectItem value="Roberto Cruz">Dr. Roberto Cruz</SelectItem>
                      <SelectItem value="Carlos Bautista">Dr. Carlos Bautista</SelectItem>
                      <SelectItem value="Sofia Mendoza">Dr. Sofia Mendoza</SelectItem>
                      <SelectItem value="Elena Diaz">Dr. Elena Diaz</SelectItem>
                      <SelectItem value="Carmen Salazar">Dr. Carmen Salazar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visitType">Visit Type *</Label>
                  <Select
                    required
                    defaultValue="NEW"
                    onValueChange={(value) => handleInputChange('visitType', value)}
                  >
                    <SelectTrigger id="visitType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW">New Visit</SelectItem>
                      <SelectItem value="FOLLOW_UP">Follow-up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="reasonForVisit">Chief Complaint / Reason for Visit *</Label>
                  <Textarea
                    id="reasonForVisit"
                    placeholder="Enter patient's main complaint or reason for visit..."
                    required
                    rows={3}
                    onChange={(e) => handleInputChange('reasonForVisit', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Information */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </h3>
              <div className="space-y-2">
                <Label htmlFor="paymentType">Payment Type *</Label>
                <Select
                  required
                  defaultValue="CASH"
                  onValueChange={(value) => handleInputChange('paymentType', value)}
                >
                  <SelectTrigger id="paymentType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="PHILHEALTH">PhilHealth</SelectItem>
                    <SelectItem value="HMO">HMO</SelectItem>
                    <SelectItem value="PHILHEALTH_HMO">PhilHealth + HMO</SelectItem>
                    <SelectItem value="CHARITY">Charity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="hasInsurance"
                  checked={hasInsurance}
                  onChange={(e) => {
                    setHasInsurance(e.target.checked)
                    handleInputChange('hasInsurance', e.target.checked)
                  }}
                  className="rounded"
                />
                <Label htmlFor="hasInsurance" className="font-normal cursor-pointer">
                  Patient has PhilHealth/HMO
                </Label>
              </div>

              {hasInsurance && (
                <div className="grid md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="philhealthNumber">PhilHealth Number</Label>
                    <Input
                      id="philhealthNumber"
                      placeholder="12-345678901-2"
                      onChange={(e) => handleInputChange('philhealthNumber', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hmoProvider">HMO Provider</Label>
                    <Input
                      id="hmoProvider"
                      placeholder="e.g., Maxicare, Medicard"
                      onChange={(e) => handleInputChange('hmoProvider', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Register & Check-In
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}