import { z } from 'zod'
import { db } from '@/lib/db'
import { NotFoundError, ConflictError } from '@/lib/api/errors'
import { OrderDetailsSchema } from '@/lib/services/orders/schemas'
import { OrderType, OrderPriority } from '@/src/generated/client/enums'

const PlaceOrderInputSchema = z.object({
  encounterId: z.string().min(1),
  orderType: z.nativeEnum(OrderType),
  details: OrderDetailsSchema,
  priority: z.nativeEnum(OrderPriority).default('ROUTINE'),
  clinicalIndication: z.string().optional(),
})

export type PlaceOrderInput = z.infer<typeof PlaceOrderInputSchema>

interface By {
  userId: string
}

export async function place(input: unknown, by: By) {
  const parsed = PlaceOrderInputSchema.parse(input)

  const staff = await db.staff.findFirst({
    where: { userId: by.userId },
    select: { id: true },
  })
  if (!staff) throw new NotFoundError('Staff record not found')

  const encounter = await db.encounter.findUnique({
    where: { id: parsed.encounterId },
    select: { id: true },
  })
  if (!encounter) throw new NotFoundError('Encounter not found')

  return db.$transaction(async (tx) => {
    return tx.order.create({
      data: {
        encounterId: parsed.encounterId,
        placerId: staff.id,
        orderType: parsed.orderType,
        details: parsed.details as object,
        status: 'PLACED',
        priority: parsed.priority,
        clinicalIndication: parsed.clinicalIndication ?? null,
      },
      include: {
        placer: { select: { id: true, firstName: true, lastName: true } },
        encounter: {
          select: {
            id: true,
            patient: { select: { id: true, mrn: true, firstName: true, lastName: true } },
          },
        },
      },
    })
  })
}

export async function cancel(id: string, _by: By) {
  const order = await db.order.findUnique({ where: { id }, select: { id: true, status: true } })
  if (!order) throw new NotFoundError('Order not found')
  if (order.status === 'CANCELLED') throw new ConflictError('Order already cancelled')
  if (order.status === 'COMPLETED') throw new ConflictError('Cannot cancel a completed order')

  return db.order.update({
    where: { id },
    data: { status: 'CANCELLED' },
  })
}

export async function getById(id: string) {
  const order = await db.order.findUnique({
    where: { id },
    include: {
      placer: { select: { id: true, firstName: true, lastName: true, jobTitle: true } },
      encounter: {
        include: {
          patient: { select: { id: true, mrn: true, firstName: true, lastName: true } },
        },
      },
      orderVerifications: { orderBy: { verifiedAt: 'desc' }, take: 1 },
    },
  })
  if (!order) throw new NotFoundError('Order not found')
  return order
}

export async function listForEncounter(
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

export async function listAll(opts?: { orderType?: string; status?: string }) {
  return db.order.findMany({
    where: {
      ...(opts?.orderType ? { orderType: opts.orderType as OrderType } : {}),
      ...(opts?.status ? { status: opts.status as never } : {}),
    },
    include: {
      placer: { select: { id: true, firstName: true, lastName: true } },
      encounter: {
        select: {
          id: true,
          status: true,
          patient: { select: { id: true, mrn: true, firstName: true, lastName: true } },
        },
      },
      orderVerifications: { orderBy: { verifiedAt: 'desc' }, take: 1 },
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  })
}

export async function verify(id: string, input: { notes?: string }, by: By) {
  const staff = await db.staff.findFirst({ where: { userId: by.userId }, select: { id: true } })
  if (!staff) throw new NotFoundError('Staff record not found')

  return db.$transaction(async (tx) => {
    const updated = await tx.order.updateMany({
      where: { id, status: 'PLACED' },
      data: { status: 'VERIFIED' },
    })
    if (updated.count === 0) throw new ConflictError('Order is no longer available for verification')

    await tx.orderVerification.create({
      data: {
        orderId: id,
        pharmacistId: staff.id,
        verifiedAt: new Date(),
        status: 'VERIFIED',
        notes: input.notes ?? null,
      },
    })

    return tx.order.findUnique({ where: { id } })
  })
}

export async function returnToPrescriber(id: string, reason: string, by: By) {
  const staff = await db.staff.findFirst({ where: { userId: by.userId }, select: { id: true } })
  if (!staff) throw new NotFoundError('Staff record not found')

  return db.$transaction(async (tx) => {
    const updated = await tx.order.updateMany({
      where: { id, status: 'PLACED' },
      data: { status: 'CANCELLED' },
    })
    if (updated.count === 0) throw new ConflictError('Order is no longer available for return')

    await tx.orderVerification.create({
      data: {
        orderId: id,
        pharmacistId: staff.id,
        verifiedAt: new Date(),
        status: 'REJECTED',
        notes: reason,
      },
    })

    return tx.order.findUnique({ where: { id } })
  })
}

export async function listForPharmacistQueue() {
  const orders = await db.order.findMany({
    where: { orderType: 'MEDICATION', status: 'PLACED' },
    include: {
      placer: { select: { id: true, firstName: true, lastName: true, jobTitle: true } },
      encounter: {
        include: {
          patient: {
            include: {
              allergies: { where: { status: 'ACTIVE' } },
              patientHistories: {
                where: { status: 'ACTIVE' },
                orderBy: { onsetDate: 'desc' },
                take: 10,
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  })

  return orders.map((order) => {
    const allergies = order.encounter.patient.allergies ?? []
    const clinicalChecks = {
      allergyAlert: allergies.length > 0,
      drugInteraction: false,
      renalDosing: false,
    }
    return { ...order, clinicalChecks }
  })
}

export async function listForLabQueue() {
  return db.order.findMany({
    where: {
      orderType: 'LAB',
      status: { in: ['PLACED', 'IN_PROGRESS'] as never[] },
    },
    include: {
      placer: { select: { id: true, firstName: true, lastName: true } },
      encounter: {
        select: {
          id: true,
          type: true,
          patient: {
            select: {
              id: true,
              mrn: true,
              firstName: true,
              lastName: true,
              dateOfBirth: true,
              gender: true,
            },
          },
        },
      },
      labResults: true,
    },
    orderBy: { createdAt: 'asc' },
  })
}

export async function getVerificationView(id: string, _viewer: By) {
  const order = await db.order.findUnique({
    where: { id },
    include: {
      placer: { select: { id: true, firstName: true, lastName: true, jobTitle: true } },
      encounter: {
        include: {
          patient: {
            include: {
              allergies: true,
              patientHistories: { orderBy: { onsetDate: 'desc' }, take: 10 },
            },
          },
        },
      },
      orderVerifications: { orderBy: { verifiedAt: 'desc' }, take: 1 },
    },
  })
  if (!order) throw new NotFoundError('Order not found')

  const allergies = order.encounter.patient.allergies ?? []
  const clinicalChecks = {
    allergyAlert: allergies.length > 0,
    drugInteraction: false,
    renalDosing: false,
  }

  return { order, clinicalChecks }
}
