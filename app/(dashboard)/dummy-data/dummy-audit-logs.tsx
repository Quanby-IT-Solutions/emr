export type AuditActionType = "CREATE" | "READ" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "EXPORT" | "PRINT"
export type AuditModule = "Scheduling" | "Registration" | "Nursing" | "Pharmacy" | "Laboratory" | "System" | "User Management" | "Billing"

export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  userRole: string
  action: AuditActionType
  module: AuditModule
  description: string
  ipAddress: string
  resourceType: string
  resourceId: string | null
  isSecurityEvent: boolean
}

export const dummyAuditLogs: AuditLogEntry[] = [
  {
    id: "AL-001", timestamp: "2026-04-09T08:15:32", userId: "U001", userName: "Dr. Jose Rivera",
    userRole: "Clinician", action: "READ", module: "Nursing", description: "Viewed patient record for Maria Garcia (P002)",
    ipAddress: "192.168.1.45", resourceType: "Patient", resourceId: "P002", isSecurityEvent: false,
  },
  {
    id: "AL-002", timestamp: "2026-04-09T08:12:10", userId: "U002", userName: "Ana Cruz",
    userRole: "Registrar", action: "CREATE", module: "Registration", description: "Registered new patient: Roberto Aquino",
    ipAddress: "192.168.1.22", resourceType: "Patient", resourceId: "P045", isSecurityEvent: false,
  },
  {
    id: "AL-003", timestamp: "2026-04-09T08:05:00", userId: "U003", userName: "unknown_user",
    userRole: "Unknown", action: "LOGIN", module: "System", description: "Failed login attempt - invalid credentials (3rd attempt)",
    ipAddress: "203.45.67.89", resourceType: "Auth", resourceId: null, isSecurityEvent: true,
  },
  {
    id: "AL-004", timestamp: "2026-04-09T07:58:44", userId: "U004", userName: "Nurse Joy Reyes",
    userRole: "Nurse", action: "UPDATE", module: "Nursing", description: "Updated vital signs for patient John Smith (P001)",
    ipAddress: "192.168.1.67", resourceType: "VitalSigns", resourceId: "VS-1234", isSecurityEvent: false,
  },
  {
    id: "AL-005", timestamp: "2026-04-09T07:45:22", userId: "U005", userName: "Admin User",
    userRole: "System Admin", action: "UPDATE", module: "User Management", description: "Deactivated account for resigned employee: Mark Gonzales",
    ipAddress: "192.168.1.10", resourceType: "User", resourceId: "U089", isSecurityEvent: true,
  },
  {
    id: "AL-006", timestamp: "2026-04-09T07:30:15", userId: "U006", userName: "RPh. Grace Tan",
    userRole: "Pharmacist", action: "UPDATE", module: "Pharmacy", description: "Verified medication order #ORD-4567 for patient David Anderson (P003)",
    ipAddress: "192.168.1.88", resourceType: "Order", resourceId: "ORD-4567", isSecurityEvent: false,
  },
  {
    id: "AL-007", timestamp: "2026-04-09T07:15:00", userId: "U007", userName: "system",
    userRole: "System", action: "LOGIN", module: "System", description: "Account locked after 5 failed login attempts: user carlos.mendez",
    ipAddress: "192.168.2.15", resourceType: "Auth", resourceId: null, isSecurityEvent: true,
  },
  {
    id: "AL-008", timestamp: "2026-04-09T07:00:00", userId: "U005", userName: "Admin User",
    userRole: "System Admin", action: "EXPORT", module: "System", description: "Exported monthly system report for March 2026",
    ipAddress: "192.168.1.10", resourceType: "Report", resourceId: "RPT-MAR-2026", isSecurityEvent: false,
  },
  {
    id: "AL-009", timestamp: "2026-04-08T22:45:30", userId: "U008", userName: "Scheduler Ana",
    userRole: "Scheduler", action: "CREATE", module: "Scheduling", description: "Created appointment for patient Sophia Nguyen (P004) with Dr. Lee",
    ipAddress: "192.168.1.33", resourceType: "Appointment", resourceId: "APT-9012", isSecurityEvent: false,
  },
  {
    id: "AL-010", timestamp: "2026-04-08T21:30:00", userId: "U009", userName: "unknown_attacker",
    userRole: "Unknown", action: "LOGIN", module: "System", description: "Unauthorized access attempt from external IP - blocked by firewall",
    ipAddress: "45.33.128.77", resourceType: "Auth", resourceId: null, isSecurityEvent: true,
  },
  {
    id: "AL-011", timestamp: "2026-04-08T18:00:22", userId: "U004", userName: "Nurse Joy Reyes",
    userRole: "Nurse", action: "CREATE", module: "Nursing", description: "Completed shift endorsement for Ward 3B evening shift",
    ipAddress: "192.168.1.67", resourceType: "ShiftReport", resourceId: "SR-0456", isSecurityEvent: false,
  },
  {
    id: "AL-012", timestamp: "2026-04-08T16:30:10", userId: "U010", userName: "Lab Tech Maria",
    userRole: "Lab Tech", action: "UPDATE", module: "Laboratory", description: "Uploaded lab results for patient Emily Wong (P006) - CBC & Blood Chemistry",
    ipAddress: "192.168.1.55", resourceType: "LabResult", resourceId: "LR-7890", isSecurityEvent: false,
  },
  {
    id: "AL-013", timestamp: "2026-04-08T14:20:05", userId: "U002", userName: "Ana Cruz",
    userRole: "Registrar", action: "DELETE", module: "Registration", description: "Merged duplicate patient records: P045 into P002",
    ipAddress: "192.168.1.22", resourceType: "Patient", resourceId: "P045", isSecurityEvent: true,
  },
  {
    id: "AL-014", timestamp: "2026-04-08T12:00:00", userId: "U005", userName: "Admin User",
    userRole: "System Admin", action: "CREATE", module: "User Management", description: "Created new user account for Dr. Elena Marcos (Resident Physician)",
    ipAddress: "192.168.1.10", resourceType: "User", resourceId: "U091", isSecurityEvent: false,
  },
  {
    id: "AL-015", timestamp: "2026-04-08T10:15:33", userId: "U011", userName: "Biller Rose",
    userRole: "Biller", action: "CREATE", module: "Billing", description: "Generated invoice #INV-2026-0334 for patient P003 - Php 45,320.00",
    ipAddress: "192.168.1.77", resourceType: "Invoice", resourceId: "INV-2026-0334", isSecurityEvent: false,
  },
]
