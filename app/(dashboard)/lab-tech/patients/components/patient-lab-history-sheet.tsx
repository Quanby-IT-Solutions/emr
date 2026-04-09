"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { IconAlertTriangle } from "@tabler/icons-react"
import type { LabPatient, LabOrder } from "@/app/(dashboard)/dummy-data/dummy-lab-orders"

interface PatientLabHistorySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: LabPatient | null
  orders: LabOrder[]
}

function getFlagVariant(flag: string): "default" | "secondary" | "destructive" | "warning" {
  switch (flag) {
    case "Critical": return "destructive"
    case "Abnormal": return "warning"
    default: return "secondary"
  }
}

export function PatientLabHistorySheet({ open, onOpenChange, patient, orders }: PatientLabHistorySheetProps) {
  if (!patient) return null

  const patientOrders = orders.filter(o => o.patient.mrn === patient.mrn)
  const activeOrders = patientOrders.filter(o => ["PLACED", "COLLECTED", "IN_PROGRESS"].includes(o.status))
  const completedOrders = patientOrders.filter(o => o.status === "COMPLETED" || o.status === "CORRECTED")
  const criticalResults = completedOrders.filter(o =>
    o.results?.analytes.some(a => a.flag === "Critical")
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[640px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Lab History — {patient.name}</SheetTitle>
          <SheetDescription>{patient.mrn} · DOB: {patient.dob} · {patient.gender}</SheetDescription>
        </SheetHeader>

        {/* Summary */}
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline">{patientOrders.length} Total Orders</Badge>
          <Badge variant="secondary">{activeOrders.length} Active</Badge>
          <Badge variant="default">{completedOrders.length} Completed</Badge>
          {patient.criticalCount > 0 && (
            <Badge variant="destructive" className="gap-1">
              <IconAlertTriangle className="h-3 w-3" />
              {patient.criticalCount} Critical
            </Badge>
          )}
        </div>

        <Tabs defaultValue="active" className="flex-1 flex flex-col">
          <TabsList className="w-full">
            <TabsTrigger value="active" className="flex-1">
              Active Orders
              {activeOrders.length > 0 && <Badge variant="secondary" className="ml-2">{activeOrders.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              Results History
            </TabsTrigger>
            <TabsTrigger value="critical" className="flex-1">
              Critical Values
              {criticalResults.length > 0 && <Badge variant="destructive" className="ml-2">{criticalResults.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            {/* Active Orders Tab */}
            <TabsContent value="active" className="mt-0">
              {activeOrders.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground">No active orders.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Panel</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ordered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeOrders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.testPanel}</TableCell>
                        <TableCell>
                          <Badge variant={order.priority === "STAT" ? "destructive" : order.priority === "URGENT" ? "warning" : "secondary"}>
                            {order.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{order.status.replace("_", " ")}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{order.orderedAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            {/* Results History Tab */}
            <TabsContent value="history" className="mt-0 space-y-4">
              {completedOrders.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground">No completed results.</div>
              ) : (
                completedOrders.map(order => (
                  <div key={order.id} className="rounded-md border p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-sm">{order.testPanel}</span>
                        <span className="text-xs text-muted-foreground ml-2">{order.completedAt}</span>
                      </div>
                      <div className="flex gap-1">
                        {order.status === "CORRECTED" && <Badge variant="warning" className="text-xs">Corrected</Badge>}
                        {order.results?.analytes.some(a => a.flag === "Critical") && (
                          <Badge variant="destructive" className="text-xs">Critical</Badge>
                        )}
                        {order.results?.analytes.some(a => a.flag === "Abnormal") && !order.results.analytes.some(a => a.flag === "Critical") && (
                          <Badge variant="warning" className="text-xs">Abnormal</Badge>
                        )}
                      </div>
                    </div>
                    <Separator />
                    {order.results && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Analyte</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Range</TableHead>
                            <TableHead>Flag</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {order.results.analytes.map(a => (
                            <TableRow key={a.id}>
                              <TableCell className="text-sm">{a.name}</TableCell>
                              <TableCell className={
                                a.flag === "Critical" ? "font-bold text-red-600 dark:text-red-400 text-sm"
                                  : a.flag === "Abnormal" ? "font-semibold text-amber-600 dark:text-amber-400 text-sm" : "text-sm"
                              }>
                                {a.correctedFrom && <span className="line-through text-muted-foreground mr-1">{a.correctedFrom}</span>}
                                {a.value} {a.unit}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">{a.referenceRange}</TableCell>
                              <TableCell><Badge variant={getFlagVariant(a.flag)} className="text-xs">{a.flag}</Badge></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                ))
              )}
            </TabsContent>

            {/* Critical Values Tab */}
            <TabsContent value="critical" className="mt-0">
              {criticalResults.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-muted-foreground">No critical values on record.</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Panel</TableHead>
                      <TableHead>Analyte</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Range</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {criticalResults.flatMap(order =>
                      order.results!.analytes
                        .filter(a => a.flag === "Critical")
                        .map(a => (
                          <TableRow key={`${order.id}-${a.id}`}>
                            <TableCell className="font-medium text-sm">{order.testPanel}</TableCell>
                            <TableCell className="text-sm">{a.name}</TableCell>
                            <TableCell className="font-bold text-red-600 dark:text-red-400 text-sm">
                              {a.value} {a.unit}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{a.referenceRange}</TableCell>
                            <TableCell className="text-sm">{order.completedAt}</TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
