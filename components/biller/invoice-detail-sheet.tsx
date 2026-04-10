"use client"

import {
  currency,
  getSoaForInvoice,
  sampleHospitalBillingProfile,
  sampleInvoices,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type SampleInvoice = (typeof sampleInvoices)[number]

type InvoiceDetailSheetProps = {
  invoice: SampleInvoice | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvoiceDetailSheet({
  invoice,
  open,
  onOpenChange,
}: InvoiceDetailSheetProps) {
  const soa = invoice ? getSoaForInvoice(invoice.id) : null
  const gross = soa
    ? soa.chargeLines.reduce((s, c) => s + c.amount, 0)
    : invoice?.total ?? 0
  const totalDeductions = soa
    ? soa.deductionLines.reduce((s, d) => s + d.amount, 0)
    : 0
  const vatAmount = soa ? gross * soa.vatRate : 0
  const amountDue = Math.max(gross - totalDeductions, 0)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Statement of Account (SOA)</SheetTitle>
          <SheetDescription>
            Philippine-style hospital billing preview. Actual official values still come from
            backend posting and reconciliation workflows.
          </SheetDescription>
        </SheetHeader>

        {invoice ? (
          <div className="flex flex-1 flex-col gap-4 px-4">
            <div className="rounded-lg border bg-muted/30 p-4 text-sm">
              <p className="font-semibold">{sampleHospitalBillingProfile.name}</p>
              <p className="text-muted-foreground">{sampleHospitalBillingProfile.address}</p>
              <p className="text-muted-foreground text-xs">
                VAT Reg TIN: {sampleHospitalBillingProfile.vatRegTin}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <p>
                <span className="text-muted-foreground">Date: </span>
                {invoice.issued}
              </p>
              <p>
                <span className="text-muted-foreground">SOA No: </span>
                <span className="font-mono">{invoice.id}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Patient: </span>
                {invoice.patient}
              </p>
              <p>
                <span className="text-muted-foreground">MRN: </span>
                <span className="font-mono text-xs">{invoice.mrn}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Room No: </span>
                {soa?.roomNo ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Encounter: </span>
                <span className="font-mono text-xs">{invoice.encounterId}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Admission: </span>
                {soa?.admissionDate ?? "—"}
              </p>
              <p>
                <span className="text-muted-foreground">Discharge: </span>
                {soa?.dischargeDate ?? "—"}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Actual charges (PHP)</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(soa?.chargeLines ?? []).map((row, idx) => (
                    <TableRow key={`${row.description}-${idx}`}>
                      <TableCell className="text-sm">{row.description}</TableCell>
                      <TableCell className="text-right font-medium">{currency(row.amount)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell className="font-semibold">Total gross amount</TableCell>
                    <TableCell className="text-right font-semibold">{currency(gross)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Deductions & discounts</p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(soa?.deductionLines ?? []).length > 0 ? (
                    (soa?.deductionLines ?? []).map((row, idx) => (
                      <TableRow key={`${row.description}-${idx}`}>
                        <TableCell className="text-sm">{row.description}</TableCell>
                        <TableCell className="text-right font-medium">
                          ({currency(row.amount)})
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell className="text-muted-foreground">No deductions</TableCell>
                      <TableCell className="text-right text-muted-foreground">—</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell className="font-semibold">Total deductions</TableCell>
                    <TableCell className="text-right font-semibold">
                      ({currency(totalDeductions)})
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="space-y-1 rounded-lg border bg-muted/30 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">VATable sales</span>
                <span>{currency(gross)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">VAT ({Math.round((soa?.vatRate ?? 0) * 100)}%)</span>
                <span>{currency(vatAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">VAT-exempt / zero-rated</span>
                <span>{currency(soa?.zeroRatedVat ?? 0)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Net amount due</span>
                <span>{currency(amountDue)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-xs">
                <span>Invoice status</span>
                <span className="flex items-center gap-2">
                  <Badge variant="outline">{invoice.status}</Badge>
                  {invoice.balance > 0 ? `Balance ${currency(invoice.balance)}` : "Paid"}
                </span>
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
