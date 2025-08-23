/**
 * @purpose: Assemblage page complète Create avec sections et hooks selon CLAUDE.md
 * @domain: create
 * @scope: feature-create
 * @created: 2025-08-22
 */

"use client"

import { useState } from "react"
import { MainCreationSection, HeroSectionWrapper } from './sections'
import { ActorSelectorModal } from './ui/ActorSelectorModal'
import { CreatePageGuard } from './ui/CreatePageGuard'
import { VoiceSelectionModal } from './ui/VoiceSelectionModal'
import { AudioSettingsDrawer } from './ui/AudioSettingsDrawer'
import { CreateAvatarModal } from './ui/CreateAvatarModal'
import { useProjects, mockVoices, mockAvatars, type Voice } from "@/src/app/_shared"
import { useAudioRecording } from "../hooks/useAudioRecording"
import { useVoiceGeneration } from "../hooks/useVoiceGeneration"
import type { CreationType, Avatar, AudioSettings } from "../types"
import { creationTypes, speechModes, videoFormats } from "../constants"

export function CreateMain() {
  const { currentProject } = useProjects()
  
  const [script, setScript] = useState("")
  const [selectedType, setSelectedType] = useState<CreationType>("talking-actor")
  const [speechMode, setSpeechMode] = useState<"text-to-speech" | "speech-to-speech">("text-to-speech")
  const [selectedActor, setSelectedActor] = useState<Avatar | null>(null)
  const [selectedVideoFormat, setSelectedVideoFormat] = useState("16:9")
  const [isGenerating, setIsGenerating] = useState(false)
  
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
      case "scenes":
        return "Scene description: describe the atmosphere and desired action..."
      case "b-rolls":
        return "B-Roll description: product, environment, visual style..."
      default:
        return "Describe your video..."
    }
  }

  const handleSubmit = async () => {
    const hasContent = speechMode === "text-to-speech" ? script.trim() : audioRecording.audioFile
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
        <HeroSectionWrapper currentProject={currentProject} />

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
        onAvatarCreated={(avatar) => {
          setIsCreateAvatarModalOpen(false)
        }}
      />
    </CreatePageGuard>
  )
}