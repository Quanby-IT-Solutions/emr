"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { IconAlertTriangle, IconArrowUpRight, IconShieldCheck } from "@tabler/icons-react"
import type { LabOrder, LabAnalyte } from "@/app/(dashboard)/dummy-data/dummy-lab-orders"

interface ValidateResultModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: LabOrder | null
  onApprove: (orderId: string) => void
  onReject: (orderId: string) => void
}

// Simulated results for orders awaiting validation (since real entered data isn't persisted)
const simulatedResults: Record<string, LabAnalyte[]> = {
  "Complete Blood Count (CBC)": [
    { id: "s1", name: "WBC", value: "11.8", unit: "x10³/µL", referenceRange: "4.5–11.0", flag: "Abnormal", previousValue: "9.5" },
    { id: "s2", name: "RBC", value: "4.7", unit: "x10⁶/µL", referenceRange: "4.5–5.5", flag: "Normal" },
    { id: "s3", name: "Hemoglobin", value: "14.0", unit: "g/dL", referenceRange: "13.5–17.5", flag: "Normal" },
    { id: "s4", name: "Hematocrit", value: "42.0", unit: "%", referenceRange: "38.0–50.0", flag: "Normal" },
    { id: "s5", name: "Platelets", value: "195", unit: "x10³/µL", referenceRange: "150–400", flag: "Normal" },
    { id: "s6", name: "MCV", value: "89", unit: "fL", referenceRange: "80–100", flag: "Normal" },
    { id: "s7", name: "MCH", value: "29.8", unit: "pg", referenceRange: "27–33", flag: "Normal" },
    { id: "s8", name: "MCHC", value: "33.3", unit: "g/dL", referenceRange: "32–36", flag: "Normal" },
  ],
  "Urinalysis": [
    { id: "s10", name: "Color", value: "Dark Yellow", unit: "", referenceRange: "Yellow", flag: "Abnormal" },
    { id: "s11", name: "Clarity", value: "Hazy", unit: "", referenceRange: "Clear", flag: "Abnormal" },
    { id: "s12", name: "Specific Gravity", value: "1.028", unit: "", referenceRange: "1.005–1.030", flag: "Normal" },
    { id: "s13", name: "pH", value: "5.5", unit: "", referenceRange: "5.0–8.0", flag: "Normal" },
    { id: "s14", name: "Protein", value: "Trace", unit: "", referenceRange: "Negative", flag: "Abnormal" },
    { id: "s15", name: "Glucose", value: "Negative", unit: "", referenceRange: "Negative", flag: "Normal" },
    { id: "s16", name: "Blood", value: "Small", unit: "", referenceRange: "Negative", flag: "Abnormal" },
    { id: "s17", name: "Leukocyte Esterase", value: "Positive", unit: "", referenceRange: "Negative", flag: "Abnormal" },
    { id: "s18", name: "Nitrites", value: "Positive", unit: "", referenceRange: "Negative", flag: "Abnormal" },
  ],
  "Basic Metabolic Panel (BMP)": [
    { id: "s20", name: "Sodium", value: "141", unit: "mEq/L", referenceRange: "136–145", flag: "Normal" },
    { id: "s21", name: "Potassium", value: "5.4", unit: "mEq/L", referenceRange: "3.5–5.0", flag: "Abnormal", previousValue: "4.8" },
    { id: "s22", name: "Chloride", value: "103", unit: "mEq/L", referenceRange: "98–106", flag: "Normal" },
    { id: "s23", name: "CO2", value: "24", unit: "mEq/L", referenceRange: "23–29", flag: "Normal" },
    { id: "s24", name: "BUN", value: "22", unit: "mg/dL", referenceRange: "7–20", flag: "Abnormal" },
    { id: "s25", name: "Creatinine", value: "1.5", unit: "mg/dL", referenceRange: "0.7–1.3", flag: "Abnormal", previousValue: "1.1" },
    { id: "s26", name: "Glucose", value: "105", unit: "mg/dL", referenceRange: "70–100", flag: "Abnormal" },
    { id: "s27", name: "Calcium", value: "9.0", unit: "mg/dL", referenceRange: "8.5–10.5", flag: "Normal" },
  ],
}

function getFlagVariant(flag: string): "default" | "secondary" | "destructive" | "warning" {
  switch (flag) {
    case "Critical": return "destructive"
    case "Abnormal": return "warning"
    default: return "secondary"
  }
}

