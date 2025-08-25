"use client"

import { useState, useRef } from "react"
import { MainCreationSection, HeroSectionWrapper, type HeroSectionWrapperRef } from './sections'
import { ActorSelectorModal } from './ui/ActorSelectorModal'
import { CreatePageGuard } from './ui/CreatePageGuard'
import { VoiceSelectionModal } from './ui/VoiceSelectionModal'
import { AudioSettingsDrawer } from './ui/AudioSettingsDrawer'
import { CreateAvatarModal } from './ui/CreateAvatarModal'
import { useProjectContext, mockVoices, mockAvatars, type Voice } from "@/src/app/_shared"
import { useAudioRecording } from "../hooks/useAudioRecording"
import { useVoiceGeneration } from "../hooks/useVoiceGeneration"
import type { CreationType, Avatar, AudioSettings } from "../types"
import { creationTypes, speechModes, videoFormats } from "../constants"

export function CreateMain() {
  const { currentProject } = useProjectContext()
  
  const [script, setScript] = useState("")
  const [selectedType, setSelectedType] = useState<CreationType>("talking-actor")
  const [speechMode, setSpeechMode] = useState<"text-to-speech" | "speech-to-speech">("text-to-speech")
  const [selectedActor, setSelectedActor] = useState<Avatar | null>(null)
  const [selectedVideoFormat, setSelectedVideoFormat] = useState("16:9")
  const [selectedBRollImage, setSelectedBRollImage] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasStartedGeneration, setHasStartedGeneration] = useState(false)
  const heroSectionRef = useRef<HeroSectionWrapperRef>(null)
  
  // REF Pattern - Protection absolue contre les doublons B-roll
  const brollGenerationInProgress = useRef(false)
  const brollGenerationKey = useRef<string | null>(null)
  
  const [isActorModalOpen, setIsActorModalOpen] = useState(false)
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [isAudioSettingsOpen, setIsAudioSettingsOpen] = useState(false)
  const [isCreateAvatarModalOpen, setIsCreateAvatarModalOpen] = useState(false)
  
  const audioRecording = useAudioRecording()
  const voiceGeneration = useVoiceGeneration(mockVoices[0])
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    speed: 1.0,
    stability: 0.5,
    similarity: 0.75,
    styleExaggeration: 0.0
  })
  
  const getPlaceholder = () => {
    switch (selectedType) {
      case "talking-actor":
        return "Avatar script: write what the avatar should say..."
      case "b-rolls":
        return "B-Roll description: product, environment, visual style..."
      default:
        return "Describe your video..."
    }
  }

  const handleSubmit = async () => {
    const hasContent = speechMode === "text-to-speech" ? script.trim() : audioRecording.audioFile
    
    if (selectedType === "b-rolls") {
      if (!hasContent || !currentProject || isGenerating) {
        return
      }

      // REF Pattern - Protection absolue contre doublons B-roll
      const imageKey = selectedBRollImage ? `${selectedBRollImage.name}_${selectedBRollImage.size}` : 'no-image'
      const currentKey = `${script.trim()}_${imageKey}_${selectedVideoFormat}_${currentProject.id}`
      
      if (brollGenerationInProgress.current && brollGenerationKey.current === currentKey) {
        return
      }
      
      brollGenerationInProgress.current = true
      brollGenerationKey.current = currentKey

      setIsGenerating(true)
      setHasStartedGeneration(true)
      try {
        const brollData = {
          prompt: script.trim(),
          name: `B-Roll ${new Date().toLocaleDateString('fr-FR')}`,
          projectId: currentProject.id,
          imageUrl: selectedBRollImage ? await uploadImageToFal(selectedBRollImage) : undefined,
          aspectRatio: selectedVideoFormat as "21:9" | "16:9" | "4:3" | "1:1" | "3:4" | "9:16",
          resolution: "480p" as const,
          duration: "3" as const,
          type: "seedance-video",
          visibility: "private" as const
        }

        const response = await fetch('/api/broll/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(brollData)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Erreur lors de la génération du B-roll')
        }

        const result = await response.json()
        console.log('✅ B-roll créé en processing:', result)
        
        // Ajouter instantanément la vidéo "processing" à l'affichage
        if (heroSectionRef.current && result.broll) {
          const processingVideo = {
            id: result.broll.id,
            title: result.broll.name,
            posterUrl: selectedBRollImage ? URL.createObjectURL(selectedBRollImage) : '/placeholder-video.jpg',
            videoUrl: null,
            status: 'processing' as const,
            progress: 0,
            createdAt: result.broll.createdAt,
            duration: (result.broll.duration || '0:03').replace(/\n/g, ''),
            format: result.broll.format || '16:9'
          }
          
          heroSectionRef.current.addProcessingVideo(processingVideo)
        }
        
        // Réinitialiser le formulaire
        setScript("")
        setSelectedBRollImage(null)
        
        // REF Pattern - Libération après succès
        brollGenerationInProgress.current = false
        brollGenerationKey.current = null
        
      } catch (error) {
        console.error('Erreur génération B-roll:', error)
        alert(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
        
        // REF Pattern - Libération après erreur
        brollGenerationInProgress.current = false
        brollGenerationKey.current = null
      } finally {
        setIsGenerating(false)
        setHasStartedGeneration(false)
      }
    } else {
      if (!hasContent || !selectedActor || !currentProject) {
        return
      }

      setIsGenerating(true)
      try {
        alert(`Génération simulée: script="${script}", actor="${selectedActor.id}"`)
      } finally {
        setIsGenerating(false)
      }
    }
  }

  const uploadImageToFal = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await fetch('/api/images/upload', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      throw new Error('Échec upload image')
    }
    
    const data = await response.json()
    return data.url
  }

  const handleVoiceChange = (voice: Voice) => {
    voiceGeneration.handleVoiceChange(voice)
  }

  return (
    <CreatePageGuard>
      <div className="h-full flex flex-col relative">
        {/* Background gradients */}
        <div className="absolute -inset-8 overflow-hidden pointer-events-none z-0">
          <div className="absolute bottom-0 left-0 right-0 h-[70vh] bg-gradient-to-t from-primary/12 via-primary/5 via-primary/2 to-transparent"></div>
          <div 
            className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full blur-3xl opacity-25"
            style={{
              background: 'radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, hsl(var(--primary) / 0.04) 40%, transparent 70%)'
            }}
          ></div>
          <div className="absolute top-0 right-0 w-[40vw] h-[40vh] bg-gradient-to-bl from-secondary/8 via-secondary/3 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-[35vw] h-[35vh] bg-gradient-to-tr from-accent/6 via-accent/2 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background/10 via-transparent to-background/10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-transparent to-background/15"></div>
        </div>

        {/* Hero Section */}
        <HeroSectionWrapper 
          ref={heroSectionRef}
          currentProject={currentProject} 
        />

        {/* Creation Section */}
        <div className="flex-shrink-0 relative z-10 pb-8 pt-8">
          <div className={`w-full flex px-4 ${
            selectedType === "talking-actor" && isAudioSettingsOpen 
              ? "justify-center gap-2 items-start" 
              : "justify-center"
          }`}>
            <MainCreationSection
              selectedType={selectedType}
              script={script}
              speechMode={speechMode}
              selectedVideoFormat={selectedVideoFormat}
              selectedActor={selectedActor}
              selectedVoice={voiceGeneration.selectedVoice}
              selectedBRollImage={selectedBRollImage}
              audioFile={audioRecording.audioFile}
              recordedBlob={audioRecording.recordedBlob}
              isRecording={audioRecording.isRecording}
              isPlaying={audioRecording.isPlaying}
              recordingState={audioRecording.recordingState}
              recordingTime={audioRecording.recordingTime}
              isVoiceGenerated={voiceGeneration.isVoiceGenerated}
              isGeneratingVoice={voiceGeneration.isGeneratingVoice}
              isPlayingVoice={voiceGeneration.isPlayingVoice}
              isAudioSettingsOpen={isAudioSettingsOpen}
              isGenerating={isGenerating}
              creationTypes={creationTypes}
              speechModes={speechModes}
              videoFormats={videoFormats}
              onTypeChange={(type: CreationType) => {
                setSelectedType(type)
                if (type !== "talking-actor") {
                  setIsAudioSettingsOpen(false)
                }
              }}
              onScriptChange={setScript}
              onSpeechModeChange={setSpeechMode}
              onVideoFormatChange={setSelectedVideoFormat}
              onBRollImageChange={setSelectedBRollImage}
              onOpenActorModal={() => setIsActorModalOpen(true)}
              onSubmit={handleSubmit}
              onStartRecording={audioRecording.startRecording}
              onStopRecording={audioRecording.stopRecording}
              onPlayRecording={audioRecording.playRecording}
              onPauseRecording={audioRecording.pauseRecording}
              onRestartRecording={audioRecording.restartRecording}
              onPrepareRecording={audioRecording.prepareRecording}
              onClearAudio={audioRecording.clearAudio}
              onCancelRecording={audioRecording.cancelRecording}
              onGenerateVoice={voiceGeneration.generateVoice}
              onPlayPauseVoice={voiceGeneration.isPlayingVoice ? voiceGeneration.pauseGeneratedVoice : voiceGeneration.playGeneratedVoice}
              onRegenerateVoice={voiceGeneration.regenerateVoice}
              onToggleAudioSettings={() => setIsAudioSettingsOpen(!isAudioSettingsOpen)}
              formatTime={audioRecording.formatTime}
              getPlaceholder={getPlaceholder}
            />

            {/* Audio Settings Drawer */}
            {selectedType === "talking-actor" && (
              <div className={`transition-all duration-400 ease-in-out transform ${
                isAudioSettingsOpen 
                  ? "w-80 translate-x-0 opacity-100" 
                  : "w-0 translate-x-0 opacity-0 overflow-hidden"
              } self-stretch`}>
                <div className="w-80 p-[1px] rounded-2xl bg-gradient-to-b from-border/50 via-primary/10 to-border/30 h-full">
                  <div className="bg-card/95 backdrop-blur-sm border-0 rounded-2xl shadow-xl shadow-primary/5 p-4 h-full flex flex-col">
                    <AudioSettingsDrawer
                      isOpen={isAudioSettingsOpen}
                      selectedVoice={voiceGeneration.selectedVoice}
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

      {/* Modals */}
      <ActorSelectorModal
        isOpen={isActorModalOpen}
        onClose={() => setIsActorModalOpen(false)}
        onSelectActor={(actor) => {
          setSelectedActor(actor)
          setIsActorModalOpen(false)
        }}
        selectedActorId={selectedActor?.id}
        onCreateAvatar={() => {
          setIsActorModalOpen(false)
          setIsCreateAvatarModalOpen(true)
        }}
      />

      <VoiceSelectionModal
        isOpen={isVoiceModalOpen}
        selectedVoice={voiceGeneration.selectedVoice}
        voices={mockVoices}
        onClose={() => setIsVoiceModalOpen(false)}
        onVoiceChange={handleVoiceChange}
      />

      <CreateAvatarModal
        isOpen={isCreateAvatarModalOpen}
        onClose={() => setIsCreateAvatarModalOpen(false)}
        projectId={currentProject?.id}
        videoFormat={selectedVideoFormat}
        onAvatarCreated={(avatar) => {
          setIsCreateAvatarModalOpen(false)
        }}
        onAvatarGenerationCompleted={async (avatar) => {
          if (heroSectionRef.current) {
            await heroSectionRef.current.refreshAvatars()
          }
        }}
      />
    </CreatePageGuard>
  )
}