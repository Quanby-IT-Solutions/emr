import { NextRequest, NextResponse } from 'next/server'

const staffDirectory: Record<string, { id: string; firstName: string; lastName: string; jobTitle: string }> = {
  staff_nurse_1: {
    id: 'staff_nurse_1',
    firstName: 'Jamie',
    lastName: 'Cruz',
    jobTitle: 'RN',
  },
}

let observations = [
  {
    id: 'obs-1',
    encounterId: 'e1',
    recorderId: 'staff_nurse_1',
    recorder: staffDirectory.staff_nurse_1,
    recordedAt: '2026-04-09T09:10:00.000Z',
    observationType: 'HEART_RATE',
    value: '84',
    unit: 'BPM',
  },
  {
    id: 'obs-2',
    encounterId: 'e1',
    recorderId: 'staff_nurse_1',
    recorder: staffDirectory.staff_nurse_1,
    recordedAt: '2026-04-09T09:10:00.000Z',
    observationType: 'SYSTOLIC_BP',
    value: '126',
    unit: 'MMHG',
  },
  {
    id: 'obs-3',
    encounterId: 'e1',
    recorderId: 'staff_nurse_1',
    recorder: staffDirectory.staff_nurse_1,
    recordedAt: '2026-04-09T09:10:00.000Z',
    observationType: 'DIASTOLIC_BP',
    value: '78',
    unit: 'MMHG',
  },
  {
    id: 'obs-4',
    encounterId: 'e1',
    recorderId: 'staff_nurse_1',
    recorder: staffDirectory.staff_nurse_1,
    recordedAt: '2026-04-09T09:10:00.000Z',
    observationType: 'TEMPERATURE',
    value: '37.1',
    unit: 'CELSIUS',
  },
  {
    id: 'obs-5',
    encounterId: 'e1',
    recorderId: 'staff_nurse_1',
    recorder: staffDirectory.staff_nurse_1,
    recordedAt: '2026-04-09T09:10:00.000Z',
    observationType: 'RESPIRATORY_RATE',
    value: '18',
    unit: 'BRPM',
  },
  {
    id: 'obs-6',
    encounterId: 'e1',
    recorderId: 'staff_nurse_1',
    recorder: staffDirectory.staff_nurse_1,
    recordedAt: '2026-04-09T09:10:00.000Z',
    observationType: 'SPO2',
    value: '98',
    unit: 'PERCENT',
  },
  {
    id: 'obs-7',
    encounterId: 'e1',
    recorderId: 'staff_nurse_1',
    recorder: staffDirectory.staff_nurse_1,
    recordedAt: '2026-04-09T06:45:00.000Z',
    observationType: 'PAIN_SCORE',
    value: '3',
    unit: 'POINTS',
  },
  {
    id: 'obs-8',
    encounterId: 'e1',
    recorderId: 'staff_nurse_1',
    recorder: staffDirectory.staff_nurse_1,
    recordedAt: '2026-04-09T06:45:00.000Z',
    observationType: 'WEIGHT',
    value: '68.4',
    unit: 'KG',
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const encounterId = searchParams.get('encounterId')

    if (!encounterId) {
      return NextResponse.json(
        { error: 'Encounter ID is required' },
        { status: 400 }
      )
    }

    const filteredObservations = observations
      .filter((observation) => observation.encounterId === encounterId)
      .sort((left, right) => {
        const leftTime = new Date(left.recordedAt).getTime()
        const rightTime = new Date(right.recordedAt).getTime()
        return rightTime - leftTime
      })

    return NextResponse.json({ observations: filteredObservations })
  } catch (error) {
    console.error('Flowsheet fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch observations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { encounterId, recorderId, observationType, value, unit } = body

    if (!encounterId || !recorderId || !observationType || value === undefined || value === null) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const recorder = staffDirectory[recorderId]

    if (!recorder) {
      return NextResponse.json(
        { error: 'Recorder not found' },
        { status: 400 }
      )
    }

    const observation = {
      encounterId,
      id: crypto.randomUUID(),
      observationType,
      recordedAt: new Date().toISOString(),
      recorder,
      recorderId,
      unit: unit || null,
      value,
    }

    observations = [observation, ...observations]

    return NextResponse.json({ observation })
  } catch (error) {
    console.error('Flowsheet creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create observation' },
      { status: 500 }
    )
  }
}
