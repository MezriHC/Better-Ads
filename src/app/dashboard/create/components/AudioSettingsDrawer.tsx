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
    <div className={`bg-card border border-border rounded-2xl p-4 shadow-lg transition-all duration-300 ease-in-out ${isOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
      {isOpen && (
        <div className="min-w-[280px]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Audio Settings</h3>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-muted hover:bg-accent flex items-center justify-center transition-colors cursor-pointer"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>
          
          {/* Voice Overview */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl mb-4">
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
              onClick={onOpenVoiceModal}
              className="px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-all cursor-pointer border border-primary/20 hover:border-primary/30"
            >
              Change Voice
            </button>
          </div>
          
          {/* Audio Parameters */}
          <div className="space-y-4">
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
                onChange={(e) => handleSettingChange('speed', parseFloat(e.target.value))}
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
                onChange={(e) => handleSettingChange('stability', parseFloat(e.target.value))}
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
                onChange={(e) => handleSettingChange('similarity', parseFloat(e.target.value))}
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
                onChange={(e) => handleSettingChange('styleExaggeration', parseFloat(e.target.value))}
                className="w-full h-2 bg-muted rounded appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:rounded [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
