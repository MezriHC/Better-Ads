"use client"

import { useState } from "react"
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
import type { CreationType, Avatar, AudioSettings } from "./types"
import { creationTypes, speechModes, videoFormats, voices } from "./constants"

export default function CreatePage() {
  const { currentProject } = useProjects()
  const [script, setScript] = useState("")
  const [selectedType, setSelectedType] = useState<CreationType>("talking-actor")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [speechMode, setSpeechMode] = useState<"text-to-speech" | "speech-to-speech">("text-to-speech")
  const [isSpeechDropdownOpen, setIsSpeechDropdownOpen] = useState(false)
  const [selectedActor, setSelectedActor] = useState<Avatar | null>(null)
  const [isActorModalOpen, setIsActorModalOpen] = useState(false)
  const [selectedVideoFormat, setSelectedVideoFormat] = useState("16:9")
  const [isVideoFormatDropdownOpen, setIsVideoFormatDropdownOpen] = useState(false)
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [isAudioSettingsOpen, setIsAudioSettingsOpen] = useState(false)
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    speed: 1.0,
    stability: 0.5,
    similarity: 0.75,
    styleExaggeration: 0.0
  })

  // Custom hooks
  const audioRecording = useAudioRecording()
  const voiceGeneration = useVoiceGeneration({ id: "2", name: "Emma", gender: "female", language: "English", country: "US", flag: "🇺🇸" })

  const currentType = creationTypes.find(type => type.id === selectedType)
  const currentSpeechMode = speechModes.find(mode => mode.id === speechMode)
  const currentVideoFormat = videoFormats.find(format => format.id === selectedVideoFormat)

  const handleSubmit = () => {
    const hasContent = speechMode === "text-to-speech" ? script.trim() : audioRecording.audioFile
    if (hasContent) {
      // Logique de génération

    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }

  return (
    <CreatePageGuard>
      <div className="flex flex-col min-h-full">
      <HeroSection currentProject={currentProject} />

      {/* Content Area - Compact spacing */}
      <div className="w-full mx-auto px-4 relative">
        <div className="flex justify-center">
          {/* Main Creation Section */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg w-full max-w-4xl mr-4">
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
            <div className="mb-4">
              {selectedType === "talking-actor" && speechMode === "speech-to-speech" ? (
                <AudioRecordingInterface
                  recordedBlob={audioRecording.recordedBlob}
                  audioFile={audioRecording.audioFile}
                  isRecording={audioRecording.isRecording}
                  isPlaying={audioRecording.isPlaying}
                  recordingState={audioRecording.recordingState}
                  recordingTime={audioRecording.recordingTime}
                  onStartRecording={audioRecording.startRecording}
                  onStopRecording={audioRecording.stopRecording}
                  onPlayRecording={audioRecording.playRecording}
                  onPauseRecording={audioRecording.pauseRecording}
                  onRestartRecording={audioRecording.restartRecording}
                  onPrepareRecording={audioRecording.prepareRecording}
                  onClearAudio={audioRecording.clearAudio}
                  onCancelRecording={audioRecording.cancelRecording}
                  formatTime={audioRecording.formatTime}
                />
              ) : (
                <ScriptInput
                  value={script}
                  onChange={setScript}
                  onKeyDown={handleKeyDown}
                />
              )}
            </div>

            {/* Voice Preview - Always visible for Talking Actor */}
            {selectedType === "talking-actor" && (
              <VoicePreview
                selectedVoice={voiceGeneration.selectedVoice}
                selectedActor={selectedActor}
                isVoiceGenerated={voiceGeneration.isVoiceGenerated}
                isGeneratingVoice={voiceGeneration.isGeneratingVoice}
                isPlayingVoice={voiceGeneration.isPlayingVoice}
                speechMode={speechMode}
                script={script}
                audioFile={audioRecording.audioFile}
                onGenerateVoice={voiceGeneration.generateVoice}
                onPlayPause={voiceGeneration.isPlayingVoice ? voiceGeneration.pauseGeneratedVoice : voiceGeneration.playGeneratedVoice}
                onRegenerateVoice={voiceGeneration.regenerateVoice}
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
              audioFile={audioRecording.audioFile}
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
          
          {/* Audio Settings Drawer - Only for Talking Actor */}
          {selectedType === "talking-actor" && (
            <AudioSettingsDrawer
              isOpen={isAudioSettingsOpen}
              selectedVoice={voiceGeneration.selectedVoice}
              audioSettings={audioSettings}
              onClose={() => setIsAudioSettingsOpen(false)}
              onAudioSettingsChange={setAudioSettings}
              onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            />
          )}
        </div>
      </div>

      {/* Actor Selection Modal */}
      <ActorSelectorModal
        isOpen={isActorModalOpen}
        onClose={() => setIsActorModalOpen(false)}
        onSelectActor={(actor) => {
          // Pour les avatars créés custom - ne pas fermer la modal
          setSelectedActor(actor)
        }}
        onSelectExistingActor={(actor) => {
          // Pour les avatars existants - fermer la modal
          setSelectedActor(actor)
          setIsActorModalOpen(false)
        }}
      />

      {/* Voice Selection Modal */}
      <VoiceSelectionModal
        isOpen={isVoiceModalOpen}
        selectedVoice={voiceGeneration.selectedVoice}
        voices={voices}
        onClose={() => setIsVoiceModalOpen(false)}
        onVoiceChange={voiceGeneration.handleVoiceChange}
      />

      </div>
    </CreatePageGuard>
  )
}
