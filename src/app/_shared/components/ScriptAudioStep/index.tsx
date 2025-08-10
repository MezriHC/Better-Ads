"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { IconChevronDown, IconPlayerPlay, IconMicrophone, IconFileMusic, IconSettings2, IconTrash, IconFileText } from '@tabler/icons-react'
import { Avatar, Voice, AudioSettings, SpeechMode } from './types'
import { voices } from './data'
import { AudioRecordingModal } from './AudioRecordingModal'
import { VoiceSelectionModal } from './VoiceSelectionModal'
import { DropdownSelector } from './DropdownSelector'
import { AudioSettingsDrawer } from './AudioSettingsDrawer'

interface ScriptAudioStepProps {
  selectedAvatar: Avatar | null
  onBack: () => void
  onNext: () => void
  type: "video" | "product"
  onValidationChange?: (canContinue: boolean) => void
}

export function ScriptAudioStep({ selectedAvatar, onBack, onNext, type, onValidationChange }: ScriptAudioStepProps) {
  const [script, setScript] = useState("")
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(voices[0]) // Default to first voice
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [speechMode, setSpeechMode] = useState<SpeechMode>("text-to-speech")
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [isAudioSettingsOpen, setIsAudioSettingsOpen] = useState(false)
  
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    speed: 1.10,
    stability: 0.50,
    similarity: 0.75,
    styleExaggeration: 0.00
  })

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAudioFile(file)
      setScript("")
    }
  }

  const handleVoiceSelect = (voice: Voice) => {
    setSelectedVoice(voice)
    setIsVoiceModalOpen(false)
  }

  const handleScriptChange = (value: string) => {
    setScript(value)
    if (value.trim()) {
      setAudioFile(null)
    }
  }

  const handleRecordedAudio = (audioBlob: Blob) => {
    const file = new File([audioBlob], 'recorded-audio.wav', { type: 'audio/wav' })
    setAudioFile(file)
    setScript("")
  }

  const canContinue = Boolean(
    selectedVoice && (
      (speechMode === "text-to-speech" && script.trim()) ||
      (speechMode === "speech-to-speech" && audioFile)
    )
  )

  useEffect(() => {
    onValidationChange?.(canContinue)
  }, [canContinue, onValidationChange])

  const handleSliderChange = (key: keyof AudioSettings, value: number) => {
    setAudioSettings(prev => ({ ...prev, [key]: value }))
  }

  // Dropdown options
  const speechModeOptions = [
    {
      id: "text-to-speech",
      label: "Text to Speech",
      description: "Type your script",
      icon: <IconFileText className="w-5 h-5 text-blue-500" />
    },
    {
      id: "speech-to-speech",
      label: "Speech to Speech", 
      description: "Upload or record audio",
      icon: <IconMicrophone className="w-5 h-5 text-red-500" />
    }
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
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

      {/* Main Content Area */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden">
        {/* Script/Content Area */}
        <div className="p-6">
          {speechMode === 'text-to-speech' ? (
            <textarea
              value={script}
              onChange={(e) => handleScriptChange(e.target.value)}
              placeholder={type === "video" ? "Enter your script here..." : "Describe your product here..."}
              className="w-full h-40 p-4 bg-muted/50 border-0 rounded-xl text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-base leading-relaxed"
            />
          ) : (
            <div className="space-y-4">
              {audioFile ? (
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <IconFileMusic className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{audioFile.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {(audioFile.size / 1024 / 1024).toFixed(2)} MB • Ready for voice cloning
                    </p>
                  </div>
                  <button
                    onClick={() => setAudioFile(null)}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                  >
                    <IconTrash size={18} />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="sr-only"
                    />
                    <div className="p-6 border-2 border-dashed border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer text-center group">
                      <div className="flex flex-col gap-3 items-center">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-all">
                          <IconFileMusic className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Upload Audio File</p>
                          <p className="text-sm text-muted-foreground">MP3, WAV, M4A</p>
                        </div>
                      </div>
                    </div>
                  </label>
                  <button
                    onClick={() => setIsRecordingModalOpen(true)}
                    className="p-6 border-2 border-dashed border-red-200 rounded-xl hover:border-red-400 hover:bg-red-50/50 dark:border-red-800 dark:hover:border-red-600 dark:hover:bg-red-950/20 transition-all text-center group"
                  >
                    <div className="flex flex-col gap-3 items-center">
                      <div className="w-12 h-12 rounded-xl bg-red-100 group-hover:bg-red-200 dark:bg-red-950 dark:group-hover:bg-red-900 flex items-center justify-center transition-all">
                        <IconMicrophone className="w-6 h-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Record Audio</p>
                        <p className="text-sm text-muted-foreground">Record directly</p>
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Voice Display */}
        {selectedVoice && (
          <div className="px-6 py-4 bg-muted/30 border-t border-border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                {selectedVoice.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{selectedVoice.name}</h3>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{selectedVoice.language}</span>
                  <span className="text-sm text-muted-foreground">0:00</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {selectedVoice.gender === "female" ? "Female" : "Male"} • {selectedVoice.age === "young" ? "Young" : "Adult"} • {selectedVoice.accent}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                  <IconPlayerPlay className="w-5 h-5 text-muted-foreground" />
                </button>
                <button 
                  onClick={() => setIsAudioSettingsOpen(true)}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <IconSettings2 className="w-5 h-5 text-muted-foreground" />
                </button>
                <button className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors">
                  <IconTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="px-6 py-4 bg-muted/20 border-t border-border">
          <div className="flex items-center gap-4">
            {/* Speech Mode Selector */}
            <DropdownSelector
              options={speechModeOptions}
              selectedId={speechMode}
              onSelect={(id) => setSpeechMode(id as SpeechMode)}
              className="min-w-[180px]"
            />

            {/* Avatar Selector */}
            {selectedAvatar && (
              <button 
                onClick={() => setIsAvatarModalOpen(true)}
                className="flex items-center gap-3 px-4 py-2 bg-background border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <Image 
                  src={selectedAvatar.imageUrl} 
                  alt={selectedAvatar.name} 
                  width={32} 
                  height={32} 
                  className="rounded-lg object-cover" 
                />
                <span className="font-medium">1 Actor</span>
                <IconChevronDown className="w-4 h-4" />
              </button>
            )}

            {/* Voice Selector */}
            <button 
              onClick={() => setIsVoiceModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-accent transition-colors ml-auto"
            >
              <span className="font-medium">Choose Voice</span>
              <IconChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals and Drawers */}
      <VoiceSelectionModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSelect={handleVoiceSelect}
        selectedVoiceId={selectedVoice?.id}
      />
      <AudioRecordingModal
        isOpen={isRecordingModalOpen}
        onClose={() => setIsRecordingModalOpen(false)}
        onSave={handleRecordedAudio}
      />
      <AudioSettingsDrawer
        isOpen={isAudioSettingsOpen}
        onClose={() => setIsAudioSettingsOpen(false)}
        settings={audioSettings}
        onSettingsChange={setAudioSettings}
      />
    </div>
  )
}
