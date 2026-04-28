import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client'
import { UnauthorizedError, ForbiddenError } from '@/lib/api/errors'
import { listForPharmacistQueue } from '@/lib/services/orders'

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, UserRole.PHARMACIST)
    const result = await listForPharmacistQueue()
    return ok(result)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[GET /api/orders/pharmacy-queue]', err)
    return error('INTERNAL_ERROR', 'Failed to fetch pharmacy queue', { status: 500 })
  }
}
