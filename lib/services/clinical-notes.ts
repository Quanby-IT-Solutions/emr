import { db } from '@/lib/db'
import { ClinicalNoteType, ClinicalNoteStatus, AuditActionType } from '@/src/generated/client'
import { NotFoundError, ForbiddenError } from '@/lib/api/errors'

export interface CreateNoteInput {
  encounterId: string
  noteType: ClinicalNoteType
  title?: string
  content?: string
  cosignerId?: string
  isSensitive?: boolean
}

const NOTE_INCLUDE = {
  author: { select: { id: true, firstName: true, lastName: true, jobTitle: true } },
  cosigner: { select: { id: true, firstName: true, lastName: true, jobTitle: true } },
  addenda: {
    include: {
      author: { select: { id: true, firstName: true, lastName: true, jobTitle: true } },
    },
    orderBy: { signedAt: 'asc' as const },
  },
} as const

export async function create(input: CreateNoteInput, byUserId: string) {
  const staff = await db.staff.findUnique({ where: { userId: byUserId } })
  if (!staff) throw new Error('Staff record not found')

  return db.clinicalNote.create({
    data: {
      encounterId: input.encounterId,
      authorId: staff.id,
      noteType: input.noteType,
      title: input.title ?? null,
      content: input.content ?? null,
      status: ClinicalNoteStatus.DRAFT,
      isSensitive: input.isSensitive ?? false,
      cosignerId: input.cosignerId ?? null,
    },
    include: NOTE_INCLUDE,
  })
}

export async function sign(noteId: string, byUserId: string) {
  const staff = await db.staff.findUnique({ where: { userId: byUserId } })
  if (!staff) throw new Error('Staff record not found')

  const note = await db.clinicalNote.findUnique({ where: { id: noteId } })
  if (!note) throw new NotFoundError('Clinical note not found')

  return db.$transaction(async (tx) => {
    const updated = await tx.clinicalNote.update({
      where: { id: noteId },
      data: { status: ClinicalNoteStatus.SIGNED, signedAt: new Date() },
      include: NOTE_INCLUDE,
    })
    await tx.auditLog.create({
      data: {
        userId: byUserId,
        actionType: AuditActionType.UPDATE,
        entityType: 'ClinicalNote',
        entityId: noteId,
        details: { action: 'SIGN', signedBy: staff.id },
      },
    })
    return updated
  })
}

export async function cosign(noteId: string, byUserId: string) {
  const staff = await db.staff.findUnique({ where: { userId: byUserId } })
  if (!staff) throw new Error('Staff record not found')

  const note = await db.clinicalNote.findUnique({ where: { id: noteId } })
  if (!note) throw new NotFoundError('Clinical note not found')
  if (note.cosignerId && note.cosignerId !== staff.id) {
    throw new ForbiddenError('Not the designated cosigner for this note')
  }

  return db.$transaction(async (tx) => {
    const updated = await tx.clinicalNote.update({
      where: { id: noteId },
      data: { status: ClinicalNoteStatus.SIGNED, signedAt: new Date(), cosignerId: staff.id },
      include: NOTE_INCLUDE,
    })
    await tx.auditLog.create({
      data: {
        userId: byUserId,
        actionType: AuditActionType.UPDATE,
        entityType: 'ClinicalNote',
        entityId: noteId,
        details: { action: 'COSIGN', cosignedBy: staff.id },
      },
    })
    return updated
  })
}

export async function addAddendum(parentId: string, content: string, byUserId: string) {
  const staff = await db.staff.findUnique({ where: { userId: byUserId } })
  if (!staff) throw new Error('Staff record not found')

  const parent = await db.clinicalNote.findUnique({ where: { id: parentId } })
  if (!parent) throw new NotFoundError('Parent note not found')

  return db.clinicalNote.create({
    data: {
      encounterId: parent.encounterId,
      authorId: staff.id,
      noteType: ClinicalNoteType.ADDENDUM,
      title: `Addendum to: ${parent.title ?? 'Note'}`,
      content,
      status: ClinicalNoteStatus.SIGNED,
      isSensitive: parent.isSensitive,
      parentNoteId: parentId,
      signedAt: new Date(),
    },
    include: NOTE_INCLUDE,
  })
}

export async function reject(noteId: string, comment: string, byUserId: string) {
  const staff = await db.staff.findUnique({ where: { userId: byUserId } })
  if (!staff) throw new Error('Staff record not found')

  const note = await db.clinicalNote.findUnique({ where: { id: noteId } })
  if (!note) throw new NotFoundError('Clinical note not found')

  const rejectionPrefix = `[CORRECTION REQUESTED by ${staff.firstName} ${staff.lastName}]: ${comment}\n\n`
  const updatedContent = rejectionPrefix + (note.content ?? '')

  return db.$transaction(async (tx) => {
    const updated = await tx.clinicalNote.update({
      where: { id: noteId },
      data: { status: ClinicalNoteStatus.DRAFT, content: updatedContent },
      include: NOTE_INCLUDE,
    })
    await tx.auditLog.create({
      data: {
        userId: byUserId,
        actionType: AuditActionType.UPDATE,
        entityType: 'ClinicalNote',
        entityId: noteId,
        details: { action: 'REJECT', comment, rejectedBy: staff.id },
      },
    })
    return updated
  })
}
