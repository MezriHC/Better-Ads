"use client"

import React from 'react'
import { IconX, IconInfoCircle, IconRotateClockwise } from '@tabler/icons-react'
import { AudioSettings } from './types'

interface AudioSettingsDrawerProps {
  isOpen: boolean
  onClose: () => void
  settings: AudioSettings
  onSettingsChange: (settings: AudioSettings) => void
}

export function AudioSettingsDrawer({ isOpen, onClose, settings, onSettingsChange }: AudioSettingsDrawerProps) {
  const handleSliderChange = (key: keyof AudioSettings, value: number) => {
    onSettingsChange({
      ...settings,
      [key]: value
    })
  }

  const resetSettings = () => {
    onSettingsChange({
      speed: 1.00,
      stability: 0.50,
      similarity: 0.75,
      styleExaggeration: 0.00
    })
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-background border-l border-border shadow-xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Audio Settings</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={resetSettings}
                className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
                title="Reset to default"
              >
                <IconRotateClockwise size={18} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
              >
                <IconX size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-8 overflow-y-auto">
            {/* Speed */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-foreground">Speed</label>
                  <IconInfoCircle size={14} className="text-muted-foreground" />
                </div>
                <span className="text-sm font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                  {settings.speed.toFixed(2)}X
                </span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0.25"
                  max="4.00"
                  step="0.05"
                  value={settings.speed}
                  onChange={(e) => handleSliderChange('speed', parseFloat(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.25X</span>
                  <span>4.00X</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Controls the speaking rate of the generated audio
              </p>
            </div>

            {/* Stability */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-foreground">Stability</label>
                  <IconInfoCircle size={14} className="text-muted-foreground" />
                </div>
                <span className="text-sm font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                  {settings.stability.toFixed(2)}
                </span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0.00"
                  max="1.00"
                  step="0.05"
                  value={settings.stability}
                  onChange={(e) => handleSliderChange('stability', parseFloat(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.00</span>
                  <span>1.00</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Higher values reduce variability but may sound less natural
              </p>
            </div>

            {/* Similarity */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-foreground">Similarity</label>
                  <IconInfoCircle size={14} className="text-muted-foreground" />
                </div>
                <span className="text-sm font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                  {settings.similarity.toFixed(2)}
                </span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0.00"
                  max="1.00"
                  step="0.05"
                  value={settings.similarity}
                  onChange={(e) => handleSliderChange('similarity', parseFloat(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.00</span>
                  <span>1.00</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                How closely the output matches the original voice characteristics
              </p>
            </div>

            {/* Style Exaggeration */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-foreground">Style Exaggeration</label>
                  <IconInfoCircle size={14} className="text-muted-foreground" />
                </div>
                <span className="text-sm font-mono bg-muted px-2 py-1 rounded text-muted-foreground">
                  {settings.styleExaggeration.toFixed(2)}
                </span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0.00"
                  max="2.00"
                  step="0.05"
                  value={settings.styleExaggeration}
                  onChange={(e) => handleSliderChange('styleExaggeration', parseFloat(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.00</span>
                  <span>2.00</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Amplifies the emotional and stylistic aspects of the voice
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Apply Settings
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
