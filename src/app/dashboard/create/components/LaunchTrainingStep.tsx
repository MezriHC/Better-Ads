"use client"

import Image from "next/image"
import { IconMicrophone, IconDownload } from "@tabler/icons-react"
import { useEffect, useState, useCallback } from "react"
// TODO: Réimplémenter useAvatarGeneration
interface Avatar {
  id: string
  title: string
  videoUrl: string | null
  posterUrl: string
  status: 'processing' | 'ready' | 'failed'
  userId: string
  projectId: string
  createdAt: string
  updatedAt: string
  metadata: unknown
}
import { useProjects } from "@/src/app/_shared/hooks/useProjects"
import { logger } from "@/src/app/_shared/utils/logger"

interface GeneratedActor {
  id: string
  imageUrl: string
  description: string
}

interface LaunchTrainingStepProps {
  actor?: GeneratedActor | null
  selectedImageUrl?: string
  prompt?: string
  onVideoGenerated?: (video: any) => void
  onAvatarGenerationStarted?: (avatarData: any) => void
  onAvatarGenerationCompleted?: (avatar: any) => void
}

export function LaunchTrainingStep({ 
  actor, 
  selectedImageUrl,
  prompt,
  onVideoGenerated,
  onAvatarGenerationStarted,
  onAvatarGenerationCompleted
}: LaunchTrainingStepProps) {
  const [generatedAvatar, setGeneratedAvatar] = useState<Avatar | null>(null)
  const [downloadingVideo, setDownloadingVideo] = useState(false)
  const [hasStartedGeneration, setHasStartedGeneration] = useState(false)
  const [currentAvatarId, setCurrentAvatarId] = useState<string | null>(null)
  // TODO: Réimplémenter les hooks d'avatar
  const isGenerating = false
  const error = null
  const { currentProject } = useProjects()

  const handleGenerateAvatar = useCallback(async () => {
    if (!selectedImageUrl || !prompt || isGenerating || !currentProject?.id) {
      return
    }

    try {
      const { mockAvatarGeneration } = await import('../services/mockGeneration')
      const result = await mockAvatarGeneration(prompt, selectedImageUrl)
      
      const avatar: Avatar = {
        id: result.id,
        title: result.title,
        videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4',
        posterUrl: result.imageUrl,
        status: 'ready',
        userId: 'current-user',
        projectId: currentProject.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {}
      }
      
      setGeneratedAvatar(avatar)
      onAvatarGenerationCompleted?.(avatar)
    } catch (error) {
      logger.client.error('Erreur génération avatar:', error)
    }
  }, [selectedImageUrl, prompt, isGenerating, currentProject?.id, onAvatarGenerationCompleted])

  useEffect(() => {
    // Démarrer automatiquement la génération d'avatar UNE SEULE FOIS
    if (selectedImageUrl && prompt && !hasStartedGeneration && currentProject?.id && !isGenerating) {
      logger.client.info(`Démarrage génération avatar automatique`)
      setHasStartedGeneration(true)
      handleGenerateAvatar()
    }
  }, [selectedImageUrl, prompt, hasStartedGeneration, currentProject?.id, handleGenerateAvatar, isGenerating])
  
  // Nettoyer le polling quand le composant se démonte
  useEffect(() => {
    return () => {
      if (currentAvatarId) {
        // TODO: Réimplémenter stopPolling
      }
    }
  }, [currentAvatarId])

  const handleDownloadVideo = async () => {
    if (!generatedAvatar?.videoUrl) return
    
    setDownloadingVideo(true)
    
    try {
      // Récupérer la vidéo comme blob
      const response = await fetch(generatedAvatar.videoUrl)
      const blob = await response.blob()
      
      // Créer un URL temporaire pour le blob
      const url = window.URL.createObjectURL(blob)
      
      // Créer et déclencher le téléchargement
      const link = document.createElement('a')
      link.href = url
      link.download = `ai-avatar-video-${generatedAvatar.id}.mp4`
      link.click()
      
      // Nettoyer l'URL temporaire
      window.URL.revokeObjectURL(url)
      
    } catch {
      // En cas d'erreur, utiliser la méthode simple
      const link = document.createElement('a')
      link.href = generatedAvatar.videoUrl!
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
      {generatedAvatar?.status === 'ready' && generatedAvatar.videoUrl ? (
        /* UI une fois l'avatar généré - layout centré */
        <div className="flex flex-col items-center justify-center h-full">
          {/* Titre avec excitation ! */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              🎉 Your avatar is ready!
            </h3>
            <p className="text-base text-muted-foreground">
              You can watch it below or find it in your library
            </p>
          </div>

          {/* Container vidéo avec bouton download - taille augmentée */}
          <div className="relative group mb-8">
            <div className="w-64 aspect-[9/16] rounded-xl overflow-hidden border-2 border-border relative">
              <video 
                src={generatedAvatar.videoUrl}
                controls
                className="w-full h-full object-cover"
                poster={generatedAvatar.posterUrl}
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
                
                {/* Loading overlay when generating or processing */}
                {(isGenerating || generatedAvatar?.status === 'processing') && (
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
              {isGenerating ? "🎬 Starting generation..." : 
               generatedAvatar?.status === 'processing' ? "🎨 Creating your avatar..." : 
               generatedAvatar?.status === 'failed' ? "⚠️ Oops, an error!" : 
               error ? "⚠️ Oops, an error!" : "🎥 Ready to generate"}
            </h3>
            
            <div className="text-base text-muted-foreground mb-6">
              {isGenerating ? (
                <p>Preparing your avatar generation! ✨</p>
              ) : generatedAvatar?.status === 'processing' ? (
                <p>Creating your magical avatar video! This may take a few minutes...</p>
              ) : generatedAvatar?.status === 'failed' ? (
                <p className="text-red-500">Avatar generation failed. Please try again.</p>
              ) : error ? (
                <p className="text-red-500">Error: {error}</p>
              ) : (
                <p>Everything is ready to generate your avatar!</p>
              )}
            </div>

            {/* Bouton retry si erreur */}
            {(error || generatedAvatar?.status === 'failed') && (
              <button
                onClick={() => {
                  setHasStartedGeneration(false)
                  setGeneratedAvatar(null)
                  setCurrentAvatarId(null)
                  handleGenerateAvatar()
                }}
                disabled={isGenerating || generatedAvatar?.status === 'processing'}
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
