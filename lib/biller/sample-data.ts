/**
 * Demo-only fixtures for billing UI previews (not persisted).
 * Mirrors TOR “Billing (Starter RCM)” surface area for layout demos — not production RCM logic.
 */

export const currency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n)

export const sampleCharges = [
  {
    id: "chg-001",
    encounterId: "ENC-2026-88421",
    patient: "Maria Santos",
    mrn: "MRN-100482",
    visitType: "OPD",
    service: "99214 — Office visit, est. patient",
    qty: 1,
    unitPrice: 185.0,
    status: "Posted" as const,
    suggestedFrom: "CPOE",
  },
  {
    id: "chg-002",
    encounterId: "ENC-2026-88421",
    patient: "Maria Santos",
    mrn: "MRN-100482",
    visitType: "OPD",
    service: "80053 — Comprehensive metabolic panel",
    qty: 1,
    unitPrice: 62.0,
    status: "Posted" as const,
    suggestedFrom: "Order",
  },
  {
    id: "chg-003",
    encounterId: "ENC-2026-88102",
    patient: "James Okonkwo",
    mrn: "MRN-100501",
    visitType: "ER",
    service: "99285 — ED visit, high severity",
    qty: 1,
    unitPrice: 420.0,
    status: "Pending" as const,
    suggestedFrom: "Documentation",
  },
  {
    id: "chg-004",
    encounterId: "ENC-2026-87933",
    patient: "Elena Vasquez",
    mrn: "MRN-100388",
    visitType: "IPD",
    service: "73630 — X-ray exam, foot",
    qty: 1,
    unitPrice: 178.5,
    status: "Posted" as const,
    suggestedFrom: "Order",
  },
  {
    id: "chg-005",
    encounterId: "ENC-2026-87933",
    patient: "Elena Vasquez",
    mrn: "MRN-100388",
    visitType: "IPD",
    service: "Room & board — Med/Surg, per diem",
    qty: 2,
    unitPrice: 1850.0,
    status: "Posted" as const,
    suggestedFrom: "ADT",
  },
  {
    id: "chg-006",
    encounterId: "ENC-2026-88501",
    patient: "Robert Chen",
    mrn: "MRN-100612",
    visitType: "OPD",
    service: "99213 — Office visit, est. patient",
    qty: 1,
    unitPrice: 96.0,
    status: "Posted" as const,
    suggestedFrom: "CPOE",
  },
] as const

export const sampleInvoices = [
  {
    id: "inv-10492",
    patient: "Maria Santos",
    mrn: "MRN-100482",
    encounterId: "ENC-2026-88421",
    issued: "2026-04-02",
    total: 247.0,
    balance: 0,
    status: "Paid" as const,
  },
  {
    id: "inv-10493",
    patient: "Elena Vasquez",
    mrn: "MRN-100388",
    encounterId: "ENC-2026-87933",
    issued: "2026-04-05",
    total: 3878.5,
    balance: 1200.0,
    status: "Partial" as const,
  },
  {
    id: "inv-10494",
    patient: "James Okonkwo",
    mrn: "MRN-100501",
    encounterId: "ENC-2026-88102",
    issued: "2026-04-07",
    total: 420.0,
    balance: 320.0,
    status: "Partial" as const,
  },
  {
    id: "inv-10495",
    patient: "Robert Chen",
    mrn: "MRN-100612",
    encounterId: "ENC-2026-88501",
    issued: "2026-04-08",
    total: 96.0,
    balance: 96.0,
    status: "Draft" as const,
  },
] as const

