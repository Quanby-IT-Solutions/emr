import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserRole } from '@/src/generated/client/enums'
import { UnauthorizedError, ForbiddenError } from '@/lib/api/errors'

vi.mock('@/lib/auth/session', () => ({
  readSessionCookie: vi.fn(),
  getSessionUser: vi.fn(),
}))

import { requireRole } from '@/lib/auth/guard'
import { readSessionCookie, getSessionUser } from '@/lib/auth/session'

const mockReadCookie = vi.mocked(readSessionCookie)
const mockGetSession = vi.mocked(getSessionUser)

function makeReq() {
  return {} as Parameters<typeof requireRole>[0]
}

describe('requireRole', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('throws UnauthorizedError when no session cookie', async () => {
    mockReadCookie.mockReturnValue(null)
    await expect(requireRole(makeReq(), UserRole.NURSE)).rejects.toThrow(UnauthorizedError)
  })

  it('throws UnauthorizedError when session not found or expired', async () => {
    mockReadCookie.mockReturnValue('stale-session')
    mockGetSession.mockResolvedValue(null)
    await expect(requireRole(makeReq(), UserRole.NURSE)).rejects.toThrow(UnauthorizedError)
  })

  it('throws ForbiddenError when role does not match', async () => {
    mockReadCookie.mockReturnValue('session-123')
    mockGetSession.mockResolvedValue({ userId: 'user-1', role: UserRole.CLINICIAN })
    await expect(requireRole(makeReq(), UserRole.NURSE)).rejects.toThrow(ForbiddenError)
  })

  it('returns user when single role matches', async () => {
    mockReadCookie.mockReturnValue('session-123')
    mockGetSession.mockResolvedValue({ userId: 'user-1', role: UserRole.NURSE })
    const user = await requireRole(makeReq(), UserRole.NURSE)
    expect(user).toEqual({ userId: 'user-1', role: UserRole.NURSE })
  })

  it('returns user when role is in allowed array', async () => {
    mockReadCookie.mockReturnValue('session-123')
    mockGetSession.mockResolvedValue({ userId: 'user-1', role: UserRole.NURSE })
    const user = await requireRole(makeReq(), [UserRole.CLINICIAN, UserRole.NURSE])
    expect(user).toEqual({ userId: 'user-1', role: UserRole.NURSE })
  })

  it('throws ForbiddenError when role is not in allowed array', async () => {
    mockReadCookie.mockReturnValue('session-123')
    mockGetSession.mockResolvedValue({ userId: 'user-1', role: UserRole.PHARMACIST })
    await expect(
      requireRole(makeReq(), [UserRole.CLINICIAN, UserRole.NURSE])
    ).rejects.toThrow(ForbiddenError)
  })
})
