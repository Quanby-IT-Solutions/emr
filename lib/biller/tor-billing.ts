/**
 * Billing (starter RCM) UI copy and demo helpers — not persisted.
 * Purpose, workflows, validations, KPI labels.
 */

export const TOR_BILLING_PURPOSE =
  "Minimal financial backbone: capture charges, create invoices, record payments, and produce receipts for reconciliation."

export const TOR_BILLING_CORE_DATA = "Charge items, invoices, payments."

export const TOR_BILLING_WORKFLOWS = [
  "Add charges",
  "Compile invoice",
  "Accept payments",
  "Generate receipt",
  "Reconcile",
] as const

export const TOR_BILLING_VALIDATIONS = [
  "Price lists are scoped to context (facility, visit type, date).",
  "Posted payments cannot be hard-deleted — void or reverse only.",
  "Tax handling is optional and applied per facility rules.",
] as const

export const TOR_BILLING_KPIS = [
  "Days in accounts receivable",
  "Charge capture rate",
  "Payment collection rate",
] as const

/** Demo: active price list scope (price lists are contextual). */
export const demoActivePriceList = {
  name: "Facility professional fee schedule FY2026",
  scope: "Main campus · OPD / ER / IPD · Effective 2026-01-01",
  note: "Preview only—no live pricing engine.",
} as const
