import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client/enums'
import { UnauthorizedError, ForbiddenError } from '@/lib/api/errors'
import { listAll } from '@/lib/services/orders'

const ALLOWED = [
  UserRole.CLINICIAN,
  UserRole.NURSE,
  UserRole.PHARMACIST,
  UserRole.SYSTEM_ADMIN,
  UserRole.AUDITOR,
]

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ALLOWED)
    const { searchParams } = new URL(req.url)
    const orderType = searchParams.get('orderType') ?? undefined
    const status = searchParams.get('status') ?? undefined
    const result = await listAll({ orderType, status })
    return ok(result)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[GET /api/orders]', err)
    return error('INTERNAL_ERROR', 'Failed to fetch orders', { status: 500 })
  }
}
