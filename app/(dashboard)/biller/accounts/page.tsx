"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import {
  currency,
  sampleAccountsReceivable,
  totalOpenReceivables,
} from "@/lib/biller/sample-data"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function AccountsPage() {
  const grand = totalOpenReceivables()

  return (
    <ProtectedRoute requiredRole={UserRole.BILLER}>
      <DashboardLayout role={UserRole.BILLER}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Accounts receivable</h1>
            <p className="text-muted-foreground max-w-3xl">
              <strong>Reconcile</strong> open balances and follow up by aging. Bankruptcy or
              special financial class can pause automated reminders and flag accounts for review
              (illustrative row: Taylor Brooks).
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Aging buckets below are illustrative—statements and reminder jobs are not run in
              this preview.
            </p>
          </div>
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <CardTitle>Open balances</CardTitle>
                <CardDescription>Accounts and aging for follow-up.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead>MRN / ID</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Auto reminders</TableHead>
                      <TableHead className="text-right">Current</TableHead>
                      <TableHead className="text-right">31–60</TableHead>
                      <TableHead className="text-right">61–90</TableHead>
                      <TableHead className="text-right">90+</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Last payment</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleAccountsReceivable.map((row) => {
                      const total =
                        row.current + row.days30 + row.days60 + row.days90
                      return (
                        <TableRow key={row.mrn}>
                          <TableCell className="font-medium">{row.patient}</TableCell>
                          <TableCell className="font-mono text-xs">{row.mrn}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{row.financialClass}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                row.automatedReminders === "Halted"
                                  ? "warning"
                                  : "secondary"
                              }
                            >
                              {row.automatedReminders}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {row.current > 0 ? currency(row.current) : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.days30 > 0 ? currency(row.days30) : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.days60 > 0 ? currency(row.days60) : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            {row.days90 > 0 ? currency(row.days90) : "—"}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {currency(total)}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {row.lastPayment}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={8} className="text-right font-medium">
                        Open A/R (sample)
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {currency(grand)}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
