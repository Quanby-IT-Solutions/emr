"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import {
  IconTestPipe,
  IconFlask,
  IconAlertTriangle,
  IconSearch,
  IconDroplet,
  IconPlayerPlay,
  IconChecks,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { CollectSpecimenModal } from "./components/collect-specimen-modal"
import { ResultEntryModal } from "./components/result-entry-modal"
import { ValidateResultModal } from "./components/validate-result-modal"
import type { ProcessingOrder, LabResultPayload } from "./types"

// ---------------------------------------------------------------------------
// API type (shape returned by /api/orders/lab-queue)
// ---------------------------------------------------------------------------

interface LabQueueOrder {
  id: string
  orderType: string
  status: string
  priority: string
  clinicalIndication: string | null
  createdAt: string
  details: {
    orderType: string
    testName?: string
    specimen?: string
  }
  placer: { id: string; firstName: string; lastName: string }
  encounter: {
    id: string
    type: string
    patient: {
      id: string
      mrn: string
      firstName: string
      lastName: string
      dateOfBirth: string
      gender: string | null
    }
  }
  labResults: Array<{
    id: string
    analyteName: string | null
    value: string | null
    unit: string | null
    referenceRange: string | null
    flag: string | null
    loincCode: string | null
  }>
}

// ---------------------------------------------------------------------------
// Mapper: DB order → ProcessingOrder
// ---------------------------------------------------------------------------

function toProcessingOrder(o: LabQueueOrder): ProcessingOrder {
  const patient = o.encounter.patient
  const analytes = (o.labResults ?? [])
    .filter((r) => r.analyteName)
    .map((r, i) => ({
      id: r.id,
      name: r.analyteName ?? `Analyte ${i + 1}`,
      value: r.value ?? "",
      unit: r.unit ?? "",
      referenceRange: r.referenceRange ?? "",
      flag: r.flag ?? "Normal",
    }))

  return {
    id: o.id,
    patient: {
      id: patient.id,
      name: `${patient.firstName} ${patient.lastName}`,
      mrn: patient.mrn,
      dob: patient.dateOfBirth,
      gender: patient.gender ?? "Unknown",
    },
    testPanel: o.details.testName ?? "Lab Test",
    specimenType: o.details.specimen ?? "Blood",
    priority: o.priority as "STAT" | "URGENT" | "ROUTINE",
    status: o.status as ProcessingOrder["status"],
    orderedBy: `${o.placer.firstName} ${o.placer.lastName}`,
    orderedAt: new Date(o.createdAt).toLocaleString(),
    encounterType: o.encounter.type,
    results:
      analytes.length > 0
        ? {
            analytes,
            enteredBy: "Lab Tech",
            enteredAt: new Date().toISOString(),
          }
        : undefined,
  }
}

// ---------------------------------------------------------------------------
// Helper components
// ---------------------------------------------------------------------------

