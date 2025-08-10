"use client"

import { useSession, signIn, signOut } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()
  
  return {
    // État de la session
    user: session?.user || null,
    session: session || null,
    isLoading: status === "loading",
    isAuthenticated: !!session?.user,
    
    // Méthodes d'authentification
    signIn: (provider?: string) => signIn(provider),
    signOut: () => signOut({ callbackUrl: "/login" }),
    
    // Informations utilisateur
    userId: session?.user?.id || null,
    userEmail: session?.user?.email || null,
    userName: session?.user?.name || null,
    userImage: session?.user?.image || null,
  }
}
