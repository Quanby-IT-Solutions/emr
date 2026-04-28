import { db } from '@/lib/db'
import { z } from 'zod'
import {
  EncounterType,
  EncounterStatus,
  ClinicalNoteType,
  ClinicalNoteStatus,
  ObservationType,
  ObservationUnit,
  AuditActionType,
  OrderType,
  InvoiceStatus,
  OrderStatus,
} from '@/src/generated/client/enums'
import { NotFoundError, ConflictError } from '@/lib/api/errors'

export { DISCHARGE_STEPS, type DischargeStep } from '@/lib/services/encounters-constants'
import { DISCHARGE_STEPS } from '@/lib/services/encounters-constants'

const DischargeChecklistPartialSchema = z.object({
  'Discharge Summary': z.boolean().optional(),
  'Medications Explained': z.boolean().optional(),
  'Home Instructions': z.boolean().optional(),
  'Follow-up Booked': z.boolean().optional(),
  'PhilHealth Clearance': z.boolean().optional(),
  'Pharmacy Clearance': z.boolean().optional(),
  'Final Vitals': z.boolean().optional(),
  'Wheeled Out': z.boolean().optional(),
})

export type DischargeChecklistPartial = z.infer<typeof DischargeChecklistPartialSchema>

export interface TriageVital {
  type: ObservationType
  value: string
  unit?: ObservationUnit | null
}

export interface TriageInput {
  chiefComplaint: string
  triageCategory: string
  triageDisposition: string
  triageNotes?: string
  vitals?: TriageVital[]
}

