/**
 * Aggregates from sample audit logs for the Auditor / Privacy Officer "Reports" UI.
 * TOR: immutable audit trail; break-glass triggers enhanced auditing.
 */

import { sampleAuditLogs } from "@/lib/auditor/sample-audit-logs"

export function countByActionType() {
  const m = new Map<string, number>()
  for (const row of sampleAuditLogs) {
    m.set(row.actionType, (m.get(row.actionType) ?? 0) + 1)
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1])
}

export function breakGlassEvents() {
  return sampleAuditLogs.filter((r) => r.actionType === "BREAK_GLASS")
}

export function patientChartReads() {
  return sampleAuditLogs.filter(
    (r) => r.actionType === "READ" && r.entityType === "PATIENT_CHART"
  )
}

export function loginEvents() {
  return sampleAuditLogs.filter((r) => r.actionType === "LOGIN")
}

export function privilegedOrSecurityEvents() {
  return sampleAuditLogs.filter(
    (r) =>
      r.entityType === "USER_ROLE" ||
      r.entityType === "AUDIT_LOG_QUERY" ||
      r.actionType === "BREAK_GLASS"
  )
}

/** Demo CSV of action-type counts for export button. */
export function actionSummaryCsv(): string {
  const rows = countByActionType()
  const lines = ["action_type,count", ...rows.map(([k, v]) => `${k},${v}`)]
  return lines.join("\n")
}