export function ValidateResultModal({ open, onOpenChange, order, onApprove, onReject }: ValidateResultModalProps) {
  if (!order) return null

  const analytes = order.results?.analytes ?? simulatedResults[order.testPanel] ?? []
  const hasCritical = analytes.some(a => a.flag === "Critical")
  const hasAbnormal = analytes.some(a => a.flag === "Abnormal")
  const hasDeltaCheck = analytes.some(a => a.previousValue)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[820px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconShieldCheck className="h-5 w-5" />
            Validate Results
          </DialogTitle>
          <DialogDescription>
            Review results before finalizing. Check for delta alerts and critical values.
          </DialogDescription>
        </DialogHeader>

        {/* Patient Info */}
        <div className="rounded-md border p-3 space-y-2 bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{order.patient.name}</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{order.patient.mrn}</Badge>
              <Badge
                variant={order.priority === "STAT" ? "destructive" : order.priority === "URGENT" ? "warning" : "secondary"}
              >
                {order.priority}
              </Badge>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-muted-foreground">Panel:</span> <span className="font-medium">{order.testPanel}</span></div>
            <div><span className="text-muted-foreground">Entered by:</span> <span className="font-medium">{order.results?.enteredBy ?? "Tech. R. Martinez"}</span></div>
          </div>
        </div>

        {/* Alerts */}
        {(hasCritical || hasDeltaCheck) && (
          <div className="space-y-2">
            {hasCritical && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded px-3 py-2">
                <IconAlertTriangle className="h-4 w-4 shrink-0" />
                <span className="font-medium">Critical values detected — clinician notification required before finalizing.</span>
              </div>
            )}
            {hasDeltaCheck && (
              <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded px-3 py-2">
                <IconArrowUpRight className="h-4 w-4 shrink-0" />
                <span className="font-medium">Delta check: Significant changes from previous values detected (see Δ column).</span>
              </div>
            )}
          </div>
        )}

        {/* Results Table */}
        <ScrollArea className="flex-1 max-h-[340px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px]">Analyte</TableHead>
                <TableHead className="w-[90px]">Value</TableHead>
                <TableHead className="w-[70px]">Unit</TableHead>
                <TableHead className="w-[120px]">Reference Range</TableHead>
                <TableHead className="w-[80px]">Flag</TableHead>
                <TableHead className="w-[100px]">Δ Previous</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytes.map((analyte) => (
                <TableRow
                  key={analyte.id}
                  className={
                    analyte.flag === "Critical"
                      ? "bg-red-50/50 dark:bg-red-950/20"
                      : analyte.flag === "Abnormal"
                        ? "bg-amber-50/50 dark:bg-amber-950/20"
                        : ""
                  }
                >
                  <TableCell className="font-medium">{analyte.name}</TableCell>
                  <TableCell className={
                    analyte.flag === "Critical"
                      ? "font-bold text-red-600 dark:text-red-400"
                      : analyte.flag === "Abnormal"
                        ? "font-semibold text-amber-600 dark:text-amber-400"
                        : ""
                  }>
                    {analyte.value}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{analyte.unit}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{analyte.referenceRange}</TableCell>
                  <TableCell>
                    <Badge variant={getFlagVariant(analyte.flag)} className="text-xs">
                      {analyte.flag}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {analyte.previousValue ? (
                      <span className="text-muted-foreground">{analyte.previousValue} → {analyte.value}</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* Summary */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">Summary:</span>
          <Badge variant="secondary">{analytes.filter(a => a.flag === "Normal").length} Normal</Badge>
          {hasAbnormal && <Badge variant="warning">{analytes.filter(a => a.flag === "Abnormal").length} Abnormal</Badge>}
          {hasCritical && <Badge variant="destructive">{analytes.filter(a => a.flag === "Critical").length} Critical</Badge>}
        </div>

        {/* Validation Notes */}
        <div className="space-y-2">
          <Label htmlFor="validationNotes">Validation Notes (optional)</Label>
          <Textarea id="validationNotes" placeholder="Add notes for this validation..." rows={2} />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={() => {
            onReject(order.id)
            onOpenChange(false)
          }}>
            Return for Re-run
          </Button>
          <Button onClick={() => {
            onApprove(order.id)
            onOpenChange(false)
          }}>
            Approve &amp; Finalize
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
