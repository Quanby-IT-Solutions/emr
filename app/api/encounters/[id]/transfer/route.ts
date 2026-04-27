import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client/enums'
import { UnauthorizedError, ForbiddenError } from '@/lib/api/errors'
import * as encountersService from '@/lib/services/encounters'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(req, [UserRole.REGISTRAR, UserRole.NURSE, UserRole.SYSTEM_ADMIN])
    const { id } = await params
    const body = await req.json()
    const { toLocationId, fromLocationId, transportStaffId } = body
    if (!toLocationId) return error('VALIDATION_ERROR', 'toLocationId is required', { status: 400 })
    const result = await encountersService.transfer(id, toLocationId, {
      fromLocationId,
      transportStaffId,
      requesterId: user.userId,
    })
    return ok(result)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[POST /api/encounters/[id]/transfer]', err)
    return error('INTERNAL_ERROR', 'Failed to transfer encounter', { status: 500 })
  }
}
