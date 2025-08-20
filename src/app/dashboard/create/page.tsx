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
import { logger } from "@/src/app/_shared/utils/logger"

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
  
  // Generated content states
  const [generatedVideos, setGeneratedVideos] = useState<any[]>([])
  const [videoRefreshTrigger, setVideoRefreshTrigger] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  
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

  const handleSubmit = async () => {
    const hasContent = speechMode === "text-to-speech" ? script.trim() : audioFile
    if (!hasContent || !selectedActor || !currentProject) {
      logger.client.warn('Génération impossible: contenu, avatar ou projet manquant')
      return
    }

    if (isGenerating) {
      logger.client.warn('Génération déjà en cours, ignorée')
      return
    }

    setIsGenerating(true)
    logger.client.info('Début génération vidéo finale avec avatar + script')

    // Créer une vidéo temporaire avec loader dans la liste
    const tempVideo = {
        id: `temp-${Date.now()}`,
        url: selectedActor.imageUrl, // Image comme placeholder
        thumbnailUrl: selectedActor.imageUrl,
        prompt: script,
        createdAt: new Date().toISOString(),
        status: "processing" as const,
        isGenerating: true,
        projectName: currentProject.name
      }

    // Ajouter à la liste avec loader
    setGeneratedVideos(prev => [tempVideo, ...prev])

    try {
      // Générer la vidéo finale (avec TTS + lip sync)
      const response = await fetch('/api/ai/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: script,
          imageUrl: selectedActor.imageUrl,
          type: 'generated-video', // Vidéo finale, pas avatar
          projectId: currentProject.id
        })
      })

      if (!response.ok) {
        throw new Error('Erreur génération vidéo')
      }

      const data = await response.json()
      
      if (data.success) {
        logger.client.info(`Vidéo finale générée: ${data.video.id}`)
        
        // Attendre un peu avant de supprimer la vidéo temporaire
        // pour laisser le temps au refresh de se faire
        setTimeout(() => {
          setGeneratedVideos(prev => prev.filter(v => v.id !== tempVideo.id))
        }, 1000)
        
        // Rafraîchir la liste depuis la base
        setVideoRefreshTrigger(prev => prev + 1)
        
        // Reset le script
        setScript("")
      } else {
        throw new Error(data.error || 'Erreur génération')
      }

    } catch (error) {
      logger.client.error('Erreur génération vidéo finale:', error)
      
      // Supprimer la vidéo temporaire en cas d'erreur
      setGeneratedVideos(prev => prev.filter(v => v.id !== tempVideo.id))
      
      alert(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <CreatePageGuard>
      <div className="h-full flex flex-col relative">
        {/* Background gradients subtils - Position absolue pour ignorer le padding */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Gradient central diffus */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[700px] bg-gradient-radial from-primary/3 via-primary/1 to-transparent blur-3xl" />
          
          {/* Gradient subtil en bas pour l'interface */}
          <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-primary/2 via-primary/1 to-transparent" />
          
          {/* Gradient latéraux très subtils - pleine largeur */}
          <div className="absolute top-0 left-0 w-[400px] h-full bg-gradient-to-r from-secondary/2 to-transparent" />
          <div className="absolute top-0 right-0 w-[400px] h-full bg-gradient-to-l from-secondary/2 to-transparent" />
          
          {/* Gradient supérieur subtil */}
          <div className="absolute top-0 left-0 right-0 h-[300px] bg-gradient-to-b from-accent/1 to-transparent" />
        </div>

        {/* Hero Section centré avec scroll */}
        <div className="flex-1 flex items-center justify-center overflow-y-auto relative z-10">
          <div className="w-full py-8">
            <HeroSection 
            currentProject={currentProject} 
            generatedVideos={generatedVideos}
            onNewVideoAdded={() => setVideoRefreshTrigger(prev => prev + 1)}
            videoRefreshTrigger={videoRefreshTrigger}
          />
          </div>
        </div>

        {/* Creation Modal en bas - Position fixe par rapport au bas */}
        <div className="pb-8 flex-shrink-0 relative z-10">
          <div className="w-full flex justify-center px-4">
            {/* Container centré avec largeur maximale intelligente */}
            <div className={`w-full transition-all duration-400 ease-in-out ${
              selectedType === "talking-actor" && isAudioSettingsOpen 
                ? "max-w-[1200px] flex gap-6 items-end" 
                : "max-w-4xl flex justify-center items-end"
            }`} style={{
              overflow: selectedType === "talking-actor" ? "hidden" : "visible"
            }}>
                {/* Main Creation Section avec gradient border effect */}
                <div className="p-[1px] rounded-2xl bg-gradient-to-b from-border/50 via-primary/10 to-border/30 w-full max-w-4xl transition-all duration-400 ease-in-out">
                  <div className="bg-card/95 backdrop-blur-sm border-0 rounded-2xl p-4 shadow-xl shadow-primary/5">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
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

              {/* Script Input or Audio Recording - Container avec hauteur fixe */}
              <div className="h-32">
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
                  </div>
                </div>
                
                {/* Audio Settings Drawer - Animation sans écrasement */}
                {selectedType === "talking-actor" && (
                  <div className={`transition-all duration-400 ease-in-out transform ${
                    isAudioSettingsOpen 
                      ? "w-80 translate-x-0 opacity-100" 
                      : "w-0 translate-x-0 opacity-0 overflow-hidden"
                  }`}>
                    <div className="w-80 p-[1px] rounded-2xl bg-gradient-to-b from-border/40 via-secondary/10 to-border/20">
                      <div className="bg-card/95 backdrop-blur-sm rounded-2xl shadow-xl shadow-secondary/5">
                        <AudioSettingsDrawer
                          isOpen={isAudioSettingsOpen}
                          selectedVoice={selectedVoice}
                          audioSettings={audioSettings}
                          onClose={() => setIsAudioSettingsOpen(false)}
                          onAudioSettingsChange={setAudioSettings}
                          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
                        />
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Actor Selection Modal */}
      <ActorSelectorModal
        isOpen={isActorModalOpen}
        onClose={() => setIsActorModalOpen(false)}
        onSelectActor={(actor) => {
          // Empêcher les générations multiples
          if (isGenerating) {
            logger.client.warn('Génération déjà en cours, ignorée')
            return
          }
          
          setIsGenerating(true)
          setSelectedActor(actor)
          logger.client.info(`Début génération vidéo avec avatar: ${actor.id}`)
          
          // Ajouter une seule vidéo en cours de génération
          const generatingVideo = {
            id: `gen-${Date.now()}`,
            url: null,
            thumbnailUrl: actor.imageUrl,
            isGenerating: true,
            prompt: `Génération en cours...`,
            createdAt: new Date().toISOString(),
            avatarId: actor.id
          }
          setGeneratedVideos(prev => [...prev, generatingVideo])
        }}
        onSelectExistingActor={(actor) => {
          // Pour les avatars existants - fermer la modal
          setSelectedActor(actor)
          setIsActorModalOpen(false)
        }}
        selectedActorId={selectedActor?.id}
        onVideoGenerated={(video) => {
          logger.client.info(`Vidéo générée avec succès: ${video?.id}`)
          // Réinitialiser le flag de génération
          setIsGenerating(false)
          // Déclencher le refresh des vidéos depuis la base
          setVideoRefreshTrigger(prev => prev + 1)
          // Supprimer les vidéos temporaires en cours
          setGeneratedVideos(prev => prev.filter(v => !v.isGenerating))
          // Fermer la modal d'avatars après génération
          setIsActorModalOpen(false)
        }}
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
