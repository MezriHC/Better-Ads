"use client"

import { useState, useEffect } from "react"
import { logger } from "@/src/app/_shared/utils/logger"

interface HeroSectionProps {
  currentProject: { id: string; name: string } | null
}

export function HeroSection({ currentProject }: HeroSectionProps) {
  const [isLoading, setIsLoading] = useState(false)

  // TODO: Réimplémenter le chargement des vidéos
  const fetchUserVideos = async () => {
    if (!currentProject) {
      logger.client.warn('Pas de projet sélectionné pour charger les vidéos')
      return
    }
    
    try {
      setIsLoading(true)
      logger.client.info(`TODO: Charger les vidéos pour le projet: ${currentProject.id}`)
      
      // TODO: Réimplémenter le chargement des vidéos
      
    } catch (error) {
      logger.client.error('Erreur lors du chargement des contenus', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Charger les vidéos au changement de projet
  useEffect(() => {
    if (currentProject) {
      fetchUserVideos()
    }
  }, [currentProject])

  // TODO: Remplacer par des vraies vidéos
  const allVideos: any[] = []

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
        // TODO: Afficher les vidéos générées
        <div className="w-full max-w-7xl mx-auto px-4 space-y-6">
          <div className="text-left">
            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
              Generated Content
            </h1>
            <p className="text-sm text-muted-foreground">
              {allVideos.length} video{allVideos.length > 1 ? 's' : ''} in your project
            </p>
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