export async function getOrders(
  encounterId: string,
  query?: { orderType?: string; status?: string }
) {
  return db.order.findMany({
    where: {
      encounterId,
      ...(query?.orderType ? { orderType: query.orderType as OrderType } : {}),
      ...(query?.status ? { status: query.status as never } : {}),
    },
    include: {
      placer: { select: { id: true, firstName: true, lastName: true } },
      orderVerifications: { orderBy: { verifiedAt: 'desc' }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getClinicalNotes(
  encounterId: string,
  viewerUserId: string,
  opts?: { take?: number; skip?: number }
) {
  await db.auditLog
    .create({
      data: {
        userId: viewerUserId,
        actionType: AuditActionType.READ,
        entityType: 'Encounter',
        entityId: encounterId,
      },
    })
    .catch(() => {})

  return db.clinicalNote.findMany({
    where: { encounterId, parentNoteId: null },
    include: {
      author: { select: { id: true, firstName: true, lastName: true, jobTitle: true } },
      cosigner: { select: { id: true, firstName: true, lastName: true, jobTitle: true } },
      addenda: {
        include: {
          author: { select: { id: true, firstName: true, lastName: true, jobTitle: true } },
        },
        orderBy: { signedAt: 'asc' },
      },
    },
    orderBy: [{ signedAt: 'desc' }, { id: 'desc' }],
    take: opts?.take ?? 50,
    skip: opts?.skip ?? 0,
  })
}

export async function getById(id: string) {
  return db.encounter.findUnique({
    where: { id },
    include: {
      patient: true,
      currentLocation: { include: { department: true } },
      attendingProvider: true,
    },
  })
}

export async function createFromAppointment(
  appointmentId: string,
  type: EncounterType = EncounterType.OUTPATIENT
) {
  const appt = await db.appointment.findUnique({ where: { id: appointmentId } })
  if (!appt) throw new Error('Appointment not found')

  return db.$transaction(async (tx) => {
    const encounter = await tx.encounter.create({
      data: {
        patientId: appt.patientId,
        type,
        status: EncounterStatus.ACTIVE,
        startDateTime: new Date(),
      },
    })
    await tx.appointment.update({ where: { id: appointmentId }, data: { encounterId: encounter.id } })
    return encounter
  })
}

export async function createWalkIn(
  patientId: string,
  type: EncounterType = EncounterType.OUTPATIENT
) {
  return db.encounter.create({
    data: {
      patientId,
      type,
      status: EncounterStatus.ACTIVE,
      startDateTime: new Date(),
    },
  })
}

export async function listActive(opts?: { status?: EncounterStatus }) {
  return db.encounter.findMany({
    where: { status: opts?.status ?? EncounterStatus.ACTIVE },
    include: {
      patient: { select: { id: true, mrn: true, firstName: true, lastName: true, dateOfBirth: true, gender: true } },
      currentLocation: { select: { id: true, unit: true, roomNumber: true, bedNumber: true } },
      attendingProvider: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { startDateTime: 'desc' },
  })
}

export async function triage(encounterId: string, input: TriageInput, userId: string) {
  const staff = await db.staff.findUnique({ where: { userId } })
  if (!staff) throw new Error('Staff record not found for user')

  return db.$transaction(async (tx) => {
    const encounter = await tx.encounter.findUnique({ where: { id: encounterId } })
    if (!encounter) throw new Error('Encounter not found')

    const note = await tx.clinicalNote.create({
      data: {
        encounterId,
        authorId: staff.id,
        noteType: ClinicalNoteType.TRIAGE_NOTE,
        title: `Triage: ${input.triageCategory}`,
        content: JSON.stringify({
          chiefComplaint: input.chiefComplaint,
          triageCategory: input.triageCategory,
          triageDisposition: input.triageDisposition,
          triageNotes: input.triageNotes ?? null,
        }),
        status: ClinicalNoteStatus.SIGNED,
        isSensitive: false,
        signedAt: new Date(),
      },
    })

    const observations = await Promise.all(
      (input.vitals ?? []).map((v) =>
        tx.flowsheetObservation.create({
          data: {
            encounterId,
            recorderId: staff.id,
            recordedAt: new Date(),
            observationType: v.type,
            value: v.value,
            unit: v.unit ?? null,
          },
        })
      )
    )

    if (encounter.status !== EncounterStatus.ACTIVE) {
      await tx.encounter.update({
        where: { id: encounterId },
        data: { status: EncounterStatus.ACTIVE },
      })
    }

    return { note, observations }
  })
}

export async function getFlowsheet(
  encounterId: string,
  userId: string,
  opts?: { take?: number; skip?: number }
) {
  const observations = await db.flowsheetObservation.findMany({
    where: { encounterId },
    include: {
      recorder: { select: { id: true, firstName: true, lastName: true, jobTitle: true } },
    },
    orderBy: { recordedAt: 'desc' },
    take: opts?.take ?? 50,
    skip: opts?.skip ?? 0,
  })

  await db.auditLog
    .create({
      data: {
        userId,
        actionType: AuditActionType.READ,
        entityType: 'Encounter',
        entityId: encounterId,
      },
    })
    .catch(() => {})

  return observations
}

export async function recordObservation(
  encounterId: string,
  input: { observationType: string; value: string; unit?: string | null },
  userId: string
) {
  const staff = await db.staff.findUnique({ where: { userId } })
  if (!staff) throw new Error('Staff record not found')

  const encounter = await db.encounter.findUnique({ where: { id: encounterId }, select: { id: true } })
  if (!encounter) throw new Error('Encounter not found')

  return db.flowsheetObservation.create({
    data: {
      encounterId,
      recorderId: staff.id,
      recordedAt: new Date(),
      observationType: input.observationType as ObservationType,
      value: input.value,
      unit: (input.unit ?? null) as ObservationUnit | null,
    },
    include: {
      recorder: { select: { id: true, firstName: true, lastName: true, jobTitle: true } },
    },
  })
}

export async function transfer(
  encounterId: string,
  toLocationId: string,
  opts?: { fromLocationId?: string; transportStaffId?: string; requesterId?: string }
) {
  return db.$transaction(async (tx) => {
    const encounter = await tx.encounter.update({
      where: { id: encounterId },
      data: { currentLocationId: toLocationId },
    })

    await tx.location.update({ where: { id: toLocationId }, data: { status: 'OCCUPIED' } })

    if (opts?.fromLocationId) {
      await tx.location.update({
        where: { id: opts.fromLocationId },
        data: { status: 'AVAILABLE' },
      })
    }

    const patientTransfer = await tx.patientTransfer.create({
      data: {
        encounterId,
        fromLocationId: opts?.fromLocationId ?? null,
        toLocationId,
        transferDateTime: new Date(),
        transportStaffId: opts?.transportStaffId ?? null,
      },
    })

    await tx.auditLog.create({
      data: {
        userId: opts?.requesterId ?? null,
        actionType: AuditActionType.UPDATE,
        entityType: 'Encounter',
        entityId: encounterId,
        details: {
          action: 'TRANSFER',
          toLocationId,
          fromLocationId: opts?.fromLocationId,
        },
      },
    })

    return { encounter, transfer: patientTransfer }
  })
}

const ORDER_TYPE_TO_CMI: Partial<Record<OrderType, string>> = {
  [OrderType.MEDICATION]: 'cmi_pharm',
  [OrderType.LAB]: 'cmi_80053',
  [OrderType.IMAGING]: 'cmi_71046',
  [OrderType.PROCEDURE]: 'cmi_96365',
}
const ROOM_BOARD_CMI = 'cmi_ms_day'
const MS_PER_DAY = 1000 * 60 * 60 * 24

export async function compileInvoice(encounterId: string, by: string) {
  return db.$transaction(async (tx) => {
    const encounter = await tx.encounter.findUnique({
      where: { id: encounterId },
      include: {
        patient: { select: { id: true } },
        orders: { where: { status: { not: OrderStatus.CANCELLED } } },
      },
    })
    if (!encounter) throw new NotFoundError('Encounter not found')

    const cmiIds = new Set<string>()
    for (const order of encounter.orders) {
      const cmiId = ORDER_TYPE_TO_CMI[order.orderType]
      if (cmiId) cmiIds.add(cmiId)
    }
    if (encounter.admissionDateTime) cmiIds.add(ROOM_BOARD_CMI)

    const chargeItems = await tx.chargeMasterItem.findMany({
      where: { id: { in: [...cmiIds] }, isActive: true },
    })
    const cmiMap = new Map(chargeItems.map((c) => [c.id, c]))

    type LineSpec = { cmiId: string; description: string; qty: number; unitPrice: number }
    const lineSpecs: LineSpec[] = []

    if (encounter.admissionDateTime) {
      const roomCmi = cmiMap.get(ROOM_BOARD_CMI)
      if (roomCmi) {
        const end = encounter.endDateTime ?? new Date()
        const days = Math.max(1, Math.ceil(
          (end.getTime() - encounter.admissionDateTime.getTime()) / MS_PER_DAY
        ))
        lineSpecs.push({
          cmiId: ROOM_BOARD_CMI,
          description: roomCmi.description ?? 'Room & board',
          qty: days,
          unitPrice: roomCmi.priceInCents,
        })
      }
    }

    for (const order of encounter.orders) {
      const cmiId = ORDER_TYPE_TO_CMI[order.orderType]
      if (!cmiId) continue
      const cmi = cmiMap.get(cmiId)
      if (!cmi) continue
      lineSpecs.push({
        cmiId,
        description: cmi.description ?? order.orderType,
        qty: 1,
        unitPrice: cmi.priceInCents,
      })
    }

    const totalCents = lineSpecs.reduce((s, l) => s + l.qty * l.unitPrice, 0)

    let invoice = await tx.invoice.findFirst({
      where: { encounterId },
      orderBy: { issueDate: 'desc' },
    })

    if (invoice) {
      invoice = await tx.invoice.update({
        where: { id: invoice.id },
        data: { totalAmountInCents: totalCents, status: InvoiceStatus.DRAFT },
      })
      await tx.invoiceLineItem.deleteMany({ where: { invoiceId: invoice.id } })
    } else {
      invoice = await tx.invoice.create({
        data: {
          patientId: encounter.patient.id,
          encounterId,
          status: InvoiceStatus.DRAFT,
          totalAmountInCents: totalCents,
          amountPaidInCents: 0,
          issueDate: new Date(),
        },
      })
    }

    await tx.invoiceLineItem.createMany({
      data: lineSpecs.map((l) => ({
        invoiceId: invoice!.id,
        chargeMasterItemId: l.cmiId,
        description: l.description,
        quantity: l.qty,
        unitPriceInCents: l.unitPrice,
        totalPriceInCents: l.qty * l.unitPrice,
      })),
    })

    await tx.auditLog.createMany({
      data: [
        {
          userId: by,
          actionType: AuditActionType.CREATE,
          entityType: 'Invoice',
          entityId: invoice.id,
          details: { encounterId, lineItemCount: lineSpecs.length, totalCents },
        },
        {
          userId: by,
          actionType: AuditActionType.CREATE,
          entityType: 'InvoiceLineItem',
          entityId: invoice.id,
          details: { invoiceId: invoice.id, count: lineSpecs.length },
        },
      ],
    })

    return tx.invoice.findUniqueOrThrow({
      where: { id: invoice.id },
      include: {
        patient: { select: { id: true, mrn: true, firstName: true, lastName: true } },
        encounter: { select: { id: true, type: true, status: true, startDateTime: true } },
        invoiceLineItems: {
          include: { chargeMasterItem: { select: { id: true, itemCode: true, description: true } } },
          orderBy: { id: 'asc' },
        },
      },
    })
  }, { timeout: 10000 })
}

export async function updateDischargeChecklist(
  id: string,
  partial: DischargeChecklistPartial,
  _userId: string
) {
  const validated = DischargeChecklistPartialSchema.parse(partial)

  const encounter = await db.encounter.findUnique({
    where: { id },
    select: { id: true, dischargeChecklist: true },
  })
  if (!encounter) throw new NotFoundError('Encounter not found')

  const existing = (encounter.dischargeChecklist as Record<string, boolean> | null) ?? {}
  const merged = { ...existing, ...validated }

  return db.encounter.update({ where: { id }, data: { dischargeChecklist: merged } })
}

export async function discharge(id: string, userId: string) {
  const staff = await db.staff.findUnique({ where: { userId } })
  if (!staff) throw new Error('Staff record not found')

  const encounter = await db.encounter.findUnique({
    where: { id },
    include: { currentLocation: true },
  })
  if (!encounter) throw new NotFoundError('Encounter not found')
  if (encounter.status === EncounterStatus.DISCHARGED) {
    throw new ConflictError('Encounter already discharged')
  }

  const checklist = (encounter.dischargeChecklist as Record<string, boolean> | null) ?? {}
  const allComplete = DISCHARGE_STEPS.every((step) => checklist[step] === true)
  if (!allComplete) {
    const incomplete = DISCHARGE_STEPS.filter((step) => !checklist[step])
    throw new ConflictError(`Discharge checklist incomplete: ${incomplete.join(', ')}`)
  }

  return db.$transaction(
    async (tx) => {
      const updatedEncounter = await tx.encounter.update({
        where: { id },
        data: { status: EncounterStatus.DISCHARGED, endDateTime: new Date() },
      })

      if (encounter.currentLocationId) {
        await tx.location.update({
          where: { id: encounter.currentLocationId },
          data: { status: 'CLEANING' },
        })
      }

      const note = await tx.clinicalNote.create({
        data: {
          encounterId: id,
          authorId: staff.id,
          noteType: ClinicalNoteType.DISCHARGE_SUMMARY,
          title: 'Discharge Summary',
          content: JSON.stringify({
            dischargeDateTime: new Date().toISOString(),
            dischargedBy: `${staff.firstName} ${staff.lastName}`,
            checklist,
          }),
          status: ClinicalNoteStatus.SIGNED,
          isSensitive: false,
          signedAt: new Date(),
        },
      })

      await tx.auditLog.create({
        data: {
          userId,
          actionType: AuditActionType.UPDATE,
          entityType: 'Encounter',
          entityId: id,
          details: { action: 'DISCHARGE', noteId: note.id },
        },
      })

      return { encounter: updatedEncounter, note }
    },
    { timeout: 10000 }
  )
}
