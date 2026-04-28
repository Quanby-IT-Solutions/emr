import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client'
import { UnauthorizedError, ForbiddenError, NotFoundError, ConflictError } from '@/lib/api/errors'
import { verify } from '@/lib/services/orders'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(req, UserRole.PHARMACIST)
    const { id } = await params
    const body = await req.json().catch(() => ({}))
    const order = await verify(id, body, user)
    return ok(order)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    if (err instanceof NotFoundError) return error('NOT_FOUND', err.message, { status: 404 })
    if (err instanceof ConflictError) return error('CONFLICT', err.message, { status: 409 })
    console.error('[POST /api/orders/[id]/verify]', err)
    return error('INTERNAL_ERROR', 'Failed to verify order', { status: 500 })
  }
}
