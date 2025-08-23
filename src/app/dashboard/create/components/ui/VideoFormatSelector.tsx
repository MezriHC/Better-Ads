"use client"

import { IconChevronDown } from "@tabler/icons-react"
import { useRef, useState } from "react"

interface VideoFormat {
  id: string
  label: string
  ratio: string
}

interface VideoFormatSelectorProps {
  selectedVideoFormat: string
  onFormatChange: (formatId: string) => void
  videoFormats: VideoFormat[]
  isOpen: boolean
  onToggleOpen: () => void
}

export function VideoFormatSelector({
  selectedVideoFormat,
  onFormatChange,
  videoFormats,
  isOpen,
  onToggleOpen
}: VideoFormatSelectorProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down')
  
  const currentVideoFormat = videoFormats.find(format => format.id === selectedVideoFormat)

  // Calculer la direction optimale du dropdown au moment du clic
  const handleToggleOpen = () => {
    if (!isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const dropdownHeight = videoFormats.length * 56 + 16 // hauteur approximative
      const spaceBelow = window.innerHeight - buttonRect.bottom
      const spaceAbove = buttonRect.top
      
      // Déterminer la direction AVANT d'ouvrir pour éviter le flickering
      setDropdownDirection(spaceBelow < dropdownHeight && spaceAbove > dropdownHeight ? 'up' : 'down')
    }
    onToggleOpen()
  }

  const handleFormatSelect = (formatId: string) => {
    onFormatChange(formatId)
    onToggleOpen() // This will close the dropdown
  }

  const getFormatDimensions = (formatId: string) => {
    return {
      width: formatId === "16:9" ? "14px" : formatId === "9:16" ? "8px" : "10px",
      height: formatId === "16:9" ? "8px" : formatId === "9:16" ? "14px" : "10px",
    }
  }

  const currentDimensions = getFormatDimensions(selectedVideoFormat)

  return (
    <div className="relative">
      <button 
        ref={buttonRef}
        onClick={handleToggleOpen}
        className="flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-lg hover:bg-accent transition-all cursor-pointer h-[44px]"
      >
        <div className="w-6 h-5 bg-background border border-border rounded flex items-center justify-center">
          <div 
            className="bg-muted-foreground"
            style={{
              width: currentDimensions.width,
              height: currentDimensions.height,
              borderRadius: "1px"
            }}
          />
        </div>
        <span className="text-sm font-medium text-foreground">{currentVideoFormat?.label}</span>
        <span className="text-xs text-muted-foreground">({currentVideoFormat?.ratio})</span>
        <IconChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Video Format Dropdown Menu */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={onToggleOpen} />
          <div className={`absolute left-0 bg-card border border-border rounded-lg shadow-lg z-20 min-w-[200px] ${
            dropdownDirection === 'up' 
              ? 'bottom-full mb-2' 
              : 'top-full mt-2'
          }`}>
            {videoFormats.map((format) => {
              const dimensions = getFormatDimensions(format.id)
              return (
                <button
                  key={format.id}
                  onClick={() => handleFormatSelect(format.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/50 transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer"
                >
                  <div className="w-6 h-5 bg-background border border-border rounded flex items-center justify-center">
                    <div 
                      className="bg-muted-foreground"
                      style={{
                        width: dimensions.width,
                        height: dimensions.height,
                        borderRadius: "1px"
                      }}
                    />
                  </div>
                  <div>
                    <span className="font-medium text-foreground">{format.label}</span>
                    <span className="text-xs text-muted-foreground ml-2">({format.ratio})</span>
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}