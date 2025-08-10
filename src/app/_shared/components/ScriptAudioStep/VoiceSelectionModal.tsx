"use client"

import React, { useState } from 'react'
import { IconX, IconPlayerPlay, IconChevronDown } from '@tabler/icons-react'
import { Voice } from './types'
import { voices } from './data'

function FilterSelect({ 
  value, 
  onChange, 
  options 
}: { 
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const currentOption = options.find(opt => opt.value === value)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-foreground hover:border-primary/50 transition-colors min-w-[140px] justify-between"
      >
        <span className="text-sm font-medium">{currentOption?.label}</span>
        <IconChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 w-full bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden max-h-60 overflow-y-auto" style={{marginTop: '4px'}}>
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors ${
                  value === option.value ? 'bg-accent text-accent-foreground' : 'text-foreground'
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

export function VoiceSelectionModal({ 
  isOpen, 
  onClose, 
  onSelect, 
  selectedVoiceId 
}: { 
  isOpen: boolean
  onClose: () => void
  onSelect: (voice: Voice) => void
  selectedVoiceId?: string
}) {
  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all")
  const [languageFilter, setLanguageFilter] = useState<"all" | string>("all")

  const languages = Array.from(new Set(voices.map(voice => voice.language)))
  
  const genderOptions = [
    { value: "all", label: "All genders" },
    { value: "female", label: "Female" },
    { value: "male", label: "Male" }
  ]

  const languageOptions = [
    { value: "all", label: "All languages" },
    ...languages.map(lang => ({
      value: lang,
      label: lang
    }))
  ]
  
  const filteredVoices = voices.filter(voice => {
    if (genderFilter !== "all" && voice.gender !== genderFilter) return false
    if (languageFilter !== "all" && voice.language !== languageFilter) return false
    return true
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl border border-border w-full max-w-4xl max-h-[80vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-border flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Choose an AI Voice</h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-muted hover:bg-accent flex items-center justify-center transition-colors"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>
          
          {/* Filters */}
          <div className="flex gap-4">
            <FilterSelect
              label="Gender"
              value={genderFilter}
              onChange={(value) => setGenderFilter(value as "all" | "male" | "female")}
              options={genderOptions}
            />
            
            <FilterSelect
              label="Language"
              value={languageFilter}
              onChange={setLanguageFilter}
              options={languageOptions}
            />
          </div>
        </div>

        {/* Voice grid */}
        <div className="p-6 overflow-y-auto max-h-[500px]">
          <div className="grid grid-cols-2 gap-4">
            {filteredVoices.map((voice) => (
              <div
                key={voice.id}
                onClick={() => onSelect(voice)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedVoiceId === voice.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-accent/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-foreground">{voice.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {voice.gender === "female" ? "Female" : "Male"} • {voice.age === "young" ? "Young" : "Adult"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      🇺🇸 {voice.language} • {voice.accent}
                    </p>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors">
                    <IconPlayerPlay className="w-4 h-4 text-primary" fill="currentColor" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
