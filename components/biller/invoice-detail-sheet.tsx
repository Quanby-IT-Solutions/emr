"use client"

import {
  chargesForEncounter,
  currency,
  sampleInvoices,
  subtotalForEncounter,
} from "@/lib/biller/sample-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type SampleInvoice = (typeof sampleInvoices)[number]

type InvoiceDetailSheetProps = {
  invoice: SampleInvoice | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Optional tax rate for preview (facility rules apply in production). */
const DEMO_TAX_RATE = 0

export function InvoiceDetailSheet({
  invoice,
  open,
  onOpenChange,
}: InvoiceDetailSheetProps) {
  const lines = invoice ? chargesForEncounter(invoice.encounterId) : []
  const subtotal = invoice ? subtotalForEncounter(invoice.encounterId) : 0
  const tax = Math.round(subtotal * DEMO_TAX_RATE * 100) / 100
  const withTax = subtotal + tax
  const subtotalMatchesInvoice =
    invoice && Math.abs(subtotal - invoice.total) < 0.01

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Consolidated invoice</SheetTitle>
          <SheetDescription>
            One statement for the visit with every charge line. Charges are grouped by encounter.
            Tax follows facility rules—this preview uses {DEMO_TAX_RATE * 100}%.
          </SheetDescription>
        </SheetHeader>

        {invoice ? (
          <div className="flex flex-1 flex-col gap-4 px-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-mono font-semibold">{invoice.id}</span>
              <Badge variant="outline">{invoice.status}</Badge>
              <span className="text-muted-foreground">{invoice.issued}</span>
            </div>
            <div className="text-sm">
              <p className="font-medium">{invoice.patient}</p>
              <p className="text-muted-foreground font-mono text-xs">
                MRN {invoice.mrn} · {invoice.encounterId}
              </p>
            </div>

            {!subtotalMatchesInvoice ? (
              <p className="rounded-md border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-xs text-amber-950 dark:text-amber-100">
                Preview: line subtotal {currency(subtotal)} differs from invoice total{" "}
                {currency(invoice.total)}. In production, totals are enforced when charges and
                invoices post.
              </p>
            ) : null}

            <div>
              <p className="mb-2 text-sm font-medium">Charge lines</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit</TableHead>
                    <TableHead className="text-right">Line</TableHead>
                    <TableHead className="text-xs">Suggested from</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="max-w-[200px] whitespace-normal text-xs">
                        {row.service}
                      </TableCell>
                      <TableCell className="text-right">{row.qty}</TableCell>
                      <TableCell className="text-right text-xs">
                        {currency(row.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right text-xs font-medium">
                        {currency(row.qty * row.unitPrice)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {row.suggestedFrom}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-1 rounded-lg border bg-muted/30 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal (charges)</span>
                <span className="font-medium">{currency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (optional)</span>
                <span>{currency(tax)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Invoice total</span>
                <span>{currency(withTax)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-xs">
                <span>Balance due</span>
                <span>{invoice.balance > 0 ? currency(invoice.balance) : "—"}</span>
              </div>
            </div>
          </div>
        ) : null}

        <SheetFooter>
          <Button type="button" className="w-full" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
