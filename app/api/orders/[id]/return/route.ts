import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client/enums'
import { UnauthorizedError, ForbiddenError, NotFoundError, ConflictError } from '@/lib/api/errors'
import { returnToPrescriber } from '@/lib/services/orders'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(req, UserRole.PHARMACIST)
    const { id } = await params
    const body = await req.json().catch(() => ({}))
    const { reason } = body
    if (!reason?.trim()) {
      return error('VALIDATION_ERROR', 'Return reason is required', { status: 400 })
    }
    const order = await returnToPrescriber(id, reason, user)
    return ok(order)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    if (err instanceof NotFoundError) return error('NOT_FOUND', err.message, { status: 404 })
    if (err instanceof ConflictError) return error('CONFLICT', err.message, { status: 409 })
    console.error('[POST /api/orders/[id]/return]', err)
    return error('INTERNAL_ERROR', 'Failed to return order', { status: 500 })
  }
}
