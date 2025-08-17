"use client"

import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Sidebar } from "@/src/app/_shared/components/Sidebar"
import { ThemeToggle } from "@/src/app/_shared/components/ThemeToggle"
import { useAuth } from "@/src/app/_shared/hooks/useAuth"
import { IconChevronDown, IconLogout, IconUser } from "@tabler/icons-react"

const menuItems = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Create", href: "/dashboard/create" },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  
  const currentPage = menuItems.find((item) => item.href === pathname)
  const pageTitle = currentPage ? currentPage.title : "Dashboard"

  // Fermer le menu utilisateur quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false)
    }

    if (isUserMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [isUserMenuOpen])

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <header className="border-b border-border bg-card px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Titre de la page */}
            <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
            
            {/* Actions du header */}
            <div className="flex items-center gap-4">
              {/* Bouton Dark Mode */}
              <ThemeToggle />
              
              {/* Menu utilisateur */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsUserMenuOpen(!isUserMenuOpen)
                  }}
                  className="flex items-center p-1 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <IconUser className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </button>
                
                {/* Menu déroulant */}
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                    {/* Informations utilisateur */}
                    <div className="px-3 py-3 border-b border-border">
                      <div className="flex items-center gap-3">
                        {user?.image ? (
                          <Image
                            src={user.image}
                            alt={user.name || "User"}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <IconUser className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">{user?.name}</span>
                          <span className="text-xs text-muted-foreground">{user?.email}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false)
                          signOut()
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted/50 rounded-md cursor-pointer"
                      >
                        <IconLogout className="w-4 h-4" />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
