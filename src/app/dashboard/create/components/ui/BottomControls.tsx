"use client"

import { VideoFormatSelector } from "./VideoFormatSelector"
import { SpeechModeSelector } from "./SpeechModeSelector"
import { ActorSelection } from "./ActorSelection"
import { GenerateButton } from "./GenerateButton"

type CreationType = "talking-actor" | "scenes" | "b-rolls"

interface Avatar {
  id: string
  name: string
  imageUrl: string
}

interface SpeechMode {
  id: string
  label: string
}

interface VideoFormat {
  id: string
  label: string
  ratio: string
}

interface BottomControlsProps {
  selectedType: CreationType
  speechMode: "text-to-speech" | "speech-to-speech"
  selectedVideoFormat: string
  selectedActor: Avatar | null
  script: string
  audioFile: File | null
  speechModes: SpeechMode[]
  videoFormats: VideoFormat[]
  isVideoFormatDropdownOpen: boolean
  isSpeechDropdownOpen: boolean
  onVideoFormatChange: (formatId: string) => void
  onSpeechModeChange: (mode: "text-to-speech" | "speech-to-speech") => void
  onToggleVideoFormatDropdown: () => void
  onToggleSpeechDropdown: () => void
  onOpenActorModal: () => void
  onSubmit: () => void
}

export function BottomControls({
  selectedType,
  speechMode,
  selectedVideoFormat,
  selectedActor,
  script,
  audioFile,
  speechModes,
  videoFormats,
  isVideoFormatDropdownOpen,
  isSpeechDropdownOpen,
  onVideoFormatChange,
  onSpeechModeChange,
  onToggleVideoFormatDropdown,
  onToggleSpeechDropdown,
  onOpenActorModal,
  onSubmit
}: BottomControlsProps) {
  return (
    <div className="flex items-center justify-between h-12">
      <div className="flex items-center gap-3 relative">
        {/* Video Format Dropdown - Only for Scenes and B-Rolls */}
        <div className={`transition-all duration-500 ease-in-out absolute ${
          (selectedType === "scenes" || selectedType === "b-rolls")
            ? "opacity-100 transform translate-x-0" 
            : "opacity-0 transform -translate-x-4 pointer-events-none"
        }`}>
          <VideoFormatSelector
            selectedVideoFormat={selectedVideoFormat}
            onFormatChange={onVideoFormatChange}
            videoFormats={videoFormats}
            isOpen={isVideoFormatDropdownOpen}
            onToggleOpen={onToggleVideoFormatDropdown}
          />
        </div>

        {/* Speech Mode + Actor Selection - Only for Talking Actor */}
        <div className={`transition-all duration-500 ease-in-out flex items-center gap-3 ${
          selectedType === "talking-actor"
            ? "opacity-100 transform translate-x-0" 
            : "opacity-0 transform translate-x-4 pointer-events-none"
        }`}>
          <SpeechModeSelector
            speechMode={speechMode}
            onModeChange={onSpeechModeChange}
            speechModes={speechModes}
            isOpen={isSpeechDropdownOpen}
            onToggleOpen={onToggleSpeechDropdown}
          />
          <ActorSelection
            selectedActor={selectedActor}
            onOpenModal={onOpenActorModal}
          />
        </div>
      </div>

      {/* Generate Button */}
      <GenerateButton
        selectedType={selectedType}
        speechMode={speechMode}
        script={script}
        audioFile={audioFile}
        onSubmit={onSubmit}
      />
    </div>
  )
}