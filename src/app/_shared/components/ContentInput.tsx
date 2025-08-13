"use client"

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { 
  IconMicrophone, 
  IconFileMusic, 
  IconTrash,
  IconPlayerPlay,
  IconPlayerPause,
  IconRefresh,
  IconFileText,
  IconChevronDown,
  IconHeadphones,
  IconX
} from '@tabler/icons-react'

type ContentMode = "text" | "audio"

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

interface ContentInputProps {
  contentMode: ContentMode
  onContentModeChange: (mode: ContentMode) => void
  script: string
  onScriptChange: (script: string) => void
  audioFile: File | null
  onAudioFileChange: (file: File | null) => void
  type: "video" | "product"
  selectedAvatar: Avatar | null
  selectedVoice: Voice
  onVoiceChange: (voice: Voice) => void
  onAvatarChange: () => void
  isVoiceGenerated: boolean
  isGeneratingVoice: boolean
  isPlayingVoice: boolean
  onGenerateVoice: () => void
  onPlayVoice: () => void
  onPauseVoice: () => void
  onRegenerateVoice: () => void
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

export function ContentInput({
  contentMode,
  onContentModeChange,
  script,
  onScriptChange,
  audioFile,
  onAudioFileChange,
  type,
  selectedAvatar,
  selectedVoice,
  onVoiceChange,
  onAvatarChange,
  isVoiceGenerated,
  isGeneratingVoice,
  isPlayingVoice,
  onGenerateVoice,
  onPlayVoice,
  onPauseVoice,
  onRegenerateVoice
}: ContentInputProps) {
  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingState, setRecordingState] = useState<"idle" | "ready" | "recording" | "completed">("idle")
  
