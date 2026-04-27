import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ConflictError, NotFoundError } from '@/lib/api/errors'

interface MockTx {
  encounter: { update: ReturnType<typeof vi.fn> }
  location: { update: ReturnType<typeof vi.fn> }
  clinicalNote: { create: ReturnType<typeof vi.fn> }
  auditLog: { create: ReturnType<typeof vi.fn> }
}

const mocks = vi.hoisted(() => ({
  staffFindUnique: vi.fn(),
  encounterFindUnique: vi.fn(),
  transaction: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  db: {
    staff: { findUnique: mocks.staffFindUnique },
    encounter: { findUnique: mocks.encounterFindUnique },
    $transaction: mocks.transaction,
  },
}))

import { discharge, DISCHARGE_STEPS } from '@/lib/services/encounters'

const FULL_CHECKLIST = Object.fromEntries(DISCHARGE_STEPS.map((s) => [s, true]))
const STUB_STAFF = { id: 'staff-1', userId: 'user-1', firstName: 'Nurse', lastName: 'Joy' }

function makeTx(overrides?: Partial<{
  encounterUpdate: ReturnType<typeof vi.fn>
  locationUpdate: ReturnType<typeof vi.fn>
  noteCreate: ReturnType<typeof vi.fn>
  auditCreate: ReturnType<typeof vi.fn>
}>): MockTx {
  return {
    encounter: { update: overrides?.encounterUpdate ?? vi.fn().mockResolvedValue({ id: 'enc-1', status: 'DISCHARGED', endDateTime: new Date() }) },
    location: { update: overrides?.locationUpdate ?? vi.fn().mockResolvedValue({}) },
    clinicalNote: { create: overrides?.noteCreate ?? vi.fn().mockResolvedValue({ id: 'note-1' }) },
    auditLog: { create: overrides?.auditCreate ?? vi.fn().mockResolvedValue({}) },
  }
}

describe('discharge transaction (Test #7)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('throws NotFoundError when encounter not found', async () => {
    mocks.staffFindUnique.mockResolvedValue(STUB_STAFF)
    mocks.encounterFindUnique.mockResolvedValue(null)

    await expect(discharge('enc-missing', 'user-1')).rejects.toThrow(NotFoundError)
  })

  it('throws ConflictError when already discharged', async () => {
    mocks.staffFindUnique.mockResolvedValue(STUB_STAFF)
    mocks.encounterFindUnique.mockResolvedValue({
      id: 'enc-1',
      status: 'DISCHARGED',
      currentLocationId: null,
      dischargeChecklist: FULL_CHECKLIST,
    })

    await expect(discharge('enc-1', 'user-1')).rejects.toThrow(ConflictError)
  })

  it('throws ConflictError when checklist is incomplete', async () => {
    mocks.staffFindUnique.mockResolvedValue(STUB_STAFF)
    mocks.encounterFindUnique.mockResolvedValue({
      id: 'enc-1',
      status: 'ACTIVE',
      currentLocationId: null,
      dischargeChecklist: { 'Discharge Summary': true },
    })

    await expect(discharge('enc-1', 'user-1')).rejects.toThrow(ConflictError)
  })

  it('success: writes 3 entities + 1 audit row inside transaction', async () => {
    mocks.staffFindUnique.mockResolvedValue(STUB_STAFF)
    mocks.encounterFindUnique.mockResolvedValue({
      id: 'enc-1',
      status: 'ACTIVE',
      currentLocationId: 'loc-1',
      currentLocation: { id: 'loc-1' },
      dischargeChecklist: FULL_CHECKLIST,
    })

    const tx = makeTx()
    mocks.transaction.mockImplementation(async (fn: (tx: MockTx) => Promise<unknown>) => fn(tx))

    const result = await discharge('enc-1', 'user-1')

    expect(tx.encounter.update).toHaveBeenCalledOnce()
    expect(tx.encounter.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'enc-1' },
        data: expect.objectContaining({ status: 'DISCHARGED' }),
      })
    )
    expect(tx.location.update).toHaveBeenCalledOnce()
    expect(tx.location.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'loc-1' },
        data: { status: 'CLEANING' },
      })
    )
    expect(tx.clinicalNote.create).toHaveBeenCalledOnce()
    expect(tx.auditLog.create).toHaveBeenCalledOnce()

    expect(result.note).toEqual({ id: 'note-1' })
  })

  it('skips location update when encounter has no location', async () => {
    mocks.staffFindUnique.mockResolvedValue(STUB_STAFF)
    mocks.encounterFindUnique.mockResolvedValue({
      id: 'enc-2',
      status: 'ACTIVE',
      currentLocationId: null,
      currentLocation: null,
      dischargeChecklist: FULL_CHECKLIST,
    })

    const tx = makeTx()
    mocks.transaction.mockImplementation(async (fn: (tx: MockTx) => Promise<unknown>) => fn(tx))

    await discharge('enc-2', 'user-1')

    expect(tx.location.update).not.toHaveBeenCalled()
    expect(tx.encounter.update).toHaveBeenCalledOnce()
    expect(tx.clinicalNote.create).toHaveBeenCalledOnce()
  })

  it('rollback: rejects when note creation fails', async () => {
    mocks.staffFindUnique.mockResolvedValue(STUB_STAFF)
    mocks.encounterFindUnique.mockResolvedValue({
      id: 'enc-1',
      status: 'ACTIVE',
      currentLocationId: 'loc-1',
      dischargeChecklist: FULL_CHECKLIST,
    })

    const tx = makeTx({
      noteCreate: vi.fn().mockRejectedValue(new Error('DB write failed')),
    })
    mocks.transaction.mockImplementation(async (fn: (tx: MockTx) => Promise<unknown>) => fn(tx))

    await expect(discharge('enc-1', 'user-1')).rejects.toThrow('DB write failed')
    expect(tx.clinicalNote.create).toHaveBeenCalledOnce()
  })
})
