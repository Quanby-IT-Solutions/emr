import { NextRequest, NextResponse } from 'next/server'
import { login } from '@/lib/services/auth'
import { setSessionCookie } from '@/lib/auth/session'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password } = body ?? {}

    if (!username || !password) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Username and password required' } },
        { status: 400 }
      )
    }

    const result = await login(String(username).trim().toLowerCase(), String(password))
    if (!result) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } },
        { status: 401 }
      )
    }

    const res = NextResponse.json({ data: result.user })
    setSessionCookie(res, result.sessionId, result.expiresAt)
    return res
  } catch (err) {
    console.error('[auth/login]', err)
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    )
  }
}
