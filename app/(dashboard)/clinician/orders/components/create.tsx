"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CreateOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateOrderModal({ open, onOpenChange }: CreateOrderModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Order</DialogTitle>
          <DialogDescription>
            Place medication, lab, or imaging orders
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Select Patient</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose patient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient1">John Doe (MRN-001)</SelectItem>
                  <SelectItem value="patient2">Jane Smith (MRN-002)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select order type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medication">Medication</SelectItem>
                  <SelectItem value="lab">Laboratory</SelectItem>
                  <SelectItem value="imaging">Imaging</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Order Item</Label>
            <Input placeholder="e.g., Aspirin 81mg, CBC, Chest X-Ray" />
          </div>
          <div className="space-y-2">
            <Label>Instructions</Label>
            <Textarea placeholder="Special instructions or notes..." />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="stat">STAT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Frequency (if applicable)</Label>
              <Input placeholder="e.g., Once daily" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Submit Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
