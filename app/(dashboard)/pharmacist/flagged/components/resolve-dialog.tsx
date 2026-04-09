"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export interface FlaggedOrder {
  id: number
  patient: string
  mrn: string
  medication: string
  dose: string
  prescriber: string
  flaggedBy: string
  flagDate: string
  flagReason: string
  flagCategory: string
  resolutionStatus: "Pending" | "Resolved"
  resolutionOutcome?: string
  resolutionNotes?: string
  resolvedDate?: string
  resolvedBy?: string
}

interface ResolveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: FlaggedOrder | null
  onResolve: (orderId: number, outcome: string, notes: string) => void
}

export function ResolveDialog({
  open,
  onOpenChange,
  order,
  onResolve,
}: ResolveDialogProps) {
  const [outcome, setOutcome] = useState("")
  const [notes, setNotes] = useState("")

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setOutcome("")
      setNotes("")
    }
    onOpenChange(isOpen)
  }

  function handleResolve() {
    if (!order) return
    if (!outcome) {
      toast.error("Resolution outcome is required")
      return
    }
    if (!notes.trim()) {
      toast.error("Resolution notes are required")
      return
    }
    onResolve(order.id, outcome, notes)
    handleOpenChange(false)
  }

  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Resolve Flagged Order</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Order Summary */}
          <div className="rounded-lg border p-3 space-y-2 bg-muted/30">
            <div className="text-sm">
              <span className="text-muted-foreground">Patient:</span>{" "}
              <span className="font-medium">{order.patient}</span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Medication:</span>{" "}
              <span className="font-medium">
                {order.medication} — {order.dose}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">Flag Reason:</span>{" "}
              <Badge variant="destructive" className="text-xs ml-1">
                {order.flagCategory}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">{order.flagReason}</div>
          </div>

          {/* Resolution Outcome */}
          <div className="space-y-2">
            <Label>Resolution Outcome *</Label>
            <Select value={outcome} onValueChange={setOutcome}>
              <SelectTrigger>
                <SelectValue placeholder="Select resolution outcome..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prescriber-modified">
                  Prescriber Modified Order
                </SelectItem>
                <SelectItem value="order-cancelled">Order Cancelled</SelectItem>
                <SelectItem value="override-approved">
                  Override Approved with Justification
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resolution Notes */}
          <div className="space-y-2">
            <Label>Resolution Notes *</Label>
            <Textarea
              placeholder="Document the resolution details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleResolve} disabled={!outcome || !notes.trim()}>
            Resolve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
