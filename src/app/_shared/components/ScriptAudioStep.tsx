"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { IconUpload, IconPlayerPlay, IconX, IconChevronDown, IconFileText, IconMicrophone, IconFileMusic } from "@tabler/icons-react"

interface Avatar {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  imageUrl: string
  type: "video" | "product"
  gender?: "male" | "female"
  age?: "young" | "adult"
  theme?: string
}

interface Voice {
  id: string
  name: string
  gender: "male" | "female"
  age: "young" | "adult"
  language: string
  accent: string
  previewUrl: string
}

interface ScriptAudioStepProps {
  selectedAvatar: Avatar | null
  onBack: () => void
  onNext: () => void
  type: "video" | "product"
  onValidationChange?: (canContinue: boolean) => void
}

// Sample voices data
const voices: Voice[] = [
  { id: "1", name: "Carson", gender: "male", age: "young", language: "English", accent: "American", previewUrl: "#" },
  { id: "2", name: "Violet", gender: "female", age: "young", language: "English", accent: "American", previewUrl: "#" },
  { id: "3", name: "Addison", gender: "female", age: "young", language: "English", accent: "American", previewUrl: "#" },
  { id: "4", name: "Diego", gender: "male", age: "young", language: "Portuguese", accent: "Brazilian", previewUrl: "#" },
  { id: "5", name: "Charles", gender: "male", age: "young", language: "English", accent: "American", previewUrl: "#" },
  { id: "6", name: "William", gender: "male", age: "young", language: "English", accent: "American", previewUrl: "#" },
  { id: "7", name: "Scarlett", gender: "female", age: "young", language: "English", accent: "American", previewUrl: "#" },
  { id: "8", name: "Marie", gender: "female", age: "adult", language: "French", accent: "French", previewUrl: "#" },
]

// Custom dropdown component (same style as AvatarSelector)
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
          <div className="absolute top-full left-0 mt-1 w-full bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden max-h-60 overflow-y-auto">
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