function priorityVariant(priority: string): "destructive" | "warning" | "secondary" {
  switch (priority) {
    case "STAT": return "destructive"
    case "URGENT": return "warning"
    default: return "secondary"
  }
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------

export default function ProcessingPage() {
  const [orders, setOrders] = useState<ProcessingOrder[]>([])
  const [search, setSearch] = useState("")
  const [collectOpen, setCollectOpen] = useState(false)
  const [resultEntryOpen, setResultEntryOpen] = useState(false)
  const [validateOpen, setValidateOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<ProcessingOrder | null>(null)

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders/lab-queue")
      if (!res.ok) return
      const { data } = await res.json()
      setOrders((data ?? []).map(toProcessingOrder))
    } catch { /* ignore */ }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return orders.filter((o) =>
      o.patient.name.toLowerCase().includes(q) ||
      o.patient.mrn.toLowerCase().includes(q) ||
      o.testPanel.toLowerCase().includes(q)
    )
  }, [orders, search])

  const placed = filtered.filter((o) => o.status === "PLACED")
  const collected = filtered.filter((o) => o.status === "COLLECTED")
  const inProgress = filtered.filter((o) => o.status === "IN_PROGRESS")

  // Stats
  const collectedCount = orders.filter((o) => o.status === "COLLECTED").length
  const runningCount = orders.filter((o) => o.status === "IN_PROGRESS").length
  const placedCount = orders.filter((o) => o.status === "PLACED").length
  const criticalAlerts = orders.filter(
    (o) => o.priority === "STAT" && (o.status === "PLACED" || o.status === "COLLECTED")
  ).length

  function handleCollect(orderId: string, data: { collectedAt: string; collectedBy: string; specimenCondition: string }) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: "COLLECTED" as const,
              collectedAt: data.collectedAt,
              collectedBy: data.collectedBy,
              specimenCondition: data.specimenCondition,
            }
          : o
      )
    )
  }

  function handleStartProcessing(orderId: string) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "IN_PROGRESS" as const } : o
      )
    )
  }

  async function handleResultSubmit(orderId: string, results: LabResultPayload[]) {
    try {
      const res = await fetch("/api/lab-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, results }),
      })
      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error?.message ?? "Failed to enter results")
        return
      }
      // Update local state with entered results + advance to IN_PROGRESS
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== orderId) return o
          return {
            ...o,
            status: "IN_PROGRESS" as const,
            results: {
              analytes: results.map((r, i) => ({
                id: `r-${i}`,
                name: r.analyteName,
                value: r.value,
                unit: r.unit ?? "",
                referenceRange: r.referenceRange ?? "",
                flag: r.flag ?? "Normal",
              })),
              enteredBy: "Lab Tech",
              enteredAt: new Date().toISOString(),
            },
          }
        })
      )
      toast.success("Results entered successfully")
    } catch {
      toast.error("Failed to enter results")
    }
  }

  async function handleApprove(orderId: string) {
    try {
      const res = await fetch(`/api/lab-results/${orderId}/validate`, { method: "POST" })
      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error?.message ?? "Failed to validate results")
        return
      }
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
      toast.success("Results validated and finalized")
    } catch {
      toast.error("Failed to validate results")
    }
  }

  function handleReject(orderId: string) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: "COLLECTED" as const } : o
      )
    )
  }

  function renderTable(items: ProcessingOrder[], tab: "placed" | "collected" | "in-progress") {
    if (items.length === 0) {
      return (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          No orders in this category.
        </div>
      )
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>MRN</TableHead>
            <TableHead>Test Panel</TableHead>
            <TableHead>Specimen Type</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Ordered</TableHead>
            {tab !== "placed" && <TableHead>Collected</TableHead>}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.patient.name}</TableCell>
              <TableCell>{order.patient.mrn}</TableCell>
              <TableCell>{order.testPanel}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{order.specimenType}</TableCell>
              <TableCell>
                <Badge variant={priorityVariant(order.priority)}>{order.priority}</Badge>
              </TableCell>
              <TableCell className="text-sm">{order.orderedAt}</TableCell>
              {tab !== "placed" && (
                <TableCell className="text-sm">{order.collectedAt ?? "—"}</TableCell>
              )}
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {tab === "placed" && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="border"
                          onClick={() => { setSelectedOrder(order); setCollectOpen(true) }}
                        >
                          <IconDroplet className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Collect Specimen</TooltipContent>
                    </Tooltip>
                  )}
                  {tab === "collected" && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="border"
                          onClick={() => handleStartProcessing(order.id)}
                        >
                          <IconPlayerPlay className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Begin Processing</TooltipContent>
                    </Tooltip>
                  )}
                  {tab === "in-progress" && (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="border"
                            onClick={() => { setSelectedOrder(order); setResultEntryOpen(true) }}
                          >
                            <IconFlask className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Enter Results</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="border"
                            onClick={() => { setSelectedOrder(order); setValidateOpen(true) }}
                          >
                            <IconChecks className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Validate & Finalize</TooltipContent>
                      </Tooltip>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  return (
    <ProtectedRoute requiredRole={UserRole.LAB_TECH}>
      <DashboardLayout role={UserRole.LAB_TECH}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Test Processing</h1>
            <p className="text-muted-foreground">
              Manage specimen collection, result entry, and validation
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Awaiting Collection</CardTitle>
                <IconDroplet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{placedCount}</div>
                <p className="text-xs text-muted-foreground">Orders placed, not yet collected</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Specimens Collected</CardTitle>
                <IconTestPipe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{collectedCount}</div>
                <p className="text-xs text-muted-foreground">Ready for processing</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tests Running</CardTitle>
                <IconFlask className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{runningCount}</div>
                <p className="text-xs text-muted-foreground">In progress / awaiting validation</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">STAT Pending</CardTitle>
                <IconAlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{criticalAlerts}</div>
                <p className="text-xs text-muted-foreground">Urgent orders awaiting processing</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabbed Content */}
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Processing Queue</CardTitle>
                  <div className="relative w-72">
                    <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search patient, MRN, or test..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="placed">
                  <TabsList>
                    <TabsTrigger value="placed">
                      Awaiting Collection
                      {placed.length > 0 && <Badge variant="secondary" className="ml-2">{placed.length}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger value="collected">
                      Collected
                      {collected.length > 0 && <Badge variant="secondary" className="ml-2">{collected.length}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger value="in-progress">
                      In Progress
                      {inProgress.length > 0 && <Badge variant="secondary" className="ml-2">{inProgress.length}</Badge>}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="placed" className="mt-4">
                    {renderTable(placed, "placed")}
                  </TabsContent>
                  <TabsContent value="collected" className="mt-4">
                    {renderTable(collected, "collected")}
                  </TabsContent>
                  <TabsContent value="in-progress" className="mt-4">
                    {renderTable(inProgress, "in-progress")}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Modals */}
        <CollectSpecimenModal
          open={collectOpen}
          onOpenChange={setCollectOpen}
          order={selectedOrder}
          onConfirm={(id, data) => handleCollect(id, data)}
        />
        <ResultEntryModal
          open={resultEntryOpen}
          onOpenChange={setResultEntryOpen}
          order={selectedOrder}
          onSubmit={handleResultSubmit}
        />
        <ValidateResultModal
          open={validateOpen}
          onOpenChange={setValidateOpen}
          order={selectedOrder}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
