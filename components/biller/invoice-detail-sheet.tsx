"use client"

import { currency } from "@/lib/biller/sample-data"
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

export interface InvoiceLineItemDTO {
  id: string
  description: string | null
  quantity: number
  unitPriceInCents: number
  totalPriceInCents: number
  chargeMasterItem: { id: string; itemCode: string; description: string | null }
}

export interface InvoiceDTO {
  id: string
  status: string
  totalAmountInCents: number
  amountPaidInCents: number
  issueDate: string | null
  dueDate: string | null
  patient: { id: string; mrn: string; firstName: string; lastName: string }
  encounter: { id: string; type: string; status: string } | null
  invoiceLineItems: InvoiceLineItemDTO[]
}

type InvoiceDetailSheetProps = {
  invoice: InvoiceDTO | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DEMO_TAX_RATE = 0

function statusVariant(status: string) {
  switch (status) {
    case "PAID": return "secondary" as const
    case "PARTIALLY_PAID": return "warning" as const
    case "ISSUED": return "default" as const
    default: return "outline" as const
  }
}

function statusLabel(status: string) {
  switch (status) {
    case "PARTIALLY_PAID": return "Partial"
    case "PAID": return "Paid"
    case "ISSUED": return "Issued"
    default: return "Draft"
  }
}

export function InvoiceDetailSheet({
  invoice,
  open,
  onOpenChange,
}: InvoiceDetailSheetProps) {
  const subtotalCents = invoice
    ? invoice.invoiceLineItems.reduce((s, l) => s + l.totalPriceInCents, 0)
    : 0
  const subtotal = subtotalCents / 100
  const tax = Math.round(subtotal * DEMO_TAX_RATE * 100) / 100
  const withTax = subtotal + tax
  const balance = invoice ? (invoice.totalAmountInCents - invoice.amountPaidInCents) / 100 : 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Consolidated invoice</SheetTitle>
          <SheetDescription>
            One statement for the visit with every charge line. Charges are grouped by encounter.
            Tax follows facility rules-this preview uses {DEMO_TAX_RATE * 100}%.
          </SheetDescription>
        </SheetHeader>

        {invoice ? (
          <div className="flex flex-1 flex-col gap-4 px-4">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-mono font-semibold">{invoice.id}</span>
              <Badge variant={statusVariant(invoice.status)}>{statusLabel(invoice.status)}</Badge>
              {invoice.issueDate ? (
                <span className="text-muted-foreground">
                  {new Date(invoice.issueDate).toLocaleDateString()}
                </span>
              ) : null}
            </div>
            <div className="text-sm">
              <p className="font-medium">
                {invoice.patient.firstName} {invoice.patient.lastName}
              </p>
              <p className="text-muted-foreground font-mono text-xs">
                MRN {invoice.patient.mrn}
                {invoice.encounter ? ` · ${invoice.encounter.id}` : ""}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Charge lines</p>
              {invoice.invoiceLineItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No line items on this invoice.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit</TableHead>
                      <TableHead className="text-right">Line</TableHead>
                      <TableHead className="text-xs">Code</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice.invoiceLineItems.map((line) => (
                      <TableRow key={line.id}>
                        <TableCell className="max-w-[200px] whitespace-normal text-xs">
                          {line.description ?? line.chargeMasterItem.description ?? "-"}
                        </TableCell>
                        <TableCell className="text-right">{line.quantity}</TableCell>
                        <TableCell className="text-right text-xs">
                          {currency(line.unitPriceInCents / 100)}
                        </TableCell>
                        <TableCell className="text-right text-xs font-medium">
                          {currency(line.totalPriceInCents / 100)}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs font-mono">
                          {line.chargeMasterItem.itemCode}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
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
                <span>{currency(invoice.totalAmountInCents / 100)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-xs">
                <span>Balance due</span>
                <span>{balance > 0 ? currency(balance) : "-"}</span>
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
