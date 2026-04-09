"use client"

import * as React from "react"
import type { BillerPaymentRow } from "@/lib/biller/sample-data"
import { currency } from "@/lib/biller/sample-data"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

type PaymentReceiptSheetProps = {
  payment: BillerPaymentRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentReceiptSheet({
  payment,
  open,
  onOpenChange,
}: PaymentReceiptSheetProps) {
  const printRef = React.useRef<HTMLDivElement>(null)
  const invalid =
    payment?.status === "Voided" || payment?.status === "Reversed"

  const handlePrint = () => {
    if (invalid) return
    const node = printRef.current
    if (!node) return
    const w = window.open("", "_blank", "width=420,height=640")
    if (!w) return
    w.document.write(
      `<!DOCTYPE html><html><head><title>Receipt ${payment?.receiptId ?? ""}</title>
      <style>
        body { font-family: system-ui, sans-serif; padding: 24px; color: #111; }
        h1 { font-size: 1.125rem; margin: 0 0 8px; }
        .muted { color: #555; font-size: 0.875rem; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 0.875rem; }
        td { padding: 6px 0; vertical-align: top; }
        td:first-child { color: #555; width: 40%; }
        .amount { font-size: 1.25rem; font-weight: 700; margin-top: 20px; }
      </style></head><body>${node.innerHTML}</body></html>`
    )
    w.document.close()
    w.focus()
    w.print()
    w.close()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Payment receipt</SheetTitle>
          <SheetDescription>
            TOR workflow: generate receipt after payment is accepted. Posted payments are not
            hard-deleted — void or reverse only (adjustment flows are backend work).
          </SheetDescription>
        </SheetHeader>

        {payment ? (
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
            {invalid ? (
              <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                This receipt is no longer valid — payment marked{" "}
                <strong>{payment.status.toLowerCase()}</strong> (client demo only).
              </p>
            ) : null}
            <div
              ref={printRef}
              className={`rounded-lg border bg-card p-6 text-card-foreground shadow-sm ${invalid ? "opacity-60" : ""}`}
            >
              <p className="text-center text-sm font-semibold tracking-wide uppercase">
                Sample Hospital
              </p>
              <p className="text-muted-foreground text-center text-xs">Payment receipt</p>
              <p className="mt-4 text-center font-mono text-lg font-bold">{payment.receiptId}</p>
              <table className="mt-4 w-full text-sm">
                <tbody>
                  <tr>
                    <td className="text-muted-foreground py-1.5">Date</td>
                    <td className="py-1.5 font-medium">{payment.date}</td>
                  </tr>
                  <tr>
                    <td className="text-muted-foreground py-1.5">Received from</td>
                    <td className="py-1.5">{payment.patient}</td>
                  </tr>
                  {payment.mrn !== "—" ? (
                    <tr>
                      <td className="text-muted-foreground py-1.5">MRN</td>
                      <td className="py-1.5 font-mono text-xs">{payment.mrn}</td>
                    </tr>
                  ) : null}
                  <tr>
                    <td className="text-muted-foreground py-1.5">Method</td>
                    <td className="py-1.5">{payment.method}</td>
                  </tr>
                  <tr>
                    <td className="text-muted-foreground py-1.5">Applied to invoice</td>
                    <td className="py-1.5 font-mono text-xs">{payment.invoiceId}</td>
                  </tr>
                  <tr>
                    <td className="text-muted-foreground py-1.5">Payment ref.</td>
                    <td className="py-1.5 font-mono text-xs">{payment.id}</td>
                  </tr>
                  <tr>
                    <td className="text-muted-foreground py-1.5">Status</td>
                    <td className="py-1.5">{payment.status}</td>
                  </tr>
                </tbody>
              </table>
              <p className="amount text-center">{currency(payment.amount)}</p>
              {!invalid ? (
                <p className="text-muted-foreground mt-4 text-center text-xs">
                  Thank you for your payment.
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <SheetFooter className="border-t pt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={!payment}
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            type="button"
            className="w-full"
            disabled={!payment || invalid}
            onClick={handlePrint}
          >
            Print receipt
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
