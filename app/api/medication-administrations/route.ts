import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client/enums'
import { UnauthorizedError, ForbiddenError, NotFoundError, ConflictError } from '@/lib/api/errors'
import { AdministerInputSchema, administer, listPendingMedOrders } from '@/lib/services/medications'
import { ZodError } from 'zod'

const ALLOWED_READ = [
  UserRole.NURSE,
  UserRole.CLINICIAN,
  UserRole.PHARMACIST,
  UserRole.SYSTEM_ADMIN,
  UserRole.AUDITOR,
]

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ALLOWED_READ)
    const orders = await listPendingMedOrders()
    return ok({ orders })
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[GET /api/medication-administrations]', err)
    return error('INTERNAL_ERROR', 'Failed to fetch medication orders', { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(req, UserRole.NURSE)
    const body = await req.json()
    const { orderId, ...rest } = body
    if (!orderId) return error('VALIDATION_ERROR', 'orderId is required', { status: 400 })
    const input = AdministerInputSchema.parse(rest)
    const administration = await administer(orderId, input, user.userId)
    return ok({ administration }, { status: 201 })
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    if (err instanceof NotFoundError) return error('NOT_FOUND', err.message, { status: 404 })
    if (err instanceof ConflictError) return error('CONFLICT', err.message, { status: 409 })
    if (err instanceof ZodError) return error('VALIDATION_ERROR', 'Validation failed', { status: 400 })
    console.error('[POST /api/medication-administrations]', err)
    return error('INTERNAL_ERROR', 'Failed to record administration', { status: 500 })
  }
}
