"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Appointment } from "./dummy"
import { useState } from "react"
import { 
  User, 
  Calendar, 
  FileText, 
  Shield,
  CreditCard,
  UserCheck,
  X,
  Edit
} from "lucide-react"
import { format } from "date-fns"

interface PatientModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: Appointment | null
  onConfirmCheckIn: (notes: string, paymentType: string) => void
}

export function PatientModal({ open, onOpenChange, appointment, onConfirmCheckIn }: PatientModalProps) {
  const [checkInNotes, setCheckInNotes] = useState("")
  const [paymentType, setPaymentType] = useState("CASH")

  if (!appointment) return null

  const handleCheckIn = () => {
    onConfirmCheckIn(checkInNotes, paymentType)
    setCheckInNotes("")
    setPaymentType("CASH")
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      SCHEDULED: { variant: "outline", label: "Scheduled" },
      ARRIVED: { variant: "secondary", label: "Arrived" },
      CHECKED_IN: { variant: "default", label: "Checked In" },
      CANCELLED: { variant: "destructive", label: "Cancelled" }
    }
    const status_info = variants[status] || variants.SCHEDULED
    return <Badge variant={status_info.variant}>{status_info.label}</Badge>
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Patient Check-In</span>
            {getStatusBadge(appointment.status)}
          </DialogTitle>
          <DialogDescription>
            Appointment ID: {appointment.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Demographics */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Patient ID</p>
                <p className="font-medium">{appointment.patientId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Full Name</p>
                <p className="font-medium">{appointment.patientName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Age</p>
                <p className="font-medium">{appointment.age} years old</p>
              </div>
              <div>
                <p className="text-muted-foreground">Gender</p>
                <p className="font-medium">{appointment.gender === "MALE" ? "Male" : "Female"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Contact Number</p>
                <p className="font-medium">+63 917 123 4567</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Appointment Info */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Appointment Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Date</p>
                <p className="font-medium">{format(new Date(appointment.appointmentDate), "PPP")}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Time</p>
                <p className="font-medium">{appointment.appointmentTime}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Department</p>
                <p className="font-medium">{appointment.department}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Attending Physician</p>
                <p className="font-medium">Dr. {appointment.physician}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Visit Type</p>
                <p className="font-medium">
                  {appointment.visitType === "NEW" ? "New Patient" : "Follow-up Visit"}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Reason for Visit */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Chief Complaint
            </h3>
            <div className="text-sm">
              <p className="text-muted-foreground">Reason for Visit</p>
              <p className="font-medium mt-1">{appointment.reasonForVisit}</p>
            </div>
          </div>

          <Separator />

          {/* Insurance Info */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Insurance Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
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
                <p className="text-muted-foreground">Card Number</p>
                <p className="font-medium">MAX-987654321</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Type */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Method
            </h3>
            <div className="space-y-2">
              <Label htmlFor="paymentType">Select Payment Type *</Label>
              <Select value={paymentType} onValueChange={setPaymentType}>
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
          </div>

          <Separator />

          {/* Check-In Notes */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Check-In Notes
            </h3>
            <div className="space-y-2">
              <Label htmlFor="checkInNotes">Registrar Remarks (Optional)</Label>
              <Textarea
                id="checkInNotes"
                placeholder="Enter any special notes or observations about the patient..."
                value={checkInNotes}
                onChange={(e) => setCheckInNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button 
            variant="secondary"
            onClick={() => {/* Handle edit */}}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Info
          </Button>
          <Button 
            onClick={handleCheckIn}
            disabled={appointment.status === "CHECKED_IN"}
          >
            <UserCheck className="mr-2 h-4 w-4" />
            Confirm Check-In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}