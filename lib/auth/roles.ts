// import { UserRole } from '@/lib/generated/prisma/enums'
// import { UserRole } from '@prisma/client'

import { UserRole } from "@/src/generated/client/enums"

export { UserRole }

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.SYSTEM_ADMIN]: 100,
  [UserRole.AUDITOR]: 90,
  [UserRole.CLINICIAN]: 80,
  [UserRole.PHARMACIST]: 70,
  [UserRole.NURSE]: 60,
  [UserRole.LAB_TECH]: 50,
  [UserRole.HIM_CODER]: 40,
  [UserRole.BILLER]: 30,
  [UserRole.REGISTRAR]: 20,
  [UserRole.SCHEDULER]: 10,
  [UserRole.PATIENT]: 0,
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SYSTEM_ADMIN]: 'System Administrator',
  [UserRole.AUDITOR]: 'Auditor / Privacy Officer',
  [UserRole.CLINICIAN]: 'Clinician',
  [UserRole.PHARMACIST]: 'Pharmacist',
  [UserRole.NURSE]: 'Nurse',
  [UserRole.LAB_TECH]: 'Lab Technician',
  [UserRole.HIM_CODER]: 'HIM Coder',
  [UserRole.BILLER]: 'Biller',
  [UserRole.REGISTRAR]: 'Registrar',
  [UserRole.SCHEDULER]: 'Scheduler',
  [UserRole.PATIENT]: 'Patient',
}

export const ROLE_DASHBOARD_ROUTES: Record<UserRole, string> = {
  [UserRole.SYSTEM_ADMIN]: '/admin',
  [UserRole.AUDITOR]: '/auditor',
  [UserRole.CLINICIAN]: '/clinician',
  [UserRole.PHARMACIST]: '/pharmacist',
  [UserRole.NURSE]: '/nurse',
  [UserRole.LAB_TECH]: '/lab-tech',
  [UserRole.HIM_CODER]: '/him-coder',
  [UserRole.BILLER]: '/biller',
  [UserRole.REGISTRAR]: '/registrar',
  [UserRole.SCHEDULER]: '/scheduler',
  [UserRole.PATIENT]: '/patient',
}

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

export function canAccessAdmin(userRole: UserRole): boolean {
  return hasRole(userRole, UserRole.AUDITOR)
}

export function canAccessClinical(userRole: UserRole): boolean {
  return hasRole(userRole, UserRole.CLINICIAN)
}

export function canAccessPharmacy(userRole: UserRole): boolean {
  return hasRole(userRole, UserRole.PHARMACIST)
}

export function canAccessLab(userRole: UserRole): boolean {
  return hasRole(userRole, UserRole.LAB_TECH)
}

export function canAccessBilling(userRole: UserRole): boolean {
  return hasRole(userRole, UserRole.BILLER)
}