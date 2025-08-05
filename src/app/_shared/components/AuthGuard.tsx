"use client"

import { useAuth } from "../contexts/AuthContext"
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
    // Attendre que le chargement soit terminé
    if (isLoading) return

    // Si l'utilisateur n'est pas connecté et n'est pas sur la page de login
    if (!isAuthenticated && pathname !== "/login") {
      router.push("/login")
    }
    // Si l'utilisateur est connecté et est sur la page de login, rediriger vers dashboard
    if (isAuthenticated && pathname === "/login") {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, pathname, router])

  // Afficher un loader pendant le chargement ou si on redirige
  if (isLoading || (!isAuthenticated && pathname !== "/login")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <>{children}</>
}