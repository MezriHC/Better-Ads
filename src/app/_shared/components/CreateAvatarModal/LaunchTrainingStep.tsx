"use client"

import Image from "next/image"
import { IconMicrophone, IconDownload } from "@tabler/icons-react"
import { useEffect, useState, useCallback } from "react"
import { useVideoGeneration } from "../../hooks/useVideoGeneration"
import { GeneratedVideoData } from "../../types/seedance"

interface GeneratedActor {
  id: string
  imageUrl: string
  description: string
}

interface LaunchTrainingStepProps {
  actor?: GeneratedActor | null
  selectedImageUrl?: string
  prompt?: string
}

export function LaunchTrainingStep({ 
  actor, 
  selectedImageUrl,
  prompt 
}: LaunchTrainingStepProps) {
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideoData | null>(null)
  const [downloadingVideo, setDownloadingVideo] = useState(false)
  const [hasStartedGeneration, setHasStartedGeneration] = useState(false)
  const { generateVideo, isGenerating, error } = useVideoGeneration()

  const handleGenerateVideo = useCallback(async () => {
    if (!selectedImageUrl || !prompt) {
      return
    }

    // Vérifier que l'URL est valide
    if (!selectedImageUrl.includes('fal.media')) {
      return
    }
    
    const video = await generateVideo(prompt, selectedImageUrl)
    if (video) {
      setGeneratedVideo(video)
    }
  }, [selectedImageUrl, prompt, generateVideo])

  useEffect(() => {
    // Démarrer automatiquement la génération vidéo UNE SEULE FOIS
    if (selectedImageUrl && prompt && !hasStartedGeneration) {
      setHasStartedGeneration(true)
      handleGenerateVideo()
    }
  }, [selectedImageUrl, prompt, hasStartedGeneration, handleGenerateVideo])

  const handleDownloadVideo = async () => {
    if (!generatedVideo) return
    
    setDownloadingVideo(true)
    
    try {
      // Récupérer la vidéo comme blob
      const response = await fetch(generatedVideo.url)
      const blob = await response.blob()
      
      // Créer un URL temporaire pour le blob
      const url = window.URL.createObjectURL(blob)
      
      // Créer et déclencher le téléchargement
      const link = document.createElement('a')
      link.href = url
      link.download = `ai-avatar-video-${generatedVideo.id}.mp4`
      link.click()
      
      // Nettoyer l'URL temporaire
      window.URL.revokeObjectURL(url)
      
    } catch {
      // En cas d'erreur, utiliser la méthode simple
      const link = document.createElement('a')
      link.href = generatedVideo.url
      link.target = '_blank'
      link.click()
    } finally {
      setTimeout(() => {
        setDownloadingVideo(false)
      }, 1000)
    }
  }

  return (
    <div className="flex-1 p-8">
      {generatedVideo ? (
        /* UI une fois la vidéo générée - layout centré */
        <div className="flex flex-col items-center justify-center h-full">
          {/* Titre avec excitation ! */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              🎉 Your video is ready!
            </h3>
            <p className="text-base text-muted-foreground">
              You can watch it below or find it in your library
            </p>
          </div>

          {/* Container vidéo avec bouton download - taille augmentée */}
          <div className="relative group mb-8">
            <div className="w-64 aspect-[9/16] rounded-xl overflow-hidden border-2 border-border relative">
              <video 
                src={generatedVideo.url}
                controls
                className="w-full h-full object-cover"
                poster={selectedImageUrl}
              >
                Votre navigateur ne supporte pas les vidéos.
              </video>
              
              {/* Bouton téléchargement en overlay */}
              <button
                onClick={handleDownloadVideo}
                className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm ${
                  downloadingVideo
                    ? 'bg-foreground scale-110 animate-pulse'
                    : 'bg-background/90 hover:bg-background hover:scale-105'
                }`}
              >
                {downloadingVideo ? (
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                ) : (
                  <IconDownload className="w-4 h-4 text-foreground" />
                )}
              </button>
            </div>
          </div>


        </div>
      ) : (
        /* UI pendant la génération ou erreur - layout centré */
        <div className="flex flex-col items-center justify-center h-full">
          {/* Preview pendant génération - taille contrôlée */}
          <div className="mb-6">
            <div className="relative w-48 aspect-[9/16] mx-auto">
              <div className="w-full h-full bg-muted rounded-xl overflow-hidden relative border-2 border-border">
                {selectedImageUrl ? (
                  <Image
                    src={selectedImageUrl}
                    alt="Your avatar"
                    fill
                    sizes="192px"
                    className="object-cover"
                  />
                ) : actor ? (
                  <Image
                    src={actor.imageUrl}
                    alt="Your avatar"
                    fill
                    sizes="192px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                      <IconMicrophone className="w-6 h-6 text-muted-foreground" />
                    </div>
                  </div>
                )}
                
                {/* Loading overlay when generating */}
                {isGenerating && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status avec enthousiasme */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground mb-3">
              {isGenerating ? "🎬 Generating..." : error ? "⚠️ Oops, an error!" : "🚀 Preparing..."}
            </h3>
            
            <div className="text-base text-muted-foreground mb-6">
              {isGenerating ? (
                <p>Creating your magical video! ✨</p>
              ) : error ? (
                <p className="text-red-500">Error: {error}</p>
              ) : (
                <p>We&apos;re preparing something incredible for you...</p>
              )}
            </div>

            {/* Bouton retry si erreur */}
            {error && (
              <button
                onClick={() => {
                  setHasStartedGeneration(false)
                  handleGenerateVideo()
                }}
                disabled={isGenerating}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors cursor-pointer disabled:opacity-50"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
