import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch flowsheet observations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const encounterId = searchParams.get('encounterId');

    if (!encounterId) {
      return NextResponse.json(
        { error: 'Encounter ID is required' },
        { status: 400 }
      );
    }

    const observations = await prisma.flowsheetObservation.findMany({
      where: { encounterId },
      include: {
        recorder: {
          select: {
            firstName: true,
            lastName: true,
            jobTitle: true,
          },
        },
      },
      orderBy: {
        recordedAt: 'desc',
      },
    });

    return NextResponse.json({ observations });
  } catch (error) {
    console.error('Flowsheet fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch observations', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST - Create new observation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { encounterId, recorderId, observationType, value, unit } = body;

    const observation = await prisma.flowsheetObservation.create({
      data: {
        encounterId,
        recorderId,
        recordedAt: new Date(),
        observationType,
        value,
        unit: unit || null,
      },
      include: {
        recorder: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({ observation });
  } catch (error) {
    console.error('Flowsheet creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create observation', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}