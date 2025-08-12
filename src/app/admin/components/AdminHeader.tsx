"use client"

import { IconDatabase, IconCloud, IconLogout } from "@tabler/icons-react"

interface AdminHeaderProps {
  activeTab: "database" | "storage"
  onTabChange: (tab: "database" | "storage") => void
  onLogout: () => void
}

export default function AdminHeader({ activeTab, onTabChange, onLogout }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-background border-b border-border flex items-center px-6 gap-4 shrink-0">
      
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-foreground">
          Administration
        </h1>
      </div>
      
      {/* Navigation centrée */}
      <div className="flex items-center justify-center">
        <div className="relative bg-muted rounded-xl p-1">
          {/* Sliding background indicator */}
          <div 
            className={`absolute top-1 h-[calc(100%-8px)] bg-white rounded-lg transition-all duration-300 ease-out ${
              activeTab === "database" ? "left-1 w-[calc(50%-4px)]" : "left-[calc(50%+4px)] w-[calc(50%-4px)]"
            }`}
          />
          
          {/* Navigation Buttons */}
          <div className="relative grid grid-cols-2 gap-1">
            <button
              onClick={() => onTabChange("database")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 cursor-pointer ${
                activeTab === "database" 
                  ? "text-black" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <IconDatabase className="w-4 h-4" />
                Database
              </span>
            </button>
            <button
              onClick={() => onTabChange("storage")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 cursor-pointer ${
                activeTab === "storage" 
                  ? "text-black" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <IconCloud className="w-4 h-4" />
                Storage
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onLogout}
          className="w-10 h-10 rounded-full border bg-muted/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-200 ease-in-out cursor-pointer shadow-xs dark:shadow-sm hover:shadow-sm dark:hover:shadow-md"
        >
          <IconLogout className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}