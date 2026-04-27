import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser, readSessionCookie } from '@/lib/auth/session'
import { UserRole } from '@/src/generated/client/enums'

// Must run on Node runtime — session lookup hits Postgres via the singleton.
// Edge runtime cannot load bcryptjs or use the Prisma singleton.

const ROLE_DASHBOARDS: Record<UserRole, string> = {
  [UserRole.SYSTEM_ADMIN]: '/admin',
  [UserRole.AUDITOR]: '/auditor',
  [UserRole.CLINICIAN]: '/clinician',
  [UserRole.PHARMACIST]: '/pharmacist',
  [UserRole.NURSE]: '/nurse',
  [UserRole.LAB_TECH]: '/lab-tech',
  [UserRole.HIM_CODER]: '/him-coder',
  [UserRole.BILLER]: '/biller',
  [UserRole.REGISTRAR]: '/registrar',
  [UserRole.SCHEDULER]: '/scheduler',
  [UserRole.PATIENT]: '/patient',
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const sessionId = readSessionCookie(req)

  if (pathname === '/login') {
    if (!sessionId) return NextResponse.next()
    try {
      const user = await getSessionUser(sessionId)
      if (user) {
        const dest = ROLE_DASHBOARDS[user.role] ?? '/'
        return NextResponse.redirect(new URL(dest, req.url))
      }
    } catch (err) {
      // fail open — DB unreachable; per-route guard will reject on next request
      console.error('[middleware] session lookup failed:', err)
    }
    return NextResponse.next()
  }

  // Dashboard paths: require a session cookie at minimum.
  // Per-route requireRole() validates the DB-backed session on each request.
  if (!sessionId) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    const user = await getSessionUser(sessionId)
    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  } catch (err) {
    // fail open — let through; per-route guard rejects
    console.error('[middleware] session lookup failed, failing open:', err)
  }

  return NextResponse.next()
}

export const config = {
  runtime: 'nodejs',
  matcher: [
    '/login',
    '/(admin|auditor|biller|clinician|him-coder|it-support|lab-tech|nurse|patient|pharmacist|registrar|scheduler|profile)/:path*',
  ],
}
