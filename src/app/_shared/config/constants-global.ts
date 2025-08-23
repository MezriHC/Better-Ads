/**
 * @purpose: Constantes invariables globales du projet
 * @domain: config
 * @scope: global
 * @created: 2025-08-22
 */

export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  PROJECTS: '/api/projects',
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const

export const PAGINATION_LIMITS = {
  DEFAULT: 10,
  MAX: 100,
  MIN: 1,
} as const

export const AUTH_CONFIG = {
  SIGN_IN_URL: '/login',
  SIGN_OUT_REDIRECT: '/',
  SESSION_MAX_AGE: 30 * 24 * 60 * 60,
} as const