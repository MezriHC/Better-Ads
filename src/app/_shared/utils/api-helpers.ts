import { NextResponse } from 'next/server'

export interface RetryOptions {
  maxRetries?: number
  baseDelay?: number
  maxDelay?: number
  backoffMultiplier?: number
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2
  } = options

  let lastError: Error | unknown

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries) {
        throw error
      }

      const delay = Math.min(
        baseDelay * Math.pow(backoffMultiplier, attempt),
        maxDelay
      )
      
      console.log(`Tentative ${attempt + 1}/${maxRetries + 1} échoué, retry dans ${delay}ms...`)
      
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

export interface ApiErrorDetails {
  error: string
  details?: string
  code?: string
  timestamp?: string
}

export function createApiError(
  message: string, 
  details?: string | unknown,
  status: number = 500,
  code?: string
): NextResponse<ApiErrorDetails> {
  const errorDetails = details instanceof Error ? details.message : 
                      typeof details === 'string' ? details : 
                      'Erreur inconnue'

  const response: ApiErrorDetails = {
    error: message,
    details: errorDetails,
    timestamp: new Date().toISOString()
  }

  if (code) {
    response.code = code
  }

  console.error(`API Error [${status}]:`, message, errorDetails)

  return NextResponse.json(response, { status })
}

export async function withTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number = 30000
): Promise<T> {
  const controller = new AbortController()
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      controller.abort()
      reject(new Error(`Opération timeout après ${timeoutMs}ms`))
    }, timeoutMs)
  })

  try {
    return await Promise.race([
      operation(),
      timeoutPromise
    ])
  } finally {
    controller.abort()
  }
}

export interface DownloadOptions {
  maxSize?: number
  timeout?: number
  retryOptions?: RetryOptions
}

export async function downloadWithRetry(
  url: string, 
  options: DownloadOptions = {}
): Promise<ArrayBuffer> {
  const {
    maxSize = 100 * 1024 * 1024, // 100MB par défaut
    timeout = 60000, // 60 secondes
    retryOptions = {}
  } = options

  return withRetry(async () => {
    return withTimeout(async () => {
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentLength = response.headers.get('content-length')
      if (contentLength && parseInt(contentLength) > maxSize) {
        throw new Error(`Fichier trop volumineux: ${contentLength} bytes (max: ${maxSize})`)
      }

      const buffer = await response.arrayBuffer()
      
      if (buffer.byteLength > maxSize) {
        throw new Error(`Fichier trop volumineux: ${buffer.byteLength} bytes (max: ${maxSize})`)
      }

      return buffer
    }, timeout)
  }, retryOptions)
}

export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[]
): string | null {
  for (const field of requiredFields) {
    if (!data[field] || (typeof data[field] === 'string' && data[field].toString().trim() === '')) {
      return `Le champ "${field}" est requis`
    }
  }
  return null
}

export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') return ''
  return input.trim().slice(0, maxLength)
}