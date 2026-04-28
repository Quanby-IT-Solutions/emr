import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ApiPatient as Patient } from "@/lib/api/patients-client"

interface ConfirmBookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedPatient: Patient | null
  selectedProvider: string | undefined
  selectedDepartment: string | undefined
  selectedDeptLocation: string | undefined
  selectedOfficeLocation: string | undefined
  date: Date | undefined
  selectedTime: string | undefined
  purpose: string | undefined
  telephone: string | undefined
  onTelephoneChange: (value: string) => void
  onPurposeChange: (value: string) => void
  onConfirm: () => void
}

export function ConfirmBookingModal({
  open,
  onOpenChange,
  selectedPatient,
  selectedProvider,
  selectedDepartment,
  selectedDeptLocation,
  selectedOfficeLocation,
  date,
  selectedTime,
  purpose,
  telephone,
  onTelephoneChange,
  onPurposeChange,
  onConfirm,
}: ConfirmBookingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Confirm Appointment</DialogTitle>
          <DialogDescription className="mb-4">
            Please review your appointment details before confirming.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-1 space-y-5">  
          {/* Patient Details */}
          <div className="grid gap-4">
            <Label className="font-semibold">Patient Details</Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-1">
                <Label htmlFor="firstName" className="text-sm text-muted-foreground">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={selectedPatient?.firstName || ""}
                  readOnly
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="middleName" className="text-sm text-muted-foreground">Middle Name</Label>
                <Input
                  id="middleName"
                  name="middleName"
                  value={selectedPatient?.middleName || ""}
                  readOnly
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="lastName" className="text-sm text-muted-foreground">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={selectedPatient?.lastName || ""}
                  readOnly
                />
              </div>
            </div>
            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="grid gap-1">
                <Label htmlFor="contact" className="text-sm text-muted-foreground">Mobile Number</Label>
                <Input
                  id="contact"
                  name="contact"
                  value={selectedPatient?.contactPhone || ""}
                  readOnly
                  inputMode="tel"
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="telephone" className="text-sm text-muted-foreground">Telephone (optional)</Label>
                <Input
                  id="telephone"
                  name="telephone"
                  placeholder="(02) XXXXXXX"
                  value={telephone}
                  onChange={(e) => onTelephoneChange(e.target.value)}
                  inputMode="tel"
                />
              </div>
            </div>

            {/* Health Provider Details */}
            <Label className="font-semibold">Health Provider Details</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="grid gap-1">
                <Label htmlFor="provider" className="text-sm text-muted-foreground">Provider:</Label>
                <Input id="provider" name="provider" value={selectedProvider} readOnly/>
              </div>
              <div className="grid gap-1">
                <Label htmlFor="location" className="text-sm text-muted-foreground">Office Location:</Label>
                <Input id="location" name="location" value={selectedOfficeLocation} readOnly/>
              </div>                
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="grid gap-1">
                <Label htmlFor="department" className="text-sm text-muted-foreground">Specialty/Department:</Label>
                <Input id="department" name="department" value={selectedDepartment} readOnly/>
              </div>
              <div className="grid gap-1">
                <Label htmlFor="location" className="text-sm text-muted-foreground">Department Location:</Label>
                <Input id="location" name="location" value={selectedDeptLocation} readOnly/>
              </div>                
            </div>

            {/* Appointment Date and Time*/}
            <Label className="font-semibold">Appointment Details</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="grid gap-1">
                <Label htmlFor="date" className="text-sm text-muted-foreground">Appointment Date:</Label>
                <Input id="date" name="date" value={date ? date.toDateString() : ''} readOnly/>
              </div>
              <div className="grid gap-1">
                <Label htmlFor="time" className="text-sm text-muted-foreground">Appointment Time:</Label>
                <Input id="time" name="time" value={selectedTime} readOnly/>
              </div>
            </div>
          </div>

          {/* Appointment Purpose */}
          <div className="grid gap-1">
            <Label htmlFor="appointmentPurpose" className="text-sm text-muted-foreground">Purpose of Appointment</Label>
            <textarea
              id="appointmentPurpose"
              name="appointmentPurpose"
              rows={3}
              maxLength={600}
              value={purpose}
              onChange={(e) => onPurposeChange(e.target.value)}
              className="border rounded-md p-2 resize-none focus-visible:ring-1 focus-visible:ring-ring placeholder:text-xs text-sm"
              placeholder="Briefly describe the purpose (e.g. consultation, annual checkup, lab interpretation, etc.)"
              readOnly
            />
            <p className="text-xs text-muted-foreground">
              Maximum 2 short paragraphs (600 characters)
            </p>
          </div>
        
          <div className="mt-6 flex gap-2">
            <Button onClick={onConfirm}>Confirm</Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}