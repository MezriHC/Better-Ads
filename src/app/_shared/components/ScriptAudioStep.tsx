"use client"

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { 
  IconChevronDown, 
  IconPlayerPlay, 
  IconMicrophone, 
  IconFileMusic, 
  IconSettings2, 
  IconTrash, 
  IconFileText,
  IconX,
  IconSquare,
  IconPlayerPause,
  IconInfoCircle,
  IconRotateClockwise
} from '@tabler/icons-react'

// Types
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

interface AudioSettings {
  speed: number
  stability: number
  similarity: number
  styleExaggeration: number
}

type SpeechMode = "text-to-speech" | "speech-to-speech"

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

export function ScriptAudioStep({ selectedAvatar, onBack, onNext, type, onValidationChange }: ScriptAudioStepProps) {
  // Main state
  const [script, setScript] = useState("")
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(voices[0])
  const [speechMode, setSpeechMode] = useState<SpeechMode>("text-to-speech")
  
  // Modal states
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false)
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false)
  
  // Audio settings
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    speed: 1.10,
    stability: 0.50,
    similarity: 0.75,
    styleExaggeration: 0.00
  })

  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Voice selection modal state
  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all")
  const [languageFilter, setLanguageFilter] = useState<"all" | string>("all")

  // Handlers
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

  const handleSliderChange = (key: keyof AudioSettings, value: number) => {
    setAudioSettings(prev => ({ ...prev, [key]: value }))
  }

  // Recording functions
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
    } catch {
      // Silent error handling
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Validation
  const canContinue = Boolean(
    selectedVoice && (
      (speechMode === "text-to-speech" && script.trim()) ||
      (speechMode === "speech-to-speech" && audioFile)
    )
  )

  useEffect(() => {
    onValidationChange?.(canContinue)
  }, [canContinue, onValidationChange])

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

  // Filtered voices for modal
  const languages = Array.from(new Set(voices.map(voice => voice.language)))
  const filteredVoices = voices.filter(voice => {
    if (genderFilter !== "all" && voice.gender !== genderFilter) return false
    if (languageFilter !== "all" && voice.language !== languageFilter) return false
    return true
  })

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

      {/* Main Layout - 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left + Center Column - Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
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
                      onClick={() => setIsVoiceSettingsOpen(true)}
                      className="p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      <IconSettings2 className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <button 
                      onClick={() => setSelectedVoice(null)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                    >
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
                <div className="relative">
                  <button 
                    onClick={() => setSpeechMode(speechMode === "text-to-speech" ? "speech-to-speech" : "text-to-speech")}
                    className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    {speechMode === "text-to-speech" ? (
                      <IconFileText className="w-5 h-5 text-blue-500" />
                    ) : (
                      <IconMicrophone className="w-5 h-5 text-red-500" />
                    )}
                    <span className="font-medium">
                      {speechMode === "text-to-speech" ? "Text to Speech" : "Speech to Speech"}
                    </span>
                    <IconChevronDown className="w-4 h-4" />
                  </button>
                </div>

                {/* Avatar Selector */}
                {selectedAvatar && (
                  <button className="flex items-center gap-3 px-4 py-2 bg-background border border-border rounded-lg hover:bg-accent transition-colors">
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
        </div>

        {/* Right Column - Audio Settings */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Audio Settings</h3>
            
            <div className="space-y-6">
              {/* Speed */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Speed</label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                    {audioSettings.speed.toFixed(2)}X
                  </span>
                </div>
                <input
                  type="range"
                  min="0.25"
                  max="4.00"
                  step="0.05"
                  value={audioSettings.speed}
                  onChange={(e) => handleSliderChange('speed', parseFloat(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.25X</span>
                  <span>4.00X</span>
                </div>
              </div>

              {/* Stability */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Stability</label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                    {audioSettings.stability.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.00"
                  max="1.00"
                  step="0.05"
                  value={audioSettings.stability}
                  onChange={(e) => handleSliderChange('stability', parseFloat(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.00</span>
                  <span>1.00</span>
                </div>
              </div>

              {/* Similarity */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Similarity</label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                    {audioSettings.similarity.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.00"
                  max="1.00"
                  step="0.05"
                  value={audioSettings.similarity}
                  onChange={(e) => handleSliderChange('similarity', parseFloat(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.00</span>
                  <span>1.00</span>
                </div>
              </div>

              {/* Style Exaggeration */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Style Exaggeration</label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                    {audioSettings.styleExaggeration.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.00"
                  max="2.00"
                  step="0.05"
                  value={audioSettings.styleExaggeration}
                  onChange={(e) => handleSliderChange('styleExaggeration', parseFloat(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.00</span>
                  <span>2.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Selection Modal */}
      {isVoiceModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl border border-border w-full max-w-4xl max-h-[80vh] overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-border flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Choose an AI Voice</h2>
                <button 
                  onClick={() => setIsVoiceModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-muted hover:bg-accent flex items-center justify-center transition-colors"
                >
                  <IconX className="w-4 h-4" />
                </button>
              </div>
              
              {/* Filters */}
              <div className="flex gap-4">
                <select 
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value as "all" | "male" | "female")}
                  className="px-4 py-2 bg-background border border-border rounded-lg"
                >
                  <option value="all">All genders</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
                
                <select 
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  className="px-4 py-2 bg-background border border-border rounded-lg"
                >
                  <option value="all">All languages</option>
                  {languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Voice grid */}
            <div className="p-6 overflow-y-auto max-h-[500px]">
              <div className="grid grid-cols-2 gap-4">
                {filteredVoices.map((voice) => (
                  <div
                    key={voice.id}
                    onClick={() => handleVoiceSelect(voice)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedVoice?.id === voice.id
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
                onClick={() => setIsVoiceModalOpen(false)}
                className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audio Recording Modal */}
      {isRecordingModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Enregistrer Audio</h3>
              <button onClick={() => setIsRecordingModalOpen(false)} className="text-muted-foreground hover:text-foreground">
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
                  onClick={() => setIsRecordingModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    if (audioBlob) {
                      handleRecordedAudio(audioBlob)
                      setIsRecordingModalOpen(false)
                      setAudioBlob(null)
                    }
                  }}
                  disabled={!audioBlob}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voice Settings Drawer */}
      {isVoiceSettingsOpen && selectedVoice && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsVoiceSettingsOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-80 bg-background border-l border-border shadow-xl z-50 transform transition-transform duration-300">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Voice Settings</h3>
                <button
                  onClick={() => setIsVoiceSettingsOpen(false)}
                  className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
                >
                  <IconX size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                {/* Current Voice */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-foreground">Current Voice</h4>
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {selectedVoice.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h5 className="font-semibold text-foreground">{selectedVoice.name}</h5>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{selectedVoice.language}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedVoice.gender === "female" ? "Female" : "Male"} • {selectedVoice.age === "young" ? "Young" : "Adult"} • {selectedVoice.accent}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center gap-2">
                        <IconPlayerPlay size={16} />
                        <span className="text-sm font-medium">Preview</span>
                      </button>
                      <button 
                        onClick={() => {
                          setIsVoiceSettingsOpen(false)
                          setIsVoiceModalOpen(true)
                        }}
                        className="flex-1 px-3 py-2 bg-background border border-border text-foreground rounded-lg hover:bg-accent transition-colors"
                      >
                        <span className="text-sm font-medium">Change</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Voice Configuration */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-foreground">Voice Configuration</h4>
                  
                  {/* Additional Voice Options */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Voice Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                        Default
                      </button>
                      <button className="px-3 py-2 bg-background border border-border rounded-lg text-sm hover:bg-accent transition-colors">
                        Custom
                      </button>
                    </div>
                  </div>

                  {/* Emphasis */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">Emphasis</label>
                    <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm">
                      <option>Normal</option>
                      <option>Strong</option>
                      <option>Moderate</option>
                      <option>Reduced</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-border">
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsVoiceSettingsOpen(false)}
                    className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2"
                  >
                    <IconRotateClockwise size={16} />
                    <span className="text-sm font-medium">Reset</span>
                  </button>
                  <button
                    onClick={() => setIsVoiceSettingsOpen(false)}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <span className="text-sm font-medium">Apply</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
