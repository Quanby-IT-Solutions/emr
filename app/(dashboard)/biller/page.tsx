import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import {
  currency,
  sampleDashboardKpis,
  sampleInvoices,
} from "@/lib/biller/sample-data"
import {
  TOR_BILLING_KPIS,
  TOR_BILLING_PURPOSE,
  TOR_BILLING_VALIDATIONS,
  TOR_BILLING_WORKFLOWS,
} from "@/lib/biller/tor-billing"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { IconCurrencyDollar, IconFileText, IconCash, IconChartBar } from "@tabler/icons-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function BillerDashboard() {
  const pct = (r: number) => `${Math.round(r * 100)}%`
  const recent = [...sampleInvoices].sort((a, b) => (a.issued < b.issued ? 1 : -1)).slice(0, 4)

  return (
    <ProtectedRoute requiredRole={UserRole.BILLER}>
      <DashboardLayout role={UserRole.BILLER}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Billing (Starter RCM)</h1>
            <p className="text-muted-foreground max-w-3xl">{TOR_BILLING_PURPOSE}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              KPI numbers and invoice rows are sample fixtures — no backend ledger.
            </p>
          </div>

          <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {TOR_BILLING_KPIS[0]}
                </CardTitle>
                <IconChartBar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sampleDashboardKpis.daysInAR}</div>
                <p className="text-xs text-muted-foreground">days (sample average)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {TOR_BILLING_KPIS[1]}
                </CardTitle>
                <IconFileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {pct(sampleDashboardKpis.chargeCaptureRate)}
                </div>
                <p className="text-xs text-muted-foreground">sample rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {TOR_BILLING_KPIS[2]}
                </CardTitle>
                <IconCash className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {pct(sampleDashboardKpis.paymentCollectionRate)}
                </div>
                <p className="text-xs text-muted-foreground">sample rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open receivables</CardTitle>
                <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currency(sampleDashboardKpis.openReceivables)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Supports <strong>reconcile</strong> workflow (sample aging sum)
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 px-4 lg:grid-cols-2 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>TOR — key workflows</CardTitle>
                <CardDescription>Billing (Starter RCM) Section 2</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
                  {TOR_BILLING_WORKFLOWS.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ol>
                <div>
                  <p className="mb-1 font-medium">Validations (paraphrased)</p>
                  <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                    {TOR_BILLING_VALIDATIONS.map((v) => (
                      <li key={v}>{v}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick links</CardTitle>
                <CardDescription>Navigate to each workflow screen</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2 sm:grid-cols-2">
                <Button className="w-full" asChild>
                  <Link href="/biller/charges">Charges</Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/biller/invoices">Invoices</Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/biller/payments">Payments</Link>
                </Button>
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/biller/accounts">Accounts receivable</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent invoices</CardTitle>
                <CardDescription>Sample list — open Invoices for consolidated line view</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Issued</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recent.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                        <TableCell className="max-w-[140px] truncate">{inv.patient}</TableCell>
                        <TableCell className="text-xs">{inv.issued}</TableCell>
                        <TableCell className="text-right text-xs">
                          {inv.balance > 0 ? currency(inv.balance) : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              inv.status === "Paid"
                                ? "secondary"
                                : inv.status === "Partial"
                                  ? "warning"
                                  : inv.status === "Draft"
                                    ? "outline"
                                    : "tertiary"
                            }
                          >
                            {inv.status}
                          </Badge>
                        </TableCell>
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
