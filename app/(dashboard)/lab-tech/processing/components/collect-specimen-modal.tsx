"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { ProcessingOrder } from "../types"

interface CollectSpecimenModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: ProcessingOrder | null
  onConfirm: (orderId: string, data: { collectedAt: string; collectedBy: string; specimenCondition: string }) => void
}

export function CollectSpecimenModal({ open, onOpenChange, order, onConfirm }: CollectSpecimenModalProps) {
  if (!order) return null

  const now = new Date()
  const defaultTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Collect Specimen</DialogTitle>
          <DialogDescription>
            Confirm specimen collection for this lab order.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Order Info */}
          <div className="rounded-md border p-3 space-y-2 bg-muted/30">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{order.patient.name}</span>
              <Badge variant="outline">{order.patient.mrn}</Badge>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Test Panel:</span>{" "}
                <span className="font-medium">{order.testPanel}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Specimen Type:</span>{" "}
                <span className="font-medium">{order.specimenType}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Priority:</span>{" "}
                <Badge
                  variant={order.priority === "STAT" ? "destructive" : order.priority === "URGENT" ? "warning" : "secondary"}
                  className="ml-1"
                >
                  {order.priority}
                </Badge>
              </div>
              <div>
                <span className="text-muted-foreground">Ordered by:</span>{" "}
                <span className="font-medium">{order.orderedBy}</span>
              </div>
            </div>
          </div>

          {/* Collection Fields */}
          <div className="space-y-2">
            <Label htmlFor="collectedAt">Collection Date & Time</Label>
            <Input id="collectedAt" type="datetime-local" defaultValue={defaultTime} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="collectedBy">Collector ID</Label>
            <Input id="collectedBy" defaultValue="Tech. R. Martinez" placeholder="Enter technologist name/ID..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specimenCondition">Specimen Condition</Label>
            <Select defaultValue="Satisfactory">
              <SelectTrigger id="specimenCondition">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Satisfactory">Satisfactory</SelectItem>
                <SelectItem value="Hemolyzed">Hemolyzed</SelectItem>
                <SelectItem value="Lipemic">Lipemic</SelectItem>
                <SelectItem value="Icteric">Icteric</SelectItem>
                <SelectItem value="Clotted">Clotted</SelectItem>
                <SelectItem value="Insufficient Quantity">Insufficient Quantity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => {
            onConfirm(order.id, {
              collectedAt: defaultTime,
              collectedBy: "Tech. R. Martinez",
              specimenCondition: "Satisfactory",
            })
            onOpenChange(false)
          }}>
            Confirm Collection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
