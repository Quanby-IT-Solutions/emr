import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client/enums'
import { UnauthorizedError, ForbiddenError } from '@/lib/api/errors'
import { getActiveSessions, getAccessLog } from '@/lib/services/break-glass'

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(req, [UserRole.CLINICIAN])
    const [activeSessions, log] = await Promise.all([
      getActiveSessions(user),
      getAccessLog(user),
    ])
    return ok({ activeSessions, log })
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[GET /api/break-glass/sessions]', err)
    return error('INTERNAL_ERROR', 'Failed to fetch sessions', { status: 500 })
  }
}
