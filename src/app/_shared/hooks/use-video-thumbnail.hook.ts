"use client"

import { useState, useEffect, useRef } from 'react'
import { generateVideoThumbnailSafe } from '../lib/video-thumbnail.util'

interface UseVideoThumbnailOptions {
  videoUrl?: string | null
  fallbackUrl?: string
  enabled?: boolean
}

export function useVideoThumbnail({
  videoUrl,
  fallbackUrl = '/placeholder-video.jpg',
  enabled = true
}: UseVideoThumbnailOptions) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(fallbackUrl)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const generatedRef = useRef<string | null>(null)

  useEffect(() => {
    if (!enabled || !videoUrl || generatedRef.current === videoUrl) {
      return
    }

    const generateThumbnail = async () => {
      setIsGenerating(true)
      setError(null)
      
      try {
        const thumbnail = await generateVideoThumbnailSafe(videoUrl, fallbackUrl)
        setThumbnailUrl(thumbnail)
        generatedRef.current = videoUrl
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate thumbnail')
        setThumbnailUrl(fallbackUrl)
      } finally {
        setIsGenerating(false)
      }
    }

    generateThumbnail()
  }, [videoUrl, fallbackUrl, enabled])

  // Reset quand l'URL change
  useEffect(() => {
    if (!videoUrl) {
      setThumbnailUrl(fallbackUrl)
      generatedRef.current = null
      setError(null)
    }
  }, [videoUrl, fallbackUrl])

  return {
    thumbnailUrl,
    isGenerating,
    error
  }
}