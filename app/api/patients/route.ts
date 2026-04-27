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

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ALLOWED_READ)
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') ?? undefined
    const withEncounters = searchParams.get('withEncounters') === 'true'
    const patients = await patientsService.list({ search, withEncounters })
    return ok(patients)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[GET /api/patients]', err)
    return error('INTERNAL_ERROR', 'Failed to fetch patients', { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(req, [UserRole.REGISTRAR, UserRole.SCHEDULER, UserRole.SYSTEM_ADMIN])
    const body = await req.json()
    const patient = await patientsService.create(body, user.userId)
    return ok(patient, { status: 201 })
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[POST /api/patients]', err)
    return error('INTERNAL_ERROR', 'Failed to create patient', { status: 500 })
  }
}
