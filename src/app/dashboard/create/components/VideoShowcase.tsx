"use client"

import { useState } from "react"
import { VideoGrid } from "./VideoGrid"
import { VideoData } from "./VideoCard"
import { IconEye, IconEyeOff } from "@tabler/icons-react"

// Mock data pour tester tous les états et formats
const mockVideos: VideoData[] = [
  // Vidéos ready - Format 16:9 (horizontal)
  {
    id: "video-1",
    title: "Product Demo - Nike Shoes",
    posterUrl: "https://picsum.photos/400/225?random=1",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
    status: "ready",
    duration: "0:45",
    createdAt: "2024-01-15T10:00:00Z",
    format: "16:9"
  },
  {
    id: "video-2", 
    title: "AI Avatar Presentation",
    posterUrl: "https://picsum.photos/400/225?random=2",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
    status: "ready",
    duration: "1:23",
    createdAt: "2024-01-14T15:30:00Z",
    format: "16:9"
  },
  
  // Vidéos ready - Format 9:16 (vertical)
  {
    id: "video-3",
    title: "Vertical Story",
    posterUrl: "https://picsum.photos/225/400?random=3", 
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
    status: "ready",
    duration: "0:30",
    createdAt: "2024-01-13T09:15:00Z",
    format: "9:16"
  },
  {
    id: "video-4",
    title: "Mobile First Video",
    posterUrl: "https://picsum.photos/225/400?random=4",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
    status: "ready",
    duration: "1:00",
    createdAt: "2024-01-12T16:45:00Z",
    format: "9:16"
  },
  
  // Vidéos ready - Format 1:1 (carré)
  {
    id: "video-5",
    title: "Square Social Post",
    posterUrl: "https://picsum.photos/400/400?random=5",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
    status: "ready",
    duration: "0:15",
    createdAt: "2024-01-11T14:20:00Z",
    format: "1:1"
  },
  {
    id: "video-6",
    title: "Instagram Square",
    posterUrl: "https://picsum.photos/400/400?random=6",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
    status: "ready",
    duration: "0:28",
    createdAt: "2024-01-10T11:30:00Z",
    format: "1:1"
  },
  
  // Vidéos en processing - différents formats
  {
    id: "video-7",
    title: "Marketing Campaign",
    posterUrl: "https://picsum.photos/400/225?random=7",
    status: "processing",
    createdAt: "2024-01-16T14:20:00Z",
    format: "16:9"
  },
  {
    id: "video-8",
    title: "Story Generation",
    posterUrl: "https://picsum.photos/225/400?random=8",
    status: "processing",
    createdAt: "2024-01-16T16:45:00Z",
    format: "9:16"
  },
  {
    id: "video-9",
    title: "Square Ad",
    posterUrl: "https://picsum.photos/400/400?random=9",
    status: "processing",
    createdAt: "2024-01-16T18:30:00Z",
    format: "1:1"
  },
  
  // Vidéos failed - différents formats
  {
    id: "video-10",
    title: "Horizontal Campaign",
    posterUrl: "https://picsum.photos/400/225?random=10",
    status: "failed",
    createdAt: "2024-01-12T11:30:00Z",
    format: "16:9"
  },
  {
    id: "video-11",
    title: "Vertical Story",
    posterUrl: "https://picsum.photos/225/400?random=11",
    status: "failed",
    createdAt: "2024-01-12T09:15:00Z",
    format: "9:16"
  }
]

interface VideoShowcaseProps {
  projectId?: string
  heroSection?: React.ReactNode
  onVideoPlay?: (video: VideoData) => void
}

export function VideoShowcase({ projectId, heroSection, onVideoPlay }: VideoShowcaseProps) {
  const [showVideoSection, setShowVideoSection] = useState(false)

  // En vrai, on ferait un fetch des vidéos du projet
  // Pour l'instant, on utilise toujours les mock data pour montrer tous les formats
  const hasGeneratedVideos = false // Simule qu'on n'a pas encore de vraies vidéos générées
  const videos = mockVideos

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
        console.error('Download failed:', error)
        alert('Download failed. Please try again.')
      }
    }
  }

  const handleDelete = (video: VideoData) => {
    if (confirm(`Are you sure you want to delete "${video.title}"?`)) {
      console.log('Deleting video:', video.id)
      // TODO: Implémenter la suppression réelle
    }
  }

  const handleRename = (video: VideoData) => {
    const newTitle = prompt('Enter new title:', video.title)
    if (newTitle && newTitle.trim() !== video.title) {
      console.log('Renaming video:', video.id, 'to:', newTitle)
      // TODO: Implémenter le renommage réel
    }
  }

  // Si on affiche les vidéos, on affiche la section vidéos
  if (showVideoSection) {
    return (
      <div className="space-y-4">
        {/* Header avec toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Generated Videos</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Videos being generated or ready to view
            </p>
          </div>
          
          <button
            onClick={() => setShowVideoSection(false)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-primary text-primary-foreground"
          >
            <IconEyeOff className="w-4 h-4" />
            Hide Videos
          </button>
        </div>

        {/* Video Grid */}
        <VideoGrid
          videos={videos}
          onPlay={handlePlay}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onRename={handleRename}
          emptyMessage="No videos generated yet. Start creating below!"
        />

      </div>
    )
  }

  // Sinon, on affiche la HeroSection avec un toggle pour voir les vidéos
  return (
    <div className="space-y-4">
      {/* Toggle pour afficher les vidéos */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowVideoSection(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-muted text-muted-foreground hover:text-foreground"
        >
          <IconEye className="w-4 h-4" />
          Preview Videos
        </button>
      </div>

      {/* Hero Section */}
      {heroSection}
    </div>
  )
}