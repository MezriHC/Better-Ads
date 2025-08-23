export class Logger {
  private static instance: Logger
  private isDev = process.env.NODE_ENV === 'development'

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  client = {
    info: (message: string, data?: unknown) => {
      if (typeof window !== 'undefined') {
      }
    },
    
    error: (message: string, error?: unknown) => {
      if (typeof window !== 'undefined') {
      }
    },
    
    warn: (message: string, data?: unknown) => {
      if (typeof window !== 'undefined') {
      }
    },
    
    debug: (message: string, data?: unknown) => {
      if (typeof window !== 'undefined' && this.isDev) {
      }
    }
  }

  server = {
    info: (message: string, data?: unknown) => {
      if (typeof window === 'undefined') {
      }
    },
    
    error: (message: string, error?: unknown) => {
      if (typeof window === 'undefined') {
        const errorMessage = error instanceof Error ? error.message : String(error)
        if (error instanceof Error && error.stack && this.isDev) {
        }
      }
    },
    
    warn: (message: string, data?: unknown) => {
      if (typeof window === 'undefined') {
      }
    },
    
    debug: (message: string, data?: unknown) => {
      if (typeof window === 'undefined' && this.isDev) {
      }
    },

    api: {
      request: (method: string, url: string, data?: unknown) => {
        if (typeof window === 'undefined') {
        }
      },
      
      response: (method: string, url: string, status: number, data?: unknown) => {
        if (typeof window === 'undefined') {
          const emoji = status >= 200 && status < 300 ? '✅' : '❌'
        }
      },
      
      error: (method: string, url: string, error: unknown) => {
        if (typeof window === 'undefined') {
          const errorMessage = error instanceof Error ? error.message : String(error)
        }
      }
    }
  }

}

export const logger = Logger.getInstance()
