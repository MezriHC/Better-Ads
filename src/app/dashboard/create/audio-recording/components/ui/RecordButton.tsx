/**
 * @purpose: Bouton atomique pur pour l'enregistrement audio sans logique métier
 * @domain: audio
 * @scope: feature-create
 * @created: 2025-08-22
 */

import { IconMicrophone, IconPlayerPause } from "@tabler/icons-react"

interface RecordButtonProps {
  isRecording: boolean
  recordingState: "idle" | "ready" | "recording" | "completed"
  onClick: () => void
  className?: string
}

export function RecordButton({ 
  isRecording, 
  recordingState, 
  onClick, 
  className = "" 
}: RecordButtonProps) {
  const getButtonStyles = () => {
    switch (recordingState) {
      case "recording":
        return "bg-red-500 text-white animate-pulse"
      case "ready":
        return "bg-primary text-primary-foreground hover:bg-primary/90"
      default:
        return "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    }
  }

  return (
    <button
      onClick={onClick}
      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors cursor-pointer ${getButtonStyles()} ${className}`}
    >
      {isRecording ? (
        <IconPlayerPause className="w-5 h-5" />
      ) : (
        <IconMicrophone className="w-5 h-5" />
      )}
    </button>
  )
}