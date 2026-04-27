import { z } from 'zod'
import { db } from '@/lib/db'
import { NotFoundError } from '@/lib/api/errors'
import { AuditActionType } from '@/src/generated/client/enums'

const RequestAccessInputSchema = z.object({
  patientId: z.string().min(1),
  reason: z.string().min(1, 'Reason is required'),
  justification: z.string().min(50, 'Justification must be at least 50 characters'),
})

export type RequestAccessInput = z.infer<typeof RequestAccessInputSchema>

interface By {
  userId: string
}

const SESSION_DURATION_MS = 60 * 60 * 1000 // 1 hour

export async function auditBreakGlass(
  { userId, patientId, reasonForAccess, reason }: {
    userId: string
    patientId: string
    reasonForAccess: string
    reason: string
  },
  patientDetails: { mrn: string; name: string }
) {
  return db.auditLog.create({
    data: {
      userId,
      actionType: AuditActionType.BREAK_GLASS,
      entityType: 'Patient',
      entityId: patientId,
      reasonForAccess,
      details: {
        reason,
        patientMrn: patientDetails.mrn,
        patientName: patientDetails.name,
      },
    },
  })
}

export async function requestAccess(input: unknown, by: By) {
  const parsed = RequestAccessInputSchema.parse(input)

  const patient = await db.patient.findUnique({
    where: { id: parsed.patientId },
    select: { id: true, mrn: true, firstName: true, lastName: true },
  })
  if (!patient) throw new NotFoundError('Patient not found')

  const patientName = `${patient.firstName} ${patient.lastName}`

  const auditRow = await auditBreakGlass(
    {
      userId: by.userId,
      patientId: parsed.patientId,
      reasonForAccess: parsed.justification,
      reason: parsed.reason,
    },
    { mrn: patient.mrn, name: patientName }
  )

  const expiresAt = new Date(auditRow.timestamp.getTime() + SESSION_DURATION_MS)

  return {
    auditLogId: String(auditRow.id),
    expiresAt: expiresAt.toISOString(),
    patient: {
      id: patient.id,
      name: patientName,
      mrn: patient.mrn,
    },
  }
}

export async function getActiveSessions(by: By) {
  const windowStart = new Date(Date.now() - SESSION_DURATION_MS)

  const entries = await db.auditLog.findMany({
    where: {
      userId: by.userId,
      actionType: AuditActionType.BREAK_GLASS,
      timestamp: { gte: windowStart },
    },
    orderBy: { timestamp: 'desc' },
  })

  return entries
    .map((e) => {
      const details = e.details as Record<string, unknown> | null
      const expiresAt = new Date(e.timestamp.getTime() + SESSION_DURATION_MS)
      return {
        id: String(e.id),
        patientId: e.entityId ?? '',
        patientName: (details?.patientName as string) ?? '',
        patientMrn: (details?.patientMrn as string) ?? '',
        reason: (details?.reason as string) ?? '',
        grantedAt: e.timestamp.toISOString(),
        expiresAt: expiresAt.toISOString(),
        minutesRemaining: Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 60000)),
      }
    })
    .filter((s) => new Date(s.expiresAt) > new Date())
}

export async function getAccessLog(by: By) {
  const entries = await db.auditLog.findMany({
    where: {
      userId: by.userId,
      actionType: AuditActionType.BREAK_GLASS,
    },
    orderBy: { timestamp: 'desc' },
    take: 100,
  })

  return entries.map((e) => {
    const details = e.details as Record<string, unknown> | null
    const isActive = e.timestamp.getTime() + SESSION_DURATION_MS > Date.now()
    return {
      id: String(e.id),
      date: e.timestamp.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      patient: (details?.patientName as string) ?? 'Unknown',
      patientId: e.entityId ?? '',
      reason: (details?.reason as string) ?? '',
      justification: e.reasonForAccess ?? '',
      duration: isActive ? 'In Progress' : '~1 hour',
      reviewedBy: 'Pending',
      status: 'Pending Review' as const,
    }
  })
}
