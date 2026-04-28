import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client'
import { UnauthorizedError, ForbiddenError, NotFoundError } from '@/lib/api/errors'
import { updateDischargeChecklist } from '@/lib/services/encounters'
import { ZodError } from 'zod'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(req, UserRole.NURSE)
    const { id } = await params
    const body = await req.json()
    const encounter = await updateDischargeChecklist(id, body, user.userId)
    return ok({ encounter })
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    if (err instanceof NotFoundError) return error('NOT_FOUND', err.message, { status: 404 })
    if (err instanceof ZodError) return error('VALIDATION_ERROR', 'Invalid checklist keys', { status: 400 })
    console.error('[PATCH /api/encounters/[id]/discharge-checklist]', err)
    return error('INTERNAL_ERROR', 'Failed to update discharge checklist', { status: 500 })
  }
}
