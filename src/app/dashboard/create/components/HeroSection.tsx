"use client"

import { useState, useEffect } from "react"
import { IconSparkles } from "@tabler/icons-react"

interface HeroSectionProps {
  currentProject: { name: string } | null
  generatedVideos?: any[]
  onNewVideoAdded?: () => void
}

export function HeroSection({ currentProject, generatedVideos = [], onNewVideoAdded }: HeroSectionProps) {
  const [persistedVideos, setPersistedVideos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Charger les vidéos depuis la base au montage
  useEffect(() => {
    fetchUserVideos()
  }, [])

  // Recharger les vidéos quand une nouvelle est ajoutée
  useEffect(() => {
    if (onNewVideoAdded) {
      fetchUserVideos()
    }
  }, [generatedVideos.length])

  const fetchUserVideos = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/ai/videos/user')
      
      if (response.ok) {
        const data = await response.json()
        setPersistedVideos(data.videos || [])
      }
    } catch (error) {
      console.error('Erreur chargement vidéos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Combiner vidéos persistées + vidéos en mémoire temporaires
  const allVideos = [...persistedVideos, ...generatedVideos.filter(v => v.isGenerating)]
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
        // Afficher les vidéos générées
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-6">
            Generated Content
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {allVideos.map((video, index) => (
              <div key={index} className="relative aspect-[9/16] bg-muted rounded-lg overflow-hidden border border-border">
                {video.isGenerating ? (
                  // Pendant génération - juste l'image + loader
                  <>
                    <img
                      src={video.thumbnailUrl}
                      alt={video.prompt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  </>
                ) : (
                  // Vidéo générée - lecteur vidéo
                  <video
                    src={video.url}
                    poster={video.thumbnailUrl}
                    controls
                    className="w-full h-full object-cover"
                  >
                    Your browser does not support video.
                  </video>
                )}
              </div>
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
