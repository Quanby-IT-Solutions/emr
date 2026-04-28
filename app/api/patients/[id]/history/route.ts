import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import { requireRole } from '@/lib/auth/guard'
import { UserRole, HistoryType, HistoryStatus, AuditActionType } from '@/src/generated/client/enums'
import { UnauthorizedError, ForbiddenError } from '@/lib/api/errors'
import { db } from '@/lib/db'

const ALLOWED = [UserRole.CLINICIAN, UserRole.NURSE]

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(req, ALLOWED)
    const { id: patientId } = await params
    const body = await req.json()
    const { type, entry, icd10Code, onsetDate } = body

    if (!type || !entry) return error('VALIDATION_ERROR', 'type and entry are required', { status: 400 })

    const patient = await db.patient.findUnique({ where: { id: patientId }, select: { id: true } })
    if (!patient) return error('NOT_FOUND', 'Patient not found', { status: 404 })

    const history = await db.patientHistory.create({
      data: {
        patientId,
        type: type as HistoryType,
        entry,
        icd10Code: icd10Code ?? null,
        status: HistoryStatus.ACTIVE,
        onsetDate: onsetDate ? new Date(onsetDate) : null,
      },
    })

    await db.auditLog
      .create({
        data: {
          userId: user.userId,
          actionType: AuditActionType.CREATE,
          entityType: 'PatientHistory',
          entityId: history.id,
          details: { patientId, type, entry },
        },
      })
      .catch(() => {})

    return ok(history, { status: 201 })
  } catch (err) {
    if (err instanceof UnauthorizedError) return error('UNAUTHORIZED', err.message, { status: 401 })
    if (err instanceof ForbiddenError) return error('FORBIDDEN', err.message, { status: 403 })
    console.error('[POST /api/patients/[id]/history]', err)
    return error('INTERNAL_ERROR', 'Failed to add patient history', { status: 500 })
  }
}
