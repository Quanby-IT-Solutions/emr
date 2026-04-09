"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { UserRole } from "@/lib/auth/roles"

export default function RequestRecordsPage() {
  return (
    <ProtectedRoute requiredRole={UserRole.PATIENT}>
      <DashboardLayout role={UserRole.PATIENT}>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <h1 className="text-2xl font-bold">Request records</h1>
          </div>
          <div className="min-h-[50vh] px-4 lg:px-6" aria-hidden />
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
