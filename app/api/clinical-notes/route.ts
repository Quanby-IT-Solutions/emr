import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole, ClinicalNoteType } from '@/src/generated/client/enums'
import { UnauthorizedError, ForbiddenError } from '@/lib/api/errors'
import { db } from '@/lib/db'
import { create } from '@/lib/services/clinical-notes'

const ALLOWED = [UserRole.CLINICIAN, UserRole.NURSE, UserRole.SYSTEM_ADMIN, UserRole.AUDITOR]

const NOTE_INCLUDE = {
  author: { select: { id: true, firstName: true, lastName: true, jobTitle: true } },
  cosigner: { select: { id: true, firstName: true, lastName: true, jobTitle: true } },
  addenda: {
    include: {
      author: { select: { id: true, firstName: true, lastName: true, jobTitle: true } },
    },
    orderBy: { signedAt: 'asc' as const },
  },
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(req, ALLOWED)
    const { searchParams } = new URL(req.url)
    const encounterId = searchParams.get('encounterId')
    const authorId = searchParams.get('authorId')
    const staffId = searchParams.get('staffId')
    const status = searchParams.get('status')

    const where: Record<string, unknown> = { parentNoteId: null }
    if (encounterId) where.encounterId = encounterId
    if (authorId) where.authorId = authorId
    if (staffId) where.authorId = staffId
    if (status) where.status = status

    const notes = await db.clinicalNote.findMany({
      where,
      include: NOTE_INCLUDE,
      orderBy: [{ signedAt: 'desc' }, { id: 'desc' }],
      take: 100,
    })

    return ok(notes)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[GET /api/clinical-notes]', err)
    return error('INTERNAL_ERROR', 'Failed to fetch clinical notes', { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(req, [UserRole.CLINICIAN, UserRole.NURSE])
    const body = await req.json()
    const { encounterId, noteType, title, content, cosignerId, isSensitive } = body

    if (!encounterId || !noteType) {
      return error('VALIDATION_ERROR', 'encounterId and noteType are required', { status: 400 })
    }

    const note = await create(
      { encounterId, noteType: noteType as ClinicalNoteType, title, content, cosignerId, isSensitive },
      user.userId
    )
    return ok(note, { status: 201 })
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    if (err instanceof Error && err.message === 'Staff record not found')
      return error('NOT_FOUND', err.message, { status: 404 })
    console.error('[POST /api/clinical-notes]', err)
    return error('INTERNAL_ERROR', 'Failed to create clinical note', { status: 500 })
  }
}
