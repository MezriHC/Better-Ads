export const ENV_CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  DATABASE_URL: process.env.DATABASE_URL || '',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
} as const

export const isDevelopment = ENV_CONFIG.NODE_ENV === 'development'
export const isProduction = ENV_CONFIG.NODE_ENV === 'production'

export function validateEnvironment() {
  const required = ['NEXTAUTH_SECRET', 'DATABASE_URL', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`)
  }
}