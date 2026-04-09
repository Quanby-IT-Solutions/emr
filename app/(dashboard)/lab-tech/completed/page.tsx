"use client"

import { useState, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import {
  IconSearch,
  IconEye,
  IconPencil,
  IconAlertTriangle,
} from "@tabler/icons-react"

import { labOrders, type LabOrder } from "@/app/(dashboard)/dummy-data/dummy-lab-orders"
import { ResultDetailSheet } from "./components/result-detail-sheet"
import { CorrectResultModal } from "./components/correct-result-modal"

function flagSummary(order: LabOrder): { label: string; variant: "secondary" | "warning" | "destructive" } {
  if (!order.results) return { label: "No Results", variant: "secondary" }
  const hasCritical = order.results.analytes.some(a => a.flag === "Critical")
  const hasAbnormal = order.results.analytes.some(a => a.flag === "Abnormal")
  if (hasCritical) return { label: "Critical", variant: "destructive" }
  if (hasAbnormal) return { label: "Abnormal", variant: "warning" }
  return { label: "Normal", variant: "secondary" }
}

export default function CompletedPage() {
  const [search, setSearch] = useState("")
  const [panelFilter, setPanelFilter] = useState("all")
  const [detailOpen, setDetailOpen] = useState(false)
  const [correctOpen, setCorrectOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null)

  const completedOrders = useMemo(() => {
    return labOrders.filter(o => o.status === "COMPLETED" || o.status === "CORRECTED")
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return completedOrders.filter(o => {
      const matchesSearch = o.patient.name.toLowerCase().includes(q) ||
        o.patient.mrn.toLowerCase().includes(q) ||
        o.testPanel.toLowerCase().includes(q)
      const matchesPanel = panelFilter === "all" || o.testPanel === panelFilter
      return matchesSearch && matchesPanel
    })
  }, [completedOrders, search, panelFilter])

  const panels = [...new Set(completedOrders.map(o => o.testPanel))]

  return (
    <ProtectedRoute requiredRole={UserRole.LAB_TECH}>
      <DashboardLayout role={UserRole.LAB_TECH}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Completed Orders</h1>
            <p className="text-muted-foreground">
              View finalized lab results, corrections, and audit trail
            </p>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle>Results</CardTitle>
                  <div className="flex items-center gap-3">
                    <div className="relative w-64">
                      <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search patient, MRN, test..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={panelFilter} onValueChange={setPanelFilter}>
                      <SelectTrigger className="w-56">
                        <SelectValue placeholder="Filter by panel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Panels</SelectItem>
                        {panels.map(p => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filtered.length === 0 ? (
                  <div className="flex items-center justify-center py-12 text-muted-foreground">
                    No completed orders match your search criteria.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>MRN</TableHead>
                        <TableHead>Test Panel</TableHead>
                        <TableHead>Completed</TableHead>
                        <TableHead>Flags</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Entered By</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map(order => {
                        const flag = flagSummary(order)
                        return (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.patient.name}</TableCell>
                            <TableCell>{order.patient.mrn}</TableCell>
                            <TableCell>{order.testPanel}</TableCell>
                            <TableCell className="text-sm">{order.completedAt ?? "—"}</TableCell>
                            <TableCell>
                              <Badge variant={flag.variant} className="text-xs gap-1">
                                {flag.variant === "destructive" && <IconAlertTriangle className="h-3 w-3" />}
                                {flag.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={order.status === "CORRECTED" ? "warning" : "default"} className="text-xs">
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {order.results?.enteredBy ?? "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="border"
                                      onClick={() => { setSelectedOrder(order); setDetailOpen(true) }}
                                    >
                                      <IconEye className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>View Results</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="border"
                                      onClick={() => { setSelectedOrder(order); setCorrectOpen(true) }}
                                    >
                                      <IconPencil className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Correct Result</TooltipContent>
                                </Tooltip>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sheet / Modal */}
        <ResultDetailSheet
          open={detailOpen}
          onOpenChange={setDetailOpen}
          order={selectedOrder}
        />
        <CorrectResultModal
          open={correctOpen}
          onOpenChange={setCorrectOpen}
          order={selectedOrder}
          onSubmit={() => {}}
        />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
