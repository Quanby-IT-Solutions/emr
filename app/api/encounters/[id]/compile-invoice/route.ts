import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client/enums'
import { UnauthorizedError, ForbiddenError, NotFoundError } from '@/lib/api/errors'
import * as encountersService from '@/lib/services/encounters'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(req, [UserRole.BILLER])
    const { id: encounterId } = await params
    const invoice = await encountersService.compileInvoice(encounterId, user.userId)
    return ok(invoice, { status: 201 })
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    if (err instanceof NotFoundError) return error('NOT_FOUND', err.message, { status: 404 })
    console.error('[POST /api/encounters/[id]/compile-invoice]', err)
    return error('INTERNAL_ERROR', 'Failed to compile invoice', { status: 500 })
  }
}