// Voice selection modal component
function VoiceSelectionModal({ 
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
        <div className="p-6 border-b border-border">
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
          <div className="flex gap-4 mt-4">
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
                  <div>
                    <h3 className="font-semibold text-foreground">{voice.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {voice.gender === "female" ? "Female" : "Male"} • {voice.age === "young" ? "Young" : "Adult"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
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

export function ScriptAudioStep({ selectedAvatar, onBack, onNext, type, onValidationChange }: ScriptAudioStepProps) {
  const [script, setScript] = useState("")
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null)
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [contentMethod, setContentMethod] = useState<"script" | "audio">("script") // Choose between script or audio
  const [customMotion, setCustomMotion] = useState("")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAudioFile(file)
      setScript("") // Clear script when uploading audio
    }
  }

  const handleVoiceSelect = (voice: Voice) => {
    setSelectedVoice(voice)
    setIsVoiceModalOpen(false)
  }

  const handleScriptChange = (value: string) => {
    setScript(value)
    if (value.trim()) {
      setAudioFile(null) // Clear audio when writing script
    }
  }

  const canContinue = Boolean(selectedVoice && (script.trim() || audioFile))

  // Notify parent about validation state changes
  useEffect(() => {
    onValidationChange?.(canContinue)
  }, [canContinue, onValidationChange])

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Header with Next button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {type === "video" ? "Script & Audio" : "Product Description & Audio"}
            </h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors"
            >
              Back
            </button>
            <div
              onClick={canContinue ? onNext : undefined}
              className={canContinue ? "cursor-pointer" : "cursor-not-allowed"}
            >
              <div
                className={`p-[2px] rounded-[16px] transition-all ${
                  canContinue 
                    ? 'bg-gradient-to-b from-black/20 to-transparent dark:from-white/20' 
                    : 'bg-gradient-to-b from-black/10 to-transparent dark:from-white/10'
                }`}
              >
                <div
                  className={`group rounded-[14px] shadow-lg transition-all ${
                    canContinue
                      ? 'bg-foreground dark:bg-white hover:shadow-md active:shadow-sm active:scale-[0.98] cursor-pointer'
                      : 'bg-muted cursor-not-allowed opacity-50'
                  }`}
                >
                  <div
                    className={`px-6 py-3 rounded-[12px] transition-all ${
                      canContinue
                        ? 'bg-gradient-to-b from-transparent to-white/10 dark:to-black/10'
                        : 'bg-gradient-to-b from-transparent to-black/5 dark:to-white/5'
                    }`}
                  >
                    <span className={`font-semibold ${
                      canContinue
                        ? 'text-background dark:text-black'
                        : 'text-muted-foreground'
                    }`}>
                      {type === "video" ? "Generate Video" : "Generate Ad"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:items-start">
          
          {/* Left Column - Forms (3/4 width on large screens) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            
            {/* Combined Script & Audio Section */}
            <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-4">
              
              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-muted rounded-lg">
                <button
                  onClick={() => setContentMethod("script")}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    contentMethod === "script"
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <IconFileText className="w-4 h-4" />
                  {type === "video" ? "Script" : "Description"}
                </button>
                <button
                  onClick={() => setContentMethod("audio")}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    contentMethod === "audio"
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <IconUpload className="w-4 h-4" />
                  Audio
                </button>
              </div>

          {/* Content based on selected tab */}
          {contentMethod === "script" && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  {type === "video" ? "Your script" : "Product description"}
                </label>
                <div className="relative">
                  <textarea
                    value={script}
                    onChange={(e) => handleScriptChange(e.target.value)}
                    placeholder={type === "video" ? "Enter your script here..." : "Describe your product here..."}
                    className="w-full h-24 p-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
                
                {/* Voice selector integrated below textarea */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3">
                    {selectedVoice ? (
                      <div className="flex items-center gap-2">
                        <IconMicrophone className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground font-medium">{selectedVoice.name} - Voice</span>
                        <button 
                          className="w-6 h-6 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                          title="Preview voice"
                        >
                          <IconPlayerPlay className="w-3 h-3 text-primary" fill="currentColor" />
                        </button>
                        <button
                          onClick={() => setIsVoiceModalOpen(true)}
                          className="text-xs text-muted-foreground hover:text-foreground underline"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsVoiceModalOpen(true)}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <IconMicrophone className="w-4 h-4" />
                        <span className="underline">Select AI Voice</span>
                      </button>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-muted-foreground">
                      {script.length}/4000 characters
                    </p>
                    {script.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        Ready
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {contentMethod === "audio" && (
            <div>
              {audioFile ? (
                <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconMicrophone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{audioFile.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {(audioFile.size / 1024 / 1024).toFixed(2)} MB • Voice will be replaced
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setAudioFile(null)}
                    className="px-3 py-1 text-sm bg-background border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="block">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                  <div className="w-full p-4 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-accent/50 transition-all cursor-pointer text-center group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 flex items-center justify-center mx-auto mb-2 transition-all">
                      <IconFileMusic className="w-5 h-5 text-primary" />
                    </div>
                    <p className="font-medium text-foreground mb-1">Upload audio file</p>
                    <p className="text-sm text-muted-foreground">
                      MP3, WAV, M4A • Max 10MB
                    </p>
                  </div>
                </label>
              )}
            </div>
          )}

            </div>
            
            {/* Custom Motion Section (Optional) */}
            <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground">Custom Motion</h3>
                <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">Optional</span>
              </div>
              <p className="text-sm text-muted-foreground -mt-2">
                Describe specific gestures and facial expressions for your avatar
              </p>
              
              <div>
                <textarea
                  value={customMotion}
                  onChange={(e) => setCustomMotion(e.target.value)}
                  placeholder="e.g., 'Avatar speaks with hands up in the air, smiling, pointing to the product...'"
                  className="w-full h-20 p-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">
                    {customMotion.length}/500 characters
                  </p>
                  {customMotion.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-accent-foreground">
                      <div className="w-2 h-2 rounded-full bg-accent-foreground"></div>
                      Motion added
                    </div>
                  )}
                </div>
              </div>
            </div>
            
          </div>
          
          {/* Right Column - Avatar Preview (1/4 width on large screens) */}
          <div className="lg:col-span-1">
            {selectedAvatar && (
              <div className="bg-card border border-border rounded-2xl p-4 sticky top-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Selected Avatar</h3>
                <div className="aspect-[9/16] relative rounded-xl overflow-hidden bg-muted">
                  <Image
                    src={selectedAvatar.imageUrl}
                    alt={selectedAvatar.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="mt-3">
                  <h4 className="font-medium text-foreground">{selectedAvatar.name}</h4>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedAvatar.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-muted rounded-full text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>

      {/* Voice Selection Modal */}
      <VoiceSelectionModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSelect={handleVoiceSelect}
        selectedVoiceId={selectedVoice?.id}
      />
    </>
  )
}