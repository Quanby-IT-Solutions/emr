import type { NextRequest } from 'next/server'
import { UserRole } from '@/src/generated/client/enums'
import { getSessionUser, readSessionCookie } from '@/lib/auth/session'
import type { AuthUser } from '@/lib/auth/session'
import { UnauthorizedError, ForbiddenError } from '@/lib/api/errors'

export async function requireUser(req: NextRequest): Promise<AuthUser> {
  const sessionId = readSessionCookie(req)
  if (!sessionId) throw new UnauthorizedError('Authentication required')
  const user = await getSessionUser(sessionId)
  if (!user) throw new UnauthorizedError('Session expired or invalid')
  return user
}

export async function requireRole(req: NextRequest, allowed: UserRole | UserRole[]): Promise<AuthUser> {
  const user = await requireUser(req)
  const roles = Array.isArray(allowed) ? allowed : [allowed]
  if (!roles.includes(user.role)) throw new ForbiddenError('Insufficient permissions')
  return user
}
