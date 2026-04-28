import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client'
import { UnauthorizedError, ForbiddenError, NotFoundError, ConflictError } from '@/lib/api/errors'
import { validate } from '@/lib/services/labs'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const user = await requireRole(req, UserRole.LAB_TECH)
    const { orderId } = await params
    const order = await validate(orderId, user)
    return ok(order)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    if (err instanceof NotFoundError) return error('NOT_FOUND', err.message, { status: 404 })
    if (err instanceof ConflictError) return error('CONFLICT', err.message, { status: 409 })
    console.error('[POST /api/lab-results/[orderId]/validate]', err)
    return error('INTERNAL_ERROR', 'Failed to validate results', { status: 500 })
  }
}
