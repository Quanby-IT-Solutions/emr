"use client"

import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import {
  currency,
  sampleDashboardKpis,
  sampleInvoices,
  sampleAccountsReceivable,
  totalOpenReceivables,
} from "@/lib/biller/sample-data"
import { TOR_BILLING_KPIS } from "@/lib/biller/tor-billing"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IconDownload } from "@tabler/icons-react"

function invoiceStatusCounts() {
  const m = new Map<string, number>()
  for (const inv of sampleInvoices) {
    m.set(inv.status, (m.get(inv.status) ?? 0) + 1)
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1])
}

function billingReportCsv() {
  const lines = [
    "metric,value",
    `days_in_ar,${sampleDashboardKpis.daysInAR}`,
    `charge_capture_rate,${sampleDashboardKpis.chargeCaptureRate}`,
    `payment_collection_rate,${sampleDashboardKpis.paymentCollectionRate}`,
    `open_receivables,${totalOpenReceivables()}`,
  ]
  return lines.join("\n")
}

export default function BillerReportsPage() {
  const pct = (r: number) => `${Math.round(r * 100)}%`
  const statusRows = invoiceStatusCounts()

  const download = () => {
    const blob = new Blob([billingReportCsv()], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "billing-kpi-snapshot-demo.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <ProtectedRoute requiredRole={UserRole.BILLER}>
      <DashboardLayout role={UserRole.BILLER}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Billing reports</h1>
            <p className="text-muted-foreground max-w-3xl">
              TOR — Billing (Starter RCM) <strong>Key Performance Indicators</strong> and
              reconciliation-oriented summaries. The dashboard shows the same KPI numbers at a
              glance; this page is for <strong>report-style roll-ups</strong> and export. Operational
              detail stays under{" "}
              <Link
                href="/biller/charges"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Charges
              </Link>
              ,{" "}
              <Link
                href="/biller/invoices"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Invoices
              </Link>
              ,{" "}
              <Link
                href="/biller/payments"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Payments
              </Link>
              , and{" "}
              <Link
                href="/biller/accounts"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Accounts receivable
              </Link>
              .
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              All figures are sample fixtures — not connected to a live billing engine.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 px-4 lg:px-6">
            <p className="text-sm text-muted-foreground">
              Snapshot export (KPI fields only, demo CSV).
            </p>
            <Button type="button" variant="outline" size="sm" onClick={download}>
              <IconDownload className="mr-2 size-4" />
              Export KPI snapshot (demo)
            </Button>
          </div>

          <div className="grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{TOR_BILLING_KPIS[0]}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{sampleDashboardKpis.daysInAR}</p>
                <p className="text-xs text-muted-foreground">days (sample average)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{TOR_BILLING_KPIS[1]}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {pct(sampleDashboardKpis.chargeCaptureRate)}
                </p>
                <p className="text-xs text-muted-foreground">sample rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{TOR_BILLING_KPIS[2]}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {pct(sampleDashboardKpis.paymentCollectionRate)}
                </p>
                <p className="text-xs text-muted-foreground">sample rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Open receivables (total)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {currency(sampleDashboardKpis.openReceivables)}
                </p>
                <p className="text-xs text-muted-foreground">sum of aging buckets (sample)</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 px-4 lg:grid-cols-2 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Aging &amp; reconciliation (sample)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Current</TableHead>
                      <TableHead className="text-right">31–60</TableHead>
                      <TableHead className="text-right">61–90</TableHead>
                      <TableHead className="text-right">90+</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleAccountsReceivable.map((r) => (
                      <TableRow key={r.mrn}>
                        <TableCell className="max-w-[160px] truncate text-sm font-medium">
                          {r.patient}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {r.current > 0 ? currency(r.current) : "—"}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {r.days30 > 0 ? currency(r.days30) : "—"}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {r.days60 > 0 ? currency(r.days60) : "—"}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {r.days90 > 0 ? currency(r.days90) : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Invoice status distribution (sample)</CardTitle>
                <CardDescription>
                  Count of invoices by status in the demo set — useful for pipeline reporting.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statusRows.map(([status, n]) => (
                      <TableRow key={status}>
                        <TableCell className="font-mono text-xs">{status}</TableCell>
                        <TableCell className="text-right font-medium">{n}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
