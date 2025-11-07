"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface FlagModalProps {
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

export function FlagModal({ open, onOpenChange, order }: FlagModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Flag Medication Order</DialogTitle>
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
          <div className="space-y-2">
            <Label>Reason for Flagging</Label>
            <Textarea placeholder="Enter reason for flagging this order..." />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Flag Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}