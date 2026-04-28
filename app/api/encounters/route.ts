import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole, EncounterStatus } from '@/src/generated/client/enums'
import { UnauthorizedError, ForbiddenError } from '@/lib/api/errors'
import * as encountersService from '@/lib/services/encounters'

const ALLOWED = [
  UserRole.REGISTRAR,
  UserRole.CLINICIAN,
  UserRole.NURSE,
  UserRole.PHARMACIST,
  UserRole.SYSTEM_ADMIN,
  UserRole.AUDITOR,
]

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ALLOWED)
    const { searchParams } = new URL(req.url)
    const statusParam = searchParams.get('status')
    const status = statusParam ? (statusParam as EncounterStatus) : undefined
    const encounters = await encountersService.listActive(status ? { status } : undefined)
    return ok(encounters)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[GET /api/encounters]', err)
    return error('INTERNAL_ERROR', 'Failed to list encounters', { status: 500 })
  }
}
