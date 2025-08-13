"use client"

import { ReactNode } from "react"

interface GradientButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  icon?: ReactNode
  fullWidth?: boolean
  size?: "sm" | "md" | "lg"
}

export function GradientButton({ 
  children, 
  onClick, 
  disabled = false, 
  className = "",
  icon,
  fullWidth = true,
  size = "md"
}: GradientButtonProps) {
  // Configuration des tailles
  const sizeConfig = {
    sm: {
      padding: "px-4 py-2",
      iconSize: "w-4 h-4",
      textSize: "text-sm",
      gap: "gap-2"
    },
    md: {
      padding: "px-6 py-3",
      iconSize: "w-5 h-5",
      textSize: "text-base",
      gap: "gap-3"
    },
    lg: {
      padding: "px-8 py-4",
      iconSize: "w-6 h-6",
      textSize: "text-lg",
      gap: "gap-4"
    }
  }

  const config = sizeConfig[size]
  const widthClass = fullWidth ? "w-full" : "w-fit"

  return (
    <div 
      className={`${widthClass} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      onClick={disabled ? undefined : onClick}
    >
      <div
        className={`p-[2px] rounded-[16px] transition-all ${
          disabled
            ? 'bg-gradient-to-b from-black/10 to-transparent dark:from-white/10'
            : 'bg-gradient-to-b from-black/20 to-transparent dark:from-white/20'
        }`}
      >
        <div
          className={`group rounded-[14px] shadow-lg transition-all ${widthClass} ${
            disabled
              ? 'bg-muted cursor-not-allowed opacity-50'
              : 'bg-foreground dark:bg-white hover:shadow-md active:shadow-sm active:scale-[0.98] cursor-pointer'
          }`}
        >
          <div className={`${config.padding} bg-gradient-to-b from-transparent to-white/10 dark:to-black/10 rounded-[12px] flex items-center justify-center ${config.gap}`}>
            {icon && (
              <span className={`${config.iconSize} shrink-0 flex items-center justify-center ${disabled ? 'text-muted-foreground' : 'text-background dark:text-black'}`}>
                {icon}
              </span>
            )}
            <span className={`font-semibold ${config.textSize} ${disabled ? 'text-muted-foreground' : 'text-background dark:text-black'}`}>
              {children}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
