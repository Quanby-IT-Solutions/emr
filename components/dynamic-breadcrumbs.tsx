"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function DynamicBreadcrumbs() {
  const pathname = usePathname()
  const paths = pathname.split("/").filter(Boolean)

  // Map route segments to readable names
  const getReadableName = (segment: string): string => {
    const nameMap: Record<string, string> = {
      admin: "Admin",
      scheduler: "Scheduler",
      registrar: "Registrar",
      nurse: "Nurse",
      clinician: "Clinician",
      pharmacist: "Pharmacist",
      "lab-tech": "Lab Tech",
      "him-coder": "HIM Coder",
      biller: "Biller",
      patient: "Patient",
      auditor: "Auditor / Privacy",
      users: "Users",
      facilities: "Facilities",
      "system-config": "System Configuration",
      "audit-logs": "Audit Logs",
      reports: "Reports",
      schedule: "Schedule Appointment",
      appointments: "Appointments",
      providers: "Provider Schedules",
      patients: "Patients",
      registration: "Patient Registration",
      "check-in": "Check-In",
      beds: "Bed Management",
      admissions: "Admissions",
      discharge: "Discharge Processing",
      medications: "Medication Administration",
      vitals: "Vital Signs",
      assessment: "Patient Assessment",
      transfer: "Patient Transfer",
      orders: "Orders",
      chart: "Patient Chart",
      documentation: "Clinical Documentation",
      referrals: "Referrals",
      "break-glass": "Break-Glass Access",
      notifications: "Notifications",
      verification: "Order Verification",
      approved: "Approved Orders",
      flagged: "Flagged Orders",
      inventory: "Inventory",
      queue: "Order Queue",
      processing: "Test Processing",
      completed: "Completed Orders",
      encounters: "Discharged Encounters",
      "chart-review": "Chart Review",
      coding: "Coding",
      discrepancies: "Flag Discrepancies",
      finalize: "Finalize Encounter",
      charges: "Charges",
      ready: "Ready for Billing",
      generate: "Compile invoice",
      invoices: "Invoices",
      payments: "Billing",
      accounts: "Accounts Receivable",
      profile: "My profile",
      history: "Health record",
      results: "Results",
      records: "Request records",
      messages: "Messages",
      billing: "Billing",
      logs: "Audit Logs",
      activity: "User Activity",
    }

    return nameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
  }

  // Build breadcrumb path
  const buildPath = (index: number): string => {
    return "/" + paths.slice(0, index + 1).join("/")
  }

  if (paths.length === 0) {
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {paths.map((segment, index) => {
          const isLast = index === paths.length - 1
          const href = buildPath(index)
          const name = getReadableName(segment)

          return (
            <React.Fragment key={segment + index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
