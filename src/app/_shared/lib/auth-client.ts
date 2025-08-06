"use client"

import { createAuthClient } from "better-auth/react"

// Configuration client Better Auth optimisée
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
})

// Export de toutes les méthodes Better Auth natives
export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
  updateUser,
  changePassword,
  forgetPassword,
  resetPassword,
} = authClient

// Export des types Better Auth auto-inférés
export type Session = typeof authClient.$Infer.Session
export type User = typeof authClient.$Infer.Session.user

// Hook personnalisé simplifié qui wrappe useSession
export function useAuth() {
  const { data: session, isPending: isLoading, error } = useSession()
  
  return {
    user: session?.user || null,
    session: session || null,
    isLoading,
    isAuthenticated: !!session?.user,
    error,
  }
}