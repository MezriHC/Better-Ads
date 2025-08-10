"use client"

import React, { useState, useEffect } from 'react'
import { ContentInput } from './ContentInput'
import { AudioSettings } from './AudioSettings'

// Types
interface Avatar {
  id: string
  name: string
  imageUrl: string
}

interface Voice {
  id: string
  name: string
  gender: "male" | "female"
  language: string
  country: string
  flag: string
}

interface AudioSettings {
  speed: number
  stability: number
  similarity: number
  styleExaggeration: number
}

type ContentMode = "text" | "audio"

interface ScriptAudioStepProps {
  selectedAvatar: Avatar | null
  onBack: () => void
  onNext: () => void
  type: "video" | "product"
  onValidationChange?: (canContinue: boolean) => void
}

// Sample data
const voices: Voice[] = [
  { id: "1", name: "Carson", gender: "male", language: "English", country: "US", flag: "🇺🇸" },
  { id: "2", name: "Violet", gender: "female", language: "English", country: "US", flag: "🇺🇸" },
  { id: "3", name: "Charles", gender: "male", language: "English", country: "UK", flag: "🇬🇧" },
  { id: "4", name: "Sarah", gender: "female", language: "English", country: "AU", flag: "🇦🇺" },
  { id: "5", name: "Maria", gender: "female", language: "Spanish", country: "ES", flag: "🇪🇸" },
  { id: "6", name: "Pierre", gender: "male", language: "French", country: "FR", flag: "🇫🇷" },
]

export function ScriptAudioStep({ selectedAvatar: initialAvatar, onBack, onNext, type, onValidationChange }: ScriptAudioStepProps) {
  // Core state
  const [contentMode, setContentMode] = useState<ContentMode>("text")
  const [script, setScript] = useState("")
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(
    initialAvatar || { id: "2", name: "Young Man", imageUrl: "/ai-avatars/avatar-2.jpg" }
  )
  const [selectedVoice, setSelectedVoice] = useState<Voice>(voices[0])
  
  // Voice generation state
  const [isVoiceGenerated, setIsVoiceGenerated] = useState(false)
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false)
  const [generatedVoiceBlob, setGeneratedVoiceBlob] = useState<Blob | null>(null)
  const [isPlayingVoice, setIsPlayingVoice] = useState(false)
  
  // Audio settings
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    speed: 1.0,
    stability: 0.5,
    similarity: 0.75,
    styleExaggeration: 0.0
  })

  // Voice generation functions
  const generateVoice = async () => {
    if (!script.trim() && contentMode === "text") return
    
    setIsGeneratingVoice(true)
    
    // Simulate voice generation (replace with real API call)
    setTimeout(() => {
      const dummyBlob = new Blob(['dummy audio'], { type: 'audio/wav' })
      setGeneratedVoiceBlob(dummyBlob)
      setIsVoiceGenerated(true)
      setIsGeneratingVoice(false)
    }, 2000)
  }

  const playGeneratedVoice = () => {
    if (generatedVoiceBlob && !isPlayingVoice) {
      setIsPlayingVoice(true)
      setTimeout(() => {
        setIsPlayingVoice(false)
      }, 3000)
    }
  }

  const pauseGeneratedVoice = () => {
    setIsPlayingVoice(false)
  }

  const regenerateVoice = () => {
    setIsVoiceGenerated(false)
    generateVoice()
  }

  const handleVoiceChange = (voice: Voice) => {
    setSelectedVoice(voice)
    setIsVoiceGenerated(false) // Reset generation when changing voice
  }

  // Validation
  const canContinue = Boolean(
    selectedAvatar && 
    selectedVoice && 
    (
      (contentMode === "text" && script.trim().length > 0 && script.length <= 1500) ||
      (contentMode === "audio" && audioFile)
    )
  )



  useEffect(() => {
    onValidationChange?.(canContinue)
  }, [canContinue, onValidationChange])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          {type === "video" ? "Script & Audio" : "Product Description & Audio"}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors"
          >
            Back
          </button>
          <button
            onClick={canContinue ? onNext : undefined}
            disabled={!canContinue}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              canContinue
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            {type === "video" ? "Generate Video" : "Generate Ad"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COMPONENT - Main Content */}
        <div className="lg:col-span-2">
          <ContentInput
            contentMode={contentMode}
            onContentModeChange={setContentMode}
            script={script}
            onScriptChange={setScript}
            audioFile={audioFile}
            onAudioFileChange={setAudioFile}
            type={type}
            selectedAvatar={selectedAvatar}
            selectedVoice={selectedVoice}
            onVoiceChange={handleVoiceChange}
            onAvatarChange={onBack}
            isVoiceGenerated={isVoiceGenerated}
            isGeneratingVoice={isGeneratingVoice}
            isPlayingVoice={isPlayingVoice}
            onGenerateVoice={generateVoice}
            onPlayVoice={playGeneratedVoice}
            onPauseVoice={pauseGeneratedVoice}
            onRegenerateVoice={regenerateVoice}
          />
        </div>

        {/* RIGHT COMPONENT - Audio Settings */}
        <div className="lg:col-span-1">
          <AudioSettings
            audioSettings={audioSettings}
            onAudioSettingsChange={setAudioSettings}
          />
        </div>
      </div>
    </div>
  )
}
