import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client/enums'
import { UnauthorizedError, ForbiddenError } from '@/lib/api/errors'
import * as patientsService from '@/lib/services/patients'

const ALLOWED_READ = [
  UserRole.REGISTRAR,
  UserRole.SCHEDULER,
  UserRole.CLINICIAN,
  UserRole.NURSE,
  UserRole.SYSTEM_ADMIN,
  UserRole.AUDITOR,
]

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(req, ALLOWED_READ)
    const { id } = await params
    const patient = await patientsService.getById(id)
    if (!patient) return error('NOT_FOUND', 'Patient not found', { status: 404 })
    return ok(patient)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[GET /api/patients/[id]]', err)
    return error('INTERNAL_ERROR', 'Failed to fetch patient', { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole(req, [UserRole.REGISTRAR, UserRole.SYSTEM_ADMIN])
    const { id } = await params
    const body = await req.json()
    const patient = await patientsService.update(id, body)
    return ok(patient)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[PATCH /api/patients/[id]]', err)
    return error('INTERNAL_ERROR', 'Failed to update patient', { status: 500 })
  }
}
