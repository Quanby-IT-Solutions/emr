/**
 * TOR — Billing (Starter RCM) copy and demo helpers (no backend).
 * Section 2 module: purpose, workflows, validations, integrations, KPIs.
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

export const TOR_BILLING_INTEGRATIONS = [
  "ADT — encounter is the container for charges.",
  "CPOE — orders can auto-generate or suggest charge lines.",
  "Patient portal — patients view/pay bills (separate patient experience).",
] as const

export const TOR_BILLING_KPIS = [
  "Days in accounts receivable",
  "Charge capture rate",
  "Payment collection rate",
] as const

/** Demo: active price list scope (TOR: price lists are scoped). */
export const demoActivePriceList = {
  name: "Facility professional fee schedule FY2026",
  scope: "Main campus · OPD / ER / IPD · Effective 2026-01-01",
  note: "Client-side preview only — no pricing engine.",
} as const
