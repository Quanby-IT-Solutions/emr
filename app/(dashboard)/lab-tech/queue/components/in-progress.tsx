"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface InProgressModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order?: {
    id: number
    patient: string
    item: string
    type: string
    status: string
  }
}

export function InProgressModal({ open, onOpenChange, order }: InProgressModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Mark Order In Progress</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-1">
            <Label>Patient</Label>
            <p className="text-sm text-muted-foreground">{order?.patient ?? ""}</p>
          </div>
          <div className="space-y-1">
            <Label>Order Item</Label>
            <p className="text-sm text-muted-foreground">{order?.item ?? ""}</p>
          </div>
          <div className="space-y-1">
            <Label>Type</Label>
            <p className="text-sm text-muted-foreground">{order?.type ?? ""}</p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
