import { vi } from 'vitest'

vi.mock('@/lib/request-context', () => ({
  getCurrentUser: vi.fn().mockReturnValue(null),
  runWithUser: vi.fn(),
}))
