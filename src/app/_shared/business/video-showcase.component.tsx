"use client"

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react"
import { VideoData, VideoShowcaseProps } from '../config/video-types'
import { VideoGrid } from './video-grid.component'

export interface VideoShowcaseRef {
  refreshAvatars: () => Promise<void>
  addProcessingVideo: (video: VideoData) => void
}

export const VideoShowcase = forwardRef<VideoShowcaseRef, VideoShowcaseProps>(function VideoShowcase({ projectId, heroSection, onVideoPlay }, ref) {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const hasGeneratedVideos = videos.length > 0
  const hasProcessingVideos = videos.some(v => v.status === 'processing')

  // Charger les avatars du projet avec reset complet des états
  useEffect(() => {
    if (projectId) {
      // 🔥 RESET IMMÉDIAT des anciens états pour éviter le clignotement
      setVideos([])           // Clear videos from previous project
      setError(null)          // Clear previous errors  
      setHasLoaded(false)     // Reset loaded state
      
      // Puis charger nouveau projet
      loadProjectAvatars()
    } else {
      // Reset complet si pas de projet
      setVideos([])
      setError(null)
      setHasLoaded(false)
      setLoading(false)
    }
  }, [projectId])

  // Polling intelligent - Update uniquement les vidéos processing
  const updateProcessingVideos = async () => {
    if (!projectId) return
    
    try {
      const processingVideos = videos.filter(v => v.status === 'processing')
      if (processingVideos.length === 0) return

      // Charger toutes les vidéos pour trouver les mises à jour
      const [avatarsResponse, brollsResponse] = await Promise.all([
        fetch(`/api/projects/${projectId}/avatars`),
        fetch(`/api/projects/${projectId}/brolls`)
      ])
      
      const allUpdatedVideos: VideoData[] = []
      
      if (avatarsResponse.ok) {
        const avatarsData = await avatarsResponse.json()
        if (avatarsData.avatars) {
          allUpdatedVideos.push(...avatarsData.avatars)
        }
      }
      
      if (brollsResponse.ok) {
        const brollsData = await brollsResponse.json()
        if (Array.isArray(brollsData)) {
          allUpdatedVideos.push(...brollsData)
        }
      }

      // Mettre à jour seulement les vidéos qui ont changé de statut
      setVideos(prevVideos => 
        prevVideos.map(video => {
          if (video.status !== 'processing') return video
          
          const updatedVideo = allUpdatedVideos.find(v => v.id === video.id)
          return updatedVideo && updatedVideo.status !== 'processing' ? updatedVideo : video
        })
      )
    } catch (error) {
      console.error('Erreur mise à jour vidéos processing:', error)
    }
  }

  // Polling automatique pour les vidéos en cours de génération
  useEffect(() => {
    if (hasProcessingVideos && projectId) {
      pollingIntervalRef.current = setInterval(updateProcessingVideos, 5000)
    } else {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [hasProcessingVideos, projectId, videos])

  // Ajouter une vidéo en cours de génération instantanément
  const addProcessingVideo = (newVideo: VideoData) => {
    setVideos(prevVideos => [newVideo, ...prevVideos])
  }

  // Exposer la fonction de refresh via useImperativeHandle
  useImperativeHandle(ref, () => ({
    refreshAvatars: loadProjectAvatars,
    addProcessingVideo
  }), [projectId])

  const loadProjectAvatars = async () => {
    if (!projectId) return
    
    try {
      setLoading(true)
      setError(null)
      
      // Charger les avatars et les B-rolls en parallèle
      const [avatarsResponse, brollsResponse] = await Promise.all([
        fetch(`/api/projects/${projectId}/avatars`),
        fetch(`/api/projects/${projectId}/brolls`)
      ])
      
      const allVideos: VideoData[] = []
      
      // Traiter les avatars
      if (avatarsResponse.ok) {
        const avatarsData = await avatarsResponse.json()
        if (avatarsData.avatars) {
          allVideos.push(...avatarsData.avatars)
        }
      }
      
      // Traiter les B-rolls
      if (brollsResponse.ok) {
        const brollsData = await brollsResponse.json()
        if (Array.isArray(brollsData)) {
          allVideos.push(...brollsData)
        }
      }
      
      // Trier par date de création (plus récent en premier)
      allVideos.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      setVideos(allVideos)
    } catch (err) {
      console.error('[VideoShowcase] Error loading content:', err)
      setError('Failed to load content')
      setVideos([])
    } finally {
      setLoading(false)
      setHasLoaded(true)
    }
  }

  const handlePlay = (video: VideoData) => {
    onVideoPlay?.(video)
  }

  const handleDownload = async (video: VideoData) => {
    if (video.videoUrl) {
      try {
        const response = await fetch(video.videoUrl)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${video.title}.mp4`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } catch (error) {
        alert('Download failed. Please try again.')
      }
    }
  }

  const handleDelete = (video: VideoData) => {
    if (confirm(`Are you sure you want to delete "${video.title}"?`)) {
    }
  }

  const handleRename = (video: VideoData) => {
    const newTitle = prompt('Enter new title:', video.title)
    if (newTitle && newTitle.trim() !== video.title) {
    }
  }

  // Logique d'affichage améliorée
  const shouldShowGeneratedContent = hasLoaded && (hasGeneratedVideos || error)

  // Afficher loader pendant le chargement initial
  if (!hasLoaded && loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  // Si on a des contenus OU une erreur, afficher la section contenu
  if (shouldShowGeneratedContent) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-foreground">
              Generated Content {hasGeneratedVideos && `(${videos.length})`}
            </h2>
            <p className="text-muted-foreground text-sm">
              {loading ? 'Loading content...' : 
               error ? 'Error loading content' :
               hasGeneratedVideos ? 'Content ready to view and download' : 
               'No content generated yet for this project'}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={loadProjectAvatars}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : (
          <VideoGrid
            videos={videos}
            onPlay={handlePlay}
            onDownload={handleDownload}
            onDelete={handleDelete}
            onRename={handleRename}
            emptyMessage="No content generated yet for this project. Start creating below!"
          />
        )}
      </div>
    )
  }

  // Si pas d'avatars, afficher le contenu de base (heroSection)
  return (
    <div className="space-y-4">
      {heroSection}
    </div>
  )
})