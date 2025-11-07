"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface ApproveModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order?: {
    id: number
    patient: string
    medication: string
    prescriber: string
    status: string
  }
}

export function ApproveModal({ open, onOpenChange, order }: ApproveModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Approve Medication Order</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-1">
            <Label>Patient</Label>
            <p className="text-sm text-muted-foreground">{order?.patient ?? ""}</p>
          </div>
          <div className="space-y-1">
            <Label>Medication</Label>
            <p className="text-sm text-muted-foreground">{order?.medication ?? ""}</p>
          </div>
          <div className="space-y-1">
            <Label>Prescriber</Label>
            <p className="text-sm text-muted-foreground">{order?.prescriber ?? ""}</p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Confirm Approval</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}