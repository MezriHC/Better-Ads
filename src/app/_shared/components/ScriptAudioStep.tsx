"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { IconUpload, IconPlayerPlay, IconX, IconChevronDown, IconFileText, IconMicrophone, IconFileMusic, IconSquare, IconPlayerPause } from "@tabler/icons-react"

interface Avatar {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  imageUrl: string
  type: "image"
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

// Audio Recording Modal Component
function AudioRecordingModal({ isOpen, onClose, onSave }: {
  isOpen: boolean
  onClose: () => void
  onSave: (audioBlob: Blob) => void
}) {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        setAudioBlob(blob)
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Erreur accès microphone:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }

  const playAudio = () => {
    if (audioBlob && !isPlaying) {
      const url = URL.createObjectURL(audioBlob)
      const audio = new Audio(url)
      audioRef.current = audio
      
      audio.onended = () => setIsPlaying(false)
      audio.play()
      setIsPlaying(true)
    }
  }

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleSave = () => {
    if (audioBlob) {
      onSave(audioBlob)
      onClose()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Enregistrer Audio</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <IconX size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Recording Controls */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
              <IconMicrophone size={32} className={isRecording ? "text-red-500" : "text-primary"} />
            </div>
            
            {isRecording && (
              <div className="text-center">
                <div className="text-2xl font-mono text-foreground">{formatTime(recordingTime)}</div>
                <div className="text-sm text-muted-foreground">Enregistrement en cours...</div>
              </div>
            )}

            <div className="flex gap-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <IconMicrophone size={16} />
                  Commencer
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                >
                  <IconSquare size={16} />
                  Arrêter
                </button>
              )}
            </div>
          </div>

          {/* Audio Playback */}
          {audioBlob && (
            <div className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Aperçu enregistrement</span>
                <div className="flex gap-2">
                  {!isPlaying ? (
                    <button
                      onClick={playAudio}
                      className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      <IconPlayerPlay size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={pauseAudio}
                      className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      <IconPlayerPause size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={!audioBlob}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  )
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

export function ScriptAudioStep({ selectedAvatar, onBack, onNext, type, onValidationChange }: ScriptAudioStepProps) {
  const [script, setScript] = useState("")
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null)
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [contentMethod, setContentMethod] = useState<"script" | "audio">("script") // Choose between script or audio
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false)

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

  const handleRecordedAudio = (audioBlob: Blob) => {
    // Convert blob to file
    const file = new File([audioBlob], 'recorded-audio.wav', { type: 'audio/wav' })
    setAudioFile(file)
    setScript("") // Clear script when using recorded audio
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
              <div className="flex flex-col gap-3">
                <label className="block text-sm font-medium text-foreground">
                  {type === "video" ? "Your script" : "Product description"}
                </label>
                <div className="relative">
                  <textarea
                    value={script}
                    onChange={(e) => handleScriptChange(e.target.value)}
                    placeholder={type === "video" ? "Enter your script here..." : "Describe your product here..."}
                    className="w-full h-40 p-3 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                </div>
                
                {/* Voice selector integrated below textarea */}
                <div className="flex items-center justify-between">
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
                          <p className="text-sm text-muted-foreground">
                            MP3, WAV, M4A
                          </p>
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
                        <p className="text-sm text-muted-foreground">
                          Enregistrer directement
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}

            </div>
            

            
          </div>
          
          {/* Right Column - Avatar Preview (1/4 width on large screens) */}
          <div className="lg:col-span-1">
            {selectedAvatar && (
              <div className="bg-card border border-border rounded-2xl p-4 sticky top-4 flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-foreground">Selected Avatar</h3>
                <div className="aspect-[9/16] relative rounded-xl overflow-hidden bg-muted">
                  <Image
                    src={selectedAvatar.imageUrl}
                    alt={selectedAvatar.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="font-medium text-foreground">{selectedAvatar.name}</h4>
                  <div className="flex flex-wrap gap-1">
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

      {/* Audio Recording Modal */}
      <AudioRecordingModal
        isOpen={isRecordingModalOpen}
        onClose={() => setIsRecordingModalOpen(false)}
        onSave={handleRecordedAudio}
      />
    </>
  )
}