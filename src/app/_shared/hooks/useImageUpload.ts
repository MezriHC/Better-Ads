"use client"

import { useState } from 'react'

interface UseImageUploadReturn {
  uploadImage: (file: File) => Promise<string>
  isUploading: boolean
  error: string | null
}

export function useImageUpload(): UseImageUploadReturn {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadImage = async (file: File): Promise<string> => {
    if (!file) {
      throw new Error('Aucun fichier fourni')
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload-reference', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de l\'upload')
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'L\'upload a échoué')
      }

      return data.imageUrl
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(errorMessage)
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  return {
    uploadImage,
    isUploading,
    error
  }
}
