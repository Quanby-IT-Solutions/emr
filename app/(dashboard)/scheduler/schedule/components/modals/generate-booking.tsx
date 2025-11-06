import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Patient } from "@/app/(dashboard)/scheduler/schedule/components/data-table-filtered"

interface GenerateBookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedPatient: Patient | null
  selectedProvider: string | undefined
  selectedDepartment: string | undefined
  selectedLocation: string | undefined
  date: Date | undefined
  selectedTime: string | undefined
  purpose: string | undefined
}

export function GenerateBookingModal({
  open,
  onOpenChange,
  selectedPatient,
  selectedProvider,
  selectedDepartment,
  selectedLocation,
  date,
  selectedTime,
  purpose,
}: GenerateBookingModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Appointment Booking Details</DialogTitle>
          <DialogDescription className="mb-4">
            Details of the scheduled appointment.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-5">
          <div className="grid gap-1">
            <Label htmlFor="patientName" className="text-sm text-muted-foreground">Patient Name:</Label>
            <Input 
              id="patientName" 
              name="patientName" 
              value={selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.middleName} ${selectedPatient.lastName}` : ""} 
              readOnly
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="appointmentID" className="text-sm text-muted-foreground">Appointment ID:</Label>
            <Input id="appointmentID" name="appointmentID" value="APT-20240915-001" readOnly/>
          </div>
          <div className="grid gap-1">
            <Label htmlFor="appointmentDetails" className="text-sm text-muted-foreground">Appointment Details Summary:</Label>
            <div className="overflow-x-auto">
              <table className="table-auto border-collapse border border-muted text-sm mx-4">
                <tbody>
                  <tr>
                    <td className="border border-muted px-2 py-1 font-medium">Date</td>
                    <td className="border border-muted px-2 py-1">{date ? date.toDateString() : ''}</td>
                  </tr>
                  <tr>
                    <td className="border border-muted px-2 py-1 font-medium">Time</td>
                    <td className="border border-muted px-2 py-1">{selectedTime}</td>
                  </tr>
                  <tr>
                    <td className="border border-muted px-2 py-1 font-medium">Specialty/Department</td>
                    <td className="border border-muted px-2 py-1">{selectedDepartment}</td>
                  </tr>
                  <tr>
                    <td className="border border-muted px-2 py-1 font-medium">Provider</td>
                    <td className="border border-muted px-2 py-1">{selectedProvider}</td>
                  </tr>
                  <tr>
                    <td className="border border-muted px-2 py-1 font-medium">Location</td>
                    <td className="border border-muted px-2 py-1">{selectedLocation}</td>
                  </tr>
                  <tr>
                    <td className="border border-muted px-2 py-1 font-medium align-top">Purpose</td>
                    <td className="border border-muted px-2 py-1">{purpose}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}