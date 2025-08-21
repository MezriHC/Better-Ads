"use client"

import { useState } from "react"
import { VideoGrid } from "./VideoGrid"
import { VideoData } from "./VideoCard"
import { VideoModal } from "./VideoModal"
import { IconEye, IconEyeOff } from "@tabler/icons-react"

// Mock data pour tester tous les états
const mockVideos: VideoData[] = [
  // Vidéos ready
  {
    id: "video-1",
    title: "Product Demo - Nike Shoes",
    posterUrl: "https://picsum.photos/400/225?random=1",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
    status: "ready",
    duration: "0:45",
    createdAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "video-2", 
    title: "AI Avatar Presentation",
    posterUrl: "https://picsum.photos/400/225?random=2",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
    status: "ready",
    duration: "1:23",
    createdAt: "2024-01-14T15:30:00Z"
  },
  {
    id: "video-3",
    title: "Brand Story Video",
    posterUrl: "https://picsum.photos/400/225?random=3", 
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4",
    status: "ready",
    duration: "2:15",
    createdAt: "2024-01-13T09:15:00Z"
  },
  
  // Vidéos en processing
  {
    id: "video-4",
    title: "Marketing Campaign Video",
    posterUrl: "https://picsum.photos/400/225?random=4",
    status: "processing",
    progress: 65,
    createdAt: "2024-01-16T14:20:00Z"
  },
  {
    id: "video-5",
    title: "Tutorial Video",
    posterUrl: "https://picsum.photos/400/225?random=5",
    status: "processing", 
    progress: 30,
    createdAt: "2024-01-16T16:45:00Z"
  },
  
  // Vidéo failed
  {
    id: "video-6",
    title: "Failed Generation Test",
    posterUrl: "https://picsum.photos/400/225?random=6",
    status: "failed",
    createdAt: "2024-01-12T11:30:00Z"
  }
]

interface VideoShowcaseProps {
  projectId?: string
}

export function VideoShowcase({ projectId }: VideoShowcaseProps) {
  const [showMockData, setShowMockData] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null)

  // En vrai, on ferait un fetch des vidéos du projet
  const videos = showMockData ? mockVideos : []

  const handlePlay = (video: VideoData) => {
    setSelectedVideo(video)
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

  return (
    <div className="space-y-6">
      {/* Toggle pour voir les mock data */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Your Videos</h2>
          <p className="text-muted-foreground mt-1">
            {projectId ? `Videos for current project` : 'All your generated videos'}
          </p>
        </div>
        
        <button
          onClick={() => setShowMockData(!showMockData)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            showMockData 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground hover:text-foreground'
          }`}
        >
          {showMockData ? <IconEye className="w-4 h-4" /> : <IconEyeOff className="w-4 h-4" />}
          {showMockData ? 'Hide Mock Data' : 'Show Mock Data'}
        </button>
      </div>

      {/* Stats */}
      {videos.length > 0 && (
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {videos.filter(v => v.status === 'ready').length}
            </div>
            <div className="text-sm text-muted-foreground">Ready</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {videos.filter(v => v.status === 'processing').length}
            </div>
            <div className="text-sm text-muted-foreground">Processing</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {videos.filter(v => v.status === 'failed').length}
            </div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </div>
        </div>
      )}

      {/* Video Grid */}
      <VideoGrid
        videos={videos}
        onPlay={handlePlay}
        onDownload={handleDownload}
        onDelete={handleDelete}
        onRename={handleRename}
        emptyMessage="No videos in this project yet. Go to Create to generate your first video!"
      />

      {/* Video Modal */}
      <VideoModal
        video={selectedVideo}
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  )
}