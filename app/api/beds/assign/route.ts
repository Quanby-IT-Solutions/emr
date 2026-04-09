import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/src/generated/client/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { bedId, patientId, encounterId, assignedBy, notes } = body

    // Validate required fields
    if (!bedId || !patientId || !encounterId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: bedId, patientId, encounterId' 
        },
        { status: 400 }
      )
    }

    // Check if bed is available
    const bed = await prisma.location.findUnique({
      where: { id: bedId },
      include: {
        department: true
      }
    })

    if (!bed) {
      return NextResponse.json(
        { success: false, error: 'Bed not found' },
        { status: 404 }
      )
    }

    if (bed.status !== 'AVAILABLE') {
      return NextResponse.json(
        { success: false, error: `Bed is not available. Current status: ${bed.status}` },
        { status: 409 }
      )
    }

    // Check if encounter exists
    const encounter = await prisma.encounter.findUnique({
      where: { id: encounterId }
    })

    if (!encounter) {
      return NextResponse.json(
        { success: false, error: 'Encounter not found' },
        { status: 404 }
      )
    }

    // Use transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => {
      // Update bed status to OCCUPIED
      const updatedBed = await tx.location.update({
        where: { id: bedId },
        data: {
          status: 'OCCUPIED'
        }
      })

      // Update encounter with bed assignment
      const updatedEncounter = await tx.encounter.update({
        where: { id: encounterId },
        data: {
          currentLocationId: bedId
        }
      })

      // Create patient transfer record (using existing schema fields only)
      await tx.patientTransfer.create({
        data: {
          encounterId,
          fromLocationId: null, // New admission
          toLocationId: bedId,
          transferDateTime: new Date(),
          transportStaffId: assignedBy || null
        }
      })

      // Create audit log entry
      await tx.auditLog.create({
        data: {
          userId: assignedBy || null,
          actionType: 'CREATE', // Using existing enum value
          entityType: 'BED_ASSIGNMENT',
          entityId: bedId,
          details: {
            patientId,
            encounterId,
            bedNumber: bed.bedNumber,
            roomNumber: bed.roomNumber,
            unit: bed.unit,
            departmentName: bed.department?.name || 'Unknown',
            notes: notes || 'Bed assignment during admission'
          },
          timestamp: new Date()
        }
      })

      return { 
        bed: updatedBed, 
        encounter: updatedEncounter 
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Patient successfully assigned to bed',
      data: result
    })

  } catch (error) {
    console.error('Error assigning bed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to assign bed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}