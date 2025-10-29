"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

export default function NewPatientPage() {
  const [dateOfBirth, setDateOfBirth] = useState<Date>()
  const [isVipOrConfidential, setIsVipOrConfidential] = useState(false)

  return (
    <ProtectedRoute requiredRole={UserRole.REGISTRAR}>
      <DashboardLayout role={UserRole.REGISTRAR}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">New Patient Registration</h1>
            <p className="text-muted-foreground">
              Register a new patient in the system
            </p>
          </div>

          <form className="grid gap-4 px-4 lg:px-6">
            {/* Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Demographics</CardTitle>
                <CardDescription>Basic patient information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
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
                </div>

                <div className="grid gap-4 md:grid-cols-3">
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
                    <Label htmlFor="gender">Gender *</Label>
                    <Select>
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
                    <Label htmlFor="civilStatus">Civil Status</Label>
                    <Select>
                      <SelectTrigger id="civilStatus">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SINGLE">Single</SelectItem>
                        <SelectItem value="MARRIED">Married</SelectItem>
                        <SelectItem value="WIDOWED">Widowed</SelectItem>
                        <SelectItem value="SEPARATED">Separated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Phone, email, and address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Mobile Number *</Label>
                    <Input 
                      id="contactPhone" 
                      type="tel"
                      placeholder="+63 917 123 4567" 
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="juan.delacruz@email.com" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input id="street" placeholder="123 Rizal Street" />
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="barangay">Barangay</Label>
                    <Input id="barangay" placeholder="Barangay 1" />
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
                    <Input id="zipCode" placeholder="1100" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
                <CardDescription>Person to contact in case of emergency</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactName">Contact Name</Label>
                    <Input id="emergencyContactName" placeholder="Maria Dela Cruz" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                    <Select>
                      <SelectTrigger id="emergencyContactRelationship">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SPOUSE">Spouse</SelectItem>
                        <SelectItem value="PARENT">Parent</SelectItem>
                        <SelectItem value="CHILD">Child</SelectItem>
                        <SelectItem value="SIBLING">Sibling</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContactPhone">Contact Number</Label>
                    <Input 
                      id="emergencyContactPhone" 
                      type="tel"
                      placeholder="+63 917 123 4567" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Insurance Information */}
            <Card>
              <CardHeader>
                <CardTitle>Insurance Information</CardTitle>
                <CardDescription>PhilHealth and other insurance details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="philHealthNumber">PhilHealth Number</Label>
                    <Input 
                      id="philHealthNumber" 
                      placeholder="12-345678901-2" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="philHealthType">PhilHealth Type</Label>
                    <Select>
                      <SelectTrigger id="philHealthType">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEMBER">Member</SelectItem>
                        <SelectItem value="DEPENDENT">Dependent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hmoProvider">HMO Provider</Label>
                    <Input id="hmoProvider" placeholder="Maxicare, Medicard, etc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hmoNumber">HMO Card Number</Label>
                    <Input id="hmoNumber" placeholder="HMO-123456" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>Special notes and flags</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="vipConfidential"
                    checked={isVipOrConfidential}
                    onCheckedChange={(checked) => setIsVipOrConfidential(checked as boolean)}
                  />
                  <Label 
                    htmlFor="vipConfidential" 
                    className="text-sm font-normal cursor-pointer"
                  >
                    VIP or Confidential Patient (restricted access)
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Registration Notes</Label>
                  <Input 
                    id="notes" 
                    placeholder="Any special notes or instructions..." 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-2">
              <Button type="submit" size="lg">
                Register Patient
              </Button>
              <Button type="button" variant="outline" size="lg">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}