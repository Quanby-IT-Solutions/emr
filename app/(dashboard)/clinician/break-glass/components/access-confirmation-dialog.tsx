"use client"

import { IconAlertTriangle } from "@tabler/icons-react"
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
  patientMrn: string
  reason: string
  justification: string
  onConfirm: () => void
}

export function AccessConfirmationDialog({
  open,
  onOpenChange,
  patientName,
  patientMrn,
  reason,
  justification,
  onConfirm,
}: AccessConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl!">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="rounded-full bg-red-100 p-2">
              <IconAlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <AlertDialogTitle>Confirm Break-Glass Access</AlertDialogTitle>
          </div>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                You are about to invoke Break-Glass emergency access. This action is <strong>irreversible</strong>,
                will be audited, and reviewed by the Privacy Officer.
              </p>
              <div className="rounded-lg border bg-muted/50 p-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patient</span>
                  <span className="font-medium">{patientName} ({patientMrn})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reason</span>
                  <span className="font-medium">{reason}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Session Duration</span>
                  <span className="font-medium">60 minutes</span>
                </div>
                {justification && (
                  <div className="pt-1 border-t">
                    <span className="text-muted-foreground block mb-1">Justification</span>
                    <span className="text-xs leading-relaxed">{justification}</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                After confirmation you will be redirected to the patient&apos;s chart.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={onConfirm}>
            Confirm Emergency Access
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
