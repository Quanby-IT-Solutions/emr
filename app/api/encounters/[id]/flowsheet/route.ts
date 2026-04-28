import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client/enums'
import { UnauthorizedError, ForbiddenError } from '@/lib/api/errors'
import * as encountersService from '@/lib/services/encounters'

const ALLOWED = [UserRole.CLINICIAN, UserRole.NURSE]

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(req, ALLOWED)
    const { id } = await params
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : undefined
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : undefined
    const observations = await encountersService.getFlowsheet(id, user.userId, { take, skip })
    return ok({ observations })
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[GET /api/encounters/[id]/flowsheet]', err)
    return error('INTERNAL_ERROR', 'Failed to fetch flowsheet', { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(req, ALLOWED)
    const { id } = await params
    const body = await req.json()
    const { observationType, value, unit } = body
    if (!observationType || value === undefined || value === null) {
      return error('VALIDATION_ERROR', 'observationType and value are required', { status: 400 })
    }
    const observation = await encountersService.recordObservation(
      id,
      { observationType, value: String(value), unit: unit ?? null },
      user.userId
    )
    return ok({ observation })
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[POST /api/encounters/[id]/flowsheet]', err)
    return error('INTERNAL_ERROR', 'Failed to record observation', { status: 500 })
  }
}
