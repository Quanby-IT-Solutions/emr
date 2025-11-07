"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AppointmentEntry } from "@/app/(dashboard)/scheduler/dummy-data/dummy-appointments"

interface CancelBookingModalProps {
    selectedAppointment: AppointmentEntry | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirmCancel: (appointment: AppointmentEntry) => void
}

export function CancelBookingModal({ selectedAppointment, open, onOpenChange, onConfirmCancel }: CancelBookingModalProps) {
    
    const handleCancelBooking = () => {
        if(selectedAppointment) {
            onConfirmCancel(selectedAppointment)
        }
        onOpenChange(false)
    }

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cancel Appointment</DialogTitle>
                    <DialogDescription className="mt-4">
                        Are you sure you want to <strong>cancel the appointment</strong> for{" "}
                        <strong>{selectedAppointment?.patientName}</strong> (ID: {selectedAppointment?.patientId}) with{" "}
                        <strong>Dr. {selectedAppointment?.provider}</strong> on{" "}
                        <strong>{selectedAppointment && formatDate(selectedAppointment.appointmentDate)}</strong> at{" "}
                        <strong>{selectedAppointment?.appointmentTime}</strong>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="mt-2 flex gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => onOpenChange(false)}
                        >
                            Go Back
                        </Button>
                        <Button variant="destructive" onClick={handleCancelBooking}>              
                            Confirm Cancel
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}