"use client"

import React, { createContext, useContext, ReactNode } from 'react'
import { useSession } from '@/lib/auth-client'
import type { User, Session } from '@/lib/auth-client'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending: isLoading } = useSession()
  
  const contextValue: AuthContextType = {
    user: session?.user || null,
    session: session || null,
    isLoading,
    isAuthenticated: !!session?.user
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}