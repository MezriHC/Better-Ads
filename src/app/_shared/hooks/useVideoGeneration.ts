'use client'

import { useState } from 'react'
import { GeneratedVideoData } from '../types/ai'
import { logger } from '../utils/logger'

export function useVideoGeneration() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateVideo = async (
    prompt: string, 
    imageUrl: string, 
    type: 'private-avatar' | 'generated-video' = 'generated-video',
    projectId?: string
  ): Promise<GeneratedVideoData | null> => {
    try {
      setIsGenerating(true)
      setError(null)
      
      logger.client.info(`Appel API génération vidéo: ${prompt.substring(0, 50)}...`)
      logger.video.generation.start('api-call', { prompt, imageUrl })

                const response = await fetch('/api/ai/video/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          imageUrl,
          type,
          projectId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate video')
      }

      const data = await response.json()
      
      if (!data.success) {
        logger.video.generation.error('api-response', data.error)
        throw new Error(data.error || 'Video generation failed')
      }

      logger.video.generation.complete('api-success', data.video?.url, 0)
      logger.client.info(`Vidéo générée avec succès: ${data.video?.id}`)
      return data.video

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during video generation'
      logger.video.generation.error('generation', err)
      logger.client.error(`Erreur génération vidéo: ${errorMessage}`)
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
