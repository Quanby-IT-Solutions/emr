import { db } from '@/lib/db'
import { AuditActionType, AllergyStatus, EncounterStatus } from '@/src/generated/client'

export interface CreatePatientInput {
  firstName: string
  lastName: string
  dateOfBirth: string | Date
  gender?: string
  contactPhone?: string
  email?: string
  address?: Record<string, unknown>
}

export interface UpdatePatientInput {
  firstName?: string
  lastName?: string
  dateOfBirth?: string | Date
  gender?: string
  contactPhone?: string
  email?: string
}

export async function list(opts?: { search?: string; withEncounters?: boolean }) {
  const where = opts?.search
    ? {
        OR: [
          { firstName: { contains: opts.search, mode: 'insensitive' as const } },
          { lastName: { contains: opts.search, mode: 'insensitive' as const } },
          { mrn: { contains: opts.search, mode: 'insensitive' as const } },
        ],
      }
    : {}

  return db.patient.findMany({
    where,
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    include: opts?.withEncounters
      ? {
          encounters: {
            orderBy: { startDateTime: 'desc' },
            take: 1,
            include: {
              attendingProvider: { select: { firstName: true, lastName: true } },
              currentLocation: { select: { unit: true, roomNumber: true } },
            },
          },
        }
      : undefined,
  })
}

export async function getById(id: string) {
  return db.patient.findUnique({ where: { id } })
}

export async function getByMrn(mrn: string) {
  return db.patient.findUnique({ where: { mrn } })
}

export async function create(data: CreatePatientInput, requesterId?: string) {
  const count = await db.patient.count()
  const year = new Date().getFullYear()
  const mrn = `PGH-${year}-${String(count + 1).padStart(5, '0')}`

  const patient = await db.patient.create({
    data: {
      mrn,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: new Date(data.dateOfBirth),
      gender: data.gender ?? null,
      contactPhone: data.contactPhone ?? null,
      email: data.email ?? null,
      address: (data.address as object) ?? undefined,
      isVipOrConfidential: false,
    },
  })

  await db.auditLog.create({
    data: {
      userId: requesterId ?? null,
      actionType: AuditActionType.CREATE,
      entityType: 'Patient',
      entityId: patient.id,
      details: { mrn, name: `${data.firstName} ${data.lastName}` },
    },
  })

  return patient
}

export async function getChart(id: string, viewerUserId: string) {
  await db.auditLog
    .create({
      data: {
        userId: viewerUserId,
        actionType: AuditActionType.READ,
        entityType: 'Patient',
        entityId: id,
      },
    })
    .catch(() => {})

  const patient = await db.patient.findUnique({
    where: { id },
    include: {
      allergies: { where: { status: AllergyStatus.ACTIVE } },
      patientHistories: { orderBy: { onsetDate: 'desc' }, take: 20 },
      encounters: {
        orderBy: { startDateTime: 'desc' },
        take: 5,
        include: {
          attendingProvider: {
            select: { id: true, firstName: true, lastName: true, jobTitle: true },
          },
          currentLocation: {
            select: { id: true, unit: true, roomNumber: true, bedNumber: true },
          },
          _count: { select: { clinicalNotes: true, orders: true } },
        },
      },
    },
  })

  if (!patient) return null

  const activeEncounter = patient.encounters.find((e) => e.status === EncounterStatus.ACTIVE)

  const recentOrders = activeEncounter
    ? await db.order.findMany({
        where: { encounterId: activeEncounter.id },
        include: { placer: { select: { firstName: true, lastName: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      })
    : []

  return { patient, recentOrders }
}

export async function update(id: string, data: UpdatePatientInput) {
  return db.patient.update({
    where: { id },
    data: {
      ...(data.firstName !== undefined && { firstName: data.firstName }),
      ...(data.lastName !== undefined && { lastName: data.lastName }),
      ...(data.dateOfBirth !== undefined && { dateOfBirth: new Date(data.dateOfBirth) }),
      ...(data.gender !== undefined && { gender: data.gender }),
      ...(data.contactPhone !== undefined && { contactPhone: data.contactPhone }),
      ...(data.email !== undefined && { email: data.email }),
    },
  })
}
