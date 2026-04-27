import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import * as bedsService from '@/lib/services/beds'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const bed = await bedsService.getById(id)
    if (!bed) return error('NOT_FOUND', 'Bed not found', { status: 404 })
    return ok(bed)
  } catch (err) {
    console.error('[GET /api/beds/[id]]', err)
    return error('INTERNAL_ERROR', 'Failed to fetch bed', { status: 500 })
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
    if (!status) return error('VALIDATION_ERROR', 'status is required', { status: 400 })
    const bed = await bedsService.updateStatus(id, status)
    return ok(bed)
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('Invalid status'))
      return error('VALIDATION_ERROR', err.message, { status: 400 })
    console.error('[PATCH /api/beds/[id]]', err)
    return error('INTERNAL_ERROR', 'Failed to update bed', { status: 500 })
  }
}
