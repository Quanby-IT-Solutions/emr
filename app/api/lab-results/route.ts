import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client'
import { UnauthorizedError, ForbiddenError, NotFoundError, ConflictError } from '@/lib/api/errors'
import { enterResults } from '@/lib/services/labs'
import { ZodError } from 'zod'

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(req, UserRole.LAB_TECH)
    const body = await req.json().catch(() => ({}))
    const { orderId, results } = body
    if (!orderId) return error('VALIDATION_ERROR', 'orderId is required', { status: 400 })
    const order = await enterResults(orderId, results ?? [], user)
    return ok(order)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    if (err instanceof NotFoundError) return error('NOT_FOUND', err.message, { status: 404 })
    if (err instanceof ConflictError) return error('CONFLICT', err.message, { status: 409 })
    if (err instanceof ZodError) {
      return error('VALIDATION_ERROR', 'Invalid results data', { status: 400, details: err.issues })
    }
    console.error('[POST /api/lab-results]', err)
    return error('INTERNAL_ERROR', 'Failed to enter results', { status: 500 })
  }
}
