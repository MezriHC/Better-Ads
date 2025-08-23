"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import type { SessionUser } from '../../config/app-config'

export function useAuth() {
  const { data: session, status } = useSession()
  
  return {
    user: session?.user || null,
    session: session || null,
    isLoading: status === "loading",
    isAuthenticated: !!session?.user,
    
    signIn: (provider?: string) => signIn(provider),
    signOut: () => signOut({ callbackUrl: "/login" }),
    
    userId: (session?.user as SessionUser)?.id || null,
    userEmail: session?.user?.email || null,
    userName: session?.user?.name || null,
    userImage: session?.user?.image || null,
  }
}
