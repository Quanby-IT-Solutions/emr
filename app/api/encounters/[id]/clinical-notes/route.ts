import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client/enums'
import { UnauthorizedError, ForbiddenError } from '@/lib/api/errors'
import { getClinicalNotes } from '@/lib/services/encounters'
import { create } from '@/lib/services/clinical-notes'
import { ClinicalNoteType } from '@/src/generated/client/enums'

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
    const notes = await getClinicalNotes(id, user.userId, { take, skip })
    return ok(notes)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[GET /api/encounters/[id]/clinical-notes]', err)
    return error('INTERNAL_ERROR', 'Failed to fetch clinical notes', { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(req, ALLOWED)
    const { id: encounterId } = await params
    const body = await req.json()
    const { noteType, title, content, cosignerId, isSensitive } = body

    if (!noteType) return error('VALIDATION_ERROR', 'noteType is required', { status: 400 })

    const note = await create(
      {
        encounterId,
        noteType: noteType as ClinicalNoteType,
        title,
        content,
        cosignerId,
        isSensitive,
      },
      user.userId
    )
    return ok(note, { status: 201 })
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    if (err instanceof Error && err.message === 'Staff record not found')
      return error('NOT_FOUND', err.message, { status: 404 })
    console.error('[POST /api/encounters/[id]/clinical-notes]', err)
    return error('INTERNAL_ERROR', 'Failed to create clinical note', { status: 500 })
  }
}
