import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const bed = await prisma.location.findUnique({
      where: { id },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            type: true
          }
        },
        encounters: {
          where: {
            status: 'ACTIVE'
          },
          include: {
            patient: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                mrn: true,
                dateOfBirth: true
              }
            },
            attendingProvider: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    })

    if (!bed) {
      return NextResponse.json(
        { success: false, error: 'Bed not found' },
        { status: 404 }
      )
    }

    // Transform to match expected format
    const transformedBed = {
      id: bed.id,
      roomNumber: bed.roomNumber || 'N/A',
      bedNumber: bed.bedNumber || 'N/A',
      unit: bed.unit,
      status: bed.status,
      department: bed.department,
      currentPatient: bed.encounters[0]?.patient || null,
      activeEncounter: bed.encounters[0] || null
    }

    return NextResponse.json({
      success: true,
      data: transformedBed
    })

  } catch (error) {
    console.error('Error fetching bed details:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch bed details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { status } = body

    // Validate status is a valid LocationStatus
    const validStatuses = ['AVAILABLE', 'OCCUPIED', 'CLEANING', 'OUT_OF_SERVICE']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status value' },
        { status: 400 }
      )
    }

    const updatedBed = await prisma.location.update({
      where: { id },
      data: {
        status
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Bed status updated successfully',
      data: updatedBed
    })

  } catch (error) {
    console.error('Error updating bed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update bed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}