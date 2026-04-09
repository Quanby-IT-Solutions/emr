"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { AuditLogExplorer } from "@/components/audit/audit-log-explorer"

export default function AuditorLogsPage() {
  return (
    <ProtectedRoute requiredRole={UserRole.AUDITOR}>
      <DashboardLayout role={UserRole.AUDITOR}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Audit logs</h1>
            <p className="text-muted-foreground max-w-3xl">
              Search and review audit events across the system. The table below uses
              demonstration data for preview; production will read from your
              organization&apos;s audit store.
            </p>
          </div>
          <AuditLogExplorer />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
