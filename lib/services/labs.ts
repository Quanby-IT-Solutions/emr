import { z } from 'zod'
import { db } from '@/lib/db'
import { NotFoundError, ConflictError } from '@/lib/api/errors'

interface By {
  userId: string
}

const LabResultInputSchema = z.object({
  loincCode: z.string().optional(),
  analyteName: z.string().min(1),
  value: z.string(),
  unit: z.string().optional(),
  referenceRange: z.string().optional(),
  flag: z.string().optional(),
})

export type LabResultInput = z.infer<typeof LabResultInputSchema>

export async function enterResults(orderId: string, results: unknown[], _by: By) {
  const order = await db.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true, orderType: true },
  })
  if (!order) throw new NotFoundError('Order not found')
  if (order.orderType !== 'LAB') throw new ConflictError('Not a lab order')
  if (order.status !== 'PLACED' && order.status !== 'IN_PROGRESS') {
    throw new ConflictError(`Cannot enter results for order with status ${order.status}`)
  }

  const parsed = z.array(LabResultInputSchema).parse(results)

  return db.$transaction(async (tx) => {
    await tx.labResult.deleteMany({ where: { orderId } })

    if (parsed.length > 0) {
      await tx.labResult.createMany({
        data: parsed.map((r) => ({
          orderId,
          loincCode: r.loincCode ?? null,
          analyteName: r.analyteName,
          value: r.value,
          unit: r.unit ?? null,
          referenceRange: r.referenceRange ?? null,
          flag: r.flag ?? null,
          status: 'PRELIMINARY',
          observedAt: new Date(),
        })),
      })
    }

    if (order.status === 'PLACED') {
      await tx.order.updateMany({
        where: { id: orderId, status: 'PLACED' },
        data: { status: 'IN_PROGRESS' },
      })
    }

    return tx.order.findUnique({ where: { id: orderId }, include: { labResults: true } })
  })
}

export async function validate(orderId: string, _by: By) {
  return db.$transaction(async (tx) => {
    const updated = await tx.order.updateMany({
      where: { id: orderId, status: 'IN_PROGRESS' },
      data: { status: 'COMPLETED' },
    })
    if (updated.count === 0) throw new ConflictError('Order is not IN_PROGRESS')

    return tx.order.findUnique({ where: { id: orderId } })
  })
}
