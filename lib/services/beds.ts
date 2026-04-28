import { db } from '@/lib/db'
import { AuditActionType } from '@/src/generated/client'

export interface AssignBedInput {
  bedId: string
  encounterId: string
  mrn?: string
  patientId?: string
  assignedById?: string
  notes?: string
}

type BedRow = Awaited<ReturnType<typeof db.location.findUnique>> & {
  department?: { id: string; name: string; type: string | null } | null
  encounters?: Array<{
    id: string
    status: string
    startDateTime: Date
    patient: { id: string; firstName: string; lastName: string; mrn: string; dateOfBirth: Date; gender: string | null }
    attendingProvider: { id: string; firstName: string; lastName: string } | null
  }>
}

function transformBed(bed: NonNullable<BedRow>) {
  const enc = (bed as any).encounters?.[0]
  return {
    id: bed.id,
    departmentId: bed.departmentId,
    roomNumber: bed.roomNumber ?? 'N/A',
    bedNumber: bed.bedNumber ?? 'N/A',
    unit: bed.unit,
    floor: bed.unit,
    bedType: 'Standard',
    status: bed.status ?? 'AVAILABLE',
    department: (bed as any).department
      ? {
          id: (bed as any).department.id,
          name: (bed as any).department.name,
          code: (bed as any).department.id,
          type: (bed as any).department.type ?? 'CLINICAL',
        }
      : null,
    activeEncounter: enc
      ? {
          id: enc.id,
          status: enc.status,
          startDateTime: enc.startDateTime?.toISOString?.() ?? enc.startDateTime,
          patient: enc.patient,
          consultant: enc.attendingProvider
            ? `${enc.attendingProvider.firstName} ${enc.attendingProvider.lastName}`
            : null,
        }
      : null,
    currentPatient: enc?.patient ?? null,
  }
}

const bedInclude = {
  department: { select: { id: true, name: true, type: true } },
  encounters: {
    where: { status: 'ACTIVE' as const },
    include: {
      patient: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          mrn: true,
          dateOfBirth: true,
          gender: true,
        },
      },
      attendingProvider: { select: { id: true, firstName: true, lastName: true } },
    },
    take: 1,
  },
}

export async function list(opts?: { departmentId?: string; status?: string; search?: string }) {
  const where: Record<string, unknown> = { bedNumber: { not: null } }

  if (opts?.departmentId && opts.departmentId !== 'all') {
    where.departmentId = opts.departmentId
  }
  if (opts?.status && opts.status !== 'all') {
    where.status = opts.status
  }
  if (opts?.search) {
    where.OR = [
      { roomNumber: { contains: opts.search, mode: 'insensitive' } },
      { bedNumber: { contains: opts.search, mode: 'insensitive' } },
      { unit: { contains: opts.search, mode: 'insensitive' } },
    ]
  }

  const beds = await db.location.findMany({
    where,
    include: bedInclude,
    orderBy: [{ unit: 'asc' }, { roomNumber: 'asc' }, { bedNumber: 'asc' }],
  })

  return beds.map(b => transformBed(b as NonNullable<BedRow>))
}

export async function listAvailable(opts?: { departmentId?: string; search?: string }) {
  return list({ ...opts, status: 'AVAILABLE' })
}

export async function getById(id: string) {
  const bed = await db.location.findUnique({ where: { id }, include: bedInclude })
  if (!bed) return null
  return transformBed(bed as NonNullable<BedRow>)
}

export async function updateStatus(id: string, status: string) {
  const valid = ['AVAILABLE', 'OCCUPIED', 'CLEANING', 'OUT_OF_SERVICE']
  if (!valid.includes(status)) throw new Error(`Invalid status: ${status}`)
  return db.location.update({ where: { id }, data: { status: status as any } })
}

export async function assign(input: AssignBedInput) {
  const bed = await db.location.findUnique({
    where: { id: input.bedId },
    include: { department: true },
  })
  if (!bed) throw new Error('Bed not found')
  if (bed.status !== 'AVAILABLE')
    throw new Error(`Bed is not available. Current status: ${bed.status}`)

  let patientId = input.patientId
  if (!patientId && input.mrn) {
    const patient = await db.patient.findUnique({ where: { mrn: input.mrn } })
    if (!patient) throw new Error(`Patient with MRN ${input.mrn} not found`)
    patientId = patient.id
  }
  if (!patientId) throw new Error('patientId or mrn is required')

  let encounterId = input.encounterId
  if (!encounterId) {
    const enc = await db.encounter.findFirst({
      where: { patientId, status: 'ACTIVE' },
      orderBy: { startDateTime: 'desc' },
    })
    if (!enc) throw new Error('No active encounter found for this patient')
    encounterId = enc.id
  } else {
    const enc = await db.encounter.findUnique({ where: { id: encounterId } })
    if (!enc) throw new Error('Encounter not found')
  }

  return db.$transaction(async (tx) => {
    const updatedBed = await tx.location.update({
      where: { id: input.bedId },
      data: { status: 'OCCUPIED' },
    })

    const updatedEncounter = await tx.encounter.update({
      where: { id: encounterId },
      data: { currentLocationId: input.bedId },
    })

    await tx.patientTransfer.create({
      data: {
        encounterId,
        fromLocationId: null,
        toLocationId: input.bedId,
        transferDateTime: new Date(),
        transportStaffId: input.assignedById ?? null,
      },
    })

    await tx.auditLog.create({
      data: {
        userId: input.assignedById ?? null,
        actionType: AuditActionType.CREATE,
        entityType: 'BED_ASSIGNMENT',
        entityId: input.bedId,
        details: {
          patientId,
          encounterId,
          bedNumber: bed.bedNumber,
          roomNumber: bed.roomNumber,
          unit: bed.unit,
          departmentName: (bed as any).department?.name ?? 'Unknown',
          notes: input.notes ?? 'Bed assignment during admission',
        },
      },
    })

    return { bed: updatedBed, encounter: updatedEncounter }
  })
}

export async function listDepartments() {
  const departments = await db.department.findMany({
    select: {
      id: true,
      name: true,
      type: true,
      _count: {
        select: {
          locations: {
            where: { bedNumber: { not: null }, status: 'AVAILABLE' },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  })

  return departments.map(dept => ({
    id: dept.id,
    name: dept.name,
    code: dept.id,
    type: dept.type ?? 'CLINICAL',
    availableBeds: dept._count.locations,
  }))
}
