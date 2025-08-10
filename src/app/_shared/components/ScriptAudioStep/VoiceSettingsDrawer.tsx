"use client"

import React from 'react'
import { IconX, IconRotateClockwise, IconPlayerPlay, IconTrash } from '@tabler/icons-react'
import { Voice } from './types'

interface VoiceSettingsDrawerProps {
  isOpen: boolean
  onClose: () => void
  selectedVoice: Voice
  onChangeVoice: () => void
  onDeleteVoice: () => void
}

export function VoiceSettingsDrawer({ isOpen, onClose, selectedVoice, onChangeVoice, onDeleteVoice }: VoiceSettingsDrawerProps) {
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
            <h3 className="text-lg font-semibold text-foreground">Voice Settings</h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
            >
              <IconX size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Current Voice */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">Current Voice</h4>
              <div className="p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {selectedVoice.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-semibold text-foreground">{selectedVoice.name}</h5>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{selectedVoice.language}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedVoice.gender === "female" ? "Female" : "Male"} • {selectedVoice.age === "young" ? "Young" : "Adult"} • {selectedVoice.accent}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center gap-2">
                    <IconPlayerPlay size={16} />
                    <span className="text-sm font-medium">Preview</span>
                  </button>
                  <button 
                    onClick={onChangeVoice}
                    className="flex-1 px-3 py-2 bg-background border border-border text-foreground rounded-lg hover:bg-accent transition-colors"
                  >
                    <span className="text-sm font-medium">Change</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Voice Configuration */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-foreground">Voice Configuration</h4>
              
              {/* Voice-over Setting */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Voice-over</label>
                  <span className="text-sm text-muted-foreground">{selectedVoice.name} - Default</span>
                </div>
                <button 
                  onClick={onChangeVoice}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg hover:bg-accent transition-colors text-left"
                >
                  <span className="text-sm">Select different voice</span>
                </button>
              </div>

              {/* Additional Voice Options */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Voice Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                    Default
                  </button>
                  <button className="px-3 py-2 bg-background border border-border rounded-lg text-sm hover:bg-accent transition-colors">
                    Custom
                  </button>
                </div>
              </div>

              {/* Emphasis */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Emphasis</label>
                <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm">
                  <option>Normal</option>
                  <option>Strong</option>
                  <option>Moderate</option>
                  <option>Reduced</option>
                </select>
              </div>

              {/* Language Accent */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Language Accent</label>
                <select className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm">
                  <option>{selectedVoice.accent}</option>
                  <option>American</option>
                  <option>British</option>
                  <option>Australian</option>
                </select>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-red-600">Danger Zone</h4>
              <button 
                onClick={onDeleteVoice}
                className="w-full px-4 py-2 bg-red-500/10 text-red-600 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
              >
                <IconTrash size={16} />
                <span className="text-sm font-medium">Remove Voice</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  // Reset voice settings to default
                  console.log('Reset voice settings')
                }}
                className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-accent transition-colors flex items-center justify-center gap-2"
              >
                <IconRotateClockwise size={16} />
                <span className="text-sm font-medium">Reset</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <span className="text-sm font-medium">Apply</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
