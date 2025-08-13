"use client"

import { useState } from 'react'
import { GeneratedImageData } from '../types/ai'

interface UseImageGenerationReturn {
  generateImages: (prompt: string, baseImageUrl?: string) => Promise<GeneratedImageData[]>
  editImage: (prompt: string, baseImageUrl: string) => Promise<GeneratedImageData[]>
  isGenerating: boolean
  error: string | null
}

export function useImageGeneration(): UseImageGenerationReturn {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateImages = async (prompt: string, baseImageUrl?: string): Promise<GeneratedImageData[]> => {
    if (!prompt.trim()) {
      throw new Error('Le prompt ne peut pas être vide')
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Choisir l'endpoint selon le mode
      const endpoint = baseImageUrl ? '/api/ai/images/edit' : '/api/ai/images/generate'
      const requestBody = baseImageUrl 
        ? { prompt, baseImageUrl }
        : { prompt }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Erreur lors de ${baseImageUrl ? 'l\'édition' : 'la génération'} d'images`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || `${baseImageUrl ? 'L\'édition' : 'La génération'} a échoué`)
      }

      return data.images
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(errorMessage)
      throw err
    } finally {
      setIsGenerating(false)
    }
  }

  const editImage = async (prompt: string, baseImageUrl: string): Promise<GeneratedImageData[]> => {
    return generateImages(prompt, baseImageUrl)
  }

  return {
    generateImages,
    editImage,
    isGenerating,
    error
  }
}
