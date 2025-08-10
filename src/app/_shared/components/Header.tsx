"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuth } from "../hooks/useAuth"
import { signOut } from "next-auth/react"

export function Header({ pageTitle }: { pageTitle: string }) {
  const { theme, setTheme } = useTheme()
  const { user, isAuthenticated } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userMenuOpen])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setUserMenuOpen(false)
    try {
      await signOut({
        callbackUrl: "/login"
      })
    } catch {
      
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!isAuthenticated) return null

  return (
    <header className="h-16 bg-background border-b border-border flex items-center px-6 gap-4 shrink-0">
      
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-foreground">
          {pageTitle}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        
            {/* Toggle thème avec shadow réduit en light mode */}
    <button
      onClick={toggleTheme}
      className="w-10 h-10 rounded-full border bg-muted/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-200 ease-in-out cursor-pointer shadow-xs dark:shadow-sm hover:shadow-sm dark:hover:shadow-md"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 ease-in-out dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 ease-in-out dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>

        {/* Menu utilisateur avec animation */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-10 h-10 rounded-full bg-muted/50 hover:bg-accent hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out cursor-pointer flex items-center justify-center shadow-sm hover:shadow-md ring-2 ring-transparent hover:ring-accent/20"
          >
            {user?.image ? (
              <Image 
                src={user.image} 
                alt={user.name || "User"} 
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-background transition-all duration-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-sm font-semibold text-foreground transition-all duration-200">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
            <span className="sr-only">Open user menu</span>
          </button>

          {/* Dropdown menu avec animation d'entrée plus rapide */}
          {userMenuOpen && (
            <div className="absolute right-0 top-12 w-56 bg-popover/95 backdrop-blur-sm border border-border/50 rounded-xl shadow-xl z-50 animate-in slide-in-from-top-2 duration-150">
              
              <div className="p-3 border-b border-border/50">
                <div className="flex items-center gap-3">
                  {user?.image ? (
                    <Image 
                      src={user.image} 
                      alt={user.name || "User"} 
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-background/50"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-sm font-semibold">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-popover-foreground">
                      {user?.name || "Utilisateur"}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[140px]">
                      {user?.email}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-2">
                <button 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-200 disabled:opacity-50 cursor-pointer group"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}