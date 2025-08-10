// Types communs utilisés dans l'application

// Types de base
export type ID = string
export type Timestamp = Date | string

// Types pour les réponses API
export type ApiResponse<T = Record<string, unknown>> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type ApiError = {
  success: false
  error: string
  message: string
}

export type ApiSuccess<T> = {
  success: true
  data: T
  message?: string
}

// Types pour la pagination
export type PaginationParams = {
  page?: number
  limit?: number
  skip?: number
  take?: number
}

export type PaginatedResponse<T> = {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Types pour les filtres
export type SortOrder = 'asc' | 'desc'
export type SortBy<T> = keyof T

export type FilterParams<T> = {
  sortBy?: SortBy<T>
  sortOrder?: SortOrder
  search?: string
}

// Types pour les formulaires
export type FormFieldError = {
  field: string
  message: string
}

export type FormErrors = FormFieldError[]

// Types pour les états de chargement
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// Types pour les notifications
export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export type Notification = {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
}