  // Voice modal state
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all")
  const [languageFilter, setLanguageFilter] = useState<"all" | string>("all")
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Recording functions
  const prepareRecording = () => {
    setRecordingState("ready")
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const chunks: BlobPart[] = []
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' })
        setRecordedBlob(blob)
        onAudioFileChange(new File([blob], 'recorded-audio.wav', { type: 'audio/wav' }))
        stream.getTracks().forEach(track => track.stop())
        setRecordingState("completed")
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingState("recording")
      setRecordingTime(0)
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      setRecordingState("idle")
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

  const restartRecording = () => {
    setRecordedBlob(null)
    onAudioFileChange(null)
    setRecordingTime(0)
    setIsPlaying(false)
    setRecordingState("ready")
  }

  const playRecording = () => {
    if ((recordedBlob || audioFile) && !isPlaying) {
      let url: string
      
      if (recordedBlob) {
        url = URL.createObjectURL(recordedBlob)
      } else if (audioFile) {
        url = URL.createObjectURL(audioFile)
      } else {
        return
      }
      
      const audio = new Audio(url)
      audioRef.current = audio
      
      audio.play()
      setIsPlaying(true)
      
      audio.onended = () => {
        setIsPlaying(false)
        URL.revokeObjectURL(url)
      }
    }
  }

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onAudioFileChange(file)
      setRecordingState("idle")
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <>
    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
      {/* Content Mode Toggle - Modern Unified Selector */}
      <div className="relative bg-muted rounded-xl p-1 max-w-md">
        {/* Sliding background indicator */}
        <div 
          className={`absolute top-1 h-[calc(100%-8px)] bg-primary rounded-lg transition-all duration-300 ease-out ${
            contentMode === "text" ? "left-1 w-[calc(50%-4px)]" : "left-[calc(50%+4px)] w-[calc(50%-4px)]"
          }`}
        />
        
        {/* Buttons */}
        <div className="relative grid grid-cols-2 gap-1">
          <button
            onClick={() => onContentModeChange("text")}
            className={`px-4 py-3 rounded-lg font-medium transition-colors duration-300 cursor-pointer ${
              contentMode === "text" 
                ? "text-primary-foreground" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <IconFileText className="w-4 h-4" />
              Text to Speech
            </span>
          </button>
          <button
            onClick={() => onContentModeChange("audio")}
            className={`px-4 py-3 rounded-lg font-medium transition-colors duration-300 cursor-pointer ${
              contentMode === "audio" 
                ? "text-primary-foreground" 
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <IconMicrophone className="w-4 h-4" />
              Speech to Speech
            </span>
          </button>
        </div>
      </div>

      {/* Content Input - Fixed height container */}
      <div className="h-40">
        {contentMode === "text" ? (
          <div className="relative h-full">
            <textarea
              value={script}
              onChange={(e) => {
                const value = e.target.value
                if (value.length <= 1500) {
                  onScriptChange(value)
                }
              }}
              placeholder={type === "video" ? "Enter your script here..." : "Describe your product here..."}
              className="w-full h-full p-4 pb-8 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-base leading-relaxed"
            />
            
            {/* Character counter inside textarea */}
            <div className={`absolute bottom-3 right-3 text-xs font-medium px-2 py-1 rounded ${
              script.length > 1400 ? 'bg-destructive/10 text-destructive' : 
              script.length > 1200 ? 'bg-muted text-muted-foreground' : 
              'bg-muted/50 text-muted-foreground'
            }`}>
              {script.length}/1500
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center">
            {(audioFile || recordedBlob) ? (
              /* Audio File Preview - Compact */
              <div className="w-full flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                <IconFileMusic className="w-6 h-6 text-primary" />
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">
                    {audioFile ? audioFile.name : "Recorded Audio"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {audioFile 
                      ? `${(audioFile.size / 1024 / 1024).toFixed(2)} MB`
                      : `Recorded • ${formatTime(recordingTime)}`
                    }
                  </p>
                </div>
                
                {/* Toujours afficher les contrôles de lecture */}
                <button
                  onClick={isPlaying ? pauseRecording : playRecording}
                  className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  {isPlaying ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
                </button>
                
                {/* Si c'est un enregistrement, bouton re-record, sinon bouton re-upload */}
                {recordedBlob ? (
                  <button
                    onClick={restartRecording}
                    className="w-8 h-8 flex items-center justify-center bg-muted text-foreground rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  >
                    <IconRefresh size={16} />
                  </button>
                ) : (
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleFileUpload}
                      className="sr-only"
                    />
                    <div className="w-8 h-8 flex items-center justify-center bg-muted text-foreground rounded-lg hover:bg-accent transition-colors">
                      <IconRefresh size={16} />
                    </div>
                  </label>
                )}
                
                <button
                  onClick={() => {
                    onAudioFileChange(null)
                    setRecordedBlob(null)
                    setRecordingState("idle")
                  }}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors cursor-pointer"
                >
                  <IconTrash size={18} />
                </button>
              </div>
            ) : isRecording ? (
              /* Recording in Progress - Compact */
              <div className="w-full flex items-center gap-4 p-4 border-2 border-primary rounded-xl bg-primary/5">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <IconMicrophone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="absolute inset-0 w-10 h-10 rounded-full bg-primary/30 animate-ping"></div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Recording...</p>
                  <p className="text-sm font-mono text-primary">{formatTime(recordingTime)}</p>
                </div>
                <button
                  onClick={stopRecording}
                  className="px-4 py-2 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors cursor-pointer"
                >
                  <IconPlayerPause className="w-4 h-4 mr-1 inline-block" />
                  Stop
                </button>
              </div>
            ) : recordingState === "ready" ? (
              /* Ready to Record - Compact */
              <div className="w-full flex items-center gap-4 p-4 border-2 border-primary rounded-xl bg-primary/5">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <IconMicrophone className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Ready to Record</p>
                  <p className="text-sm text-muted-foreground">Click Start when ready</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRecordingState("idle")}
                    className="px-3 py-1.5 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors cursor-pointer text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={startRecording}
                    className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer text-sm"
                  >
                    Start
                  </button>
                </div>
              </div>
            ) : (
              /* Upload or Record Options - Exactement la même taille que le textarea */
              <div className="w-full grid grid-cols-2 gap-4">
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                  <div className="w-full h-40 p-4 bg-background border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all group flex flex-col items-center justify-center gap-3 cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-all">
                      <IconFileMusic className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-foreground">Upload Audio</p>
                      <p className="text-sm text-muted-foreground">MP3, WAV, M4A</p>
                      <p className="text-xs text-muted-foreground mt-2">Choose an existing audio file from your device</p>
                    </div>
                  </div>
                </label>
                
                <button
                  onClick={prepareRecording}
                  className="w-full h-40 p-4 bg-background border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all group cursor-pointer flex flex-col items-center justify-center gap-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-all">
                    <IconMicrophone className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-foreground">Record Audio</p>
                    <p className="text-sm text-muted-foreground">Direct recording</p>
                    <p className="text-xs text-muted-foreground mt-2">Record your voice directly in the browser</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Avatar & Voice - Side by side */}
      <div className="pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4">
          
          {/* Avatar Display */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Avatar</label>
            {selectedAvatar ? (
              <div className="flex items-center gap-3 p-3 bg-background border border-border rounded-xl h-[56px]">
                <Image
                  src={selectedAvatar.imageUrl}
                  alt={selectedAvatar.name}
                  width={24}
                  height={24}
                  className="rounded object-cover"
                />
                <div className="flex-1">
                  <span className="font-medium text-foreground">{selectedAvatar.name}</span>
                </div>
                
                <button
                  onClick={onAvatarChange}
                  className="px-3 py-1.5 text-sm bg-muted text-foreground rounded-lg hover:bg-accent transition-colors cursor-pointer"
                >
                  Change
                </button>
              </div>
            ) : (
              <button
                onClick={onAvatarChange}
                className="w-full p-3 border-2 border-dashed border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all text-center h-[56px] flex items-center justify-center cursor-pointer"
              >
                <span className="text-muted-foreground">Select Avatar</span>
              </button>
            )}
          </div>
          
          {/* AI Voice */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">AI Voice</label>
            
            {!isVoiceGenerated ? (
              /* Voice Selection - Même hauteur que Avatar */
              <div className="flex gap-2 h-[56px]">
                <button 
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="flex-1 flex items-center pl-4 pr-10 bg-background border border-border rounded-xl cursor-pointer hover:bg-accent transition-colors relative"
                >
                  <span className="text-lg mr-3">{selectedVoice.flag}</span>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="font-medium">{selectedVoice.name}</span>
                  </div>
                  <IconChevronDown className="absolute right-3 w-5 h-5 text-muted-foreground" />
                </button>
                
                <button
                  onClick={onGenerateVoice}
                  disabled={isGeneratingVoice || (contentMode === "text" && !script.trim())}
                  className="w-14 flex items-center justify-center bg-background border border-border rounded-xl hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isGeneratingVoice ? (
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <IconHeadphones className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            ) : (
              /* Generated Voice Preview - Même hauteur que Avatar */
              <div className="flex items-center gap-3 p-3 bg-accent/50 border border-border rounded-xl h-[56px]">
                <button
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="px-3 py-1.5 text-sm bg-muted text-foreground rounded-lg hover:bg-accent transition-colors cursor-pointer"
                >
                  Change
                </button>
                
                <span className="text-lg">{selectedVoice.flag}</span>
                <div className="flex items-center gap-1 flex-1">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  <span className="font-medium text-foreground">{selectedVoice.name}</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={isPlayingVoice ? onPauseVoice : onPlayVoice}
                    className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    {isPlayingVoice ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
                  </button>
                  <button
                    onClick={onRegenerateVoice}
                    className="w-8 h-8 flex items-center justify-center bg-muted text-foreground rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  >
                    <IconRefresh size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Voice Selection Modal with Filters */}
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
            
            {/* Filters - Custom dropdowns with app style */}
            <div className="flex gap-4">
              {/* Gender Filter */}
              <div className="relative">
                <button
                  onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-foreground hover:border-primary/50 transition-colors min-w-[140px] justify-between"
                >
                  <span className="text-sm font-medium">
                    {genderFilter === "all" ? "All genders" : 
                     genderFilter === "female" ? "Female" : "Male"}
                  </span>
                  <IconChevronDown className={`w-4 h-4 transition-transform ${isGenderDropdownOpen ? 'rotate-180' : ''}`} />
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
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors ${
                            genderFilter === option.value ? 'bg-accent text-accent-foreground' : 'text-foreground'
                          }`}
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
                  className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-foreground hover:border-primary/50 transition-colors min-w-[150px] justify-between"
                >
                  <span className="text-sm font-medium">
                    {languageFilter === "all" ? "All languages" : languageFilter}
                  </span>
                  <IconChevronDown className={`w-4 h-4 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isLanguageDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsLanguageDropdownOpen(false)} />
                    <div className="absolute top-full left-0 w-full bg-card border border-border rounded-lg shadow-lg z-20 overflow-hidden max-h-60 overflow-y-auto mt-1">
                      <button
                        onClick={() => {
                          setLanguageFilter("all")
                          setIsLanguageDropdownOpen(false)
                        }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors ${
                          languageFilter === "all" ? 'bg-accent text-accent-foreground' : 'text-foreground'
                        }`}
                      >
                        All languages
                      </button>
                      {Array.from(new Set(voices.map(voice => voice.language))).map(lang => (
                        <button
                          key={lang}
                          onClick={() => {
                            setLanguageFilter(lang)
                            setIsLanguageDropdownOpen(false)
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors ${
                            languageFilter === lang ? 'bg-accent text-accent-foreground' : 'text-foreground'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Voice grid */}
          <div className="p-6 overflow-y-auto max-h-[500px]">
            <div className="grid grid-cols-2 gap-4">
              {voices
                .filter(voice => {
                  if (genderFilter !== "all" && voice.gender !== genderFilter) return false
                  if (languageFilter !== "all" && voice.language !== languageFilter) return false
                  return true
                })
                .map((voice) => (
                  <div
                    key={voice.id}
                    onClick={() => {
                      onVoiceChange(voice)
                      setIsVoiceModalOpen(false)
                    }}
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
                          // Play voice preview
                        }}
                        className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
                      >
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
    </>
  )
}
