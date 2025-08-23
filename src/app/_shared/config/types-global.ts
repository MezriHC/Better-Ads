
export type ApiResponse<T = unknown> = {
  success: boolean
  data: T
  message?: string
  error?: string
}

export type PaginationParams = {
  page?: number
  limit?: number
  offset?: number
}

export type SortParams = {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export type SearchParams = {
  search?: string
  filter?: Record<string, unknown>
}

export type ID = string | number

export type Status = 'pending' | 'loading' | 'success' | 'error'

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export type PaginatedResponse<T> = ApiResponse<T> & {
  meta: PaginationMeta
}

export type APIErrorCode = 
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR'
  | 'RATE_LIMITED'

export type APIError = {
  code: APIErrorCode
  message: string
  details?: Record<string, unknown>
}

export type APIHeaders = {
  'Content-Type'?: string
  'Authorization'?: string
  'X-API-Key'?: string
}

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type APIRequest<T = Record<string, unknown>> = {
  method: HTTPMethod
  url: string
  data?: T
  headers?: APIHeaders
  params?: Record<string, string | number | boolean>
}



