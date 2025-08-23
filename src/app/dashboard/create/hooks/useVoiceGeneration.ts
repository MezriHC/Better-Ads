"use client"

import { useState, useRef } from "react"
import type { Voice } from "../types"

export function useVoiceGeneration(initialVoice: Voice) {
  const [selectedVoice, setSelectedVoice] = useState<Voice>(initialVoice)
  const [isVoiceGenerated, setIsVoiceGenerated] = useState(false)
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false)
  const [generatedVoiceBlob, setGeneratedVoiceBlob] = useState<Blob | null>(null)
  const [isPlayingVoice, setIsPlayingVoice] = useState(false)
  
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null)

  const generateVoice = async () => {
    setIsGeneratingVoice(true)
    
    setTimeout(() => {
      setIsVoiceGenerated(true)
      setIsGeneratingVoice(false)
      
      const blob = new Blob([new ArrayBuffer(0)], { type: 'audio/wav' })
      setGeneratedVoiceBlob(blob)
    }, 2000)
  }

  const playGeneratedVoice = () => {
    if (generatedVoiceBlob) {
      const url = URL.createObjectURL(generatedVoiceBlob)
      const audio = new Audio(url)
      voiceAudioRef.current = audio
      
      audio.onended = () => {
        setIsPlayingVoice(false)
        URL.revokeObjectURL(url)
      }
      
      audio.play()
      setIsPlayingVoice(true)
    }
  }

  const pauseGeneratedVoice = () => {
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause()
      setIsPlayingVoice(false)
    }
  }

  const regenerateVoice = () => {
    setIsVoiceGenerated(false)
    setGeneratedVoiceBlob(null)
    generateVoice()
  }

  const handleVoiceChange = (voice: Voice) => {
    setSelectedVoice(voice)
    setIsVoiceGenerated(false) // Reset generation when changing voice
  }

  return {
    selectedVoice,
    isVoiceGenerated,
    isGeneratingVoice,
    generatedVoiceBlob,
    isPlayingVoice,
    
    generateVoice,
    playGeneratedVoice,
    pauseGeneratedVoice,
    regenerateVoice,
    handleVoiceChange
  }
}
