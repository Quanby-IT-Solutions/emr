import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client'
import { UnauthorizedError, ForbiddenError, NotFoundError } from '@/lib/api/errors'
import { runWithUser } from '@/lib/request-context'
import * as orders from '@/lib/services/orders'

const ALLOWED_READ = [
  UserRole.CLINICIAN,
  UserRole.NURSE,
  UserRole.PHARMACIST,
  UserRole.SYSTEM_ADMIN,
  UserRole.AUDITOR,
]

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(req, ALLOWED_READ)
    const { id } = await params
    const { searchParams } = new URL(req.url)
    const query = {
      orderType: searchParams.get('orderType') ?? undefined,
      status: searchParams.get('status') ?? undefined,
    }
    const result = await runWithUser(user.userId, () => orders.listForEncounter(id, query))
    return ok(result)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    if (err instanceof NotFoundError) return error('NOT_FOUND', err.message, { status: 404 })
    console.error('[GET /api/encounters/[id]/orders]', err)
    return error('INTERNAL_ERROR', 'Failed to fetch orders', { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(req, [UserRole.CLINICIAN])
    const { id: encounterId } = await params
    const body = await req.json()
    const order = await runWithUser(user.userId, () =>
      orders.place({ ...body, encounterId }, user)
    )
    return ok(order, { status: 201 })
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    if (err instanceof NotFoundError) return error('NOT_FOUND', err.message, { status: 404 })
    console.error('[POST /api/encounters/[id]/orders]', err)
    return error('INTERNAL_ERROR', 'Failed to place order', { status: 500 })
  }
}
