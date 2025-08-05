"use client"

import { useAuth } from "../contexts/AuthContext"
import { signOut } from "@/lib/auth-client"
import { IconLogout, IconUser } from "@tabler/icons-react"
import { useState } from "react"

export function Header() {
  const { user, isAuthenticated } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleSignOut = async () => {
    setIsLoggingOut(true)
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.href = "/login"
          }
        }
      })
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!isAuthenticated) return null

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900">Better Ads</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            {user?.image ? (
              <img 
                src={user.image} 
                alt={user.name || "User"} 
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <IconUser className="w-4 h-4 text-gray-600" />
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.name || "Utilisateur"}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconLogout className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}