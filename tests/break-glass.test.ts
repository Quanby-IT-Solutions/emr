import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NotFoundError } from '@/lib/api/errors'
import { ZodError } from 'zod'

const mocks = vi.hoisted(() => ({
  auditLogCreate: vi.fn(),
  patientFindUnique: vi.fn(),
  auditLogFindMany: vi.fn(),
}))

vi.mock('@/lib/db', () => ({
  db: {
    auditLog: {
      create: mocks.auditLogCreate,
      findMany: mocks.auditLogFindMany,
    },
    patient: {
      findUnique: mocks.patientFindUnique,
    },
  },
}))

import { requestAccess, getActiveSessions } from '@/lib/services/break-glass'

const BY = { userId: 'user-clinician-1' }

const STUB_PATIENT = {
  id: 'patient-1',
  mrn: 'PGH-2025-00001',
  firstName: 'Maria',
  lastName: 'Santos',
}

describe('break-glass service (Test #8)', () => {
  beforeEach(() => vi.clearAllMocks())

  // Validation tests
  it('rejects justification shorter than 50 characters', async () => {
    await expect(
      requestAccess(
        {
          patientId: 'patient-1',
          reason: 'Direct Patient Care Emergency',
          justification: 'Too short',
        },
        BY
      )
    ).rejects.toThrow(ZodError)
  })

  it('rejects justification of exactly 49 characters', async () => {
    await expect(
      requestAccess(
        {
          patientId: 'patient-1',
          reason: 'Direct Patient Care Emergency',
          justification: 'a'.repeat(49),
        },
        BY
      )
    ).rejects.toThrow(ZodError)
  })

  it('rejects missing reason', async () => {
    await expect(
      requestAccess(
        {
          patientId: 'patient-1',
          justification: 'a'.repeat(50),
        },
        BY
      )
    ).rejects.toThrow(ZodError)
  })

  it('throws NotFoundError when patient does not exist', async () => {
    mocks.patientFindUnique.mockResolvedValue(null)

    await expect(
      requestAccess(
        {
          patientId: 'patient-missing',
          reason: 'Direct Patient Care Emergency',
          justification: 'Patient presented unconscious in ER requiring immediate medication review.',
        },
        BY
      )
    ).rejects.toThrow(NotFoundError)
  })

  it('on success: writes BREAK_GLASS audit row with patientId and reason', async () => {
    mocks.patientFindUnique.mockResolvedValue(STUB_PATIENT)
    const now = new Date()
    mocks.auditLogCreate.mockResolvedValue({
      id: BigInt(42),
      timestamp: now,
      actionType: 'BREAK_GLASS',
      entityId: 'patient-1',
      reasonForAccess: 'a'.repeat(50),
    })

    const justification = 'Patient in cardiac arrest — needed allergy history for resuscitation medications.'

    await requestAccess(
      {
        patientId: 'patient-1',
        reason: 'Direct Patient Care Emergency',
        justification,
      },
      BY
    )

    expect(mocks.auditLogCreate).toHaveBeenCalledOnce()
    expect(mocks.auditLogCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: BY.userId,
          actionType: 'BREAK_GLASS',
          entityType: 'Patient',
          entityId: 'patient-1',
          reasonForAccess: justification,
          details: expect.objectContaining({
            reason: 'Direct Patient Care Emergency',
          }),
        }),
      })
    )
  })

  it('on success: returns expiresAt approximately 1 hour from now', async () => {
    mocks.patientFindUnique.mockResolvedValue(STUB_PATIENT)
    const now = new Date()
    mocks.auditLogCreate.mockResolvedValue({
      id: BigInt(43),
      timestamp: now,
      actionType: 'BREAK_GLASS',
      entityId: 'patient-1',
      reasonForAccess: 'valid justification text here',
    })

    const result = await requestAccess(
      {
        patientId: 'patient-1',
        reason: 'Direct Patient Care Emergency',
        justification: 'a'.repeat(50),
      },
      BY
    )

    const expiresAt = new Date(result.expiresAt)
    const diffMs = expiresAt.getTime() - now.getTime()
    expect(diffMs).toBeCloseTo(60 * 60 * 1000, -3) // within 1 second
    expect(result.patient.id).toBe('patient-1')
    expect(result.auditLogId).toBe('43')
  })

  it('on success: opens 1-hour session visible in getActiveSessions', async () => {
    const recentTimestamp = new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
    mocks.auditLogFindMany.mockResolvedValue([
      {
        id: BigInt(44),
        timestamp: recentTimestamp,
        actionType: 'BREAK_GLASS',
        entityId: 'patient-1',
        entityType: 'Patient',
        reasonForAccess: 'a'.repeat(50),
        details: {
          reason: 'Direct Patient Care Emergency',
          patientMrn: 'PGH-2025-00001',
          patientName: 'Maria Santos',
        },
      },
    ])

    const sessions = await getActiveSessions(BY)

    expect(sessions).toHaveLength(1)
    expect(sessions[0].patientId).toBe('patient-1')
    expect(sessions[0].minutesRemaining).toBeGreaterThan(50)
    expect(sessions[0].minutesRemaining).toBeLessThanOrEqual(60)
  })

  it('getActiveSessions filters out expired sessions', async () => {
    const expiredTimestamp = new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    mocks.auditLogFindMany.mockResolvedValue([
      {
        id: BigInt(45),
        timestamp: expiredTimestamp,
        actionType: 'BREAK_GLASS',
        entityId: 'patient-1',
        entityType: 'Patient',
        reasonForAccess: 'justification text',
        details: { reason: 'Other', patientMrn: 'PGH-2025-00001', patientName: 'Maria Santos' },
      },
    ])

    const sessions = await getActiveSessions(BY)
    expect(sessions).toHaveLength(0)
  })
})
