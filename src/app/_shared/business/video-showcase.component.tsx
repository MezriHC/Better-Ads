"use client"

import { useState, useEffect } from "react"
import { VideoData, VideoShowcaseProps } from '../config/video-types'
import { VideoGrid } from './video-grid.component'

export function VideoShowcase({ projectId, heroSection, onVideoPlay }: VideoShowcaseProps) {
  const [videos, setVideos] = useState<VideoData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasGeneratedVideos = videos.length > 0

  // Charger les avatars du projet
  useEffect(() => {
    if (projectId) {
      loadProjectAvatars()
    }
  }, [projectId])

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
      setVideos(data.avatars || [])
    } catch (err) {
      console.error('[VideoShowcase] Error loading avatars:', err)
      setError('Failed to load avatars')
      setVideos([])
    } finally {
      setLoading(false)
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

  // Si on a des avatars, afficher la section avatars
  if (hasGeneratedVideos || loading || error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-foreground">
              Generated Avatars {hasGeneratedVideos && `(${videos.length})`}
            </h2>
            <p className="text-muted-foreground text-sm">
              {loading ? 'Loading avatars...' : 
               error ? 'Error loading avatars' :
               hasGeneratedVideos ? 'Avatars ready to view and download' : 
               'No avatars generated yet for this project'}
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
            emptyMessage="No avatars generated yet for this project. Start creating below!"
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
}