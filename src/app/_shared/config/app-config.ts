/**
 * @purpose: Configuration runtime de l'application
 * @domain: config
 * @scope: global  
 * @created: 2025-08-22
 */

import type { ApiResponse } from './types-global'

export type SessionUser = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

export function getUserIdFromSession(session: { user?: unknown } | null): string | null {
  return (session?.user as SessionUser)?.id || null
}

export function createApiResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message
  }
}

export function createErrorResponse(error: string, data?: unknown): ApiResponse {
  return {
    success: false,
    data,
    error
  }
}
