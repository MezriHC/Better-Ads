"use client"

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react"
import { VideoData, VideoShowcaseProps } from '../config/video-types'
import { VideoGrid } from './video-grid.component'

export interface VideoShowcaseRef {
  refreshAvatars: () => Promise<void>
}

export const VideoShowcase = forwardRef<VideoShowcaseRef, VideoShowcaseProps>(function VideoShowcase({ projectId, heroSection, onVideoPlay }, ref) {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  const hasGeneratedVideos = videos.length > 0

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

  // Exposer la fonction de refresh via useImperativeHandle
  useImperativeHandle(ref, () => ({
    refreshAvatars: loadProjectAvatars
  }), [projectId])

  const loadProjectAvatars = async () => {
    if (!projectId) return
    
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/projects/${projectId}/avatars`)
      if (!response.ok) {
        throw new Error('Failed to load avatars')
      }
      
      const data = await response.json()
      if (data.avatars && data.avatars.length > 0) {
      }
      setVideos(data.avatars || [])
    } catch (err) {
      console.error('[VideoShowcase] Error loading avatars:', err)
      setError('Failed to load avatars')
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
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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