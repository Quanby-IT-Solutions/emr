import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client'
import { UnauthorizedError, ForbiddenError } from '@/lib/api/errors'
import * as encountersService from '@/lib/services/encounters'

const ALLOWED_READ = [
  UserRole.REGISTRAR,
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
    await requireRole(req, ALLOWED_READ)
    const { id } = await params
    const encounter = await encountersService.getById(id)
    if (!encounter) return error('NOT_FOUND', 'Encounter not found', { status: 404 })
    return ok(encounter)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[GET /api/encounters/[id]]', err)
    return error('INTERNAL_ERROR', 'Failed to fetch encounter', { status: 500 })
  }
}
