"use client"

import { useState } from "react"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useAuth } from "../contexts/AuthContext"

export function Header({ pageTitle }: { pageTitle: string }) {
  const { theme, setTheme } = useTheme()
  const { logout } = useAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
  }

  const user = {
    name: "Admin",
    email: "admin@betterads.com",
  }

  return (
    <header className="h-16 bg-background border-b border-border flex items-center px-6 gap-4 shrink-0">
      
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-foreground">
          {pageTitle}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        
        {/* Toggle thème */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full border bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition-colors"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </button>

        {/* Menu utilisateur */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-10 h-10 rounded-full bg-muted hover:bg-accent transition-colors flex items-center justify-center"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-foreground">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="sr-only">Open user menu</span>
          </button>

          {/* Dropdown menu */}
          {userMenuOpen && (
            <div className="absolute right-0 top-12 w-56 bg-popover border border-border rounded-lg shadow-lg z-50">
              
              <div className="p-2 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-popover-foreground">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-1">
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                >
                  Se déconnecter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
