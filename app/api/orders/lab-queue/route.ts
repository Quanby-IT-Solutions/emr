import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client/enums'
import { UnauthorizedError, ForbiddenError } from '@/lib/api/errors'
import { listForLabQueue } from '@/lib/services/orders'

const ALLOWED = [
  UserRole.LAB_TECH,
  UserRole.CLINICIAN,
  UserRole.NURSE,
  UserRole.PHARMACIST,
  UserRole.SYSTEM_ADMIN,
  UserRole.AUDITOR,
]

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ALLOWED)
    const result = await listForLabQueue()
    return ok(result)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[GET /api/orders/lab-queue]', err)
    return error('INTERNAL_ERROR', 'Failed to fetch lab queue', { status: 500 })
  }
}
