"use client"

import React, { useState } from "react"
import Image from "next/image"
import { IconPlayerPlay, IconDownload, IconTrash, IconClock } from "@tabler/icons-react"

interface VideoData {
  id: string
  url: string
  thumbnailUrl: string
  prompt: string
  createdAt: string
  avatarId?: string
  projectName?: string
  status: "ready" | "processing" | "queued" | "failed"
  isGenerating?: boolean
}

interface VideoCardProps {
  video: VideoData
  onDelete?: (videoId: string) => void
}

export function VideoCard({ video, onDelete }: VideoCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)

  const handleDownload = async () => {
    if (!video.url || video.isGenerating) return
    
    setIsLoading(true)
    
    try {
      // Utiliser l'API proxy pour télécharger la vidéo
      const response = await fetch('/api/minio/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          url: video.url,
          filename: `video-${video.id}.mp4`
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `video-${video.id}.mp4`
        link.click()
        window.URL.revokeObjectURL(url)
      } else {
        throw new Error('Download failed')
      }
    } catch (error) {
      console.error('Download error:', error)
      // Fallback: ouvrir dans un nouvel onglet
      const link = document.createElement('a')
      link.href = video.url
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.click()
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = () => {
    switch (video.status) {
      case "processing":
      case "queued":
        return (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-orange-100/90 text-orange-800 rounded-full text-xs font-medium backdrop-blur-sm">
            <IconClock className="w-3 h-3" />
            Processing
          </div>
        )
      case "failed":
        return (
          <div className="absolute top-3 left-3 px-2 py-1 bg-red-100/90 text-red-800 rounded-full text-xs font-medium backdrop-blur-sm">
            Failed
          </div>
        )
      default:
        return null
    }
  }

  return (
    <>
      <div className="bg-card border border-border rounded-2xl overflow-hidden group cursor-pointer">
        <div className="relative h-72 overflow-hidden">
          {video.isGenerating || video.status === "processing" || video.status === "queued" ? (
            // État de génération ou processing
            <>
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Generating...</p>
                </div>
              </div>
              {getStatusBadge()}
            </>
          ) : video.status === "failed" ? (
            // État d'échec
            <>
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
                    ×
                  </div>
                  <p className="text-sm text-muted-foreground">Generation failed</p>
                </div>
              </div>
              {getStatusBadge()}
            </>
          ) : (
            // Vidéo prête
            <>
              <Image 
                src={video.thumbnailUrl || "https://picsum.photos/400/600?random=1"}
                alt={video.prompt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Play Button */}
              <div 
                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                onClick={() => setShowPlayer(true)}
              >
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <IconPlayerPlay className="w-6 h-6 text-white" fill="currentColor" />
                </div>
              </div>

              {/* Actions Overlay */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleDownload}
                  disabled={isLoading}
                  className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <IconDownload className="w-4 h-4" />
                  )}
                </button>
                
                {onDelete && (
                  <button
                    onClick={() => onDelete(video.id)}
                    className="w-8 h-8 rounded-full bg-red-500/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-600/80 transition-colors cursor-pointer"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                )}
              </div>

              {getStatusBadge()}
            </>
          )}
        </div>
        
        {/* Card Content */}
        <div className="p-3 flex flex-col gap-1">
          <h3 className="font-semibold text-card-foreground text-sm line-clamp-2">
            {video.prompt || "Generated Video"}
          </h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{video.projectName || "No Project"}</span>
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      {showPlayer && video.status === "ready" && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
          onClick={() => setShowPlayer(false)}
        >
          <div 
            className="bg-card rounded-2xl overflow-hidden max-w-sm w-full max-h-[90vh]" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <video 
                src={video.url}
                controls
                autoPlay
                className="w-full h-auto aspect-[9/16]"
                poster={video.thumbnailUrl}
              >
                Your browser does not support the video tag.
              </video>
              <button 
                onClick={() => setShowPlayer(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <h2 className="text-lg font-bold text-card-foreground line-clamp-2">
                {video.prompt}
              </h2>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{video.projectName}</span>
                <span>{new Date(video.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
