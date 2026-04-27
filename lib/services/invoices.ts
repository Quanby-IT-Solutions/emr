import { db } from '@/lib/db'
import { InvoiceStatus } from '@/src/generated/client/enums'

const INCLUDE_FULL = {
  patient: { select: { id: true, mrn: true, firstName: true, lastName: true } },
  encounter: { select: { id: true, type: true, status: true, startDateTime: true, admissionDateTime: true } },
  invoiceLineItems: {
    include: {
      chargeMasterItem: { select: { id: true, itemCode: true, description: true } },
    },
    orderBy: { id: 'asc' as const },
  },
}

export async function list(query?: {
  status?: string
  patientId?: string
  encounterId?: string
}) {
  return db.invoice.findMany({
    where: {
      ...(query?.status ? { status: query.status as InvoiceStatus } : {}),
      ...(query?.patientId ? { patientId: query.patientId } : {}),
      ...(query?.encounterId ? { encounterId: query.encounterId } : {}),
    },
    include: INCLUDE_FULL,
    orderBy: { issueDate: 'desc' },
  })
}

export async function getById(id: string) {
  return db.invoice.findUnique({
    where: { id },
    include: INCLUDE_FULL,
  })
}
