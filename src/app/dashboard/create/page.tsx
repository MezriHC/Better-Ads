"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { IconUsers, IconChevronDown, IconVideo, IconPhotoVideo, IconMicrophone, IconPlayerPlay, IconPlayerPause, IconRefresh, IconTrash, IconHeadphones, IconX, IconSettings, IconSparkles } from "@tabler/icons-react"
import { ActorSelectorModal } from "./components/ActorSelectorModal"
import { CreatePageGuard } from "./components/CreatePageGuard"
import { CreationTypeDropdown } from "./components/CreationTypeDropdown"
import { VoicePreview } from "./components/VoicePreview"
import { GenerateButton } from "./components/GenerateButton"
import { VideoFormatSelector } from "./components/VideoFormatSelector"
import { SpeechModeSelector } from "./components/SpeechModeSelector"
import { ActorSelection } from "./components/ActorSelection"
import { VoiceSelectionModal } from "./components/VoiceSelectionModal"
import { AudioSettingsDrawer } from "./components/AudioSettingsDrawer"
import { AudioRecordingInterface } from "./components/AudioRecordingInterface"
import { HeroSection } from "./components/HeroSection"
import { CharacterCount } from "./components/CharacterCount"
import { ScriptInput } from "./components/ScriptInput"
import { BottomControls } from "./components/BottomControls"
import { useProjects } from "@/src/app/_shared/hooks/useProjects"
import { useAudioRecording } from "./hooks/useAudioRecording"
import { useVoiceGeneration } from "./hooks/useVoiceGeneration"
import type { CreationType, Avatar, Voice, AudioSettings } from "./types"
import { creationTypes, speechModes, videoFormats, voices } from "./constants"

