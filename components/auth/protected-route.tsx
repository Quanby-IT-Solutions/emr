"use client"

import { useAuth } from '@/lib/auth/context'
import { UserRole } from '@/lib/generated/prisma/enums'
import { hasRole } from '@/lib/auth/roles'
import { useRouter } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: UserRole
  fallbackPath?: string
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallbackPath = '/login'
}: ProtectedRouteProps) {
  // TEMPORARY: Bypass authentication for testing
  return <>{children}</>

  /* COMMENTED OUT FOR TESTING
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(fallbackPath)
        return
      }

      if (requiredRole && !hasRole(user.role, requiredRole)) {
        router.push('/unauthorized')
        return
      }
    }
  }, [user, isLoading, requiredRole, router, fallbackPath])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (requiredRole && !hasRole(user.role, requiredRole)) {
    return null
  }

  return <>{children}</>
  */
}