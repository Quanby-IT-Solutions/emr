import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client/enums'
import { UnauthorizedError, ForbiddenError } from '@/lib/api/errors'
import * as apptsService from '@/lib/services/appointments'

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
    const patientId = searchParams.get('patientId') ?? undefined
    const status = searchParams.get('status') ?? undefined
    const date = searchParams.get('date') ?? undefined
    const appointments = await apptsService.list({ patientId, status, date })
    return ok(appointments)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[GET /api/appointments]', err)
    return error('INTERNAL_ERROR', 'Failed to fetch appointments', { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole(req, [UserRole.SCHEDULER, UserRole.REGISTRAR, UserRole.SYSTEM_ADMIN])
    const body = await req.json()
    const appointment = await apptsService.create(body)
    return ok(appointment, { status: 201 })
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[POST /api/appointments]', err)
    return error('INTERNAL_ERROR', 'Failed to create appointment', { status: 500 })
  }
}
