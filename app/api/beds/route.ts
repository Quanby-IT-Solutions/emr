import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client'
import { UnauthorizedError, ForbiddenError } from '@/lib/api/errors'
import * as bedsService from '@/lib/services/beds'

const ALLOWED = [
  UserRole.REGISTRAR,
  UserRole.NURSE,
  UserRole.CLINICIAN,
  UserRole.SYSTEM_ADMIN,
  UserRole.AUDITOR,
]

export async function GET(req: NextRequest) {
  try {
    await requireRole(req, ALLOWED)
    const { searchParams } = new URL(req.url)
    const departmentId = searchParams.get('departmentId') ?? undefined
    const status = searchParams.get('status') ?? undefined
    const search = searchParams.get('search') ?? undefined
    const beds = await bedsService.list({ departmentId, status, search })
    return ok(beds)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[GET /api/beds]', err)
    return error('INTERNAL_ERROR', 'Failed to fetch beds', { status: 500 })
  }
}
