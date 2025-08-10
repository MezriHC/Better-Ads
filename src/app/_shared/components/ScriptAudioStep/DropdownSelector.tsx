"use client"

import React, { useState, useRef, useEffect } from 'react'
import { IconChevronDown } from '@tabler/icons-react'

interface DropdownOption {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
}

interface DropdownSelectorProps {
  options: DropdownOption[]
  selectedId: string
  onSelect: (id: string) => void
  placeholder?: string
  className?: string
}

export function DropdownSelector({ options, selectedId, onSelect, placeholder = "Select option", className = "" }: DropdownSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.id === selectedId)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-accent transition-colors w-full justify-between"
      >
        <div className="flex items-center gap-2">
          {selectedOption?.icon}
          <span className="font-medium">{selectedOption?.label || placeholder}</span>
        </div>
        <IconChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onSelect(option.id)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3 ${
                selectedId === option.id ? 'bg-accent' : ''
              }`}
            >
              {option.icon}
              <div>
                <div className="font-medium">{option.label}</div>
                {option.description && (
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
