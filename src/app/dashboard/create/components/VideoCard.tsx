"use client"

import { useState } from "react"
import { IconDownload, IconTrash, IconClock } from "@tabler/icons-react"

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

  const handleDownload = async () => {
    if (!video.url || video.isGenerating) return
    
    setIsLoading(true)
    
    try {
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
      }
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(video.id)
    }
  }

  if (video.isGenerating) {
    return (
      <div className="relative aspect-[9/16] bg-muted rounded-lg overflow-hidden border border-border">
        <img
          src={video.thumbnailUrl}
          alt={video.prompt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
        <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 rounded px-2 py-1">
          <IconClock className="w-3 h-3 inline mr-1" />
          Generating...
        </div>
      </div>
    )
  }

  return (
    <div className="relative aspect-[9/16] bg-muted rounded-lg overflow-hidden border border-border group">
      <video
        src={video.url}
        poster={video.thumbnailUrl}
        controls
        className="w-full h-full object-cover"
      >
        Your browser does not support video.
      </video>
      
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button
          onClick={handleDownload}
          disabled={isLoading}
          className="bg-black/50 hover:bg-black/70 text-white p-1.5 rounded text-xs disabled:opacity-50"
        >
          <IconDownload className="w-3 h-3" />
        </button>
        {onDelete && (
          <button
            onClick={handleDelete}
            className="bg-black/50 hover:bg-red-600/70 text-white p-1.5 rounded text-xs"
          >
            <IconTrash className="w-3 h-3" />
          </button>
        )}
      </div>
      
      <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 rounded px-2 py-1">
        {video.projectName && `${video.projectName} • `}
        {new Date(video.createdAt).toLocaleDateString()}
      </div>
    </div>
  )
}