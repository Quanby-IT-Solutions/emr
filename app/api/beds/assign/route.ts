import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client/enums'
import { UnauthorizedError, ForbiddenError } from '@/lib/api/errors'
import * as bedsService from '@/lib/services/beds'

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(req, [UserRole.REGISTRAR, UserRole.NURSE, UserRole.SYSTEM_ADMIN])
    const body = await req.json()
    const { bedId, mrn, patientId, encounterId, notes } = body

    if (!bedId) return error('VALIDATION_ERROR', 'bedId is required', { status: 400 })
    if (!mrn && !patientId) return error('VALIDATION_ERROR', 'mrn or patientId is required', { status: 400 })

    const result = await bedsService.assign({
      bedId,
      mrn,
      patientId,
      encounterId,
      assignedById: user.userId,
      notes,
    })

    return ok(result)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    if (err instanceof Error) {
      const msg = err.message
      if (msg.includes('not found')) return error('NOT_FOUND', msg, { status: 404 })
      if (msg.includes('not available')) return error('CONFLICT', msg, { status: 409 })
      if (msg.includes('required')) return error('VALIDATION_ERROR', msg, { status: 400 })
    }
    console.error('[POST /api/beds/assign]', err)
    return error('INTERNAL_ERROR', 'Failed to assign bed', { status: 500 })
  }
}
