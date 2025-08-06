"use client"

import { createAuthClient } from "better-auth/react"
import type { auth } from "./auth"

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
})

// Export auth client methods for convenience
export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
} = authClient

// Export types
export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user