// Types communs partagés

// Réponse API générique
export type ApiResponse<T = unknown> = {
  success: boolean
  data: T
  message?: string
  error?: string
}

// Paramètres de pagination
export type PaginationParams = {
  page?: number
  limit?: number
  offset?: number
}

// Paramètres de tri
export type SortParams = {
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Paramètres de recherche
export type SearchParams = {
  search?: string
  filter?: Record<string, unknown>
}

// ID générique
export type ID = string | number

// Status générique
export type Status = 'pending' | 'loading' | 'success' | 'error'

// Metadata pour les réponses paginées
export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Réponse paginée
export type PaginatedResponse<T> = ApiResponse<T> & {
  meta: PaginationMeta
}

// Types pour les avatars
export interface AvatarStats {
  pending: number
  succeeded: number
  failed: number
  total: number
}

export interface CreateAvatarRequest {
  name: string
  imageUrl: string // URL fal.ai (générée) ou blob URL (uploadée)
  projectId: string
  imageFile?: File // Fichier original si image uploadée (sera sérialisé)
}

// DEPRECATED: Ces types ne sont plus utilisés avec le nouveau workflow
// export interface UploadRequest {
//   fileName: string
//   contentType: string
// }

// export interface UploadResponse {
//   uploadUrl: string
//   filePath: string
//   expiresIn: number
// }
