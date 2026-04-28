import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client'
import { UnauthorizedError, ForbiddenError, NotFoundError } from '@/lib/api/errors'
import { ZodError } from 'zod'
import { requestAccess } from '@/lib/services/break-glass'

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(req, [UserRole.CLINICIAN])
    const body = await req.json()
    const result = await requestAccess(body, user)
    return ok(result, { status: 201 })
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    if (err instanceof NotFoundError) return error('NOT_FOUND', err.message, { status: 404 })
    if (err instanceof ZodError) {
      return error('VALIDATION_ERROR', 'Validation failed', { status: 400, details: err.issues })
    }
    console.error('[POST /api/break-glass]', err)
    return error('INTERNAL_ERROR', 'Failed to request break-glass access', { status: 500 })
  }
}
