"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import {
  currency,
  samplePatientPortalInvoices,
  samplePatientPortalLineItems,
} from "@/lib/biller/sample-data"
import { Badge } from "@/components/ui/badge"
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

function invBadge(status: string) {
  switch (status) {
    case "Paid":
      return "secondary" as const
    case "Partial":
      return "warning" as const
    case "Sent":
      return "tertiary" as const
    default:
      return "outline" as const
  }
}

export default function BillingPage() {
  const openBalance = samplePatientPortalInvoices.reduce((s, i) => s + i.balance, 0)

  return (
    <ProtectedRoute requiredRole={UserRole.PATIENT}>
      <DashboardLayout role={UserRole.PATIENT}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Billing</h1>
            <p className="text-muted-foreground max-w-3xl">
              Read-only statements and balances (Patient Portal — TOR Billing integration:
              view/pay bills). Sample data below simulates one linked account.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Demo only — no real payment processing.
            </p>
          </div>

          <div className="grid gap-4 px-4 lg:grid-cols-3 lg:px-6">
            <Card className="lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Account balance</CardTitle>
                <CardDescription>Open invoices (sample)</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold tracking-tight">{currency(openBalance)}</p>
                <Button className="mt-4 w-full" disabled title="Not implemented">
                  Pay balance
                </Button>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Your invoices</CardTitle>
                <CardDescription>Consolidated charges per visit (sample)</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Encounter</TableHead>
                      <TableHead>Issued</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">You owe</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right"> </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {samplePatientPortalInvoices.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                        <TableCell className="font-mono text-xs">{inv.encounterId}</TableCell>
                        <TableCell className="text-xs">{inv.issued}</TableCell>
                        <TableCell className="text-right text-xs">
                          {currency(inv.total)}
                        </TableCell>
                        <TableCell className="text-right text-xs font-medium">
                          {inv.balance > 0 ? currency(inv.balance) : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={invBadge(inv.status)}>{inv.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={inv.balance <= 0}
                            title="Demo only"
                          >
                            Pay
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Charges on file</CardTitle>
                <CardDescription>
                  Line items for your visit (TOR: consolidated invoice lists all charges —
                  sample encounter ENC-2026-88102)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit price</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-xs text-muted-foreground">Suggested from</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {samplePatientPortalLineItems.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="max-w-md whitespace-normal text-sm">
                          {row.service}
                        </TableCell>
                        <TableCell className="text-right">{row.qty}</TableCell>
                        <TableCell className="text-right">{currency(row.unitPrice)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {currency(row.qty * row.unitPrice)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {row.suggestedFrom}
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
