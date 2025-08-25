"use client"

import { CreationTypeDropdown } from "./CreationTypeDropdown"
import { CharacterCount } from "./CharacterCount"
import { ScriptInput } from "./ScriptInput"
import { AudioRecordingInterface } from "./AudioRecordingInterface"
import { VoicePreview } from "./VoicePreview"
import { BottomControls } from "./BottomControls"
import type { CreationType, Avatar, Voice, AudioSettings } from "../../types"

interface CreationPanelProps {
  selectedType: CreationType
  script: string
  speechMode: "text-to-speech" | "speech-to-speech"
  selectedVideoFormat: string
  selectedActor: Avatar | null
  selectedVoice: Voice
  selectedBRollImage: File | null
  isDropdownOpen: boolean
  isSpeechDropdownOpen: boolean
  isVideoFormatDropdownOpen: boolean
  audioFile: File | null
  recordedBlob: Blob | null
  isRecording: boolean
  isPlaying: boolean
  recordingState: "idle" | "ready" | "recording" | "completed"
  recordingTime: number
  isVoiceGenerated: boolean
  isGeneratingVoice: boolean
  isPlayingVoice: boolean
  isGenerating?: boolean
  creationTypes: any[]
  speechModes: any[]
  videoFormats: any[]
  onTypeChange: (type: CreationType) => void
  onScriptChange: (script: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  onToggleDropdown: () => void
  onToggleSpeechDropdown: () => void
  onToggleVideoFormatDropdown: () => void
  onVideoFormatChange: (format: string) => void
  onBRollImageChange: (image: File | null) => void
  onSpeechModeChange: (mode: "text-to-speech" | "speech-to-speech") => void
  onOpenActorModal: () => void
  onSubmit: () => void
  onCloseAudioSettings: () => void
  onStartRecording: () => void
  onStopRecording: () => void
  onPlayRecording: () => void
  onPauseRecording: () => void
  onRestartRecording: () => void
  onPrepareRecording: () => void
  onClearAudio: () => void
  onCancelRecording: () => void
  formatTime: (seconds: number) => string
  onGenerateVoice: () => void
  onPlayPauseVoice: () => void
  onRegenerateVoice: () => void
  onToggleAudioSettings: () => void
  getPlaceholder: () => string
}

export function CreationPanel({
  selectedType,
  script,
  speechMode,
  selectedVideoFormat,
  selectedActor,
  selectedVoice,
  selectedBRollImage,
  isDropdownOpen,
  isSpeechDropdownOpen,
  isVideoFormatDropdownOpen,
  audioFile,
  recordedBlob,
  isRecording,
  isPlaying,
  recordingState,
  recordingTime,
  isVoiceGenerated,
  isGeneratingVoice,
  isPlayingVoice,
  isGenerating = false,
  creationTypes,
  speechModes,
  videoFormats,
  onTypeChange,
  onScriptChange,
  onKeyDown,
  onToggleDropdown,
  onToggleSpeechDropdown,
  onToggleVideoFormatDropdown,
  onVideoFormatChange,
  onBRollImageChange,
  onSpeechModeChange,
  onOpenActorModal,
  onSubmit,
  onCloseAudioSettings,
  onStartRecording,
  onStopRecording,
  onPlayRecording,
  onPauseRecording,
  onRestartRecording,
  onPrepareRecording,
  onClearAudio,
  onCancelRecording,
  formatTime,
  onGenerateVoice,
  onPlayPauseVoice,
  onRegenerateVoice,
  onToggleAudioSettings,
  getPlaceholder
}: CreationPanelProps) {
  return (
    <div className="flex flex-col gap-3 transition-all duration-400 ease-in-out">
      <div className="flex items-center justify-between">
        <CreationTypeDropdown
          selectedType={selectedType}
          onTypeChange={onTypeChange}
          creationTypes={creationTypes}
          isOpen={isDropdownOpen}
          onToggleOpen={onToggleDropdown}
          onCloseAudioSettings={onCloseAudioSettings}
        />

        {!(selectedType === "talking-actor" && speechMode === "speech-to-speech") && (
          <CharacterCount count={script.length} maxCount={1500} />
        )}
      </div>

      <div className="h-32">
        {selectedType === "talking-actor" && speechMode === "speech-to-speech" ? (
          <AudioRecordingInterface
            recordedBlob={recordedBlob}
            audioFile={audioFile}
            isRecording={isRecording}
            isPlaying={isPlaying}
            recordingState={recordingState}
            recordingTime={recordingTime}
            onStartRecording={onStartRecording}
            onStopRecording={onStopRecording}
            onPlayRecording={onPlayRecording}
            onPauseRecording={onPauseRecording}
            onRestartRecording={onRestartRecording}
            onPrepareRecording={onPrepareRecording}
            onClearAudio={onClearAudio}
            onCancelRecording={onCancelRecording}
            formatTime={formatTime}
          />
        ) : (
          <ScriptInput
            value={script}
            onChange={onScriptChange}
            onKeyDown={onKeyDown}
            placeholder={getPlaceholder()}
            disabled={isGenerating}
          />
        )}
      </div>

      {selectedType === "talking-actor" && (
        <div className="flex flex-col gap-3">
          <VoicePreview
            selectedVoice={selectedVoice}
            selectedActor={selectedActor}
            isVoiceGenerated={isVoiceGenerated}
            isGeneratingVoice={isGeneratingVoice}
            isPlayingVoice={isPlayingVoice}
            speechMode={speechMode}
            script={script}
            audioFile={audioFile}
            onGenerateVoice={onGenerateVoice}
            onPlayPause={onPlayPauseVoice}
            onRegenerateVoice={onRegenerateVoice}
            onToggleAudioSettings={onToggleAudioSettings}
          />
        </div>
      )}

      <BottomControls
        selectedType={selectedType}
        speechMode={speechMode}
        selectedVideoFormat={selectedVideoFormat}
        selectedActor={selectedActor}
        selectedBRollImage={selectedBRollImage}
        script={script}
        audioFile={audioFile}
        speechModes={speechModes}
        videoFormats={videoFormats}
        isVideoFormatDropdownOpen={isVideoFormatDropdownOpen}
        isSpeechDropdownOpen={isSpeechDropdownOpen}
        isGenerating={isGenerating}
        onVideoFormatChange={onVideoFormatChange}
        onBRollImageChange={onBRollImageChange}
        onSpeechModeChange={onSpeechModeChange}
        onToggleVideoFormatDropdown={onToggleVideoFormatDropdown}
        onToggleSpeechDropdown={onToggleSpeechDropdown}
        onOpenActorModal={onOpenActorModal}
        onSubmit={onSubmit}
      />
    </div>
  )
}