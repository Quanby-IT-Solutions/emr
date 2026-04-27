import { db } from '@/lib/db'
import { AppointmentStatus, EncounterType, EncounterStatus } from '@/src/generated/client/enums'
import { AuditActionType } from '@/src/generated/client/client'

export interface CreateAppointmentInput {
  patientId: string
  providerName?: string
  providerId?: string
  startTime: Date | string
  endTime?: Date | string
  appointmentType?: string
}

export interface WalkInInput {
  patientId?: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  gender?: string
  contactPhone?: string
  providerName?: string
  providerId?: string
  appointmentType?: string
  requesterId?: string
}

async function resolveProviderId(providerName?: string, providerId?: string): Promise<string> {
  if (providerId) return providerId

  if (providerName) {
    const cleaned = providerName.replace(/^Dr\.?\s*/i, '').trim()
    const parts = cleaned.split(/\s+/)
    const lastName = parts[parts.length - 1]
    const staff = await db.staff.findFirst({
      where: { lastName: { contains: lastName, mode: 'insensitive' } },
    })
    if (staff) return staff.id
  }

  const fallback = await db.staff.findFirst()
  if (!fallback) throw new Error('No provider available in the system')
  return fallback.id
}

export async function list(opts?: { patientId?: string; status?: string; date?: string }) {
  const where: Record<string, unknown> = {}
  if (opts?.patientId) where.patientId = opts.patientId
  if (opts?.status) where.status = opts.status
  if (opts?.date) {
    const d = new Date(opts.date)
    const start = new Date(d)
    start.setHours(0, 0, 0, 0)
    const end = new Date(d)
    end.setHours(23, 59, 59, 999)
    where.startTime = { gte: start, lt: end }
  }

  return db.appointment.findMany({
    where,
    include: {
      patient: {
        select: { id: true, mrn: true, firstName: true, lastName: true, dateOfBirth: true, gender: true },
      },
      provider: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { startTime: 'desc' },
  })
}

export async function create(data: CreateAppointmentInput) {
  const providerId = await resolveProviderId(data.providerName, data.providerId)
  const startTime = new Date(data.startTime)
  const endTime = data.endTime
    ? new Date(data.endTime)
    : new Date(startTime.getTime() + 30 * 60 * 1000)

  return db.appointment.create({
    data: {
      patientId: data.patientId,
      providerId,
      startTime,
      endTime,
      status: AppointmentStatus.SCHEDULED,
      appointmentType: data.appointmentType ?? null,
    },
    include: {
      patient: { select: { id: true, mrn: true, firstName: true, lastName: true } },
      provider: { select: { id: true, firstName: true, lastName: true } },
    },
  })
}

export async function cancel(id: string) {
  return db.appointment.update({
    where: { id },
    data: { status: AppointmentStatus.CANCELLED },
    include: {
      patient: { select: { id: true, mrn: true, firstName: true, lastName: true } },
      provider: { select: { id: true, firstName: true, lastName: true } },
    },
  })
}

export async function confirm(id: string) {
  return db.appointment.update({
    where: { id },
    data: { status: AppointmentStatus.CONFIRMED },
    include: {
      patient: { select: { id: true, mrn: true, firstName: true, lastName: true } },
      provider: { select: { id: true, firstName: true, lastName: true } },
    },
  })
}

export async function noShow(id: string) {
  return db.appointment.update({
    where: { id },
    data: { status: AppointmentStatus.NO_SHOW },
    include: {
      patient: { select: { id: true, mrn: true, firstName: true, lastName: true } },
      provider: { select: { id: true, firstName: true, lastName: true } },
    },
  })
}

export async function checkIn(
  id: string,
  opts?: { requesterId?: string; encounterType?: EncounterType }
) {
  return db.$transaction(async (tx) => {
    const appt = await tx.appointment.update({
      where: { id },
      data: { status: AppointmentStatus.CHECKED_IN },
    })

    const encounter = await tx.encounter.create({
      data: {
        patientId: appt.patientId,
        type: opts?.encounterType ?? EncounterType.OUTPATIENT,
        status: EncounterStatus.ACTIVE,
        startDateTime: new Date(),
      },
    })

    await tx.appointment.update({ where: { id }, data: { encounterId: encounter.id } })

    await tx.auditLog.create({
      data: {
        userId: opts?.requesterId ?? null,
        actionType: AuditActionType.CREATE,
        entityType: 'Encounter',
        entityId: encounter.id,
        details: { appointmentId: id, patientId: appt.patientId, action: 'CHECK_IN' },
      },
    })

    return {
      appointment: { ...appt, status: AppointmentStatus.CHECKED_IN, encounterId: encounter.id },
      encounter,
    }
  })
}

export async function createWalkIn(data: WalkInInput) {
  return db.$transaction(async (tx) => {
    let patientId = data.patientId

    if (!patientId) {
      const count = await tx.patient.count()
      const year = new Date().getFullYear()
      const mrn = `PGH-${year}-${String(count + 1).padStart(5, '0')}`
      const patient = await tx.patient.create({
        data: {
          mrn,
          firstName: data.firstName ?? 'Unknown',
          lastName: data.lastName ?? 'Patient',
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : new Date('2000-01-01'),
          gender: data.gender ?? null,
          contactPhone: data.contactPhone ?? null,
          isVipOrConfidential: false,
        },
      })
      patientId = patient.id

      await tx.auditLog.create({
        data: {
          userId: data.requesterId ?? null,
          actionType: AuditActionType.CREATE,
          entityType: 'Patient',
          entityId: patient.id,
          details: { mrn, action: 'WALK_IN_REGISTRATION' },
        },
      })
    }

    const providerId = await resolveProviderId(data.providerName, data.providerId)
    const now = new Date()

    const encounter = await tx.encounter.create({
      data: {
        patientId,
        type: EncounterType.OUTPATIENT,
        status: EncounterStatus.ACTIVE,
        startDateTime: now,
      },
    })

    const appointment = await tx.appointment.create({
      data: {
        patientId,
        providerId,
        startTime: now,
        endTime: new Date(now.getTime() + 30 * 60 * 1000),
        status: AppointmentStatus.CHECKED_IN,
        appointmentType: data.appointmentType ?? 'Walk-In',
        encounterId: encounter.id,
      },
    })

    await tx.auditLog.create({
      data: {
        userId: data.requesterId ?? null,
        actionType: AuditActionType.CREATE,
        entityType: 'Encounter',
        entityId: encounter.id,
        details: { patientId, action: 'WALK_IN_CHECK_IN' },
      },
    })

    return { appointment, encounter }
  })
}
