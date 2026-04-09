"use client"

import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"

export default function ActivityPage() {
  return (
    <ProtectedRoute requiredRole={UserRole.AUDITOR}>
      <DashboardLayout role={UserRole.AUDITOR}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">User activity</h1>
            <p className="text-muted-foreground max-w-2xl">
              Activity summaries for this role can be added as requirements are finalized.
              For detailed events, use{" "}
              <Link
                href="/auditor/logs"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Audit logs
              </Link>
              .
            </p>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
