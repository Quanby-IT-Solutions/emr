import { NextRequest, NextResponse } from 'next/server'
import { getNotes, updateNote } from '@/lib/mock-data/clinical-notes-store'

const staffDirectory: Record<string, { id: string; firstName: string; lastName: string; jobTitle: string }> = {
  staff_nurse_1: {
    id: 'staff_nurse_1',
    firstName: 'Jamie',
    lastName: 'Cruz',
    jobTitle: 'RN',
  },
  staff_doctor_1: {
    id: 'staff_doctor_1',
    firstName: 'Miguel',
    lastName: 'Santos',
    jobTitle: 'MD',
  },
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: noteId } = await params
    const body = await request.json()
    const { action, staffId, comment, content } = body

    if (!action || !staffId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existingNote = getNotes().find((note) => note.id === noteId)

    if (!existingNote) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      )
    }

    let updatedNote

    switch (action) {
      case 'sign':
        updatedNote = updateNote(noteId, {
          comments: [],
          signedAt: new Date().toISOString(),
          status: 'SIGNED',
        })
        break

      case 'reject':
        if (!comment || comment.trim() === '') {
          return NextResponse.json(
            { error: 'Comment is required when rejecting a note' },
            { status: 400 }
          )
        }

        updatedNote = updateNote(noteId, {
          comments: [
            ...(Array.isArray(existingNote.comments) ? existingNote.comments : []),
            {
              id: crypto.randomUUID(),
              comment,
              createdAt: new Date().toISOString(),
              createdByStaff: staffDirectory[staffId] ?? {
                id: staffId,
                firstName: 'Demo',
                lastName: 'Clinician',
                jobTitle: 'MD',
              },
            },
          ],
          signedAt: null,
          status: 'NEEDS_CORRECTION',
        })
        break

      case 'resubmit':
        if (!content) {
          return NextResponse.json(
            { error: 'Updated content is required' },
            { status: 400 }
          )
        }

        updatedNote = updateNote(noteId, {
          comments: [],
          content,
          signedAt: null,
          status: 'PENDING_COSIGN',
        })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    if (!updatedNote) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ note: updatedNote })
  } catch (error) {
    console.error('Clinical note action error:', error)
    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    )
  }
}
