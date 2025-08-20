// Logger centralisé pour debug et monitoring
export class Logger {
  private static instance: Logger
  private isDev = process.env.NODE_ENV === 'development'

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  // Logs pour le navigateur
  client = {
    info: (message: string, data?: any) => {
      if (typeof window !== 'undefined') {
        console.log(`🔵 [CLIENT] ${message}`, data || '')
      }
    },
    
    error: (message: string, error?: any) => {
      if (typeof window !== 'undefined') {
        console.error(`🔴 [CLIENT ERROR] ${message}`, error || '')
      }
    },
    
    warn: (message: string, data?: any) => {
      if (typeof window !== 'undefined') {
        console.warn(`🟡 [CLIENT WARN] ${message}`, data || '')
      }
    },
    
    debug: (message: string, data?: any) => {
      if (typeof window !== 'undefined' && this.isDev) {
        console.debug(`🟢 [CLIENT DEBUG] ${message}`, data || '')
      }
    }
  }

  // Logs pour le serveur/terminal
  server = {
    info: (message: string, data?: any) => {
      if (typeof window === 'undefined') {
        console.log(`🔵 [SERVER] ${new Date().toISOString()} ${message}`, data ? JSON.stringify(data, null, 2) : '')
      }
    },
    
    error: (message: string, error?: any) => {
      if (typeof window === 'undefined') {
        console.error(`🔴 [SERVER ERROR] ${new Date().toISOString()} ${message}`, error?.message || error || '')
        if (error?.stack && this.isDev) {
          console.error(error.stack)
        }
      }
    },
    
    warn: (message: string, data?: any) => {
      if (typeof window === 'undefined') {
        console.warn(`🟡 [SERVER WARN] ${new Date().toISOString()} ${message}`, data ? JSON.stringify(data, null, 2) : '')
      }
    },
    
    debug: (message: string, data?: any) => {
      if (typeof window === 'undefined' && this.isDev) {
        console.debug(`🟢 [SERVER DEBUG] ${new Date().toISOString()} ${message}`, data ? JSON.stringify(data, null, 2) : '')
      }
    },

    // Logs spéciaux pour les APIs
    api: {
      request: (method: string, url: string, data?: any) => {
        if (typeof window === 'undefined') {
          console.log(`📥 [API REQUEST] ${method} ${url}`, data ? JSON.stringify(data, null, 2) : '')
        }
      },
      
      response: (method: string, url: string, status: number, data?: any) => {
        if (typeof window === 'undefined') {
          const emoji = status >= 200 && status < 300 ? '✅' : '❌'
          console.log(`${emoji} [API RESPONSE] ${method} ${url} ${status}`, data ? JSON.stringify(data, null, 2) : '')
        }
      },
      
      error: (method: string, url: string, error: any) => {
        if (typeof window === 'undefined') {
          console.error(`🔥 [API ERROR] ${method} ${url}`, error?.message || error)
        }
      }
    }
  }

  // Logs pour MinIO
  minio = {
    upload: (path: string, size: number) => {
      console.log(`📤 [MINIO UPLOAD] ${path} (${Math.round(size / 1024)}KB)`)
    },
    
    download: (path: string) => {
      console.log(`📥 [MINIO DOWNLOAD] ${path}`)
    },
    
    error: (operation: string, path: string, error: any) => {
      console.error(`🔥 [MINIO ERROR] ${operation} ${path}`, error?.message || error)
    }
  }

  // Logs pour les vidéos
  video = {
    generation: {
      start: (type: string, params: any) => {
        console.log(`🎬 [VIDEO GEN START] ${type}`, JSON.stringify(params, null, 2))
      },
      
      progress: (type: string, status: string) => {
        console.log(`⏳ [VIDEO GEN PROGRESS] ${type} - ${status}`)
      },
      
      complete: (type: string, url: string, duration: number) => {
        console.log(`✅ [VIDEO GEN COMPLETE] ${type} - ${url} (${duration}s)`)
      },
      
      error: (type: string, error: any) => {
        console.error(`🔥 [VIDEO GEN ERROR] ${type}`, error?.message || error)
      }
    },
    
    format: {
      detected: (url: string, width: number, height: number) => {
        const ratio = (width / height).toFixed(2)
        console.log(`📐 [VIDEO FORMAT] ${url} - ${width}x${height} (ratio: ${ratio})`)
      },
      
      mismatch: (expected: string, actual: string) => {
        console.warn(`⚠️ [VIDEO FORMAT MISMATCH] Expected: ${expected}, Actual: ${actual}`)
      }
    }
  }
}

export const logger = Logger.getInstance()