export default function CreatePage() {
  const { currentProject } = useProjects()
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
  
  // Contextual placeholders
  const getPlaceholder = () => {
    switch (selectedType) {
      case "talking-actor":
        return "Avatar script: write what the avatar should say..."
      case "scenes":
        return "Scene description: describe the atmosphere and desired action..."
      case "b-rolls":
        return "B-Roll description: product, environment, visual style..."
      default:
        return "Describe your video..."
    }
  }
  
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
  
  // Audio settings drawer
  const [isAudioSettingsOpen, setIsAudioSettingsOpen] = useState(false)
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    speed: 1.0,
    stability: 0.5,
    similarity: 0.75,
    styleExaggeration: 0.0
  })



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





  const handleSubmit = () => {
    const hasContent = speechMode === "text-to-speech" ? script.trim() : audioFile
    if (hasContent) {
      // Logique de génération
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Plus besoin de localStorage - tout est géré par le contexte projet

  return (
    <CreatePageGuard>
      <div className="h-full flex flex-col">
        {/* Hero Section centré */}
        <div className="flex-1 flex items-center justify-center">
          <HeroSection currentProject={currentProject} />
        </div>

        {/* Creation Modal en bas */}
        <div className="pb-8">
          <div className="flex justify-center">
            <div className="w-full max-w-5xl">
              <div className={`flex gap-4 transition-all duration-300 ${
                selectedType === "talking-actor" && isAudioSettingsOpen 
                  ? "justify-between" 
                  : "justify-center"
              }`}>
                {/* Main Creation Section */}
                <div className={`bg-card border border-border rounded-2xl p-4 shadow-lg transition-all duration-300 ${
                  selectedType === "talking-actor" && isAudioSettingsOpen 
                    ? "w-full max-w-3xl" 
                    : "w-full max-w-4xl"
                }`}>
            <div className="flex items-center justify-between mb-3">
              {/* Creation Type Dropdown - Compact */}
              <CreationTypeDropdown
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                creationTypes={creationTypes}
                isOpen={isDropdownOpen}
                onToggleOpen={() => setIsDropdownOpen(!isDropdownOpen)}
                onCloseAudioSettings={() => setIsAudioSettingsOpen(false)}
              />

              {/* Character Count - Only for text mode */}
              {!(selectedType === "talking-actor" && speechMode === "speech-to-speech") && (
                <CharacterCount count={script.length} maxCount={1500} />
              )}
            </div>

            {/* Script Input or Audio Recording - Plus compact */}
            <div className="mb-3">
              {selectedType === "talking-actor" && speechMode === "speech-to-speech" ? (
                <AudioRecordingInterface
                  recordedBlob={recordedBlob}
                  audioFile={audioFile}
                  isRecording={isRecording}
                  isPlaying={isPlaying}
                  recordingState={recordingState}
                  recordingTime={recordingTime}
                  onStartRecording={startRecording}
                  onStopRecording={stopRecording}
                  onPlayRecording={playRecording}
                  onPauseRecording={pauseRecording}
                  onRestartRecording={restartRecording}
                  onPrepareRecording={prepareRecording}
                  onClearAudio={() => {
                    setAudioFile(null)
                    setRecordedBlob(null)
                    setRecordingState("idle")
                  }}
                  onCancelRecording={() => setRecordingState("idle")}
                  formatTime={formatTime}
                />
              ) : (
                /* Text Input */
                <ScriptInput
                  value={script}
                  onChange={setScript}
                  onKeyDown={handleKeyDown}
                  placeholder={getPlaceholder()}
                />
              )}
            </div>

            {/* Voice Preview - Always visible for Talking Actor */}
            {selectedType === "talking-actor" && (
              <VoicePreview
                selectedVoice={selectedVoice}
                selectedActor={selectedActor}
                isVoiceGenerated={isVoiceGenerated}
                isGeneratingVoice={isGeneratingVoice}
                isPlayingVoice={isPlayingVoice}
                speechMode={speechMode}
                script={script}
                audioFile={audioFile}
                onGenerateVoice={generateVoice}
                onPlayPause={isPlayingVoice ? pauseGeneratedVoice : playGeneratedVoice}
                onRegenerateVoice={regenerateVoice}
                onToggleAudioSettings={() => setIsAudioSettingsOpen(!isAudioSettingsOpen)}
              />
            )}



            {/* Bottom Controls */}
            <BottomControls
              selectedType={selectedType}
              speechMode={speechMode}
              selectedVideoFormat={selectedVideoFormat}
              selectedActor={selectedActor}
              script={script}
              audioFile={audioFile}
              speechModes={speechModes}
              videoFormats={videoFormats}
              isVideoFormatDropdownOpen={isVideoFormatDropdownOpen}
              isSpeechDropdownOpen={isSpeechDropdownOpen}
              onVideoFormatChange={setSelectedVideoFormat}
              onSpeechModeChange={setSpeechMode}
              onToggleVideoFormatDropdown={() => setIsVideoFormatDropdownOpen(!isVideoFormatDropdownOpen)}
              onToggleSpeechDropdown={() => setIsSpeechDropdownOpen(!isSpeechDropdownOpen)}
              onOpenActorModal={() => setIsActorModalOpen(true)}
              onSubmit={handleSubmit}
            />
                </div>
                
                {/* Audio Settings Drawer - Dans le flex layout pour être responsive */}
                {selectedType === "talking-actor" && (
                  <div className={`transition-all duration-300 ${
                    isAudioSettingsOpen ? "w-80 opacity-100" : "w-0 opacity-0 overflow-hidden"
                  }`}>
                    <AudioSettingsDrawer
                      isOpen={isAudioSettingsOpen}
                      selectedVoice={selectedVoice}
                      audioSettings={audioSettings}
                      onClose={() => setIsAudioSettingsOpen(false)}
                      onAudioSettingsChange={setAudioSettings}
                      onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
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
      <VoiceSelectionModal
        isOpen={isVoiceModalOpen}
        selectedVoice={selectedVoice}
        voices={voices}
        onClose={() => setIsVoiceModalOpen(false)}
        onVoiceChange={handleVoiceChange}
      />
    </CreatePageGuard>
  )
}
