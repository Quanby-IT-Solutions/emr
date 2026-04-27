import { describe, it, expect, vi, beforeEach } from 'vitest'
import { OrderDetailsSchema } from '@/lib/services/orders/schemas'
import { ConflictError, NotFoundError } from '@/lib/api/errors'

// ─── Test #4: OrderDetailsSchema ───────────────────────────────────────────

describe('OrderDetailsSchema (Test #4)', () => {
  it('accepts a valid MEDICATION order', () => {
    const result = OrderDetailsSchema.safeParse({
      orderType: 'MEDICATION',
      medicationName: 'Metformin',
      dose: '500mg',
      route: 'PO',
      frequency: 'BID',
    })
    expect(result.success).toBe(true)
  })

  it('accepts a valid LAB order', () => {
    const result = OrderDetailsSchema.safeParse({
      orderType: 'LAB',
      testName: 'CBC',
      specimen: 'BLOOD',
    })
    expect(result.success).toBe(true)
  })

  it('accepts a LAB order without optional specimen', () => {
    const result = OrderDetailsSchema.safeParse({
      orderType: 'LAB',
      testName: 'Troponin',
    })
    expect(result.success).toBe(true)
  })

  it('rejects MEDICATION order missing dose', () => {
    const result = OrderDetailsSchema.safeParse({
      orderType: 'MEDICATION',
      medicationName: 'Metformin',
      route: 'PO',
      frequency: 'BID',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('dose'))).toBe(true)
    }
  })

  it('rejects MEDICATION order with empty dose', () => {
    const result = OrderDetailsSchema.safeParse({
      orderType: 'MEDICATION',
      medicationName: 'Metformin',
      dose: '',
      route: 'PO',
      frequency: 'BID',
    })
    expect(result.success).toBe(false)
  })

  it('rejects unknown orderType', () => {
    const result = OrderDetailsSchema.safeParse({
      orderType: 'BLOOD_DRAW',
      item: 'something',
    })
    expect(result.success).toBe(false)
  })

  it('accepts IMAGING order', () => {
    const result = OrderDetailsSchema.safeParse({
      orderType: 'IMAGING',
      study: 'XRAY',
      bodyPart: 'Chest',
    })
    expect(result.success).toBe(true)
  })

  it('accepts ADMIT_INPATIENT order', () => {
    const result = OrderDetailsSchema.safeParse({
      orderType: 'ADMIT_INPATIENT',
      unit: 'MED_WARD',
    })
    expect(result.success).toBe(true)
  })

  it('accepts DISCHARGE order with no fields', () => {
    const result = OrderDetailsSchema.safeParse({ orderType: 'DISCHARGE' })
    expect(result.success).toBe(true)
  })
})

// ─── Test #6: Order state-machine cancel guard ──────────────────────────────

const mocks = vi.hoisted(() => ({
  orderFindUnique: vi.fn(),
  orderUpdate: vi.fn(),
  staffFindFirst: vi.fn(),
  encounterFindUnique: vi.fn(),
  transaction: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  db: {
    order: {
      findUnique: mocks.orderFindUnique,
      update: mocks.orderUpdate,
    },
    staff: { findFirst: mocks.staffFindFirst },
    encounter: { findUnique: mocks.encounterFindUnique },
    $transaction: mocks.transaction,
  },
}))

import { cancel } from '@/lib/services/orders'

const BY = { userId: 'user-1' }

describe('cancel order state-machine guard (Test #6)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('throws NotFoundError when order does not exist', async () => {
    mocks.orderFindUnique.mockResolvedValue(null)
    await expect(cancel('order-missing', BY)).rejects.toThrow(NotFoundError)
  })

  it('throws ConflictError when order is already CANCELLED', async () => {
    mocks.orderFindUnique.mockResolvedValue({ id: 'order-1', status: 'CANCELLED' })
    await expect(cancel('order-1', BY)).rejects.toThrow(ConflictError)
  })

  it('throws ConflictError when order is COMPLETED', async () => {
    mocks.orderFindUnique.mockResolvedValue({ id: 'order-1', status: 'COMPLETED' })
    await expect(cancel('order-1', BY)).rejects.toThrow(ConflictError)
  })

  it('cancels a PLACED order', async () => {
    mocks.orderFindUnique.mockResolvedValue({ id: 'order-1', status: 'PLACED' })
    mocks.orderUpdate.mockResolvedValue({ id: 'order-1', status: 'CANCELLED' })

    const result = await cancel('order-1', BY)

    expect(mocks.orderUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'order-1' },
        data: { status: 'CANCELLED' },
      })
    )
    expect(result.status).toBe('CANCELLED')
  })

  it('cancels a VERIFIED order', async () => {
    mocks.orderFindUnique.mockResolvedValue({ id: 'order-2', status: 'VERIFIED' })
    mocks.orderUpdate.mockResolvedValue({ id: 'order-2', status: 'CANCELLED' })

    await cancel('order-2', BY)
    expect(mocks.orderUpdate).toHaveBeenCalledOnce()
  })

  it('cancels an IN_PROGRESS order', async () => {
    mocks.orderFindUnique.mockResolvedValue({ id: 'order-3', status: 'IN_PROGRESS' })
    mocks.orderUpdate.mockResolvedValue({ id: 'order-3', status: 'CANCELLED' })

    await cancel('order-3', BY)
    expect(mocks.orderUpdate).toHaveBeenCalledOnce()
  })
})
