import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client'
import { UnauthorizedError, ForbiddenError } from '@/lib/api/errors'
import { getChart } from '@/lib/services/patients'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(req, [UserRole.CLINICIAN, UserRole.NURSE])
    const { id } = await params
    const chart = await getChart(id, user.userId)
    if (!chart) return error('NOT_FOUND', 'Patient not found', { status: 404 })
    return ok(chart)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[GET /api/patients/[id]/chart]', err)
    return error('INTERNAL_ERROR', 'Failed to fetch patient chart', { status: 500 })
  }
}
