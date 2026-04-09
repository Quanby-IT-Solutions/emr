"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { InvoiceDetailSheet } from "@/components/biller/invoice-detail-sheet"
import { currency, sampleInvoices } from "@/lib/biller/sample-data"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Inv = (typeof sampleInvoices)[number]

function invoiceBadge(status: Inv["status"]) {
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

export default function InvoicesPage() {
  const [detail, setDetail] = React.useState<Inv | null>(null)

  return (
    <ProtectedRoute requiredRole={UserRole.BILLER}>
      <DashboardLayout role={UserRole.BILLER}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Invoices</h1>
            <p className="text-muted-foreground max-w-3xl">
              TOR workflow: <strong>compile invoice</strong> — consolidated statement for the
              encounter that lists <strong>all charge line items</strong>. Open a row to view
              lines, optional tax, and balance due (client-side demo).
            </p>
          </div>
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice list</CardTitle>
                <CardDescription>
                  Draft, issue, and reconcile against payments. One invoice per visit in this demo.
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
                    {sampleInvoices.map((inv) => (
                      <TableRow key={inv.id}>
                        <TableCell className="font-mono text-xs font-medium">
                          {inv.id}
                        </TableCell>
                        <TableCell>{inv.patient}</TableCell>
                        <TableCell className="font-mono text-xs">{inv.mrn}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {inv.encounterId}
                        </TableCell>
                        <TableCell>{inv.issued}</TableCell>
                        <TableCell className="text-right">{currency(inv.total)}</TableCell>
                        <TableCell className="text-right">
                          {inv.balance > 0 ? (
                            <span className="font-medium">{currency(inv.balance)}</span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={invoiceBadge(inv.status)}>{inv.status}</Badge>
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
                    ))}
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
