import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Appointment } from "./dummy";
import { UserX } from "lucide-react";

interface NoShowModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    appointment: Appointment | null
    onConfirmNoShow: (appointmentId: string) => void
}

export function NoShowModal({ open, onOpenChange, appointment, onConfirmNoShow }: NoShowModalProps) {
   const handleNoShow = () => {
    if(!appointment) return
    onConfirmNoShow(appointment.id)
    onOpenChange(false)
   }
  
    return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <UserX className="h-5 w-5 text-orange-600" />
              Mark as No-Show
            </AlertDialogTitle>
            <AlertDialogDescription>
              Mark this appointment as &quot;No-Show&quot;? This indicates the patient did not arrive
              at their scheduled time. This may affect future appointment privileges.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleNoShow}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Yes, Mark as No-Show
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  )
}