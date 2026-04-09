import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/src/generated/client/client';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const noteId = id;
    const body = await request.json();
    const { action, staffId, comment, content } = body;

    // Validate required fields
    if (!action || !staffId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let updatedNote;

    switch (action) {
      case 'sign':
        // Doctor signs the note
        updatedNote = await prisma.clinicalNote.update({
          where: { id: noteId },
          data: {
            status: 'SIGNED',
            signedAt: new Date(),
          },
        });
        break;

      case 'reject':
        // Doctor rejects - MUST have comment
        if (!comment || comment.trim() === '') {
          return NextResponse.json(
            { error: 'Comment is required when rejecting a note' },
            { status: 400 }
          );
        }

        // Update note status
        updatedNote = await prisma.clinicalNote.update({
          where: { id: noteId },
          data: {
            status: 'DRAFT',
          },
        });
        break;

      case 'resubmit':
        // Nurse resubmits after correction
        if (!content) {
          return NextResponse.json(
            { error: 'Updated content is required' },
            { status: 400 }
          );
        }

        updatedNote = await prisma.clinicalNote.update({
          where: { id: noteId },
          data: {
            content,
            status: 'DRAFT',
          },
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({ note: updatedNote });
  } catch (error) {
    console.error('Clinical note action error:', error);
    return NextResponse.json(
      { error: 'Failed to process action', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}