"use client"

import React from 'react'
import { IconX, IconInfoCircle } from '@tabler/icons-react'
import { AudioSettings } from './types'

export function AudioSettingsPanel({ isOpen, onClose, settings, onSettingsChange }: {
  isOpen: boolean
  onClose: () => void
  settings: AudioSettings
  onSettingsChange: (settings: AudioSettings) => void
}) {
  if (!isOpen) return null

  const handleSliderChange = (key: keyof AudioSettings, value: number) => {
    onSettingsChange({
      ...settings,
      [key]: value
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Audio Settings</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <IconX size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Speed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Speed</label>
              <span className="text-sm text-muted-foreground">{settings.speed.toFixed(2)}X</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0.25"
                max="4.00"
                step="0.05"
                value={settings.speed}
                onChange={(e) => handleSliderChange('speed', parseFloat(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          {/* Stability */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-foreground">Stability</label>
                <IconInfoCircle size={14} className="text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">{settings.stability.toFixed(2)}X</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0.00"
                max="1.00"
                step="0.05"
                value={settings.stability}
                onChange={(e) => handleSliderChange('stability', parseFloat(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          {/* Similarity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-foreground">Similarity</label>
                <IconInfoCircle size={14} className="text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">{settings.similarity.toFixed(2)}X</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0.00"
                max="1.00"
                step="0.05"
                value={settings.similarity}
                onChange={(e) => handleSliderChange('similarity', parseFloat(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          {/* Style Exaggeration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-foreground">Style exaggeration</label>
                <IconInfoCircle size={14} className="text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">{settings.styleExaggeration.toFixed(2)}X</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0.00"
                max="2.00"
                step="0.05"
                value={settings.styleExaggeration}
                onChange={(e) => handleSliderChange('styleExaggeration', parseFloat(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                onSettingsChange({
                  speed: 1.00,
                  stability: 0.50,
                  similarity: 0.75,
                  styleExaggeration: 0.00
                })
              }}
              className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