export const samplePayments = [
  {
    id: "pay-7721",
    date: "2026-04-03",
    patient: "Maria Santos",
    mrn: "MRN-100482",
    amount: 247.0,
    method: "Card",
    invoiceId: "inv-10492",
    receiptId: "RCPT-2026-033891",
    status: "Posted" as const,
  },
  {
    id: "pay-7722",
    date: "2026-04-06",
    patient: "Elena Vasquez",
    mrn: "MRN-100388",
    amount: 2678.5,
    method: "Insurance ERA",
    invoiceId: "inv-10493",
    receiptId: "RCPT-2026-034002",
    status: "Posted" as const,
  },
  {
    id: "pay-7723",
    date: "2026-04-08",
    patient: "Community Health Fund",
    mrn: "—",
    amount: 500.0,
    method: "Charity check",
    invoiceId: "inv-10493",
    receiptId: "RCPT-2026-034118",
    status: "Posted" as const,
  },
  {
    id: "pay-7724",
    date: "2026-04-08",
    patient: "James Okonkwo",
    mrn: "MRN-100501",
    amount: 100.0,
    method: "Cash",
    invoiceId: "inv-10494",
    receiptId: "RCPT-2026-034120",
    status: "Pending deposit" as const,
  },
] as const

export const sampleAccountsReceivable = [
  {
    patient: "Elena Vasquez",
    mrn: "MRN-100388",
    current: 1200.0,
    days30: 0,
    days60: 0,
    days90: 0,
    lastPayment: "2026-04-06",
    financialClass: "Commercial",
    automatedReminders: "On" as const,
  },
  {
    patient: "James Okonkwo",
    mrn: "MRN-100501",
    current: 320.0,
    days30: 100.0,
    days60: 0,
    days90: 0,
    lastPayment: "2026-04-08",
    financialClass: "Self-pay",
    automatedReminders: "On" as const,
  },
  {
    patient: "Robert Chen",
    mrn: "MRN-100612",
    current: 96.0,
    days30: 0,
    days60: 0,
    days90: 0,
    lastPayment: "—",
    financialClass: "Self-pay",
    automatedReminders: "On" as const,
  },
  {
    patient: "Northwind Employers Plan",
    mrn: "Acct-GRP-12",
    current: 0,
    days30: 18400.0,
    days60: 2200.0,
    days90: 450.0,
    lastPayment: "2026-03-22",
    financialClass: "Payer",
    automatedReminders: "On" as const,
  },
  {
    patient: "Taylor Brooks",
    mrn: "MRN-100701",
    current: 2150.0,
    days30: 0,
    days60: 0,
    days90: 0,
    lastPayment: "—",
    financialClass: "Bankruptcy — manual review",
    automatedReminders: "Halted" as const,
  },
] as const

/** Patient portal: sample statements (TOR integration — patients view/pay bills). */
export const samplePatientPortalInvoices = sampleInvoices.filter(
  (inv) => inv.mrn === "MRN-100501"
)

export const samplePatientPortalLineItems = sampleCharges.filter(
  (c) => c.encounterId === "ENC-2026-88102"
)

export function totalOpenReceivables() {
  return sampleAccountsReceivable.reduce(
    (s, r) => s + r.current + r.days30 + r.days60 + r.days90,
    0
  )
}

/** TOR KPIs only (Billing Starter RCM). */
export const sampleDashboardKpis = {
  daysInAR: 38,
  chargeCaptureRate: 0.94,
  paymentCollectionRate: 0.89,
  openReceivables: totalOpenReceivables(),
} as const

export type SampleCharge = (typeof sampleCharges)[number]

export function chargesForEncounter(encounterId: string) {
  return sampleCharges.filter((c) => c.encounterId === encounterId)
}

export function subtotalForEncounter(encounterId: string) {
  return chargesForEncounter(encounterId).reduce(
    (s, c) => s + c.qty * c.unitPrice,
    0
  )
}

export type PaymentRowStatus =
  | "Posted"
  | "Pending deposit"
  | "Voided"
  | "Reversed"

export type BillerPaymentRow = {
  id: string
  date: string
  patient: string
  mrn: string
  amount: number
  method: string
  invoiceId: string
  receiptId: string
  status: PaymentRowStatus
}

export function cloneSamplePayments(): BillerPaymentRow[] {
  return samplePayments.map((p) => ({
    ...p,
    status: p.status as PaymentRowStatus,
  }))
}

let demoReceiptSeq = 900
export function nextDemoReceiptId() {
  demoReceiptSeq += 1
  return `RCPT-2026-DEMO-${String(demoReceiptSeq).padStart(4, "0")}`
}

let demoPaySeq = 8000
export function nextDemoPaymentId() {
  demoPaySeq += 1
  return `pay-demo-${demoPaySeq}`
}
