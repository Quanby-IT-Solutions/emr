import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    // Get all departments (no isActive field in schema)
    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        _count: {
          select: {
            locations: {
              where: {
                bedNumber: { not: null }, // Only count actual beds
                status: 'AVAILABLE'
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Transform data to match expected format
    const transformedDepartments = departments.map((dept: {
      id: string;
      name: string;
      type: string | null;
      _count: {
        locations: number;
      };
    }) => ({
      id: dept.id,
      name: dept.name,
      code: dept.id, // Using ID as code since code field doesn't exist
      type: dept.type || 'CLINICAL',
      availableBeds: dept._count.locations
    }))

    return NextResponse.json({
      success: true,
      data: transformedDepartments
    })

  } catch (error) {
    console.error('Error fetching inpatient departments:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch departments',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}