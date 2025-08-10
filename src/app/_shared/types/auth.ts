// Types d'authentification NextAuth
import type { Session, User } from "next-auth"
import type { JWT } from "next-auth/jwt"

// Extension des types NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
  }
}

// Types pour les callbacks NextAuth
export type NextAuthSession = Session
export type NextAuthUser = User
export type NextAuthJWT = JWT

// Types pour les providers
export type AuthProvider = "google"

// Types pour les erreurs d'authentification
export type AuthError = {
  message: string
  code: string
}

// Types pour les événements d'authentification
export type AuthEvent = "signIn" | "signOut" | "session"
