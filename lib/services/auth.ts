import bcryptjs from 'bcryptjs'
import { db } from '@/lib/db'
import { AuditActionType } from '@/src/generated/client'
import { UserRole } from '@/src/generated/client'
import { createSession, getSessionUser, revokeSession } from '@/lib/auth/session'
import { runWithUser } from '@/lib/request-context'

export interface AuthUserFull {
  id: string
  username: string
  email: string
  role: UserRole
  isActive: boolean
  staffId?: string
  staffFirstName?: string
  staffLastName?: string
  staffJobTitle?: string
  staffDepartment?: string
}

export async function login(
  username: string,
  password: string
): Promise<{ user: AuthUserFull; sessionId: string; expiresAt: Date } | null> {
  const user = await db.user.findUnique({ where: { username } })
  if (!user || !user.isActive) return null

  const valid = await bcryptjs.compare(password, user.passwordHash)
  if (!valid) return null

  const { sessionId, expiresAt } = await createSession(user.id)

  await runWithUser(user.id, () =>
    db.auditLog.create({
      data: {
        userId: user.id,
        actionType: AuditActionType.LOGIN,
        entityType: 'User',
        entityId: user.id,
      },
    })
  )

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role as UserRole,
      isActive: user.isActive,
    },
    sessionId,
    expiresAt,
  }
}

export async function logout(sessionId: string): Promise<void> {
  await revokeSession(sessionId)
}

export async function getCurrentUser(sessionId: string): Promise<AuthUserFull | null> {
  const auth = await getSessionUser(sessionId)
  if (!auth) return null

  const user = await db.user.findUnique({
    where: { id: auth.userId },
    include: {
      staff: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          jobTitle: true,
          primaryDepartment: { select: { name: true } },
        },
      },
    },
  })
  if (!user || !user.isActive) return null

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role as UserRole,
    isActive: user.isActive,
    staffId: user.staff?.id,
    staffFirstName: user.staff?.firstName,
    staffLastName: user.staff?.lastName,
    staffJobTitle: user.staff?.jobTitle ?? undefined,
    staffDepartment: user.staff?.primaryDepartment?.name,
  }
}
