"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AccessConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patientName: string
  onConfirm: () => void
}

export function AccessConfirmationDialog({
  open,
  onOpenChange,
  patientName,
  onConfirm,
}: AccessConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Break-Glass Access</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to invoke Break-Glass access for {patientName}? This action will be audited,
            reviewed by the Privacy Officer, and linked to your user account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={onConfirm}>
            Confirm Access
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
