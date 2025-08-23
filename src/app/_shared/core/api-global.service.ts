class ApiGlobalService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  }

  private async fetchWithRetry(url: string, options: RequestInit = {}, retries = 3): Promise<Response> {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(fullUrl, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options,
        })
        
        if (response.ok) {
          return response
        }
        
        if (attempt === retries) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
      } catch (error) {
        if (attempt === retries) {
          throw error
        }
        await new Promise(resolve => setTimeout(resolve, attempt * 1000))
      }
    }
    
    throw new Error('Max retries reached')
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.fetchWithRetry(url, { method: 'GET' })
    return response.json()
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.fetchWithRetry(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
    return response.json()
  }

  async patch<T>(url: string, data: any): Promise<T> {
    const response = await this.fetchWithRetry(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    return response.json()
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.fetchWithRetry(url, { method: 'DELETE' })
    return response.json()
  }
}

export const apiGlobalService = new ApiGlobalService()