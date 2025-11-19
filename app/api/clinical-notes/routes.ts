import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch clinical notes by encounter or for co-signature queue
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const encounterId = searchParams.get('encounterId');
    const staffId = searchParams.get('staffId');
    const status = searchParams.get('status');
    const needsCosign = searchParams.get('needsCosign') === 'true';

    const where: any = {};

    if (encounterId) {
      where.encounterId = encounterId;
    }

    if (needsCosign && staffId) {
      // Notes pending co-signature for this doctor
      where.cosignerId = staffId;
      where.status = 'PENDING_COSIGN';
    } else if (status === 'NEEDS_CORRECTION' && staffId) {
      // Notes needing correction by this nurse
      where.authorId = staffId;
      where.status = 'NEEDS_CORRECTION';
    }

    const notes = await prisma.clinicalNote.findMany({
      where,
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
            jobTitle: true,
          },
        },
        cosigner: {
          select: {
            firstName: true,
            lastName: true,
            jobTitle: true,
          },
        },
        comments: {
          include: {
            createdByStaff: {
              select: {
                firstName: true,
                lastName: true,
                jobTitle: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        signedAt: 'desc',
      },
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Clinical notes fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clinical notes', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - Create new clinical note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { encounterId, authorId, cosignerId, noteType, title, content, submitForCosign } = body;

    const note = await prisma.clinicalNote.create({
      data: {
        encounterId,
        authorId,
        cosignerId: cosignerId || null,
        noteType,
        title: title || null,
        content: content || null,
        status: submitForCosign ? 'PENDING_COSIGN' : 'DRAFT',
        isSensitive: false,
      },
      include: {
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({ note });
  } catch (error) {
    console.error('Clinical note creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create clinical note', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}