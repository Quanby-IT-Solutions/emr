import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const departmentId = searchParams.get('departmentId')
    const searchQuery = searchParams.get('search')

    // Build query filters - using only fields that exist in schema
    const where: any = {
      status: 'AVAILABLE',
      bedNumber: { not: null } // Only locations with bedNumber are actual beds
    }

    if (departmentId && departmentId !== 'all') {
      where.departmentId = departmentId
    }

    if (searchQuery) {
      where.OR = [
        {
          roomNumber: {
            contains: searchQuery,
            mode: 'insensitive'
          }
        },
        {
          bedNumber: {
            contains: searchQuery,
            mode: 'insensitive'
          }
        },
        {
          unit: {
            contains: searchQuery,
            mode: 'insensitive'
          }
        }
      ]
    }

    // Fetch available beds with related data
    const beds = await prisma.location.findMany({
      where,
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
                mrn: true
              }
            }
          },
          take: 1
        }
      },
      orderBy: [
        { unit: 'asc' },
        { roomNumber: 'asc' },
        { bedNumber: 'asc' }
      ]
    })

    // Transform data to match expected format
    const transformedBeds = beds.map((bed: {
      id: string;
      roomNumber: string | null;
      bedNumber: string | null;
      unit: string;
      status: string | null;
      department: {
        id: string;
        name: string;
        type: string | null;
      } | null;
      encounters: Array<{
        patient: {
          id: string;
          firstName: string;
          lastName: string;
          mrn: string;
        };
      }>;
    }) => ({
      id: bed.id,
      roomNumber: bed.roomNumber || 'N/A',
      bedNumber: bed.bedNumber || 'N/A',
      floor: bed.unit, // Using 'unit' field as floor
      bedType: 'Standard', // Default since not in schema
      status: bed.status || 'AVAILABLE',
      notes: null,
      department: {
        id: bed.department?.id || '',
        name: bed.department?.name || 'Unknown',
        code: bed.department?.id || 'N/A' // Using ID as code since code doesn't exist
      },
      currentPatient: bed.encounters[0]?.patient || null
    }))

    return NextResponse.json({
      success: true,
      data: transformedBeds,
      count: transformedBeds.length
    })

  } catch (error) {
    console.error('Error fetching available beds:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch available beds',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}