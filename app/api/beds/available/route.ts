import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import * as bedsService from '@/lib/services/beds'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const departmentId = searchParams.get('departmentId') ?? undefined
    const search = searchParams.get('search') ?? undefined
    const beds = await bedsService.listAvailable({ departmentId, search })
    return ok(beds)
  } catch (err) {
    console.error('[GET /api/beds/available]', err)
    return error('INTERNAL_ERROR', 'Failed to fetch available beds', { status: 500 })
  }
}
