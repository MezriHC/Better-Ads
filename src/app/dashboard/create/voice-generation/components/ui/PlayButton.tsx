import { IconPlayerPlay, IconPlayerPause } from "@tabler/icons-react"

interface PlayButtonProps {
  isPlaying: boolean
  onClick: () => void
  size?: "sm" | "md" | "lg"
  variant?: "default" | "secondary"
}

export function PlayButton({ 
  isPlaying, 
  onClick, 
  size = "md",
  variant = "default" 
}: PlayButtonProps) {
  const sizeStyles = {
    sm: "w-8 h-8",
    md: "w-10 h-10", 
    lg: "w-12 h-12"
  }
  
  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  }
  
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
  }

  return (
    <button
      onClick={onClick}
      className={`${sizeStyles[size]} rounded-full flex items-center justify-center transition-colors cursor-pointer ${variantStyles[variant]}`}
    >
      {isPlaying ? (
        <IconPlayerPause className={iconSizes[size]} />
      ) : (
        <IconPlayerPlay className={iconSizes[size]} />
      )}
    </button>
  )
}