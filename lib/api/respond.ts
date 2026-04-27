import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { UnauthorizedError, ForbiddenError, NotFoundError, ConflictError } from './errors'

type RouteHandler = (req: Request, ctx?: unknown) => Promise<NextResponse>

export function ok<T>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json({ data }, init)
}

export function error(
  code: string,
  message: string,
  opts?: { status?: number; details?: unknown }
): NextResponse {
  const body: { error: { code: string; message: string; details?: unknown } } = {
    error: { code, message },
  }
  if (opts?.details !== undefined) body.error.details = opts.details
  return NextResponse.json(body, { status: opts?.status ?? 500 })
}

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx)
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        return error('UNAUTHORIZED', err.message, { status: 401 })
      }
      if (err instanceof ForbiddenError) {
        return error('FORBIDDEN', err.message, { status: 403 })
      }
      if (err instanceof NotFoundError) {
        return error('NOT_FOUND', err.message, { status: 404 })
      }
      if (err instanceof ConflictError) {
        return error('CONFLICT', err.message, { status: 409 })
      }
      if (err instanceof ZodError) {
        return error('VALIDATION_ERROR', 'Validation failed', { status: 400, details: err.issues })
      }
      console.error('[withErrorHandler]', err)
      return error('INTERNAL_ERROR', 'An unexpected error occurred', { status: 500 })
    }
  }
}
