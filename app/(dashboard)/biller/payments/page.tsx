"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { PaymentReceiptSheet } from "@/components/biller/payment-receipt-sheet"
import {
  BillerPaymentRow,
  cloneSamplePayments,
  currency,
  nextDemoPaymentId,
  nextDemoReceiptId,
  sampleInvoices,
} from "@/lib/biller/sample-data"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { IconDotsVertical } from "@tabler/icons-react"

function payBadge(status: BillerPaymentRow["status"]) {
  switch (status) {
    case "Posted":
      return "secondary" as const
    case "Pending deposit":
      return "warning" as const
    case "Voided":
      return "destructive" as const
    default:
      return "outline" as const
  }
}

export default function PaymentsPage() {
  const [rows, setRows] = React.useState<BillerPaymentRow[]>(cloneSamplePayments)
  const [receiptPayment, setReceiptPayment] = React.useState<BillerPaymentRow | null>(null)
  const [recordOpen, setRecordOpen] = React.useState(false)
  const [invoiceId, setInvoiceId] = React.useState("")
  const [amountStr, setAmountStr] = React.useState("")
  const [payer, setPayer] = React.useState("")
  const [method, setMethod] = React.useState("Card")

  const openInvoices = sampleInvoices.filter((i) => i.balance > 0)

  const selectedInvoice = sampleInvoices.find((i) => i.id === invoiceId)

  const openRecordDialog = () => {
    if (openInvoices.length === 0) return
    const first = openInvoices[0]
    setInvoiceId(first.id)
    setAmountStr(String(first.balance))
    setPayer(first.patient)
    setMethod("Card")
    setRecordOpen(true)
  }

  const recordPayment = () => {
    const amt = Number.parseFloat(amountStr)
    if (!selectedInvoice || Number.isNaN(amt) || amt <= 0 || !payer.trim()) return
    const row: BillerPaymentRow = {
      id: nextDemoPaymentId(),
      date: new Date().toISOString().slice(0, 10),
      patient: payer.trim(),
      mrn: selectedInvoice.mrn,
      amount: amt,
      method,
      invoiceId: selectedInvoice.id,
      receiptId: nextDemoReceiptId(),
      status: "Posted",
    }
    setRows((r) => [...r, row])
    setRecordOpen(false)
  }

  const setStatus = (id: string, status: "Voided" | "Reversed") => {
    setRows((r) => r.map((row) => (row.id === id ? { ...row, status } : row)))
  }

  return (
    <ProtectedRoute requiredRole={UserRole.BILLER}>
      <DashboardLayout role={UserRole.BILLER}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Payments</h1>
            <p className="text-muted-foreground max-w-3xl">
              TOR workflows: <strong>accept payments</strong>, <strong>generate receipt</strong>.
              Validations: posted payments cannot be hard-deleted — use{" "}
              <strong>void</strong> or <strong>reverse</strong> (client demo only; no ledger).
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              New payment rows stay in this session only — no backend.
            </p>
          </div>

          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4 space-y-0">
                <div>
                  <CardTitle>Payment activity</CardTitle>
                  <CardDescription>
                    Record a payment, apply it to an invoice, then open the receipt. Charity /
                    third-party payers supported in the form.
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  onClick={openRecordDialog}
                  disabled={openInvoices.length === 0}
                  title={openInvoices.length === 0 ? "No open balances in sample invoices" : undefined}
                >
                  Record payment
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Patient / payer</TableHead>
                      <TableHead>MRN</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Receipt #</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right w-[140px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{p.date}</TableCell>
                        <TableCell>{p.patient}</TableCell>
                        <TableCell className="font-mono text-xs">{p.mrn}</TableCell>
                        <TableCell className="text-right font-medium">
                          {currency(p.amount)}
                        </TableCell>
                        <TableCell className="text-xs">{p.method}</TableCell>
                        <TableCell className="font-mono text-xs">{p.invoiceId}</TableCell>
                        <TableCell className="font-mono text-xs">{p.receiptId}</TableCell>
                        <TableCell>
                          <Badge variant={payBadge(p.status)}>{p.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setReceiptPayment(p)}
                            >
                              Receipt
                            </Button>
                            {p.status === "Posted" ? (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button type="button" variant="ghost" size="icon" className="size-8">
                                    <IconDotsVertical className="size-4" />
                                    <span className="sr-only">Payment actions</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setStatus(p.id, "Voided")}>
                                    Void (demo)
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setStatus(p.id, "Reversed")}>
                                    Reverse (demo)
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Dialog open={recordOpen} onOpenChange={setRecordOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Record payment</DialogTitle>
                <DialogDescription>
                  Apply payment to an open invoice (TOR). Invoice balances in the list are static
                  until a backend posts allocations.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="inv">Invoice</Label>
                  <Select value={invoiceId} onValueChange={setInvoiceId}>
                    <SelectTrigger id="inv" className="w-full">
                      <SelectValue placeholder="Select invoice" />
                    </SelectTrigger>
                    <SelectContent>
                      {openInvoices.map((i) => (
                        <SelectItem key={i.id} value={i.id}>
                          {i.id} · {i.patient} · balance {currency(i.balance)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amt">Amount</Label>
                  <Input
                    id="amt"
                    type="number"
                    min={0}
                    step="0.01"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="payer">Patient / payer name</Label>
                  <Input
                    id="payer"
                    value={payer}
                    onChange={(e) => setPayer(e.target.value)}
                    placeholder="e.g. patient or charity name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Method</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Card">Card</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Check">Check</SelectItem>
                      <SelectItem value="Charity check">Charity check</SelectItem>
                      <SelectItem value="Insurance ERA">Insurance ERA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setRecordOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={recordPayment}>
                  Post payment &amp; issue receipt id
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <PaymentReceiptSheet
            payment={receiptPayment}
            open={receiptPayment !== null}
            onOpenChange={(open) => {
              if (!open) setReceiptPayment(null)
            }}
          />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
