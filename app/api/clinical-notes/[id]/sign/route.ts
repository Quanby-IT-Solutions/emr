import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole } from '@/src/generated/client/enums'
import { UnauthorizedError, ForbiddenError, NotFoundError } from '@/lib/api/errors'
import { sign } from '@/lib/services/clinical-notes'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(req, [UserRole.CLINICIAN, UserRole.NURSE])
    const { id } = await params
    const note = await sign(id, user.userId)
    return ok(note)
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    if (err instanceof NotFoundError) return error('NOT_FOUND', err.message, { status: 404 })
    console.error('[POST /api/clinical-notes/[id]/sign]', err)
    return error('INTERNAL_ERROR', 'Failed to sign note', { status: 500 })
  }
}
