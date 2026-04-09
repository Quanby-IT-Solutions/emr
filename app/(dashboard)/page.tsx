"use client"

import { useAuth } from '@/lib/auth/context'
import { ROLE_DASHBOARD_ROUTES } from '@/lib/auth/roles'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function DashboardRedirect() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      const dashboardRoute = ROLE_DASHBOARD_ROUTES[user.role as keyof typeof ROLE_DASHBOARD_ROUTES] || '/dashboard/admin'
      router.replace(dashboardRoute)
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return null
}
