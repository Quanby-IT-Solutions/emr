import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/services/auth'
import { readSessionCookie } from '@/lib/auth/session'

export async function GET(req: NextRequest) {
  const sessionId = readSessionCookie(req)
  if (!sessionId) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'No session' } },
      { status: 401 }
    )
  }

  const user = await getCurrentUser(sessionId).catch(() => null)
  if (!user) {
    return NextResponse.json(
      { error: { code: 'UNAUTHORIZED', message: 'Session expired or invalid' } },
      { status: 401 }
    )
  }

  return NextResponse.json({ data: user })
}
