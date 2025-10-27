"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"

export default function RegistrarPatientsPage() {
  return (
    <ProtectedRoute requiredRole={UserRole.REGISTRAR}>
      <DashboardLayout role={UserRole.REGISTRAR}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Patient Search</h1>
            <p className="text-muted-foreground">
              Search and view patient records
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
