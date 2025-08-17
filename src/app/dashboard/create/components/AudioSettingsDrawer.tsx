"use client"

import { IconX } from "@tabler/icons-react"

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

interface AudioSettingsDrawerProps {
  isOpen: boolean
  selectedVoice: Voice
  audioSettings: AudioSettings
  onClose: () => void
  onAudioSettingsChange: (settings: AudioSettings) => void
  onOpenVoiceModal: () => void
}

export function AudioSettingsDrawer({
  isOpen,
  selectedVoice,
  audioSettings,
  onClose,
  onAudioSettingsChange,
  onOpenVoiceModal
}: AudioSettingsDrawerProps) {
  const handleSettingChange = (key: keyof AudioSettings, value: number) => {
    onAudioSettingsChange({
      ...audioSettings,
      [key]: value
    })
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-lg w-full h-fit min-h-full">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Audio Settings</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-muted hover:bg-accent flex items-center justify-center transition-colors cursor-pointer"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Voice - Simplified */}
        <div className="mb-4">
          <button
            onClick={onOpenVoiceModal}
            className="w-full flex items-center justify-between p-2 bg-muted border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="text-lg">{selectedVoice.flag}</div>
              <div className="text-sm font-medium text-foreground">{selectedVoice.name}</div>
            </div>
            <div className="text-xs font-medium text-primary hover:text-primary/80 cursor-pointer">Change</div>
          </button>
        </div>

        {/* Speed Setting */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-foreground">Speed</label>
            <span className="text-sm text-muted-foreground">{audioSettings.speed}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={audioSettings.speed}
            onChange={(e) => handleSettingChange('speed', parseFloat(e.target.value))}
            className="w-full h-2 bg-muted rounded appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:rounded [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>

        {/* Stability Setting */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-foreground">Stability</label>
            <span className="text-sm text-muted-foreground">{audioSettings.stability}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={audioSettings.stability}
            onChange={(e) => handleSettingChange('stability', parseFloat(e.target.value))}
            className="w-full h-2 bg-muted rounded appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:rounded [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>

        {/* Similarity Setting */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-foreground">Similarity</label>
            <span className="text-sm text-muted-foreground">{audioSettings.similarity}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={audioSettings.similarity}
            onChange={(e) => handleSettingChange('similarity', parseFloat(e.target.value))}
            className="w-full h-2 bg-muted rounded appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:rounded [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>

        {/* Style Exaggeration Setting */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-foreground">Style Exaggeration</label>
            <span className="text-sm text-muted-foreground">{audioSettings.styleExaggeration}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={audioSettings.styleExaggeration}
            onChange={(e) => handleSettingChange('styleExaggeration', parseFloat(e.target.value))}
            className="w-full h-2 bg-muted rounded appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:rounded [&::-webkit-slider-thumb]:cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}