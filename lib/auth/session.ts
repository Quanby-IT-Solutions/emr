import type { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UserRole } from '@/src/generated/client'

const COOKIE_NAME = 'emr_session'
const SESSION_MS = 24 * 60 * 60 * 1000

export interface AuthUser {
  userId: string
  role: UserRole
}

export async function createSession(userId: string): Promise<{ sessionId: string; expiresAt: Date }> {
  const expiresAt = new Date(Date.now() + SESSION_MS)
  const session = await db.session.create({ data: { userId, expiresAt } })
  return { sessionId: session.id, expiresAt }
}

export async function getSessionUser(sessionId: string): Promise<AuthUser | null> {
  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  })
  if (!session || session.expiresAt < new Date()) return null
  return { userId: session.userId, role: session.user.role as UserRole }
}

export async function revokeSession(sessionId: string): Promise<void> {
  await db.session.delete({ where: { id: sessionId } }).catch(() => {})
}

export function readSessionCookie(req: NextRequest): string | null {
  return req.cookies.get(COOKIE_NAME)?.value ?? null
}

export function setSessionCookie(res: NextResponse, sessionId: string, expiresAt: Date): void {
  res.cookies.set(COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
  })
}

export function clearSessionCookie(res: NextResponse): void {
  res.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
  })
}
