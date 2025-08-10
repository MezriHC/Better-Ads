// Types d'API partagés
import type { User } from '../database/types'
import type { ApiResponse, PaginationParams } from './common'

// Types pour l'API Users
export type GetUserResponse = ApiResponse<User>
export type GetUsersResponse = ApiResponse<User[]>
export type CreateUserResponse = ApiResponse<User>
export type UpdateUserResponse = ApiResponse<User>
export type DeleteUserResponse = ApiResponse<{ deleted: boolean }>

export type CreateUserRequest = {
  name?: string
  email: string
  image?: string
}

export type UpdateUserRequest = Partial<{
  name: string
  email: string
  image: string
}>

export type GetUsersParams = PaginationParams & {
  search?: string
  sortBy?: 'name' | 'email' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

// Types pour les erreurs API
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

// Types pour les headers d'API
export type APIHeaders = {
  'Content-Type'?: string
  'Authorization'?: string
  'X-API-Key'?: string
}

// Types pour les méthodes HTTP
export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

// Types pour les requêtes API
export type APIRequest<T = Record<string, unknown>> = {
  method: HTTPMethod
  url: string
  data?: T
  headers?: APIHeaders
  params?: Record<string, string | number | boolean>
}
