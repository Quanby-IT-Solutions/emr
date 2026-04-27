import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client/enums'
import { UnauthorizedError, ForbiddenError } from '@/lib/api/errors'
import * as apptsService from '@/lib/services/appointments'

const ALLOWED_READ = [
  UserRole.REGISTRAR,
  UserRole.SCHEDULER,
  UserRole.CLINICIAN,
  UserRole.NURSE,
  UserRole.SYSTEM_ADMIN,
  UserRole.AUDITOR,
]

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(req, ALLOWED_READ)
    const { id } = await params
    const body = await req.json()
    const { action, status } = body

    let result
    if (action === 'cancel' || status === 'CANCELLED') {
      result = await apptsService.cancel(id)
    } else if (action === 'confirm' || status === 'CONFIRMED') {
      result = await apptsService.confirm(id)
    } else if (action === 'no-show' || status === 'NO_SHOW') {
      result = await apptsService.noShow(id)
    } else {
      return error('VALIDATION_ERROR', 'Invalid action or status', { status: 400 })
    }

    return ok(result)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[PATCH /api/appointments/[id]]', err)
    return error('INTERNAL_ERROR', 'Failed to update appointment', { status: 500 })
  }
}
