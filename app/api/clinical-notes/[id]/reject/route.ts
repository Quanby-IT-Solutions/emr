import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client'
import { UnauthorizedError, ForbiddenError, NotFoundError } from '@/lib/api/errors'
import { reject } from '@/lib/services/clinical-notes'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(req, [UserRole.CLINICIAN])
    const { id } = await params
    const body = await req.json()
    const { comment } = body

    if (!comment?.trim()) return error('VALIDATION_ERROR', 'comment is required', { status: 400 })

    const note = await reject(id, comment, user.userId)
    return ok(note)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    if (err instanceof NotFoundError) return error('NOT_FOUND', err.message, { status: 404 })
    console.error('[POST /api/clinical-notes/[id]/reject]', err)
    return error('INTERNAL_ERROR', 'Failed to reject note', { status: 500 })
  }
}
