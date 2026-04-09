import { NextRequest, NextResponse } from 'next/server'
import { addNote, getNotes } from '@/lib/mock-data/clinical-notes-store'

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const encounterId = searchParams.get('encounterId')

  if (!encounterId) {
    return NextResponse.json(
      { error: 'Encounter ID is required' },
      { status: 400 }
    )
  }

  return NextResponse.json({ notes: getNotes(encounterId) })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { encounterId, authorId, cosignerId, noteType, title, content, submitForCosign } = body

    if (!encounterId || !authorId || !noteType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const author = staffDirectory[authorId]
    const cosigner = cosignerId ? staffDirectory[cosignerId] ?? null : null

    if (!author) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 400 }
      )
    }

    if (submitForCosign && !cosigner) {
      return NextResponse.json(
        { error: 'Co-signer not found' },
        { status: 400 }
      )
    }

    const note = addNote({
      encounterId,
      authorId,
      author,
      comments: [],
      content: content || '',
      cosigner,
      cosignerId: cosigner?.id ?? null,
      isSensitive: false,
      noteType,
      signedAt: null,
      status: submitForCosign ? 'PENDING_COSIGN' : 'DRAFT',
      title: title || 'Untitled Note',
    })

    return NextResponse.json({ note })
  } catch (error) {
    console.error('Clinical note creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create clinical note' },
      { status: 500 }
    )
  }
}
