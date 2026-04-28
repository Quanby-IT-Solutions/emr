import { describe, it, expect, vi } from 'vitest'
import { _writeAudit } from '@/lib/db'
import type { PrismaClient } from '@/src/generated/client'

function makeMockPrisma(auditCreate: ReturnType<typeof vi.fn>) {
  return {
    auditLog: { create: auditCreate },
  } as unknown as PrismaClient
}

describe('audit extension — _writeAudit', () => {
  it('calls auditLog.create with correct fields', async () => {
    const auditCreate = vi.fn().mockResolvedValue(undefined)
    const mock = makeMockPrisma(auditCreate)

    await _writeAudit(mock, 'CREATE', 'Patient', 'patient-1')

    expect(auditCreate).toHaveBeenCalledOnce()
    expect(auditCreate).toHaveBeenCalledWith({
      data: {
        userId: null,
        actionType: 'CREATE',
        entityType: 'Patient',
        entityId: 'patient-1',
      },
    })
  })

  it('uses getCurrentUser() for userId', async () => {
    const { getCurrentUser } = await import('@/lib/request-context')
    vi.mocked(getCurrentUser).mockReturnValueOnce('user-42')

    const auditCreate = vi.fn().mockResolvedValue(undefined)
    const mock = makeMockPrisma(auditCreate)

    await _writeAudit(mock, 'UPDATE', 'Order', 'order-9')

    expect(auditCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({ userId: 'user-42' }),
    })
  })

  it('swallows auditLog.create errors without throwing', async () => {
    const auditCreate = vi.fn().mockRejectedValue(new Error('DB connection lost'))
    const mock = makeMockPrisma(auditCreate)

    await expect(_writeAudit(mock, 'DELETE', 'Location', 'loc-1')).resolves.toBeUndefined()
  })

  it('coerces missing entityId to null', async () => {
    const auditCreate = vi.fn().mockResolvedValue(undefined)
    const mock = makeMockPrisma(auditCreate)

    await _writeAudit(mock, 'CREATE', 'AuditLog')

    expect(auditCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({ entityId: null }),
    })
  })
})
