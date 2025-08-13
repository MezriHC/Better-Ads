"use client"

import { ReactNode } from "react"

interface GradientButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  icon?: ReactNode
}

export function GradientButton({ 
  children, 
  onClick, 
  disabled = false, 
  className = "",
  icon 
}: GradientButtonProps) {
  return (
    <div 
      className={`w-full ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}
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
          className={`group rounded-[14px] shadow-lg transition-all w-full ${
            disabled
              ? 'bg-muted cursor-not-allowed opacity-50'
              : 'bg-foreground dark:bg-white hover:shadow-md active:shadow-sm active:scale-[0.98] cursor-pointer'
          }`}
        >
          <div className={`px-6 py-3 bg-gradient-to-b from-transparent to-white/10 dark:to-black/10 rounded-[12px] flex items-center justify-center gap-3`}>
            {icon && (
              <span className={`w-6 h-6 shrink-0 ${disabled ? 'text-muted-foreground' : 'text-background dark:text-black'}`}>
                {icon}
              </span>
            )}
            <span className={`font-semibold ${disabled ? 'text-muted-foreground' : 'text-background dark:text-black'}`}>
              {children}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
