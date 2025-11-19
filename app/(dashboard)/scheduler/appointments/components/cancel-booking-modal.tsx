"use client"

import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { AppointmentEntry } from "@/app/(dashboard)/dummy-data/dummy-appointments"
import { XCircle } from "lucide-react"

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
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-red-600" />
                        Cancel Appointment
                    </AlertDialogTitle>
                    <AlertDialogDescription className="mt-4">
                        Are you sure you want to <strong>cancel the appointment</strong> for{" "}
                        <strong>{selectedAppointment?.patientName}</strong> (ID: {selectedAppointment?.patientId}) with{" "}
                        <strong>Dr. {selectedAppointment?.provider}</strong> on{" "}
                        <strong>{selectedAppointment && formatDate(selectedAppointment.appointmentDate)}</strong> at{" "}
                        <strong>{selectedAppointment?.appointmentTime}</strong>?
                        
                        <br /><br />
                        This action cannot be undone. The patient will need to reschedule if they wish to visit.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className="mt-2 flex gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => onOpenChange(false)}
                        >
                            No, Keep Appointment
                        </Button>
                        <Button variant="destructive" onClick={handleCancelBooking}>              
                            Yes, Cancel Appointment
                        </Button>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}