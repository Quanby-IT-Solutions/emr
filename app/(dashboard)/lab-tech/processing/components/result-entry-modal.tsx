"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { IconAlertTriangle } from "@tabler/icons-react"
import type { ProcessingOrder, LabResultPayload } from "../types"

interface ResultEntryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: ProcessingOrder | null
  onSubmit: (orderId: string, results: LabResultPayload[]) => void
}

// Default analytes by panel for result entry
const panelAnalytes: Record<string, { name: string; unit: string; referenceRange: string }[]> = {
  "Complete Blood Count (CBC)": [
    { name: "WBC", unit: "x10³/µL", referenceRange: "4.5–11.0" },
    { name: "RBC", unit: "x10⁶/µL", referenceRange: "4.5–5.5" },
    { name: "Hemoglobin", unit: "g/dL", referenceRange: "13.5–17.5" },
    { name: "Hematocrit", unit: "%", referenceRange: "38.0–50.0" },
    { name: "Platelets", unit: "x10³/µL", referenceRange: "150–400" },
    { name: "MCV", unit: "fL", referenceRange: "80–100" },
    { name: "MCH", unit: "pg", referenceRange: "27–33" },
    { name: "MCHC", unit: "g/dL", referenceRange: "32–36" },
  ],
  "Basic Metabolic Panel (BMP)": [
    { name: "Sodium", unit: "mEq/L", referenceRange: "136–145" },
    { name: "Potassium", unit: "mEq/L", referenceRange: "3.5–5.0" },
    { name: "Chloride", unit: "mEq/L", referenceRange: "98–106" },
    { name: "CO2", unit: "mEq/L", referenceRange: "23–29" },
    { name: "BUN", unit: "mg/dL", referenceRange: "7–20" },
    { name: "Creatinine", unit: "mg/dL", referenceRange: "0.7–1.3" },
    { name: "Glucose", unit: "mg/dL", referenceRange: "70–100" },
    { name: "Calcium", unit: "mg/dL", referenceRange: "8.5–10.5" },
  ],
  "Coagulation Panel": [
    { name: "PT", unit: "seconds", referenceRange: "11.0–13.5" },
    { name: "INR", unit: "", referenceRange: "0.9–1.1" },
    { name: "aPTT", unit: "seconds", referenceRange: "25–35" },
    { name: "Fibrinogen", unit: "mg/dL", referenceRange: "200–400" },
  ],
  "Liver Function Tests (LFT)": [
    { name: "Total Bilirubin", unit: "mg/dL", referenceRange: "0.1–1.2" },
    { name: "Direct Bilirubin", unit: "mg/dL", referenceRange: "0.0–0.3" },
    { name: "ALT", unit: "U/L", referenceRange: "7–56" },
    { name: "AST", unit: "U/L", referenceRange: "10–40" },
    { name: "ALP", unit: "U/L", referenceRange: "44–147" },
    { name: "Albumin", unit: "g/dL", referenceRange: "3.5–5.0" },
    { name: "Total Protein", unit: "g/dL", referenceRange: "6.0–8.3" },
  ],
  Urinalysis: [
    { name: "Color", unit: "", referenceRange: "Yellow" },
    { name: "Clarity", unit: "", referenceRange: "Clear" },
    { name: "Specific Gravity", unit: "", referenceRange: "1.005–1.030" },
    { name: "pH", unit: "", referenceRange: "5.0–8.0" },
    { name: "Protein", unit: "", referenceRange: "Negative" },
    { name: "Glucose", unit: "", referenceRange: "Negative" },
    { name: "Ketones", unit: "", referenceRange: "Negative" },
    { name: "Blood", unit: "", referenceRange: "Negative" },
    { name: "Leukocyte Esterase", unit: "", referenceRange: "Negative" },
    { name: "Nitrites", unit: "", referenceRange: "Negative" },
  ],
}

export function ResultEntryModal({ open, onOpenChange, order, onSubmit }: ResultEntryModalProps) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [criticals, setCriticals] = useState<Record<string, boolean>>({})
  const [techNotes, setTechNotes] = useState("")

  if (!order) return null

  const analytes = panelAnalytes[order.testPanel] ?? [
    { name: "Result 1", unit: "", referenceRange: "—" },
    { name: "Result 2", unit: "", referenceRange: "—" },
  ]

  function handleSubmit() {
    if (!order) return
    const results: LabResultPayload[] = analytes.map((a) => ({
      analyteName: a.name,
      value: values[a.name] ?? "",
      unit: a.unit || undefined,
      referenceRange: a.referenceRange || undefined,
      flag: criticals[a.name] ? "Critical" : undefined,
    })).filter((r) => r.value.trim() !== "")

    onSubmit(order.id, results)
    setValues({})
    setCriticals({})
    setTechNotes("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Enter Lab Results</DialogTitle>
          <DialogDescription>
            Enter test results for this order. Mark critical values as needed.
          </DialogDescription>
        </DialogHeader>

        {/* Patient / Order Info */}
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
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Panel:</span>{" "}
              <span className="font-medium">{order.testPanel}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Specimen:</span>{" "}
              <span className="font-medium">{order.specimenType}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Condition:</span>{" "}
              <span className="font-medium">{order.specimenCondition ?? "—"}</span>
            </div>
          </div>
          {order.specimenCondition && order.specimenCondition !== "Satisfactory" && (
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded px-2 py-1">
              <IconAlertTriangle className="h-4 w-4" />
              Specimen condition: {order.specimenCondition} — results may be affected
            </div>
          )}
        </div>

        {/* Analyte Table */}
        <ScrollArea className="flex-1 max-h-[380px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Analyte</TableHead>
                <TableHead className="w-[120px]">Value</TableHead>
                <TableHead className="w-[80px]">Unit</TableHead>
                <TableHead className="w-[120px]">Reference Range</TableHead>
                <TableHead className="w-[70px] text-center">Critical</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytes.map((analyte) => (
                <TableRow key={analyte.name}>
                  <TableCell className="font-medium">{analyte.name}</TableCell>
                  <TableCell>
                    <Input
                      className="h-8 w-full"
                      placeholder="Enter value"
                      value={values[analyte.name] ?? ""}
                      onChange={(e) => setValues((prev) => ({ ...prev, [analyte.name]: e.target.value }))}
                    />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{analyte.unit}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{analyte.referenceRange}</TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={criticals[analyte.name] ?? false}
                      onCheckedChange={(v) => setCriticals((prev) => ({ ...prev, [analyte.name]: !!v }))}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        {/* Tech Notes */}
        <div className="space-y-2">
          <Label htmlFor="techNotes">Technologist Notes</Label>
          <Textarea
            id="techNotes"
            placeholder="Add any notes about this test run..."
            rows={2}
            value={techNotes}
            onChange={(e) => setTechNotes(e.target.value)}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>
            Submit for Validation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
