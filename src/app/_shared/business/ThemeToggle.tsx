"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <button
      onClick={toggleTheme}
      className={`w-10 h-10 rounded-full border bg-muted/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-200 ease-in-out cursor-pointer shadow-xs dark:shadow-sm hover:shadow-sm dark:hover:shadow-md ${className}`}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 ease-in-out dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 ease-in-out dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
