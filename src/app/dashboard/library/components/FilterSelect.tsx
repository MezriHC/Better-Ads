"use client"

import React, { useState } from "react"
import { IconChevronDown } from "@tabler/icons-react"

interface FilterSelectProps {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

export function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedOption = options.find(option => option.value === value)
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-muted border border-border rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors min-w-[120px]"
      >
        <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
        <span className="flex-1 text-left">{selectedOption?.label}</span>
        <IconChevronDown 
          className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {isOpen && (
        <>
          {/* Overlay to close dropdown */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-full bg-popover border border-border rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-accent transition-colors ${
                  value === option.value ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}