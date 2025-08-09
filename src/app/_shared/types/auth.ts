// Types NextAuth.js - Template réutilisable pour projets

// Types pour les providers OAuth supportés
export type OAuthProvider = "google" | "github" | "discord" | "facebook" | "twitter"

// Types génériques pour les callbacks d'authentification
export interface AuthCallbacks<T = unknown> {
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
  onRequest?: () => void
  onResponse?: () => void
}