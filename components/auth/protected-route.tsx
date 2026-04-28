"use client"

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth/context'
import { UserRole, hasRole } from '@/lib/auth/roles'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: UserRole
  fallbackPath?: string
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallbackPath = '/login',
}: ProtectedRouteProps) {
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
}