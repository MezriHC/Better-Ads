"use client"

import { IconPlayerPlay, IconPlayerPause, IconHeadphones, IconSettings, IconRefresh } from "@tabler/icons-react"

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

interface VoicePreviewProps {
  selectedVoice: Voice
  selectedActor: Avatar | null
  isVoiceGenerated: boolean
  isGeneratingVoice: boolean
  isPlayingVoice: boolean
  speechMode: "text-to-speech" | "speech-to-speech"
  script: string
  audioFile: File | null
  onGenerateVoice: () => void
  onPlayPause: () => void
  onRegenerateVoice: () => void
  onToggleAudioSettings: () => void
}

export function VoicePreview({
  selectedVoice,
  selectedActor,
  isVoiceGenerated,
  isGeneratingVoice,
  isPlayingVoice,
  speechMode,
  script,
  audioFile,
  onGenerateVoice,
  onPlayPause,
  onRegenerateVoice,
  onToggleAudioSettings
}: VoicePreviewProps) {
  const isDisabled = isGeneratingVoice || (!isVoiceGenerated && (speechMode === "text-to-speech" ? !script.trim() : !audioFile))

  return (
    <div>
      {/* Voice Preview - Default component */}
      <div className="flex items-center gap-3 p-4 bg-muted border border-border rounded-lg">
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
            onClick={isVoiceGenerated ? onPlayPause : onGenerateVoice}
            disabled={isDisabled}
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
            onClick={onToggleAudioSettings}
            className="w-8 h-8 flex items-center justify-center bg-background text-foreground rounded-lg hover:bg-accent transition-colors cursor-pointer"
          >
            <IconSettings size={16} />
          </button>
          <button
            onClick={onRegenerateVoice}
            disabled={!isVoiceGenerated}
            className="w-8 h-8 flex items-center justify-center bg-background text-foreground rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <IconRefresh size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
