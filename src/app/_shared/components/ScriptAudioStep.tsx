"use client"

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { 
  IconChevronDown, 
  IconPlayerPlay, 
  IconMicrophone, 
  IconFileMusic, 
  IconTrash,
  IconX,
  IconSquare,
  IconPlayerPause
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

// Sample data
const voices: Voice[] = [
  { id: "1", name: "Carson", gender: "male", age: "young", language: "English", accent: "American", previewUrl: "#" },
  { id: "2", name: "Violet", gender: "female", age: "young", language: "English", accent: "American", previewUrl: "#" },
  { id: "3", name: "Charles", gender: "male", age: "young", language: "English", accent: "American", previewUrl: "#" },
  { id: "4", name: "Sarah", gender: "female", age: "young", language: "English", accent: "American", previewUrl: "#" },
]

const avatars: Avatar[] = [
  {
    id: "1",
    name: "Professional Woman",
    category: "business",
    description: "Professional female avatar",
    tags: ["business", "professional"],
    imageUrl: "/ai-avatars/avatar-1.jpg",
    type: "image",
    gender: "female",
    age: "adult"
  },
  {
    id: "2", 
    name: "Young Man",
    category: "casual",
    description: "Casual young male avatar",
    tags: ["casual", "young"],
    imageUrl: "/ai-avatars/avatar-2.jpg",
    type: "image",
    gender: "male",
    age: "young"
  },
]

export function ScriptAudioStep({ selectedAvatar: initialAvatar, onBack, onNext, type, onValidationChange }: ScriptAudioStepProps) {
  // Core state
  const [speechMode, setSpeechMode] = useState<SpeechMode>("text-to-speech")
  const [script, setScript] = useState("")
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(initialAvatar)
  const [selectedVoice, setSelectedVoice] = useState<Voice>(voices[0])
  
  // Audio settings
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    speed: 1.0,
    stability: 0.5,
    similarity: 0.75,
    styleExaggeration: 0.0
  })

  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Handlers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAudioFile(file)
      setRecordedBlob(null)
    }
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
        setAudioFile(new File([blob], 'recorded-audio.wav', { type: 'audio/wav' }))
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Recording failed:', error)
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

  const playRecording = () => {
    if (recordedBlob && !isPlaying) {
      const url = URL.createObjectURL(recordedBlob)
      const audio = new Audio(url)
      audioRef.current = audio
      
      audio.onended = () => setIsPlaying(false)
      audio.play()
      setIsPlaying(true)
    }
  }

  const pauseRecording = () => {
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
    selectedAvatar && selectedVoice && (
      (speechMode === "text-to-speech" && script.trim()) ||
      (speechMode === "speech-to-speech" && audioFile)
    )
  )

  useEffect(() => {
    onValidationChange?.(canContinue)
  }, [canContinue, onValidationChange])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (audioRef.current) audioRef.current.pause()
    }
  }, [])

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
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Speech Mode Selection */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Content Type</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSpeechMode("text-to-speech")}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  speechMode === "text-to-speech"
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">📝</div>
                  <div className="font-semibold">Text to Speech</div>
                  <div className="text-sm text-muted-foreground">Type your script</div>
                </div>
              </button>
              <button
                onClick={() => setSpeechMode("speech-to-speech")}
                className={`p-4 rounded-lg border-2 transition-colors ${
                  speechMode === "speech-to-speech"
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🎤</div>
                  <div className="font-semibold">Speech to Speech</div>
                  <div className="text-sm text-muted-foreground">Upload or record audio</div>
                </div>
              </button>
            </div>
          </div>

          {/* Content Input */}
          <div className="bg-card border border-border rounded-xl p-6">
            {speechMode === "text-to-speech" ? (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {type === "video" ? "Your Script" : "Product Description"}
                </h3>
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder={type === "video" ? "Enter your script here..." : "Describe your product here..."}
                  className="w-full h-40 p-4 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Audio Input</h3>
                
                {audioFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-background border border-border rounded-lg">
                      <IconFileMusic className="w-6 h-6 text-primary" />
                      <div className="flex-1">
                        <div className="font-medium">{audioFile.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                      {recordedBlob && (
                        <div className="flex gap-2">
                          <button
                            onClick={isPlaying ? pauseRecording : playRecording}
                            className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20"
                          >
                            {isPlaying ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setAudioFile(null)
                          setRecordedBlob(null)
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Upload */}
                    <label className="block">
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleFileUpload}
                        className="sr-only"
                      />
                      <div className="p-6 border-2 border-dashed border-border rounded-xl hover:border-primary/50 cursor-pointer text-center group">
                        <IconFileMusic className="w-8 h-8 text-muted-foreground group-hover:text-primary mx-auto mb-2" />
                        <div className="font-medium">Upload Audio</div>
                        <div className="text-sm text-muted-foreground">MP3, WAV, M4A</div>
                      </div>
                    </label>

                    {/* Record */}
                    <div className="p-6 border-2 border-dashed border-border rounded-xl text-center">
                      {!isRecording ? (
                        <button
                          onClick={startRecording}
                          className="w-full group"
                        >
                          <IconMicrophone className="w-8 h-8 text-muted-foreground group-hover:text-red-500 mx-auto mb-2" />
                          <div className="font-medium">Record Audio</div>
                          <div className="text-sm text-muted-foreground">Click to start</div>
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <IconMicrophone className="w-8 h-8 text-red-500 mx-auto animate-pulse" />
                          <div className="font-medium text-red-500">Recording...</div>
                          <div className="text-xl font-mono">{formatTime(recordingTime)}</div>
                          <button
                            onClick={stopRecording}
                            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            Stop Recording
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Settings Panel */}
        <div className="space-y-6">
          
          {/* Avatar Selection */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Avatar</h3>
            {selectedAvatar ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={selectedAvatar.imageUrl}
                    alt={selectedAvatar.name}
                    width={48}
                    height={48}
                    className="rounded-lg object-cover"
                  />
                  <div>
                    <div className="font-medium">{selectedAvatar.name}</div>
                    <div className="text-sm text-muted-foreground">{selectedAvatar.description}</div>
                  </div>
                </div>
                <select
                  value={selectedAvatar.id}
                  onChange={(e) => {
                    const avatar = avatars.find(a => a.id === e.target.value)
                    setSelectedAvatar(avatar || null)
                  }}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                >
                  {avatars.map(avatar => (
                    <option key={avatar.id} value={avatar.id}>{avatar.name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No avatar selected
              </div>
            )}
          </div>

          {/* Voice Selection */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Voice</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                  {selectedVoice.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{selectedVoice.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedVoice.gender} • {selectedVoice.language}
                  </div>
                </div>
              </div>
              <select
                value={selectedVoice.id}
                onChange={(e) => {
                  const voice = voices.find(v => v.id === e.target.value)
                  if (voice) setSelectedVoice(voice)
                }}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg"
              >
                {voices.map(voice => (
                  <option key={voice.id} value={voice.id}>{voice.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Audio Settings</h3>
            <div className="space-y-4">
              
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Speed</label>
                  <span className="text-sm text-muted-foreground">{audioSettings.speed.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={audioSettings.speed}
                  onChange={(e) => setAudioSettings(prev => ({...prev, speed: parseFloat(e.target.value)}))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Stability</label>
                  <span className="text-sm text-muted-foreground">{audioSettings.stability.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioSettings.stability}
                  onChange={(e) => setAudioSettings(prev => ({...prev, stability: parseFloat(e.target.value)}))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Similarity</label>
                  <span className="text-sm text-muted-foreground">{audioSettings.similarity.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioSettings.similarity}
                  onChange={(e) => setAudioSettings(prev => ({...prev, similarity: parseFloat(e.target.value)}))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Style Exaggeration</label>
                  <span className="text-sm text-muted-foreground">{audioSettings.styleExaggeration.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioSettings.styleExaggeration}
                  onChange={(e) => setAudioSettings(prev => ({...prev, styleExaggeration: parseFloat(e.target.value)}))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}