import { type NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client'
import { UnauthorizedError, ForbiddenError } from '@/lib/api/errors'
import * as encountersService from '@/lib/services/encounters'

const ALLOWED = [UserRole.CLINICIAN, UserRole.NURSE, UserRole.SYSTEM_ADMIN]

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole(request, ALLOWED)
    const { searchParams } = new URL(request.url)
    const encounterId = searchParams.get('encounterId')
    if (!encounterId) {
      return NextResponse.json({ error: 'encounterId is required' }, { status: 400 })
    }
    const observations = await encountersService.getFlowsheet(encounterId, user.userId)
    return NextResponse.json({ observations })
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: err.message }, { status: 401 })
    if (err instanceof ForbiddenError) return NextResponse.json({ error: err.message }, { status: 403 })
    console.error('[GET /api/flowsheet]', err)
    return NextResponse.json({ error: 'Failed to fetch observations' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(request, ALLOWED)
    const body = await request.json()
    const { encounterId, observationType, value, unit } = body

    if (!encounterId || !observationType || value === undefined || value === null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const observation = await encountersService.recordObservation(
      encounterId,
      { observationType, value: String(value), unit: unit ?? null },
      user.userId
    )

    return NextResponse.json({ observation })
  } catch (err) {
    if (err instanceof UnauthorizedError) return NextResponse.json({ error: err.message }, { status: 401 })
    if (err instanceof ForbiddenError) return NextResponse.json({ error: err.message }, { status: 403 })
    console.error('[POST /api/flowsheet]', err)
    return NextResponse.json({ error: 'Failed to create observation' }, { status: 500 })
  }
}
