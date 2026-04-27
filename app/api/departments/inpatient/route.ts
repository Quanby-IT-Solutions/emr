import { type NextRequest } from 'next/server'
import { ok, error } from '@/lib/api/respond'
import * as bedsService from '@/lib/services/beds'

export async function GET(_req: NextRequest) {
  try {
    const departments = await bedsService.listDepartments()
    return ok(departments)
  } catch (err) {
    console.error('[GET /api/departments/inpatient]', err)
    return error('INTERNAL_ERROR', 'Failed to fetch departments', { status: 500 })
  }
}
