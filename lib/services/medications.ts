import { db } from '@/lib/db'
import { z } from 'zod'
import { MedAdminStatus, OrderType, OrderStatus, EncounterStatus } from '@/src/generated/client'
import { ConflictError, NotFoundError } from '@/lib/api/errors'

export const AdministerInputSchema = z.object({
  status: z.enum(['GIVEN', 'HELD', 'REFUSED', 'PARTIAL_DOSE']),
  administrationTime: z.string().optional(),
  reasonForOmission: z.string().optional(),
  witnessId: z.string().optional(),
})

export type AdministerInput = z.infer<typeof AdministerInputSchema>

export async function administer(orderId: string, input: AdministerInput, userId: string) {
  const staff = await db.staff.findUnique({ where: { userId } })
  if (!staff) throw new Error('Staff record not found')

  const order = await db.order.findUnique({ where: { id: orderId } })
  if (!order) throw new NotFoundError('Order not found')
  if (order.orderType !== OrderType.MEDICATION) {
    throw new ConflictError('Order is not a medication order')
  }
  if (order.status !== OrderStatus.VERIFIED && order.status !== OrderStatus.IN_PROGRESS) {
    throw new ConflictError('Medication order must be VERIFIED or IN_PROGRESS to administer')
  }

  return db.$transaction(async (tx) => {
    const administration = await tx.medicationAdministration.create({
      data: {
        orderId,
        nurseId: staff.id,
        administrationTime: input.administrationTime ? new Date(input.administrationTime) : new Date(),
        status: input.status as MedAdminStatus,
        reasonForOmission: input.reasonForOmission ?? null,
        witnessId: input.witnessId ?? null,
      },
    })

    if (order.status === OrderStatus.VERIFIED) {
      await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.IN_PROGRESS },
      })
    }

    return administration
  })
}

export async function listForOrder(orderId: string) {
  return db.medicationAdministration.findMany({
    where: { orderId },
    include: {
      nurse: { select: { id: true, firstName: true, lastName: true, jobTitle: true } },
      witness: { select: { id: true, firstName: true, lastName: true } },
    },
    orderBy: { administrationTime: 'desc' },
  })
}

export async function listPendingMedOrders() {
  return db.order.findMany({
    where: {
      orderType: OrderType.MEDICATION,
      status: { in: [OrderStatus.VERIFIED, OrderStatus.IN_PROGRESS] },
      encounter: { status: EncounterStatus.ACTIVE },
    },
    include: {
      encounter: {
        include: {
          patient: {
            select: { id: true, mrn: true, firstName: true, lastName: true, dateOfBirth: true, gender: true },
          },
          currentLocation: {
            select: { id: true, unit: true, roomNumber: true, bedNumber: true },
          },
        },
      },
      medicationAdministrations: {
        include: {
          nurse: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: { administrationTime: 'desc' },
        take: 20,
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}
