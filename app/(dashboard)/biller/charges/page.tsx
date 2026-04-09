"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import {
  demoActivePriceList,
  TOR_BILLING_INTEGRATIONS,
  TOR_BILLING_VALIDATIONS,
} from "@/lib/biller/tor-billing"
import { currency, sampleCharges, type SampleCharge } from "@/lib/biller/sample-data"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const ENCOUNTER_PRESETS = [
  {
    encounterId: "ENC-2026-88421",
    patient: "Maria Santos",
    mrn: "MRN-100482",
    visitType: "OPD",
  },
  {
    encounterId: "ENC-2026-88102",
    patient: "James Okonkwo",
    mrn: "MRN-100501",
    visitType: "ER",
  },
  {
    encounterId: "ENC-2026-88501",
    patient: "Robert Chen",
    mrn: "MRN-100612",
    visitType: "OPD",
  },
] as const

function statusVariant(s: SampleCharge["status"]) {
  if (s === "Posted") return "secondary" as const
  return "warning" as const
}

export default function ChargesPage() {
  const [extra, setExtra] = React.useState<SampleCharge[]>([])
  const [addOpen, setAddOpen] = React.useState(false)
  const [presetIdx, setPresetIdx] = React.useState(0)
  const [service, setService] = React.useState("")
  const [qtyStr, setQtyStr] = React.useState("1")
  const [priceStr, setPriceStr] = React.useState("")
  const [source, setSource] = React.useState<SampleCharge["suggestedFrom"]>("CPOE")

  const rows = React.useMemo(
    () => [...sampleCharges, ...extra],
    [extra]
  )

  const addLine = () => {
    const qty = Number.parseInt(qtyStr, 10)
    const unitPrice = Number.parseFloat(priceStr)
    const p = ENCOUNTER_PRESETS[presetIdx]
    if (!service.trim() || Number.isNaN(qty) || qty < 1 || Number.isNaN(unitPrice)) return
    const line: SampleCharge = {
      id: `chg-local-${Date.now()}`,
      encounterId: p.encounterId,
      patient: p.patient,
      mrn: p.mrn,
      visitType: p.visitType,
      service: service.trim(),
      qty,
      unitPrice,
      status: "Pending",
      suggestedFrom: source,
    }
    setExtra((e) => [...e, line])
    setAddOpen(false)
    setService("")
    setQtyStr("1")
    setPriceStr("")
  }

  return (
    <ProtectedRoute requiredRole={UserRole.BILLER}>
      <DashboardLayout role={UserRole.BILLER}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Charges</h1>
            <p className="text-muted-foreground max-w-3xl">
              TOR workflow: <strong>add charges</strong> on the encounter (ADT container). Lines can
              be <strong>suggested</strong> from CPOE orders or documentation — auto-suggest engine
              is future work; column shows source in the demo.
            </p>
          </div>

          <div className="grid gap-4 px-4 lg:grid-cols-2 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Scoped price list (TOR validation)</CardTitle>
                <CardDescription>{TOR_BILLING_VALIDATIONS[0]}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="font-medium">{demoActivePriceList.name}</p>
                <p className="text-muted-foreground mt-1">{demoActivePriceList.scope}</p>
                <p className="text-muted-foreground mt-2 text-xs">{demoActivePriceList.note}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Integrations (TOR)</CardTitle>
                <CardDescription>Billing module touchpoints — not wired to live systems.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {TOR_BILLING_INTEGRATIONS.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4 space-y-0">
                <div>
                  <CardTitle>Charge items</CardTitle>
                  <CardDescription>
                    Review and post lines before compiling the invoice. Session-only “add line” for
                    UI review.
                  </CardDescription>
                </div>
                <Button type="button" variant="outline" onClick={() => setAddOpen(true)}>
                  Add charge line (demo)
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Encounter</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>MRN</TableHead>
                      <TableHead>Visit</TableHead>
                      <TableHead className="min-w-[220px]">Service</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit</TableHead>
                      <TableHead className="text-right">Line total</TableHead>
                      <TableHead>Suggested from</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row) => {
                      const line = row.qty * row.unitPrice
                      return (
                        <TableRow key={row.id}>
                          <TableCell className="font-mono text-xs">
                            {row.encounterId}
                          </TableCell>
                          <TableCell>{row.patient}</TableCell>
                          <TableCell className="font-mono text-xs">{row.mrn}</TableCell>
                          <TableCell>{row.visitType}</TableCell>
                          <TableCell className="max-w-[280px] whitespace-normal text-xs">
                            {row.service}
                          </TableCell>
                          <TableCell className="text-right">{row.qty}</TableCell>
                          <TableCell className="text-right">{currency(row.unitPrice)}</TableCell>
                          <TableCell className="text-right font-medium">
                            {currency(line)}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {row.suggestedFrom}
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add charge line</DialogTitle>
                <DialogDescription>
                  Client-only row appended to the table. Does not update invoices or price tables.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <div className="grid gap-2">
                  <Label>Encounter</Label>
                  <Select
                    value={String(presetIdx)}
                    onValueChange={(v) => setPresetIdx(Number.parseInt(v, 10))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ENCOUNTER_PRESETS.map((e, i) => (
                        <SelectItem key={e.encounterId} value={String(i)}>
                          {e.encounterId} · {e.patient}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="svc">Service / description</Label>
                  <Input
                    id="svc"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    placeholder="e.g. 93000 — ECG complete"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="qty">Qty</Label>
                    <Input
                      id="qty"
                      type="number"
                      min={1}
                      value={qtyStr}
                      onChange={(e) => setQtyStr(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Unit price</Label>
                    <Input
                      id="price"
                      type="number"
                      min={0}
                      step="0.01"
                      value={priceStr}
                      onChange={(e) => setPriceStr(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Suggested from</Label>
                  <Select
                    value={source}
                    onValueChange={(v) => setSource(v as SampleCharge["suggestedFrom"])}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CPOE">CPOE</SelectItem>
                      <SelectItem value="Order">Order</SelectItem>
                      <SelectItem value="Documentation">Documentation</SelectItem>
                      <SelectItem value="ADT">ADT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={addLine}>
                  Add line
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
