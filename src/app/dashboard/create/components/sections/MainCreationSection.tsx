"use client"

import { useState } from 'react'
import { IconUpload } from "@tabler/icons-react"
import { CreationPanel } from '../ui/CreationPanel'
import { AudioManager } from '../../audio-recording/components/AudioManager'
import type { CreationType, Avatar, Voice, AudioSettings } from '../../types'

interface MainCreationSectionProps {
  selectedType: CreationType
  script: string
  speechMode: "text-to-speech" | "speech-to-speech"
  selectedVideoFormat: string
  selectedActor: Avatar | null
  selectedVoice: Voice
  selectedBRollImage: File | null
  audioFile: File | null
  recordedBlob: Blob | null
  isRecording: boolean
  isPlaying: boolean
  recordingState: "idle" | "ready" | "recording" | "completed"
  recordingTime: number
  isVoiceGenerated: boolean
  isGeneratingVoice: boolean
  isPlayingVoice: boolean
  isAudioSettingsOpen: boolean
  isGenerating?: boolean
  onTypeChange: (type: CreationType) => void
  onScriptChange: (script: string) => void
  onSpeechModeChange: (mode: "text-to-speech" | "speech-to-speech") => void
  onVideoFormatChange: (format: string) => void
  onBRollImageChange: (image: File | null) => void
  onOpenActorModal: () => void
  onSubmit: () => void
  onStartRecording: () => void
  onStopRecording: () => void
  onPlayRecording: () => void
  onPauseRecording: () => void
  onRestartRecording: () => void
  onPrepareRecording: () => void
  onClearAudio: () => void
  onCancelRecording: () => void
  onGenerateVoice: () => void
  onPlayPauseVoice: () => void
  onRegenerateVoice: () => void
  onToggleAudioSettings: () => void
  formatTime: (seconds: number) => string
  getPlaceholder: () => string
  creationTypes: any[]
  speechModes: any[]
  videoFormats: any[]
}

export function MainCreationSection(props: MainCreationSectionProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSpeechDropdownOpen, setIsSpeechDropdownOpen] = useState(false)
  const [isVideoFormatDropdownOpen, setIsVideoFormatDropdownOpen] = useState(false)
  const [isDragOverGlobal, setIsDragOverGlobal] = useState(false)

  // Fermer tous les dropdowns quand on change de type
  const closeAllDropdowns = () => {
    setIsDropdownOpen(false)
    setIsSpeechDropdownOpen(false)
    setIsVideoFormatDropdownOpen(false)
  }

  // Gestion du drag & drop global pour B-Roll
  const handleGlobalDragOver = (event: React.DragEvent) => {
    if (props.selectedType === "b-rolls") {
      event.preventDefault()
      setIsDragOverGlobal(true)
    }
  }

  const handleGlobalDragLeave = (event: React.DragEvent) => {
    if (props.selectedType === "b-rolls") {
      event.preventDefault()
      // Vérifier si on sort vraiment du container (et pas juste d'un enfant)
      const rect = event.currentTarget.getBoundingClientRect()
      const x = event.clientX
      const y = event.clientY
      
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        setIsDragOverGlobal(false)
      }
    }
  }

  const handleGlobalDrop = (event: React.DragEvent) => {
    if (props.selectedType === "b-rolls") {
      event.preventDefault()
      setIsDragOverGlobal(false)
      
      const file = event.dataTransfer.files[0]
      if (file && file.type.startsWith('image/')) {
        props.onBRollImageChange(file)
      }
    }
  }

  return (
    <div 
      className={`w-full transition-all duration-400 ease-in-out h-full relative ${
        props.selectedType === "talking-actor" && props.isAudioSettingsOpen 
          ? "max-w-4xl" 
          : "max-w-4xl"
      }`}
      onDragOver={handleGlobalDragOver}
      onDragLeave={handleGlobalDragLeave}
      onDrop={handleGlobalDrop}
    >
      <div className={`p-[1px] rounded-2xl bg-gradient-to-b from-border/50 via-primary/10 to-border/30 w-full max-w-4xl transition-all duration-400 ease-in-out h-full ${
        isDragOverGlobal ? 'bg-gradient-to-b from-primary/30 via-primary/15 to-primary/5' : ''
      }`}>
        <div className="bg-card/95 backdrop-blur-sm border-0 rounded-2xl p-4 shadow-xl shadow-primary/5 h-full flex flex-col">
          <CreationPanel
            {...props}
            isDropdownOpen={isDropdownOpen}
            isSpeechDropdownOpen={isSpeechDropdownOpen}
            isVideoFormatDropdownOpen={isVideoFormatDropdownOpen}
            onToggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
            onToggleSpeechDropdown={() => setIsSpeechDropdownOpen(!isSpeechDropdownOpen)}
            onToggleVideoFormatDropdown={() => setIsVideoFormatDropdownOpen(!isVideoFormatDropdownOpen)}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                props.onSubmit()
              }
            }}
            onCloseAudioSettings={closeAllDropdowns}
          />
        </div>
      </div>

      {/* Overlay global de drop pour B-Roll */}
      {isDragOverGlobal && props.selectedType === "b-rolls" && (
        <div className="absolute inset-0 bg-background rounded-2xl flex items-center justify-center z-50 border-2 border-primary/40 border-dashed">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center">
              <IconUpload className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-base font-medium text-foreground">Drop your starting frame here</p>
              <p className="text-sm text-muted-foreground">
                {props.selectedBRollImage ? 'Replace starting frame' : 'Video will begin with this frame'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}