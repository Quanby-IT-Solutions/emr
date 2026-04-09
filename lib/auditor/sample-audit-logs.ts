/**
 * Demo-only fixtures for auditor / privacy audit log UI (not persisted).
 * Replace with API + DB when backend work starts.
 */

export type SampleAuditLogRow = {
  id: string
  timestamp: string
  userId: string | null
  actionType: string
  entityType: string | null
  entityId: string | null
  details: Record<string, unknown> | null
  reasonForAccess: string | null
  ipAddress: string | null
  user: {
    username: string
    email: string
    displayName: string | null
  } | null
}

export const sampleAuditLogs: SampleAuditLogRow[] = [
  {
    id: "1",
    timestamp: "2026-04-09T14:22:01.000Z",
    userId: "usr-reg-01",
    actionType: "CREATE",
    entityType: "BED_ASSIGNMENT",
    entityId: "loc-icu-12b",
    details: {
      patientId: "pt-88421",
      encounterId: "enc-2026-88421",
      bedNumber: "12B",
      unit: "ICU",
    },
    reasonForAccess: null,
    ipAddress: "10.0.4.18",
    user: {
      username: "jsantos",
      email: "jsantos@hospital.example",
      displayName: "Jordan Santos",
    },
  },
  {
    id: "2",
    timestamp: "2026-04-09T14:05:33.000Z",
    userId: "usr-nurse-02",
    actionType: "READ",
    entityType: "PATIENT_CHART",
    entityId: "pt-88421",
    details: { section: "MAR", durationSec: 240 },
    reasonForAccess: null,
    ipAddress: "10.0.8.44",
    user: {
      username: "mlee",
      email: "mlee@hospital.example",
      displayName: "Morgan Lee, RN",
    },
  },
  {
    id: "3",
    timestamp: "2026-04-09T13:58:00.000Z",
    userId: "usr-md-03",
    actionType: "UPDATE",
    entityType: "CLINICAL_NOTE",
    entityId: "note-99102",
    details: { noteType: "PROGRESS_NOTE", fieldsChanged: ["assessment"] },
    reasonForAccess: null,
    ipAddress: "10.0.2.101",
    user: {
      username: "akim",
      email: "akim@hospital.example",
      displayName: "Alex Kim, MD",
    },
  },
  {
    id: "4",
    timestamp: "2026-04-09T13:40:12.000Z",
    userId: "usr-audit-01",
    actionType: "READ",
    entityType: "AUDIT_LOG_QUERY",
    entityId: null,
    details: { filters: { actionType: "BREAK_GLASS" }, resultCount: 3 },
    reasonForAccess: null,
    ipAddress: "10.0.1.5",
    user: {
      username: "privacy.officer",
      email: "privacy@hospital.example",
      displayName: "R. Patel, Privacy Officer",
    },
  },
  {
    id: "5",
    timestamp: "2026-04-09T12:15:00.000Z",
    userId: "usr-md-04",
    actionType: "BREAK_GLASS",
    entityType: "PATIENT_CHART",
    entityId: "pt-77001",
    details: { mrnMasked: "MRN-770**", modules: ["orders", "results"] },
    reasonForAccess:
      "Emergency department attending — unconscious patient, no ID; need allergy and problem list for resuscitation.",
    ipAddress: "10.0.3.22",
    user: {
      username: "crojas",
      email: "crojas@hospital.example",
      displayName: "Carmen Rojas, MD",
    },
  },
  {
    id: "6",
    timestamp: "2026-04-09T08:01:00.000Z",
    userId: "usr-biller-01",
    actionType: "CREATE",
    entityType: "INVOICE",
    entityId: "inv-2026-4401",
    details: { encounterId: "enc-2026-88102", lineItems: 4, total: 1240.5 },
    reasonForAccess: null,
    ipAddress: "10.0.6.10",
    user: {
      username: "tnguyen",
      email: "tnguyen@hospital.example",
      displayName: "Taylor Nguyen",
    },
  },
  {
    id: "7",
    timestamp: "2026-04-08T22:45:00.000Z",
    userId: null,
    actionType: "LOGIN",
    entityType: "SESSION",
    entityId: null,
    details: { method: "password", mfa: true },
    reasonForAccess: null,
    ipAddress: "203.0.113.88",
    user: null,
  },
  {
    id: "8",
    timestamp: "2026-04-08T18:30:00.000Z",
    userId: "usr-admin-01",
    actionType: "UPDATE",
    entityType: "USER_ROLE",
    entityId: "usr-temp-99",
    details: { from: "SCHEDULER", to: "REGISTRAR" },
    reasonForAccess: null,
    ipAddress: "10.0.1.2",
    user: {
      username: "sysadmin",
      email: "sysadmin@hospital.example",
      displayName: "System Administrator",
    },
  },
  {
    id: "9",
    timestamp: "2026-04-08T16:12:44.000Z",
    userId: "usr-him-01",
    actionType: "READ",
    entityType: "ENCOUNTER_CODING",
    entityId: "enc-2026-77012",
    details: { codingStatus: "IN_PROGRESS" },
    reasonForAccess: null,
    ipAddress: "10.0.7.30",
    user: {
      username: "bwong",
      email: "bwong@hospital.example",
      displayName: "Ben Wong, RHIA",
    },
  },
  {
    id: "10",
    timestamp: "2026-04-08T11:00:00.000Z",
    userId: "usr-pharm-01",
    actionType: "CREATE",
    entityType: "ORDER_VERIFICATION",
    entityId: "ov-55001",
    details: { orderId: "ord-88221", decision: "APPROVED" },
    reasonForAccess: null,
    ipAddress: "10.0.5.7",
    user: {
      username: "ksharma",
      email: "ksharma@hospital.example",
      displayName: "Kiran Sharma, PharmD",
    },
  },
]
