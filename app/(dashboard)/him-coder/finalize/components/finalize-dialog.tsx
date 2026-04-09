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

interface FinalizeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  encounterId: string
  patient: string
  principalDx: string
  onConfirm: () => void
}

export function FinalizeDialog({
  open,
  onOpenChange,
  encounterId,
  patient,
  principalDx,
  onConfirm,
}: FinalizeDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Finalize Encounter Coding</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to finalize the coding for encounter{" "}
            <strong>{encounterId}</strong> ({patient}). This will mark the
            encounter as <strong>coded</strong> and lock the assigned ICD-10
            codes.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="rounded-md border p-3 my-2 text-sm space-y-1">
          <p>
            <strong>Encounter:</strong> {encounterId}
          </p>
          <p>
            <strong>Patient:</strong> {patient}
          </p>
          <p>
            <strong>Principal Dx:</strong> {principalDx}
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Finalize</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
