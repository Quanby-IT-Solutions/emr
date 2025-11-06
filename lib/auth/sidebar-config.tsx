import {
  IconCalendar,
  IconClipboard,
  IconDashboard,
  IconFileText,
  IconFlask,
  IconHeartbeat,
  IconPill,
  IconSettings,
  IconStethoscope,
  IconUser,
  IconUsers,
  IconCash,
  IconBuildingHospital,
  IconReport,
  IconShieldCheck,
  IconBed,
  IconAlertCircle,
  IconMedicalCross,
  IconSearch,
  IconFileCheck,
  IconCurrencyDollar,
  IconHistory,
  IconMessage,
} from "@tabler/icons-react"
import { UserRole } from "./roles"

export interface NavItem {
  title: string
  url: string
  icon?: any
  items?: NavItem[]
}

export const SIDEBAR_CONFIG: Record<UserRole, NavItem[]> = {
  [UserRole.SYSTEM_ADMIN]: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: IconDashboard,
    },
    {
      title: "User Management",
      url: "/admin/users",
      icon: IconUsers,
    },
    {
      title: "Facility Management",
      url: "/admin/facilities",
      icon: IconBuildingHospital,
    },
    {
      title: "System Configuration",
      url: "/admin/system-config",
      icon: IconSettings,
    },
    {
      title: "Audit Logs",
      url: "/admin/audit-logs",
      icon: IconShieldCheck,
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: IconReport,
    },
  ],
  [UserRole.SCHEDULER]: [
    {
      title: "Dashboard",
      url: "/scheduler",
      icon: IconDashboard,
    },
    {
      title: "Schedule Appointment",
      url: "/scheduler/schedule",
      icon: IconCalendar,
    },
    {
      title: "Appointments",
      url: "/scheduler/appointments",
      icon: IconClipboard,
    },
    {
      title: "Provider Schedules",
      url: "/scheduler/providers",
      icon: IconStethoscope,
    },
    {
      title: "Patients",
      url: "/scheduler/patients",
      icon: IconUser,
    },
  ],
  [UserRole.REGISTRAR]: [
    {
      title: "Dashboard",
      url: "/registrar",
      icon: IconDashboard,
    },
    {
      title: "Patient Registration",
      url: "/registrar/registration",
      icon: IconUser,
    },
    {
      title: "Appointments",
      url: "/registrar/appointments",
      icon: IconFileCheck,
    },
    {
      title: "Patient Search",
      url: "/registrar/patients",
      icon: IconSearch,
    },
    {
      title: "Bed Management",
      url: "/registrar/beds",
      icon: IconBed,
    },
    {
      title: "Admissions",
      url: "/registrar/admissions",
      icon: IconBuildingHospital,
    },
    {
      title: "Discharge Processing",
      url: "/registrar/discharge",
      icon: IconFileText,
    },
  ],
  [UserRole.NURSE]: [
    {
      title: "Dashboard",
      url: "/nurse",
      icon: IconDashboard,
    },
    {
      title: "My Patients",
      url: "/nurse/patients",
      icon: IconUsers,
    },
    {
      title: "Medication Administration",
      url: "/nurse/medications",
      icon: IconPill,
    },
    {
      title: "Vital Signs",
      url: "/nurse/vitals",
      icon: IconHeartbeat,
    },
    {
      title: "Patient Assessment",
      url: "/nurse/assessment",
      icon: IconClipboard,
    },
    {
      title: "Patient Transfer",
      url: "/nurse/transfer",
      icon: IconBed,
    },
    {
      title: "Orders",
      url: "/nurse/orders",
      icon: IconFileText,
    },
  ],
  [UserRole.CLINICIAN]: [
    {
      title: "Dashboard",
      url: "/clinician",
      icon: IconDashboard,
    },
    {
      title: "My Patients",
      url: "/clinician/patients",
      icon: IconUsers,
    },
    {
      title: "Patient Chart",
      url: "/clinician/chart",
      icon: IconFileText,
    },
    {
      title: "Clinical Documentation",
      url: "/clinician/documentation",
      icon: IconClipboard,
    },
    {
      title: "Orders",
      url: "/clinician/orders",
      icon: IconFileCheck,
    },
    {
      title: "Admissions",
      url: "/clinician/admissions",
      icon: IconBuildingHospital,
    },
    {
      title: "Referrals",
      url: "/clinician/referrals",
      icon: IconMedicalCross,
    },
    {
      title: "Discharge",
      url: "/clinician/discharge",
      icon: IconFileText,
    },
    {
      title: "Break-Glass Access",
      url: "/clinician/break-glass",
      icon: IconAlertCircle,
    },
    {
      title: "Notifications",
      url: "/clinician/notifications",
      icon: IconMessage,
    },
  ],
  [UserRole.PHARMACIST]: [
    {
      title: "Dashboard",
      url: "/pharmacist",
      icon: IconDashboard,
    },
    {
      title: "Medication Orders",
      url: "/pharmacist/orders",
      icon: IconPill,
    },
    {
      title: "Order Verification",
      url: "/pharmacist/verification",
      icon: IconFileCheck,
    },
    {
      title: "Approved Orders",
      url: "/pharmacist/approved",
      icon: IconFileCheck,
    },
    {
      title: "Flagged Orders",
      url: "/pharmacist/flagged",
      icon: IconAlertCircle,
    },
    {
      title: "Inventory",
      url: "/pharmacist/inventory",
      icon: IconClipboard,
    },
    {
      title: "Patient Profile",
      url: "/pharmacist/patients",
      icon: IconUser,
    },
  ],
  [UserRole.LAB_TECH]: [
    {
      title: "Dashboard",
      url: "/lab-tech",
      icon: IconDashboard,
    },
    {
      title: "Order Queue",
      url: "/lab-tech/queue",
      icon: IconFlask,
    },
    {
      title: "Test Processing",
      url: "/lab-tech/processing",
      icon: IconFileText,
    },
    {
      title: "Completed Orders",
      url: "/lab-tech/completed",
      icon: IconFileCheck,
    },
    {
      title: "Patient Information",
      url: "/lab-tech/patients",
      icon: IconUser,
    },
    {
      title: "Reports",
      url: "/lab-tech/reports",
      icon: IconReport,
    },
  ],
  [UserRole.HIM_CODER]: [
    {
      title: "Dashboard",
      url: "/him-coder",
      icon: IconDashboard,
    },
    {
      title: "Discharged Encounters",
      url: "/him-coder/encounters",
      icon: IconFileText,
    },
    {
      title: "Chart Review",
      url: "/him-coder/chart-review",
      icon: IconClipboard,
    },
    {
      title: "Coding",
      url: "/him-coder/coding",
      icon: IconFileCheck,
    },
    {
      title: "Flag Discrepancies",
      url: "/him-coder/discrepancies",
      icon: IconAlertCircle,
    },
    {
      title: "Finalize Encounter",
      url: "/him-coder/finalize",
      icon: IconFileCheck,
    },
    {
      title: "Reports",
      url: "/him-coder/reports",
      icon: IconReport,
    },
  ],
  [UserRole.BILLER]: [
    {
      title: "Dashboard",
      url: "/biller",
      icon: IconDashboard,
    },
    {
      title: "Ready for Billing",
      url: "/biller/ready",
      icon: IconFileText,
    },
    {
      title: "Generate Invoice",
      url: "/biller/generate",
      icon: IconFileCheck,
    },
    {
      title: "Invoices",
      url: "/biller/invoices",
      icon: IconCurrencyDollar,
    },
    {
      title: "Payment Processing",
      url: "/biller/payments",
      icon: IconCash,
    },
    {
      title: "Accounts Receivable",
      url: "/biller/accounts",
      icon: IconCurrencyDollar,
    },
    {
      title: "Reports",
      url: "/biller/reports",
      icon: IconReport,
    },
  ],
  [UserRole.PATIENT]: [
    {
      title: "Dashboard",
      url: "/patient",
      icon: IconDashboard,
    },
    {
      title: "My Profile",
      url: "/patient/profile",
      icon: IconUser,
    },
    {
      title: "Medical History",
      url: "/patient/history",
      icon: IconHistory,
    },
    {
      title: "Appointments",
      url: "/patient/appointments",
      icon: IconCalendar,
    },
    {
      title: "Test Results",
      url: "/patient/results",
      icon: IconFlask,
    },
    {
      title: "Request Records",
      url: "/patient/records",
      icon: IconFileText,
    },
    {
      title: "Messages",
      url: "/patient/messages",
      icon: IconMessage,
    },
    {
      title: "Billing",
      url: "/patient/billing",
      icon: IconCurrencyDollar,
    },
  ],
  [UserRole.AUDITOR]: [
    {
      title: "Dashboard",
      url: "/auditor",
      icon: IconDashboard,
    },
    {
      title: "Audit Logs",
      url: "/auditor/logs",
      icon: IconShieldCheck,
    },
    {
      title: "Reports",
      url: "/auditor/reports",
      icon: IconReport,
    },
    {
      title: "User Activity",
      url: "/auditor/activity",
      icon: IconUsers,
    },
  ],
}

export function getSidebarConfig(role: UserRole): NavItem[] {
  return SIDEBAR_CONFIG[role] || []
}
