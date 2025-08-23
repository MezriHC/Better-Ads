"use client"

import { useAuth } from "./hooks/useAuth"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated && pathname !== "/login") {
      router.push("/login")
    }
    if (isAuthenticated && pathname === "/login") {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, pathname, router])

  if (isLoading || (!isAuthenticated && pathname !== "/login")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}