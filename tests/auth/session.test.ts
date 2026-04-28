import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserRole } from '@/src/generated/client'

vi.mock('@/lib/db', () => ({
  db: {
    session: {
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

import { createSession, getSessionUser, revokeSession } from '@/lib/auth/session'
import { db } from '@/lib/db'

const mockDb = db as unknown as {
  session: {
    create: ReturnType<typeof vi.fn>
    findUnique: ReturnType<typeof vi.fn>
    delete: ReturnType<typeof vi.fn>
  }
}

describe('createSession', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns sessionId and a future expiresAt', async () => {
    const expiresAt = new Date(Date.now() + 86400000)
    mockDb.session.create.mockResolvedValue({ id: 'sess-abc', userId: 'user-1', expiresAt, createdAt: new Date() })

    const result = await createSession('user-1')

    expect(result.sessionId).toBe('sess-abc')
    expect(result.expiresAt.getTime()).toBeGreaterThan(Date.now())
    expect(mockDb.session.create).toHaveBeenCalledWith({
      data: { userId: 'user-1', expiresAt: expect.any(Date) },
    })
  })
})

describe('getSessionUser', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns AuthUser when session is valid', async () => {
    mockDb.session.findUnique.mockResolvedValue({
      id: 'sess-abc',
      userId: 'user-1',
      expiresAt: new Date(Date.now() + 86400000),
      user: { id: 'user-1', role: UserRole.NURSE },
    })

    const user = await getSessionUser('sess-abc')

    expect(user).toEqual({ userId: 'user-1', role: UserRole.NURSE })
  })

  it('returns null when session is expired', async () => {
    mockDb.session.findUnique.mockResolvedValue({
      id: 'sess-abc',
      userId: 'user-1',
      expiresAt: new Date(Date.now() - 1000),
      user: { id: 'user-1', role: UserRole.NURSE },
    })

    const user = await getSessionUser('sess-abc')

    expect(user).toBeNull()
  })

  it('returns null when session not found', async () => {
    mockDb.session.findUnique.mockResolvedValue(null)

    const user = await getSessionUser('nonexistent')

    expect(user).toBeNull()
  })
})

describe('revokeSession', () => {
  beforeEach(() => vi.clearAllMocks())

  it('deletes the session row', async () => {
    mockDb.session.delete.mockResolvedValue({})

    await revokeSession('sess-abc')

    expect(mockDb.session.delete).toHaveBeenCalledWith({ where: { id: 'sess-abc' } })
  })

  it('makes subsequent getSessionUser return null', async () => {
    mockDb.session.delete.mockResolvedValue({})
    await revokeSession('sess-abc')

    mockDb.session.findUnique.mockResolvedValue(null)
    const user = await getSessionUser('sess-abc')

    expect(user).toBeNull()
  })

  it('does not throw when session does not exist', async () => {
    mockDb.session.delete.mockRejectedValue(new Error('Record not found'))

    await expect(revokeSession('nonexistent')).resolves.toBeUndefined()
  })
})
