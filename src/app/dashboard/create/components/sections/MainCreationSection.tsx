/**
 * @purpose: Section principale de création avec logique métier et assemblage composants  
 * @domain: create
 * @scope: feature-create
 * @created: 2025-08-22
 */

"use client"

import { useState } from 'react'
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
  onTypeChange: (type: CreationType) => void
  onScriptChange: (script: string) => void
  onSpeechModeChange: (mode: "text-to-speech" | "speech-to-speech") => void
  onVideoFormatChange: (format: string) => void
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

  return (
    <div className={`w-full transition-all duration-400 ease-in-out h-full ${
      props.selectedType === "talking-actor" && props.isAudioSettingsOpen 
        ? "max-w-4xl" 
        : "max-w-4xl"
    }`}>
      <div className="p-[1px] rounded-2xl bg-gradient-to-b from-border/50 via-primary/10 to-border/30 w-full max-w-4xl transition-all duration-400 ease-in-out h-full">
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
            onCloseAudioSettings={() => {}}
          />
        </div>
      </div>
    </div>
  )
}