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
    info: (message: string, data?: unknown) => {
      if (typeof window !== 'undefined') {
        console.log(`🔵 [CLIENT] ${message}`, data || '')
      }
    },
    
    error: (message: string, error?: unknown) => {
      if (typeof window !== 'undefined') {
        console.error(`🔴 [CLIENT ERROR] ${message}`, error || '')
      }
    },
    
    warn: (message: string, data?: unknown) => {
      if (typeof window !== 'undefined') {
        console.warn(`🟡 [CLIENT WARN] ${message}`, data || '')
      }
    },
    
    debug: (message: string, data?: unknown) => {
      if (typeof window !== 'undefined' && this.isDev) {
        console.debug(`🟢 [CLIENT DEBUG] ${message}`, data || '')
      }
    }
  }

  // Logs pour le serveur/terminal
  server = {
    info: (message: string, data?: unknown) => {
      if (typeof window === 'undefined') {
        console.log(`🔵 [SERVER] ${new Date().toISOString()} ${message}`, data ? JSON.stringify(data, null, 2) : '')
      }
    },
    
    error: (message: string, error?: unknown) => {
      if (typeof window === 'undefined') {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error(`🔴 [SERVER ERROR] ${new Date().toISOString()} ${message}`, errorMessage || '')
        if (error instanceof Error && error.stack && this.isDev) {
          console.error(error.stack)
        }
      }
    },
    
    warn: (message: string, data?: unknown) => {
      if (typeof window === 'undefined') {
        console.warn(`🟡 [SERVER WARN] ${new Date().toISOString()} ${message}`, data ? JSON.stringify(data, null, 2) : '')
      }
    },
    
    debug: (message: string, data?: unknown) => {
      if (typeof window === 'undefined' && this.isDev) {
        console.debug(`🟢 [SERVER DEBUG] ${new Date().toISOString()} ${message}`, data ? JSON.stringify(data, null, 2) : '')
      }
    },

    // Logs spéciaux pour les APIs
    api: {
      request: (method: string, url: string, data?: unknown) => {
        if (typeof window === 'undefined') {
          console.log(`📥 [API REQUEST] ${method} ${url}`, data ? JSON.stringify(data, null, 2) : '')
        }
      },
      
      response: (method: string, url: string, status: number, data?: unknown) => {
        if (typeof window === 'undefined') {
          const emoji = status >= 200 && status < 300 ? '✅' : '❌'
          console.log(`${emoji} [API RESPONSE] ${method} ${url} ${status}`, data ? JSON.stringify(data, null, 2) : '')
        }
      },
      
      error: (method: string, url: string, error: unknown) => {
        if (typeof window === 'undefined') {
          const errorMessage = error instanceof Error ? error.message : String(error)
          console.error(`🔥 [API ERROR] ${method} ${url}`, errorMessage)
        }
      }
    }
  }

}

export const logger = Logger.getInstance()
