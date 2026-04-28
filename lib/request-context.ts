import { AsyncLocalStorage } from 'node:async_hooks'

type RequestContext = { userId: string | null }

const store = new AsyncLocalStorage<RequestContext>()

export function runWithUser<T>(userId: string | null, fn: () => T): T {
  return store.run({ userId }, fn)
}

export function getCurrentUser(): string | null {
  return store.getStore()?.userId ?? null
}
