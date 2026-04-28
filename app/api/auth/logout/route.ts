import { NextRequest, NextResponse } from 'next/server'
import { logout } from '@/lib/services/auth'
import { readSessionCookie, clearSessionCookie } from '@/lib/auth/session'

export async function POST(req: NextRequest) {
  const sessionId = readSessionCookie(req)
  if (sessionId) {
    await logout(sessionId).catch(() => {})
  }

  const res = NextResponse.json({ data: { loggedOut: true } })
  clearSessionCookie(res)
  return res
}
