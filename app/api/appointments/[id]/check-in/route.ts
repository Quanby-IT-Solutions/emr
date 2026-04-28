import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client/enums'
import { UnauthorizedError, ForbiddenError } from '@/lib/api/errors'
import * as apptsService from '@/lib/services/appointments'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(req, [UserRole.REGISTRAR, UserRole.NURSE, UserRole.SYSTEM_ADMIN])
    const { id } = await params
    const result = await apptsService.checkIn(id, { requesterId: user.userId })
    return ok(result)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[POST /api/appointments/[id]/check-in]', err)
    return error('INTERNAL_ERROR', 'Failed to check in appointment', { status: 500 })
  }
}
