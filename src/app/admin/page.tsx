"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLogin from "./components/AdminLogin"
import AdminDashboard from "./components/AdminDashboard"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem("adminAuth")
      if (adminAuth) {
        try {
          const authData = JSON.parse(adminAuth)
          const now = Date.now()
          if (authData.expires > now) {
            setIsAuthenticated(true)
          } else {
            localStorage.removeItem("adminAuth")
          }
        } catch {
          localStorage.removeItem("adminAuth")
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const expires = Date.now() + 8 * 60 * 60 * 1000 // 8 heures
        localStorage.setItem("adminAuth", JSON.stringify({ expires }))
        setIsAuthenticated(true)
      } else {
        throw new Error("Authentification échouée")
      }
    } catch (error) {
      console.error("Erreur de connexion:", error)
      throw error
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    setIsAuthenticated(false)
    router.push("/admin")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
    </div>
  )
}