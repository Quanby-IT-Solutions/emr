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
    await requireRole(req, [UserRole.REGISTRAR, UserRole.SCHEDULER, UserRole.SYSTEM_ADMIN])
    const { id } = await params
    const appointment = await apptsService.noShow(id)
    return ok(appointment)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[POST /api/appointments/[id]/no-show]', err)
    return error('INTERNAL_ERROR', 'Failed to mark no-show', { status: 500 })
  }
}
