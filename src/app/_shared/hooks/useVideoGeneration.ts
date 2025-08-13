'use client'

import { useState } from 'react'
import { GeneratedVideoData } from '../types/ai'

export function useVideoGeneration() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateVideo = async (prompt: string, imageUrl: string): Promise<GeneratedVideoData | null> => {
    try {
      setIsGenerating(true)
      setError(null)

                const response = await fetch('/api/ai/video/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          imageUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate video')
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Video generation failed')
      }

      return data.video

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during video generation'
      setError(errorMessage)
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    generateVideo,
    isGenerating,
    error,
  }
}
