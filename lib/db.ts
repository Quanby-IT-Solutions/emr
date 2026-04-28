import { PrismaClient, AuditActionType } from '@/src/generated/client/client'
import { getCurrentUser } from '@/lib/request-context'

export async function _writeAudit(
  prisma: PrismaClient,
  actionType: AuditActionType,
  entityType: string,
  entityId?: string | null
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: getCurrentUser(),
        actionType,
        entityType,
        entityId: entityId ?? null,
      },
    })
  } catch {
    // swallow — audit failure must not surface to caller
  }
}

function buildClient() {
  const base = new PrismaClient()

  return base.$extends({
    query: {
      $allModels: {
        async create({ model, args, query }) {
          const result = await query(args)
          if (model !== 'AuditLog') {
            void _writeAudit(base, AuditActionType.CREATE, model, (result as any)?.id)
          }
          return result
        },
        async update({ model, args, query }) {
          const result = await query(args)
          if (model !== 'AuditLog') {
            void _writeAudit(base, AuditActionType.UPDATE, model, (result as any)?.id)
          }
          return result
        },
        async delete({ model, args, query }) {
          const result = await query(args)
          if (model !== 'AuditLog') {
            void _writeAudit(base, AuditActionType.DELETE, model, (result as any)?.id)
          }
          return result
        },
        async upsert({ model, args, query }) {
          const result = await query(args)
          if (model !== 'AuditLog') {
            void _writeAudit(base, AuditActionType.UPDATE, model, (result as any)?.id)
          }
          return result
        },
      },
    },
  })
}

const g = globalThis as unknown as { _emrDb?: ReturnType<typeof buildClient> }

export const db = g._emrDb ?? buildClient()

if (process.env.NODE_ENV !== 'production') {
  g._emrDb = db
}
