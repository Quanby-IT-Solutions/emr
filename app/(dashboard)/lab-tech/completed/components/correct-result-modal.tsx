"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { IconAlertTriangle } from "@tabler/icons-react"
import type { LabOrder } from "@/app/(dashboard)/dummy-data/dummy-lab-orders"

interface CorrectResultModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: LabOrder | null
  onSubmit: (orderId: string) => void
}

export function CorrectResultModal({ open, onOpenChange, order, onSubmit }: CorrectResultModalProps) {
  if (!order || !order.results) return null

  const results = order.results

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[780px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Correct Result</DialogTitle>
          <DialogDescription>
            Submit a correction for finalized results. All changes create an audit trail.
          </DialogDescription>
        </DialogHeader>

        {/* Warning Banner */}
        <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 rounded-md px-3 py-2 border border-amber-200 dark:border-amber-800">
          <IconAlertTriangle className="h-4 w-4 shrink-0" />
          <span>Corrections are logged permanently. Original values will be preserved with strikethrough formatting in the patient record.</span>
        </div>

        {/* Order Info */}
        <div className="rounded-md border p-3 space-y-2 bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{order.patient.name}</span>
            <Badge variant="outline">{order.patient.mrn}</Badge>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-muted-foreground">Panel:</span> <span className="font-medium">{order.testPanel}</span></div>
            <div><span className="text-muted-foreground">Completed:</span> <span className="font-medium">{order.completedAt ?? "—"}</span></div>
          </div>
        </div>

        {/* Current Results + Correction Fields */}
        <ScrollArea className="flex-1 max-h-[320px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Analyte</TableHead>
                <TableHead className="w-[100px]">Current Value</TableHead>
                <TableHead className="w-[70px]">Unit</TableHead>
                <TableHead className="w-[120px]">Corrected Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.analytes.map(analyte => (
                <TableRow key={analyte.id}>
                  <TableCell className="font-medium">{analyte.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{analyte.value}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{analyte.unit}</TableCell>
                  <TableCell>
                    <Input className="h-8" placeholder="New value (if changed)" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* Reason for Correction */}
        <div className="space-y-2">
          <Label htmlFor="correctionReason" className="flex items-center gap-1">
            Reason for Correction <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="correctionReason"
            placeholder="Describe the reason for this correction (required)..."
            rows={3}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => {
            onSubmit(order.id)
            onOpenChange(false)
          }}>
            Submit Correction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
