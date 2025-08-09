"use client"
import { signIn, signOut, useSession } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()
  
  const isLoading = status === "loading"
  const isAuthenticated = !!session?.user

  const signInWithGoogle = () => {
    signIn("google", { callbackUrl: "/dashboard" })
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return {
    user: session?.user || null,
    session,
    isLoading,
    isAuthenticated,
    signInWithGoogle,
    signOut: handleSignOut,
    error: null,
  }
}