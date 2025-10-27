"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"

export default function BreakGlassPage() {
  return (
    <ProtectedRoute requiredRole={UserRole.CLINICIAN}>
      <DashboardLayout role={UserRole.CLINICIAN}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Break-Glass Access</h1>
            <p className="text-muted-foreground">
              Emergency access to patient records
            </p>
          </div>
          <div className="px-4 lg:px-6">
            <div>Sample page</div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
