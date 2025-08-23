"use client"

import { useState } from "react"
import { IconX, IconChevronDown, IconPlayerPlay } from "@tabler/icons-react"
import type { Voice } from '@/_shared'

interface VoiceSelectionModalProps {
  isOpen: boolean
  selectedVoice: Voice
  voices: Voice[]
  onClose: () => void
  onVoiceChange: (voice: Voice) => void
}

export function VoiceSelectionModal({
  isOpen,
  selectedVoice,
  voices,
  onClose,
  onVoiceChange
}: VoiceSelectionModalProps) {
  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all")
  const [languageFilter, setLanguageFilter] = useState<string>("all")
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)

  const filteredVoices = voices.filter(voice => {
    const genderMatch = genderFilter === "all" || voice.gender === genderFilter
    const languageMatch = languageFilter === "all" || voice.language === languageFilter
    return genderMatch && languageMatch
  })

  const handleVoiceSelect = (voice: Voice) => {
    onVoiceChange(voice)
    onClose()
  }

  const handleConfirm = () => {
    onClose()
  }

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
              className="w-8 h-8 rounded-lg bg-muted hover:bg-accent flex items-center justify-center transition-colors cursor-pointer"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>
          
          {/* Filters */}
          <div className="flex gap-4">
            {/* Gender Filter */}
            <div className="relative">
              <button
                onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-foreground hover:border-primary/50 transition-colors min-w-[140px] justify-between cursor-pointer"
              >
                <span className="text-sm font-medium">
                  {genderFilter === "all" ? "All genders" : 
                   genderFilter === "female" ? "Female" : "Male"}
                </span>
                <IconChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
              
              {isGenderDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsGenderDropdownOpen(false)} />
                  <div className="absolute top-full left-0 w-full bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden max-h-60 overflow-y-auto mt-1">
                    {[
                      { value: "all", label: "All genders" },
                      { value: "female", label: "Female" },
                      { value: "male", label: "Male" }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setGenderFilter(option.value as "all" | "male" | "female")
                          setIsGenderDropdownOpen(false)
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors text-sm cursor-pointer"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Language Filter */}
            <div className="relative">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-foreground hover:border-primary/50 transition-colors min-w-[140px] justify-between cursor-pointer"
              >
                <span className="text-sm font-medium">
                  {languageFilter === "all" ? "All languages" : languageFilter}
                </span>
                <IconChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
              
              {isLanguageDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsLanguageDropdownOpen(false)} />
                  <div className="absolute top-full left-0 w-full bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden max-h-60 overflow-y-auto mt-1">
                    {[
                      { value: "all", label: "All languages" },
                      { value: "English", label: "English" },
                      { value: "Spanish", label: "Spanish" },
                      { value: "French", label: "French" }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setLanguageFilter(option.value)
                          setIsLanguageDropdownOpen(false)
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors text-sm cursor-pointer"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Voice Grid */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVoices.map((voice) => (
              <div
                key={voice.id}
                onClick={() => handleVoiceSelect(voice)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedVoice.id === voice.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-accent/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{voice.flag}</span>
                      <h3 className="font-semibold text-foreground">{voice.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {voice.gender === "female" ? "Female" : "Male"} • {voice.language}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {voice.language} • {voice.country}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      // Play voice preview - could add functionality later
                    }}
                    className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <IconPlayerPlay className="w-4 h-4 text-primary" fill="currentColor" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-foreground hover:bg-accent rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}