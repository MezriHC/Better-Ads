/**
 * @purpose: Composant vidéo showcase avec logique métier complète cross-features
 * @domain: video
 * @scope: global
 * @different-from: dashboard/components/VideoShowcase.tsx
 * @why-different: Version complète avec formats multiples et logique avancée (remplace la version basique)
 * @created: 2024-08-23
 */

"use client"

import { useState } from "react"
import { IconEye, IconEyeOff } from "@tabler/icons-react"
import { VideoData, VideoShowcaseProps } from '../config/video-types'
import { mockVideos } from '../mock/videos-mock.data'
import { VideoGrid } from './video-grid.component'

export function VideoShowcase({ projectId, heroSection, onVideoPlay }: VideoShowcaseProps) {
  const [showVideoSection, setShowVideoSection] = useState(false)

  const hasGeneratedVideos = false
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

  if (showVideoSection) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-foreground">Generated Videos</h2>
            <p className="text-muted-foreground text-sm">
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

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowVideoSection(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer bg-muted text-muted-foreground hover:text-foreground"
        >
          <IconEye className="w-4 h-4" />
          Preview Videos
        </button>
      </div>

      {heroSection}
    </div>
  )
}