"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Appointment {
    id: number
    patient: string
    provider: string
    date: Date
    time: string
    status: string
}

interface CancelBookingModalProps {
    selectedAppointment: Appointment | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirmCancel: (appointmentID: number) => void
}

export function CancelBookingModal({ selectedAppointment, open, onOpenChange, onConfirmCancel }: CancelBookingModalProps) {
    
    const handleCancelBooking = () => {
        if(selectedAppointment) onConfirmCancel(selectedAppointment.id);
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cancel Booking</DialogTitle>
                    <DialogDescription className="mt-4">
                        Are you sure you want to <strong>cancel the appointment</strong> for <strong>{selectedAppointment?.patient}</strong> with <strong>{selectedAppointment?.provider}</strong> on <strong>{selectedAppointment?.date.toLocaleDateString()}</strong> at <strong>{selectedAppointment?.time}</strong>?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="mt-2 flex gap-2">
                    <Button variant="destructive" onClick={() => {
                        handleCancelBooking();
                    }}>              
                        Confirm
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={() => {
                        onOpenChange(false);
                        }}
                    >
                        Cancel
                    </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}