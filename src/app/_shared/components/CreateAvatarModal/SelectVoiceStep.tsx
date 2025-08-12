"use client"

import { useState } from "react"
import { IconSearch, IconChevronDown, IconPlayerPlay } from "@tabler/icons-react"

interface Voice {
  id: string
  name: string
  tags: string[]
  language: string
  accent: string
  gender: string
  audioUrl?: string
}

interface SelectedVoice {
  id: string
  name: string
  gender: string
  age: string
  language: string
  accent: string
  tags: string[]
  audioUrl?: string
}

interface SelectVoiceStepProps {
  onVoiceSelect: (voice: SelectedVoice) => void
  isUploading?: boolean
}

const mockVoices: Voice[] = [
  {
    id: "abbi",
    name: "Abbi",
    tags: ["Upbeat"],
    language: "English",
    accent: "australian",
    gender: "Female"
  },
  {
    id: "adam",
    name: "Adam",
    tags: ["Calm"],
    language: "English",
    accent: "French",
    gender: "Male"
  },
  {
    id: "addison",
    name: "Addison",
    tags: ["Informative & Educational"],
    language: "English",
    accent: "australian",
    gender: "Female"
  },
  {
    id: "adriana",
    name: "Adriana",
    tags: ["Smiling"],
    language: "English",
    accent: "Standard",
    gender: "Female"
  },
  {
    id: "agatha",
    name: "Agatha",
    tags: ["Calm"],
    language: "English",
    accent: "Standard",
    gender: "Female"
  },
  {
    id: "alexander",
    name: "Alexander",
    tags: ["Professional"],
    language: "English",
    accent: "british",
    gender: "Male"
  },
  {
    id: "alice",
    name: "Alice",
    tags: ["Friendly"],
    language: "English",
    accent: "Standard",
    gender: "Female"
  },
  {
    id: "andrew",
    name: "Andrew",
    tags: ["Authoritative"],
    language: "English",
    accent: "Standard",
    gender: "Male"
  },
  {
    id: "anna",
    name: "Anna",
    tags: ["Warm"],
    language: "English",
    accent: "Standard",
    gender: "Female"
  },
  {
    id: "brian",
    name: "Brian",
    tags: ["Casual"],
    language: "English",
    accent: "Standard",
    gender: "Male"
  },
  {
    id: "charlotte",
    name: "Charlotte",
    tags: ["Elegant"],
    language: "English",
    accent: "british",
    gender: "Female"
  },
  {
    id: "daniel",
    name: "Daniel",
    tags: ["Confident"],
    language: "English",
    accent: "Standard",
    gender: "Male"
  }
]

export function SelectVoiceStep({ onVoiceSelect, isUploading }: SelectVoiceStepProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null)
  const [genderFilter, setGenderFilter] = useState("all")

  const [languageFilter, setLanguageFilter] = useState("English")
  const [accentFilter, setAccentFilter] = useState("all")
  const [isGenderOpen, setIsGenderOpen] = useState(false)

  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isAccentOpen, setIsAccentOpen] = useState(false)
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)

  const filteredVoices = mockVoices.filter(voice => {
    const matchesSearch = voice.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGender = genderFilter === "all" || voice.gender.toLowerCase() === genderFilter
    const matchesLanguage = languageFilter === "all" || voice.language === languageFilter
    const matchesAccent = accentFilter === "all" || voice.accent.toLowerCase() === accentFilter
    
    return matchesSearch && matchesGender && matchesLanguage && matchesAccent
  })

  const handlePlayVoice = (voiceId: string) => {
    if (playingVoice === voiceId) {
      setPlayingVoice(null)
    } else {
      setPlayingVoice(voiceId)
      // Simulate audio play duration
      setTimeout(() => setPlayingVoice(null), 3000)
    }
  }

  const handleVoiceSelect = (voice: Voice) => {
    onVoiceSelect({
      id: voice.id,
      name: voice.name,
      gender: voice.gender,
      age: "Adult", // Mock data
      language: voice.language,
      accent: voice.accent,
      tags: voice.tags,
      audioUrl: voice.audioUrl
    })
  }

  return (
    <div className="relative h-full">
      {/* Search and Filters - Fixed at top */}
      <div className="absolute top-0 left-0 right-0 p-6 border-b border-border bg-card z-10">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
            />
          </div>

          {/* Gender Filter */}
          <div className="relative">
            <button
              onClick={() => setIsGenderOpen(!isGenderOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              <span>Gender</span>
              <IconChevronDown className="w-4 h-4" />
            </button>
            {isGenderOpen && (
              <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-32">
                {["all", "male", "female"].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setGenderFilter(option)
                      setIsGenderOpen(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer"
                  >
                    {option === "all" ? "All" : option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Filter */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              <span>English</span>
              <IconChevronDown className="w-4 h-4" />
            </button>
            {isLanguageOpen && (
              <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-32">
                {["all", "English", "French", "Spanish"].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setLanguageFilter(option)
                      setIsLanguageOpen(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer"
                  >
                    {option === "all" ? "All languages" : option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Accent Filter */}
          <div className="relative">
            <button
              onClick={() => setIsAccentOpen(!isAccentOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg text-foreground hover:bg-accent transition-colors cursor-pointer"
            >
              <span>Accent</span>
              <IconChevronDown className="w-4 h-4" />
            </button>
            {isAccentOpen && (
              <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 min-w-32">
                {["all", "standard", "australian", "french", "british"].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setAccentFilter(option)
                      setIsAccentOpen(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer"
                  >
                    {option === "all" ? "All accents" : option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Voice List - Scrollable content */}
      <div className="absolute inset-0 overflow-y-auto pt-[120px] pb-8 px-6">
        <div className="space-y-2">
          {filteredVoices.map((voice) => (
            <div
              key={voice.id}
              className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
              onClick={() => handleVoiceSelect(voice)}
            >
              <div className="flex items-center gap-4">
                {/* Radio Button */}
                <div className="w-5 h-5 border-2 border-border rounded-full flex items-center justify-center group-hover:border-primary transition-colors">
                  <div className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Voice Info */}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-foreground">{voice.name}</h3>
                    {voice.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="text-sm text-muted-foreground">{voice.language}</span>
                    <span className="text-sm text-muted-foreground">{voice.accent}</span>
                    <span className="text-sm text-muted-foreground">{voice.gender}</span>
                  </div>
                </div>
              </div>

              {/* Play Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePlayVoice(voice.id)
                }}
                className="w-10 h-10 bg-foreground text-background rounded-full flex items-center justify-center hover:bg-foreground/90 transition-colors"
              >
                <IconPlayerPlay className="w-4 h-4" />
              </button>
            </div>
          ))}

          {/* Status */}
          {isUploading && (
            <div className="text-center py-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">Uploading image</span>
              </div>
            </div>
          )}
          
          {/* Espacement final pour équilibrer avec le haut */}
          <div className="h-4"></div>
        </div>
      </div>
    </div>
  )
}
