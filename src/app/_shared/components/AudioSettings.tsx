"use client"

import React from 'react'

// Types
interface AudioSettings {
  speed: number
  stability: number
  similarity: number
  styleExaggeration: number
}

interface AudioSettingsProps {
  audioSettings: AudioSettings
  onAudioSettingsChange: (settings: AudioSettings) => void
}

export function AudioSettings({
  audioSettings,
  onAudioSettingsChange
}: AudioSettingsProps) {

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-6 sticky top-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Audio Settings</h3>
        
        <div className="space-y-6">
            {/* Speed */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-foreground">Speed</label>
                <span className="text-sm text-muted-foreground">{audioSettings.speed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={audioSettings.speed}
                onChange={(e) => onAudioSettingsChange({...audioSettings, speed: parseFloat(e.target.value)})}
                className="w-full h-2 bg-muted rounded appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:rounded [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            {/* Stability */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-foreground">Stability</label>
                <span className="text-sm text-muted-foreground">{audioSettings.stability.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={audioSettings.stability}
                onChange={(e) => onAudioSettingsChange({...audioSettings, stability: parseFloat(e.target.value)})}
                className="w-full h-2 bg-muted rounded appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:rounded [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            {/* Similarity */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-foreground">Similarity</label>
                <span className="text-sm text-muted-foreground">{audioSettings.similarity.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={audioSettings.similarity}
                onChange={(e) => onAudioSettingsChange({...audioSettings, similarity: parseFloat(e.target.value)})}
                className="w-full h-2 bg-muted rounded appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:rounded [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>

            {/* Style Exaggeration */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-foreground">Style Exaggeration</label>
                <span className="text-sm text-muted-foreground">{audioSettings.styleExaggeration.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={audioSettings.styleExaggeration}
                onChange={(e) => onAudioSettingsChange({...audioSettings, styleExaggeration: parseFloat(e.target.value)})}
                className="w-full h-2 bg-muted rounded appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:rounded [&::-webkit-slider-thumb]:cursor-pointer"
              />
            </div>
        </div>
      </div>
    </>
  )
}
