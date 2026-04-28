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

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ALLOWED)
    const { searchParams } = new URL(req.url)
    const query = {
      status: searchParams.get('status') ?? undefined,
      patientId: searchParams.get('patientId') ?? undefined,
      encounterId: searchParams.get('encounterId') ?? undefined,
    }
    const invoices = await invoicesService.list(query)
    return ok(invoices)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[GET /api/invoices]', err)
    return error('INTERNAL_ERROR', 'Failed to fetch invoices', { status: 500 })
  }
}
