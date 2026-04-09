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
  IconSitemap,
  IconTool,
  IconListNumbers,
  IconFileDescription,
  IconBabyCarriage,
  IconReportMedical,
  IconHeadset,
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
      title: "IT Service Requests",
      url: "/admin/it-requests",
      icon: IconTool,
    },
    {
      title: "Audit Logs & Reports",
      url: "/admin/audit-logs",
      icon: IconShieldCheck,
    },
    {
      title: "System Configuration",
      url: "/admin/system-config",
      icon: IconSettings,
    },
    {
      title: "Department Management",
      url: "/admin/departments",
      icon: IconSitemap,
    },
    {
      title: "Facility Management",
      url: "/admin/facilities",
      icon: IconBuildingHospital,
    },
  ],
  [UserRole.SCHEDULER]: [
    {
      title: "Dashboard",
      url: "/scheduler",
      icon: IconDashboard,
    },
    {
      title: "Appointment Management",
      url: "/scheduler/appointments",
      icon: IconClipboard,
    },
    {
      title: "Schedule (Calendar)",
      url: "/scheduler/schedule",
      icon: IconCalendar,
    },
    {
      title: "Provider Schedules",
      url: "/scheduler/providers",
      icon: IconStethoscope,
    },
    {
      title: "Queue Management",
      url: "/scheduler/queue",
      icon: IconListNumbers,
    },
    {
      title: "Reports",
      url: "/scheduler/reports",
      icon: IconReport,
    },
    {
      title: "IT Support",
      url: "/it-support",
      icon: IconHeadset,
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
      title: "Patient Search & Records",
      url: "/registrar/patients",
      icon: IconSearch,
    },
    {
      title: "Document Issuance",
      url: "/registrar/documents",
      icon: IconFileDescription,
    },
    {
      title: "COLB Processing",
      url: "/registrar/colb",
      icon: IconBabyCarriage,
    },
    {
      title: "PhilHealth Processing",
      url: "/registrar/philhealth",
      icon: IconCurrencyDollar,
    },
    {
      title: "Appointments",
      url: "/registrar/appointments",
      icon: IconFileCheck,
    },
    {
      title: "Bed Management",
      url: "/registrar/beds",
      icon: IconBed,
    },
    {
      title: "IT Support",
      url: "/it-support",
      icon: IconHeadset,
    },
  ],
  [UserRole.NURSE]: [
    {
      title: "Dashboard",
      url: "/nurse",
      icon: IconDashboard,
    },
    {
      title: "Patient Admission",
      url: "/nurse/admission",
      icon: IconBuildingHospital,
    },
    {
      title: "My Patients",
      url: "/nurse/patients",
      icon: IconUsers,
    },
    {
      title: "Clinical Documentation",
      url: "/nurse/clinical-docs",
      icon: IconClipboard,
    },
    {
      title: "Vital Signs",
      url: "/nurse/vitals",
      icon: IconHeartbeat,
    },
    {
      title: "Medication Administration",
      url: "/nurse/medications",
      icon: IconPill,
    },
    {
      title: "Discharge Management",
      url: "/nurse/discharge",
      icon: IconFileCheck,
    },
    {
      title: "Specialized Care",
      url: "/nurse/specialized-care",
      icon: IconMedicalCross,
    },
    {
      title: "Reports & Endorsement",
      url: "/nurse/reports",
      icon: IconReportMedical,
    },
    {
      title: "Triage Assessment",
      url: "/nurse/triage",
      icon: IconStethoscope,
    },
    {
      title: "IT Support",
      url: "/it-support",
      icon: IconHeadset,
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
    {
      title: "IT Support",
      url: "/it-support",
      icon: IconHeadset,
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
    {
      title: "IT Support",
      url: "/it-support",
      icon: IconHeadset,
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
    {
      title: "IT Support",
      url: "/it-support",
      icon: IconHeadset,
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
    {
      title: "IT Support",
      url: "/it-support",
      icon: IconHeadset,
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
    {
      title: "IT Support",
      url: "/it-support",
      icon: IconHeadset,
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
    {
      title: "IT Support",
      url: "/it-support",
      icon: IconHeadset,
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
    {
      title: "IT Support",
      url: "/it-support",
      icon: IconHeadset,
    },
  ],
}

export function getSidebarConfig(role: UserRole): NavItem[] {
  return SIDEBAR_CONFIG[role] || []
}
