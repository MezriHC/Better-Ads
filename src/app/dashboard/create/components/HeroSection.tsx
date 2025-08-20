"use client"

import { useState, useEffect } from "react"
import { IconSparkles } from "@tabler/icons-react"
import { VideoCardImproved } from "./VideoCardImproved"
import { logger } from "@/src/app/_shared/utils/logger"

interface HeroSectionProps {
  currentProject: { id: string; name: string } | null
  generatedVideos?: any[]
  onNewVideoAdded?: () => void
  videoRefreshTrigger?: number
}

export function HeroSection({ currentProject, generatedVideos = [], onNewVideoAdded, videoRefreshTrigger }: HeroSectionProps) {
  const [persistedVideos, setPersistedVideos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastFetchedProjectId, setLastFetchedProjectId] = useState<string | null>(null)

  // Charger les vidéos depuis la base au montage et changement de projet
  useEffect(() => {
    if (currentProject && currentProject.id !== lastFetchedProjectId) {
      fetchUserVideos()
      setLastFetchedProjectId(currentProject.id)
    }
  }, [currentProject, lastFetchedProjectId])

  // Recharger les vidéos quand le trigger change (nouvelle vidéo générée)
  useEffect(() => {
    if (currentProject && videoRefreshTrigger > 0) {
      logger.client.info('Trigger de refresh détecté, rechargement des vidéos...')
      fetchUserVideos()
    }
  }, [videoRefreshTrigger, currentProject])

  const fetchUserVideos = async () => {
    if (!currentProject) {
      logger.client.warn('Pas de projet sélectionné pour charger les vidéos')
      return
    }
    
    try {
      setIsLoading(true)
      logger.client.info(`Chargement des vidéos pour le projet: ${currentProject.id}`)
      
      const response = await fetch(`/api/ai/videos/user?projectId=${currentProject.id}`)
      
      if (response.ok) {
        const data = await response.json()
        setPersistedVideos(data.videos || [])
        logger.client.info(`${data.videos?.length || 0} vidéos chargées depuis la base`)
      } else {
        logger.client.error(`Erreur API vidéos: ${response.status}`)
      }
    } catch (error) {
      logger.client.error('Erreur lors du chargement des vidéos', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Combiner vidéos persistées + vidéos en mémoire temporaires
  // Garder les vidéos en génération même pendant les refresh
  const allVideos = [
    ...persistedVideos, 
    ...generatedVideos.filter(v => v.isGenerating || v.id.startsWith('temp-'))
  ]
  
  // Log pour debug
  useEffect(() => {
    logger.client.debug(`HeroSection - Vidéos totales: ${allVideos.length} (${persistedVideos.length} persistées + ${generatedVideos.filter(v => v.isGenerating || v.id.startsWith('temp-')).length} temporaires)`)
  }, [allVideos.length, persistedVideos.length, generatedVideos.length])
  return (
    <div className="text-center pt-8 pb-8">
      {currentProject && (
        <div className="mb-2">
          <span className="text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">
            Project: {currentProject.name}
          </span>
        </div>
      )}
      
      {allVideos.length > 0 ? (
        // Afficher les vidéos générées - Alignement à gauche professionnel
        <div className="w-full max-w-7xl mx-auto px-4 space-y-6">
          <div className="text-left">
            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
              Generated Content
            </h1>
            <p className="text-sm text-muted-foreground">
              {allVideos.length} video{allVideos.length > 1 ? 's' : ''} in your project
            </p>
          </div>
          
          {/* Grid responsive aligné à gauche */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-start">
            {allVideos.map((video, index) => (
              <VideoCardImproved
                key={index}
                video={video}
                onDelete={(videoId) => {
                  // TODO: Implement delete functionality
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        // Afficher le texte par défaut
        <>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
            Create videos with AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transform your ideas into captivating videos. Virtual actors, cinematic scenes, 
            professional b-rolls - everything is possible with just a few words.
          </p>
        </>
      )}
    </div>
  )
}
