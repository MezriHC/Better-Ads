"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { IconSettings, IconFileText, IconMicrophone, IconPlayerPlay, IconFileMusic } from '@tabler/icons-react'
import { Avatar, Voice, AudioSettings, SpeechMode } from './types'
import { AudioRecordingModal } from './AudioRecordingModal'
import { AudioSettingsPanel } from './AudioSettingsPanel'
import { VoiceSelectionModal } from './VoiceSelectionModal'

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
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null)
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [speechMode, setSpeechMode] = useState<SpeechMode>("text-to-speech")
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false)
  
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

  return (
    <>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2 flex flex-col gap-6">
            {/* Speech Mode Selector */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setSpeechMode("text-to-speech")}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    speechMode === "text-to-speech"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <IconFileText size={20} className={speechMode === "text-to-speech" ? "text-primary" : "text-muted-foreground"} />
                    <span className="font-medium">Text to Speech</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Écrivez votre script et l&apos;IA va le lire avec la voix sélectionnée
                  </p>
                </button>
                
                <button
                  onClick={() => setSpeechMode("speech-to-speech")}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    speechMode === "speech-to-speech"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <IconMicrophone size={20} className={speechMode === "speech-to-speech" ? "text-primary" : "text-muted-foreground"} />
                    <span className="font-medium">Speech to Speech</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enregistrez votre voix et l&apos;IA va la cloner avec la voix sélectionnée
                  </p>
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-4">
              {speechMode === 'text-to-speech' ? (
                <textarea
                  value={script}
                  onChange={(e) => handleScriptChange(e.target.value)}
                  placeholder={type === "video" ? "Enter your script here..." : "Describe your product here..."}
                  className="w-full h-40 p-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Upload Audio */}
                  <label className="block">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="sr-only"
                    />
                    <div className="w-full p-4 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-accent/50 transition-all cursor-pointer text-center group">
                      <div className="flex flex-col gap-2 items-center">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 flex items-center justify-center transition-all">
                          <IconFileMusic className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-center flex flex-col gap-1">
                          <p className="font-medium text-foreground">Upload Audio</p>
                          <p className="text-sm text-muted-foreground">MP3, WAV, M4A</p>
                        </div>
                      </div>
                    </div>
                  </label>
                  {/* Record Audio */}
                  <button
                    type="button"
                    onClick={() => setIsRecordingModalOpen(true)}
                    className="w-full p-4 border-2 border-dashed border-border rounded-lg hover:border-red-500/50 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all text-center group"
                  >
                    <div className="flex flex-col gap-2 items-center">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/10 to-red-500/5 group-hover:from-red-500/20 group-hover:to-red-500/10 flex items-center justify-center transition-all">
                        <IconMicrophone className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="text-center flex flex-col gap-1">
                        <p className="font-medium text-foreground">Record Audio</p>
                        <p className="text-sm text-muted-foreground">Enregistrer directement</p>
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-1 flex flex-col gap-6">
            {/* Avatar Selector */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Selected Avatar</h3>
              {selectedAvatar && (
                <div className="flex items-center gap-4">
                  <Image src={selectedAvatar.imageUrl} alt={selectedAvatar.name} width={64} height={64} className="rounded-full object-cover" />
                  <div>
                    <h4 className="font-medium text-foreground">{selectedAvatar.name}</h4>
                    <button className="text-sm text-primary hover:underline">Change</button>
                  </div>
                </div>
              )}
            </div>

            {/* Audio Settings */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4">Audio Settings</h3>
              <div className="space-y-6">
                {/* Speed */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Speed</label>
                    <span className="text-sm text-muted-foreground">{audioSettings.speed.toFixed(2)}X</span>
                  </div>
                  <input
                    type="range" min="0.25" max="4.00" step="0.05"
                    value={audioSettings.speed}
                    onChange={(e) => handleSliderChange('speed', parseFloat(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                {/* Stability */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Stability</label>
                    <span className="text-sm text-muted-foreground">{audioSettings.stability.toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min="0.00" max="1.00" step="0.05"
                    value={audioSettings.stability}
                    onChange={(e) => handleSliderChange('stability', parseFloat(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                {/* Similarity */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Similarity</label>
                    <span className="text-sm text-muted-foreground">{audioSettings.similarity.toFixed(2)}</span>
                  </div>
                  <input
                    type="range" min="0.00" max="1.00" step="0.05"
                    value={audioSettings.similarity}
                    onChange={(e) => handleSliderChange('similarity', parseFloat(e.target.value))}
                    className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </>
  )
}
