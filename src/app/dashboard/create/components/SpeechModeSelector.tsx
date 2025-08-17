"use client"

import { IconChevronDown } from "@tabler/icons-react"
import { useRef, useEffect, useState } from "react"

interface SpeechMode {
  id: string
  label: string
}

interface SpeechModeSelectorProps {
  speechMode: "text-to-speech" | "speech-to-speech"
  onModeChange: (mode: "text-to-speech" | "speech-to-speech") => void
  speechModes: SpeechMode[]
  isOpen: boolean
  onToggleOpen: () => void
}

export function SpeechModeSelector({
  speechMode,
  onModeChange,
  speechModes,
  isOpen,
  onToggleOpen
}: SpeechModeSelectorProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down')
  
  const currentSpeechMode = speechModes.find(mode => mode.id === speechMode)

  // Calculer la direction optimale du dropdown au moment du clic
  const handleToggleOpen = () => {
    if (!isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const dropdownHeight = speechModes.length * 48 + 16 // hauteur approximative
      const spaceBelow = window.innerHeight - buttonRect.bottom
      const spaceAbove = buttonRect.top
      
      // Déterminer la direction AVANT d'ouvrir pour éviter le flickering
      setDropdownDirection(spaceBelow < dropdownHeight && spaceAbove > dropdownHeight ? 'up' : 'down')
    }
    onToggleOpen()
  }

  const handleModeSelect = (modeId: string) => {
    onModeChange(modeId as "text-to-speech" | "speech-to-speech")
    onToggleOpen() // This will close the dropdown
  }

  return (
    <div className="relative">
      <button 
        ref={buttonRef}
        onClick={handleToggleOpen}
        className="flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-lg hover:bg-accent transition-all cursor-pointer h-[44px]"
      >
        <span className="text-sm font-medium text-foreground">{currentSpeechMode?.label}</span>
        <IconChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Speech Mode Dropdown Menu - Position intelligente */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={onToggleOpen} />
          <div className={`absolute left-0 bg-card border border-border rounded-lg shadow-lg z-20 min-w-[180px] ${
            dropdownDirection === 'up' 
              ? 'bottom-full mb-2' 
              : 'top-full mt-2'
          }`}>
            {speechModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => handleModeSelect(mode.id)}
                className="w-full flex items-center px-4 py-3 text-left hover:bg-accent/50 transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer"
              >
                <span className="font-medium text-foreground">{mode.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
