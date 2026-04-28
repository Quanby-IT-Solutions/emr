import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client'
import { UnauthorizedError, ForbiddenError } from '@/lib/api/errors'
import * as invoicesService from '@/lib/services/invoices'

const ALLOWED = [
  UserRole.BILLER,
  UserRole.SYSTEM_ADMIN,
  UserRole.AUDITOR,
]

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(req, ALLOWED)
    const { id } = await params
    const invoice = await invoicesService.getById(id)
    if (!invoice) return error('NOT_FOUND', 'Invoice not found', { status: 404 })
    return ok(invoice)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[GET /api/invoices/[id]]', err)
    return error('INTERNAL_ERROR', 'Failed to fetch invoice', { status: 500 })
  }
}
