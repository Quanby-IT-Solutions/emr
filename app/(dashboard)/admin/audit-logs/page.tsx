import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"
import { AuditLogExplorer } from "@/components/audit/audit-log-explorer"

export default function AdminAuditLogsPage() {
  return (
    <ProtectedRoute requiredRole={UserRole.SYSTEM_ADMIN}>
      <DashboardLayout role={UserRole.SYSTEM_ADMIN}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Audit logs</h1>
            <p className="text-muted-foreground max-w-3xl">
              System-wide audit trail (sample data for UI preview; backend TBD).
            </p>
          </div>
          <AuditLogExplorer />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
