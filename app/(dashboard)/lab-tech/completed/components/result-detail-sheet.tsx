"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { IconAlertTriangle, IconClock } from "@tabler/icons-react"
import type { LabOrder } from "@/app/(dashboard)/dummy-data/dummy-lab-orders"

interface ResultDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: LabOrder | null
}

function getFlagVariant(flag: string): "default" | "secondary" | "destructive" | "warning" {
  switch (flag) {
    case "Critical": return "destructive"
    case "Abnormal": return "warning"
    default: return "secondary"
  }
}

export function ResultDetailSheet({ open, onOpenChange, order }: ResultDetailSheetProps) {
  if (!order || !order.results) return null

  const results = order.results
  const hasCritical = results.analytes.some(a => a.flag === "Critical")
  const hasCorrected = results.analytes.some(a => a.correctedFrom)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[640px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Result Details — {order.testPanel}</SheetTitle>
          <SheetDescription>
            Order {order.id} · {order.patient.name}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-5 pb-6">
            {/* Patient Demographics */}
            <div className="rounded-md border p-3 space-y-2 bg-muted/30">
              <div className="flex items-center justify-between">
                <span className="font-medium">{order.patient.name}</span>
                <Badge variant="outline">{order.patient.mrn}</Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">DOB:</span> {order.patient.dob}</div>
                <div><span className="text-muted-foreground">Gender:</span> {order.patient.gender}</div>
                <div><span className="text-muted-foreground">Encounter:</span> {order.encounterType}</div>
                <div><span className="text-muted-foreground">Ordered by:</span> {order.orderedBy}</div>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={order.status === "CORRECTED" ? "warning" : "default"}>
                {order.status}
              </Badge>
              {order.priority === "STAT" && <Badge variant="destructive">STAT</Badge>}
              {hasCritical && (
                <Badge variant="destructive" className="gap-1">
                  <IconAlertTriangle className="h-3 w-3" />
                  Critical Values
                </Badge>
              )}
              {hasCorrected && (
                <Badge variant="warning" className="gap-1">
                  Corrected
                </Badge>
              )}
            </div>

            {/* Results Table */}
            <div>
              <h3 className="text-sm font-medium mb-2">Results</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Analyte</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Range</TableHead>
                      <TableHead>Flag</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.analytes.map(analyte => (
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
                        <TableCell>
                          <div className="flex flex-col">
                            {analyte.correctedFrom && (
                              <span className="text-xs line-through text-muted-foreground">{analyte.correctedFrom}</span>
                            )}
                            <span className={
                              analyte.flag === "Critical"
                                ? "font-bold text-red-600 dark:text-red-400"
                                : analyte.flag === "Abnormal"
                                  ? "font-semibold text-amber-600 dark:text-amber-400"
                                  : ""
                            }>
                              {analyte.value}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{analyte.unit}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{analyte.referenceRange}</TableCell>
                        <TableCell>
                          <Badge variant={getFlagVariant(analyte.flag)} className="text-xs">{analyte.flag}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Correction Reason (if any) */}
            {hasCorrected && (
              <div className="rounded-md border border-amber-200 dark:border-amber-800 p-3 bg-amber-50/50 dark:bg-amber-950/20 space-y-1">
                <h4 className="text-sm font-medium text-amber-700 dark:text-amber-300">Correction Notes</h4>
                {results.analytes.filter(a => a.correctionReason).map(a => (
                  <p key={a.id} className="text-sm text-muted-foreground">
                    <span className="font-medium">{a.name}:</span> {a.correctionReason}
                  </p>
                ))}
              </div>
            )}

            {/* Tech Notes */}
            {results.techNotes && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Technologist Notes</h3>
                <p className="text-sm text-muted-foreground rounded-md border p-3 bg-muted/30">{results.techNotes}</p>
              </div>
            )}

            {/* Timestamp Trail */}
            <div>
              <h3 className="text-sm font-medium mb-2">Timeline</h3>
              <div className="space-y-2">
                {[
                  { label: "Ordered", time: order.orderedAt, by: order.orderedBy },
                  { label: "Collected", time: order.collectedAt, by: order.collectedBy },
                  { label: "Results Entered", time: results.enteredAt, by: results.enteredBy },
                  { label: "Validated", time: results.validatedAt, by: results.validatedBy },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex items-center gap-2 w-36 shrink-0">
                      <IconClock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium">{step.label}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {step.time ?? "—"} {step.by && `· ${step.by}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
