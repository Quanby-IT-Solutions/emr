"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import {
  InvoiceDetailSheet,
  type InvoiceDTO,
} from "@/components/biller/invoice-detail-sheet"
import { currency } from "@/lib/biller/sample-data"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

function invoiceBadge(status: string) {
  switch (status) {
    case "PAID": return "secondary" as const
    case "PARTIALLY_PAID": return "warning" as const
    case "ISSUED": return "default" as const
    default: return "outline" as const
  }
}

function invoiceLabel(status: string) {
  switch (status) {
    case "PARTIALLY_PAID": return "Partial"
    case "PAID": return "Paid"
    case "ISSUED": return "Issued"
    default: return "Draft"
  }
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = React.useState<InvoiceDTO[]>([])
  const [detail, setDetail] = React.useState<InvoiceDTO | null>(null)
  const [encounterId, setEncounterId] = React.useState("")
  const [compiling, setCompiling] = React.useState(false)

  const fetchInvoices = React.useCallback(async () => {
    try {
      const res = await fetch("/api/invoices")
      if (!res.ok) return
      const { data } = await res.json()
      setInvoices(data ?? [])
    } catch { /* ignore */ }
  }, [])

  React.useEffect(() => { fetchInvoices() }, [fetchInvoices])

  async function handleCompile(e: React.FormEvent) {
    e.preventDefault()
    if (!encounterId.trim()) return
    setCompiling(true)
    try {
      const res = await fetch(`/api/encounters/${encounterId.trim()}/compile-invoice`, {
        method: "POST",
      })
      if (!res.ok) {
        const body = await res.json()
        toast.error(body.error?.message ?? "Failed to compile invoice")
        return
      }
      const { data } = await res.json()
      toast.success("Invoice compiled", {
        description: `Invoice ${data.id} created with ${data.invoiceLineItems.length} line items.`,
      })
      setEncounterId("")
      await fetchInvoices()
    } catch {
      toast.error("Failed to compile invoice")
    } finally {
      setCompiling(false)
    }
  }

  return (
    <ProtectedRoute requiredRole={UserRole.BILLER}>
      <DashboardLayout role={UserRole.BILLER}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Invoices</h1>
            <p className="text-muted-foreground max-w-3xl">
              <strong>Compile invoice</strong>: a consolidated statement for the visit that lists{" "}
              <strong>all charge lines</strong>. Open a row for lines, optional tax, and balance
              due (preview).
            </p>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Compile Invoice</CardTitle>
                <CardDescription>
                  Generate a new invoice for a discharged encounter. Re-running for the same
                  encounter updates the existing draft in place.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCompile} className="flex items-end gap-3 max-w-sm">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="encounterId">Encounter ID</Label>
                    <Input
                      id="encounterId"
                      placeholder="e.g. enc_s06"
                      value={encounterId}
                      onChange={(e) => setEncounterId(e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={compiling || !encounterId.trim()}>
                    {compiling ? "Compiling..." : "Compile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice list</CardTitle>
                <CardDescription>
                  Draft, issue, and reconcile against payments. One invoice per visit in this preview.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>MRN</TableHead>
                      <TableHead>Encounter</TableHead>
                      <TableHead>Issued</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right w-[120px]">Detail</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No invoices found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      invoices.map((inv) => {
                        const balance =
                          (inv.totalAmountInCents - inv.amountPaidInCents) / 100
                        return (
                          <TableRow key={inv.id}>
                            <TableCell className="font-mono text-xs font-medium">
                              {inv.id}
                            </TableCell>
                            <TableCell>
                              {inv.patient.firstName} {inv.patient.lastName}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {inv.patient.mrn}
                            </TableCell>
                            <TableCell className="font-mono text-xs">
                              {inv.encounter?.id ?? "-"}
                            </TableCell>
                            <TableCell>
                              {inv.issueDate
                                ? new Date(inv.issueDate).toLocaleDateString()
                                : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              {currency(inv.totalAmountInCents / 100)}
                            </TableCell>
                            <TableCell className="text-right">
                              {balance > 0 ? (
                                <span className="font-medium">{currency(balance)}</span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={invoiceBadge(inv.status)}>
                                {invoiceLabel(inv.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setDetail(inv)}
                              >
                                View lines
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <InvoiceDetailSheet
            invoice={detail}
            open={detail !== null}
            onOpenChange={(open) => {
              if (!open) setDetail(null)
            }}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
