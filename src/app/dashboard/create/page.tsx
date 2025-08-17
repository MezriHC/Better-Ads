"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { IconUsers, IconChevronDown, IconArrowUp, IconVideo, IconPhotoVideo, IconMicrophone, IconPlayerPlay, IconPlayerPause, IconRefresh, IconTrash, IconHeadphones, IconX, IconSettings, IconSparkles, IconBolt } from "@tabler/icons-react"
import { ActorSelectorModal } from "./components/ActorSelectorModal"

type CreationType = "talking-actor" | "scenes" | "b-rolls"

interface Avatar {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  imageUrl: string
  type: "image" | "video"
  gender?: "male" | "female"
  age?: "young" | "adult"
  theme?: string
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

export default function CreatePage() {
  const [script, setScript] = useState("")
  const [actorCount, setActorCount] = useState(1)
  const [selectedType, setSelectedType] = useState<CreationType>("talking-actor")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [speechMode, setSpeechMode] = useState<"text-to-speech" | "speech-to-speech">("text-to-speech")
  const [isSpeechDropdownOpen, setIsSpeechDropdownOpen] = useState(false)
  const [selectedActor, setSelectedActor] = useState<Avatar | null>(null)
  const [isActorModalOpen, setIsActorModalOpen] = useState(false)
  const [selectedVideoFormat, setSelectedVideoFormat] = useState("16:9")
  const [isVideoFormatDropdownOpen, setIsVideoFormatDropdownOpen] = useState(false)
  
  // Audio recording states
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingState, setRecordingState] = useState<"idle" | "ready" | "recording" | "completed">("idle")
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
  // Voice generation states
  const [selectedVoice, setSelectedVoice] = useState<Voice>({ id: "2", name: "Emma", gender: "female", language: "English", country: "US", flag: "🇺🇸" })
  const [isVoiceGenerated, setIsVoiceGenerated] = useState(false)
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false)
  const [generatedVoiceBlob, setGeneratedVoiceBlob] = useState<Blob | null>(null)
  const [isPlayingVoice, setIsPlayingVoice] = useState(false)
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all")
  const [languageFilter, setLanguageFilter] = useState<"all" | string>("all")
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false)
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  
  // Audio settings drawer
  const [isAudioSettingsOpen, setIsAudioSettingsOpen] = useState(false)
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    speed: 1.0,
    stability: 0.5,
    similarity: 0.75,
    styleExaggeration: 0.0
  })

  const creationTypes = [
    { id: "talking-actor", label: "Talking Actor", icon: IconUsers },
    { id: "scenes", label: "Scenes", icon: IconVideo },
    { id: "b-rolls", label: "B-Rolls", icon: IconPhotoVideo },
  ]

  const speechModes = [
    { id: "text-to-speech", label: "Text to Speech" },
    { id: "speech-to-speech", label: "Speech to Speech" },
  ]

  const videoFormats = [
    { id: "16:9", label: "Horizontal", ratio: "16:9" },
    { id: "9:16", label: "Vertical", ratio: "9:16" },
    { id: "1:1", label: "Square", ratio: "1:1" },
  ]

  const voices: Voice[] = [
    { id: "1", name: "Carson", gender: "male", language: "English", country: "US", flag: "🇺🇸" },
    { id: "2", name: "Emma", gender: "female", language: "English", country: "US", flag: "🇺🇸" },
    { id: "3", name: "Charles", gender: "male", language: "English", country: "UK", flag: "🇬🇧" },
    { id: "4", name: "Sarah", gender: "female", language: "English", country: "AU", flag: "🇦🇺" },
    { id: "5", name: "Maria", gender: "female", language: "Spanish", country: "ES", flag: "🇪🇸" },
    { id: "6", name: "Pierre", gender: "male", language: "French", country: "FR", flag: "🇫🇷" },
  ]

  const currentType = creationTypes.find(type => type.id === selectedType)
  const currentSpeechMode = speechModes.find(mode => mode.id === speechMode)
  const currentVideoFormat = videoFormats.find(format => format.id === selectedVideoFormat)

  // Audio recording functions
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
        setAudioFile(new File([blob], 'recorded-audio.wav', { type: 'audio/wav' }))
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
    } catch {
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
    setAudioFile(null)
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Voice generation functions
  const generateVoice = async () => {
    // Check if we have the required input based on speech mode
    if (speechMode === "text-to-speech" && !script.trim()) return
    if (speechMode === "speech-to-speech" && !audioFile) return
    
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

  // Filter voices for modal
  const filteredVoices = voices.filter(voice => {
    const matchesGender = genderFilter === "all" || voice.gender === genderFilter
    const matchesLanguage = languageFilter === "all" || voice.language === languageFilter
    return matchesGender && matchesLanguage
  })



  const handleSubmit = () => {
    const hasContent = speechMode === "text-to-speech" ? script.trim() : audioFile
    if (hasContent) {
      console.log("Generating with:", { 
        script: speechMode === "text-to-speech" ? script : undefined,
        audioFile: speechMode === "speech-to-speech" ? audioFile : undefined,
        actorCount, 
        type: selectedType, 
        speechMode: selectedType === "talking-actor" ? speechMode : undefined,
        videoFormat: selectedType !== "talking-actor" ? selectedVideoFormat : undefined,
        actor: selectedActor
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="text-center pt-20 pb-16">
        <h1 className="text-5xl font-bold tracking-tight text-foreground mb-4">
          Create videos with AI
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Transform your ideas into captivating videos. Virtual actors, cinematic scenes, 
          professional b-rolls - everything is possible with just a few words.
        </p>
      </div>

      {/* Spacer to push content to bottom */}
      <div className="flex-1"></div>

      {/* Bottom Modal Area */}
      <div className="w-full mx-auto pb-8 relative">
        <div className="flex justify-center">
          {/* Main Creation Section */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg w-full max-w-4xl mr-4">
            <div className="flex items-center justify-between mb-3">
              {/* Creation Type Dropdown - Compact */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-lg hover:bg-accent transition-all cursor-pointer"
                >
                  {currentType?.icon && <currentType.icon className="w-4 h-4 text-muted-foreground" />}
                  <span className="text-sm font-medium text-foreground">{currentType?.label}</span>
                  <IconChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ml-1 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-20 min-w-[200px]">
                      {creationTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => {
                            setSelectedType(type.id as CreationType)
                            setIsDropdownOpen(false)
                            // Fermer le drawer Audio Settings si on quitte Talking Actor
                            if (type.id !== "talking-actor") {
                              setIsAudioSettingsOpen(false)
                            }
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/50 transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer"
                        >
                          <type.icon className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Character Count - Only for text mode */}
              {!(selectedType === "talking-actor" && speechMode === "speech-to-speech") && (
                <div className="text-sm text-muted-foreground">
                  {script.length} / 1500
                </div>
              )}
            </div>

            {/* Script Input or Audio Recording - Plus compact */}
            <div className="mb-4">
              {selectedType === "talking-actor" && speechMode === "speech-to-speech" ? (
                /* Audio Recording Interface */
                (recordedBlob || audioFile) ? (
                  /* Recorded/Uploaded Audio - Compact */
                  <div className="w-full flex items-center gap-4 p-4 bg-muted border border-border rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <IconMicrophone className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        {recordedBlob ? "Recorded Audio" : audioFile?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Ready to use
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={isPlaying ? pauseRecording : playRecording}
                        className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors cursor-pointer"
                      >
                        {isPlaying ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
                      </button>
                      
                      {recordedBlob && (
                        <button
                          onClick={restartRecording}
                          className="w-8 h-8 flex items-center justify-center bg-background text-foreground rounded-lg hover:bg-accent transition-colors cursor-pointer"
                        >
                          <IconRefresh size={16} />
                        </button>
                      )}
                      
                      <button
                        onClick={() => {
                          setAudioFile(null)
                          setRecordedBlob(null)
                          setRecordingState("idle")
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-background text-destructive rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer"
                      >
                        <IconTrash size={16} />
                      </button>
                    </div>
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
                  /* Record Button - Match textarea height */
                  <button
                    onClick={prepareRecording}
                    className="w-full h-32 p-4 bg-background border border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all group cursor-pointer flex flex-col items-center justify-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-all">
                      <IconMicrophone className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-foreground">Record Audio</p>
                      <p className="text-sm text-muted-foreground">Click to start recording your voice</p>
                    </div>
                  </button>
                )
              ) : (
                /* Text Input */
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your video... (e.g., An energetic product presentation with a professional actor)"
                  className="w-full h-32 p-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
              )}
            </div>

            {/* Voice Preview - Always visible for Talking Actor */}
            {selectedType === "talking-actor" && (
              <div className="mb-4">
                {/* Voice Preview - Default component */}
                <div className="flex items-center gap-3 p-4 bg-muted border border-border rounded-xl">
                  {/* Avatar de l'acteur/voix */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-accent flex items-center justify-center">
                    {selectedActor ? (
                      <img 
                        src={selectedActor.imageUrl} 
                        alt={selectedActor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/70 to-accent/70 rounded-md flex items-center justify-center">
                        <span className="text-sm font-bold text-background">{selectedVoice.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Info voix */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{selectedVoice.name}</span>
                      <span className="text-xs text-muted-foreground">0:00</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-1 bg-muted-foreground/30 rounded-full">
                        <div className="w-2 h-1 bg-primary rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Contrôles */}
                  <div className="flex gap-2">
                    <button
                      onClick={isVoiceGenerated ? (isPlayingVoice ? pauseGeneratedVoice : playGeneratedVoice) : generateVoice}
                      disabled={isGeneratingVoice || (!isVoiceGenerated && (speechMode === "text-to-speech" ? !script.trim() : !audioFile))}
                      className="w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isGeneratingVoice ? (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      ) : isVoiceGenerated ? (
                        isPlayingVoice ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />
                      ) : (
                        <IconHeadphones size={16} />
                      )}
                    </button>
                    <button
                      onClick={() => setIsAudioSettingsOpen(!isAudioSettingsOpen)}
                      className="w-8 h-8 flex items-center justify-center bg-background text-foreground rounded-lg hover:bg-accent transition-colors cursor-pointer"
                    >
                      <IconSettings size={16} />
                    </button>
                    <button
                      onClick={regenerateVoice}
                      disabled={!isVoiceGenerated}
                      className="w-8 h-8 flex items-center justify-center bg-background text-foreground rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <IconRefresh size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}



            {/* Bottom Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Video Format Dropdown - Only for Scenes and B-Rolls */}
                {(selectedType === "scenes" || selectedType === "b-rolls") && (
                  <div className="relative">
                    <button 
                      onClick={() => setIsVideoFormatDropdownOpen(!isVideoFormatDropdownOpen)}
                      className="flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-lg hover:bg-accent transition-all cursor-pointer h-[44px]"
                    >
                      <div className="w-6 h-5 bg-background border border-border rounded flex items-center justify-center">
                        <div 
                          className="bg-muted-foreground"
                          style={{
                            width: selectedVideoFormat === "16:9" ? "14px" : 
                                   selectedVideoFormat === "9:16" ? "8px" : "10px",
                            height: selectedVideoFormat === "16:9" ? "8px" : 
                                    selectedVideoFormat === "9:16" ? "14px" : "10px",
                            borderRadius: "1px"
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-foreground">{currentVideoFormat?.label}</span>
                      <span className="text-xs text-muted-foreground">({currentVideoFormat?.ratio})</span>
                      <IconChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isVideoFormatDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Video Format Dropdown Menu */}
                    {isVideoFormatDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsVideoFormatDropdownOpen(false)} />
                        <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-20 min-w-[200px]">
                          {videoFormats.map((format) => (
                            <button
                              key={format.id}
                              onClick={() => {
                                setSelectedVideoFormat(format.id)
                                setIsVideoFormatDropdownOpen(false)
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/50 transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer"
                            >
                              <div className="w-6 h-5 bg-background border border-border rounded flex items-center justify-center">
                                <div 
                                  className="bg-muted-foreground"
                                  style={{
                                    width: format.id === "16:9" ? "14px" : 
                                           format.id === "9:16" ? "8px" : "10px",
                                    height: format.id === "16:9" ? "8px" : 
                                            format.id === "9:16" ? "14px" : "10px",
                                    borderRadius: "1px"
                                  }}
                                />
                              </div>
                              <div>
                                <span className="font-medium text-foreground">{format.label}</span>
                                <span className="text-xs text-muted-foreground ml-2">({format.ratio})</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Speech Mode Dropdown - Only for Talking Actor */}
                {selectedType === "talking-actor" && (
                  <div className="relative">
                    <button 
                      onClick={() => setIsSpeechDropdownOpen(!isSpeechDropdownOpen)}
                      className="flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-lg hover:bg-accent transition-all cursor-pointer h-[44px]"
                    >
                      <span className="text-sm font-medium text-foreground">{currentSpeechMode?.label}</span>
                      <IconChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isSpeechDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Speech Mode Dropdown Menu */}
                    {isSpeechDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsSpeechDropdownOpen(false)} />
                        <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-20 min-w-[180px]">
                          {speechModes.map((mode) => (
                            <button
                              key={mode.id}
                              onClick={() => {
                                setSpeechMode(mode.id as "text-to-speech" | "speech-to-speech")
                                setIsSpeechDropdownOpen(false)
                              }}
                              className="w-full flex items-center px-4 py-3 text-left hover:bg-accent/50 transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer"
                            >
                              <span className="font-medium text-foreground">{mode.label}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Actor Selection - Only for Talking Actor */}
                {selectedType === "talking-actor" && (
                  <button
                    onClick={() => setIsActorModalOpen(true)}
                    className="flex items-center gap-3 px-4 py-2 bg-muted border border-border rounded-lg hover:bg-accent transition-all cursor-pointer h-[44px]"
                  >
                    {selectedActor ? (
                      <div className="w-6 h-6 rounded-lg overflow-hidden">
                        <img 
                          src={selectedActor.imageUrl} 
                          alt={selectedActor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <IconUsers className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className="text-sm font-medium text-foreground">
                      {selectedActor ? selectedActor.name : "Select an actor"}
                    </span>
                  </button>
                )}
              </div>

              {/* Generate Button */}
              <div className="p-[2px] rounded-[16px] bg-gradient-to-b from-black/20 to-transparent dark:from-white/20">
                <button
                  onClick={handleSubmit}
                  disabled={selectedType === "talking-actor" && speechMode === "speech-to-speech" ? !audioFile : !script.trim()}
                  className="group rounded-[14px] bg-foreground dark:bg-white shadow-lg hover:shadow-md active:shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <div className="px-6 py-3 bg-gradient-to-b from-transparent to-white/10 dark:to-black/10 rounded-[12px] flex items-center gap-2">
                    <IconSparkles className="w-5 h-5 shrink-0 text-background dark:text-black" />
                    <span className="font-semibold text-background dark:text-black">Generate</span>
                  </div>
                </button>
              </div>
          </div>
          </div>
          
          {/* Audio Settings Drawer - Only for Talking Actor */}
          {selectedType === "talking-actor" && (
            <div className={`bg-card border border-border rounded-2xl p-6 shadow-lg transition-all duration-300 ease-in-out ${isAudioSettingsOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
            {isAudioSettingsOpen && (
              <div className="min-w-[280px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">Audio Settings</h3>
                  <button 
                    onClick={() => setIsAudioSettingsOpen(false)}
                    className="w-8 h-8 rounded-lg bg-muted hover:bg-accent flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <IconX className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Voice Overview */}
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl mb-6">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-accent flex items-center justify-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary/70 to-accent/70 rounded-md flex items-center justify-center">
                      <span className="text-xs font-bold text-background">{selectedVoice.name.charAt(0)}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{selectedVoice.name}</div>
                    <div className="text-sm text-muted-foreground">Voice-over</div>
                  </div>
                  <button
                    onClick={() => setIsVoiceModalOpen(true)}
                    className="px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-all cursor-pointer border border-primary/20 hover:border-primary/30"
                  >
                    Change Voice
                  </button>
                </div>
                
                {/* Audio Parameters */}
                <div className="space-y-6">
                  {/* Speed */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-foreground">Speed</label>
                      <span className="text-sm text-muted-foreground">{audioSettings.speed.toFixed(2)}X</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={audioSettings.speed}
                      onChange={(e) => setAudioSettings({...audioSettings, speed: parseFloat(e.target.value)})}
                      className="w-full h-2 bg-muted rounded appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:rounded [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                  </div>

                  {/* Stability */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-foreground">Stability</label>
                      <span className="text-sm text-muted-foreground">{audioSettings.stability.toFixed(2)}X</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={audioSettings.stability}
                      onChange={(e) => setAudioSettings({...audioSettings, stability: parseFloat(e.target.value)})}
                      className="w-full h-2 bg-muted rounded appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:rounded [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                  </div>

                  {/* Similarity */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-foreground">Similarity</label>
                      <span className="text-sm text-muted-foreground">{audioSettings.similarity.toFixed(2)}X</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={audioSettings.similarity}
                      onChange={(e) => setAudioSettings({...audioSettings, similarity: parseFloat(e.target.value)})}
                      className="w-full h-2 bg-muted rounded appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:rounded [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                  </div>

                  {/* Style Exaggeration */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-medium text-foreground">Style exaggeration</label>
                      <span className="text-sm text-muted-foreground">{audioSettings.styleExaggeration.toFixed(2)}X</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={audioSettings.styleExaggeration}
                      onChange={(e) => setAudioSettings({...audioSettings, styleExaggeration: parseFloat(e.target.value)})}
                      className="w-full h-2 bg-muted rounded appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:rounded [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
            </div>
          )}
        </div>
      </div>

      {/* Actor Selection Modal */}
      <ActorSelectorModal
        isOpen={isActorModalOpen}
        onClose={() => setIsActorModalOpen(false)}
        onSelectActor={(actor) => {
          setSelectedActor(actor)
          setIsActorModalOpen(false)
        }}
        selectedActorId={selectedActor?.id}
      />

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
                  className="w-8 h-8 rounded-lg bg-muted hover:bg-accent flex items-center justify-center transition-colors cursor-pointer"
                >
                  <IconX className="w-4 h-4" />
                </button>
              </div>
              
              {/* Filters */}
              <div className="flex gap-4">
                {/* Gender Filter */}
                <div className="relative">
                  <button
                    onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-foreground hover:border-primary/50 transition-colors min-w-[140px] justify-between cursor-pointer"
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
                            className="w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors text-sm cursor-pointer"
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
                    className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-lg text-foreground hover:border-primary/50 transition-colors min-w-[140px] justify-between cursor-pointer"
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
                        {[
                          { value: "all", label: "All languages" },
                          { value: "English", label: "English" },
                          { value: "Spanish", label: "Spanish" },
                          { value: "French", label: "French" }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setLanguageFilter(option.value)
                              setIsLanguageDropdownOpen(false)
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-accent/50 transition-colors text-sm cursor-pointer"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Voice Grid */}
            <div className="p-6 max-h-[50vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredVoices.map((voice) => (
                  <div
                    key={voice.id}
                    onClick={() => {
                      handleVoiceChange(voice)
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
                          // Play voice preview - could add functionality later
                        }}
                        className="w-8 h-8 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <IconPlayerPlay className="w-4 h-4 text-primary" fill="currentColor" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsVoiceModalOpen(false)}
                  className="px-4 py-2 text-foreground hover:bg-accent rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setIsVoiceModalOpen(false)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
