"use client"

import React from "react"
import { VideoCard } from "./VideoCard"

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

interface VideoGridProps {
  videos: VideoData[]
  onDeleteVideo?: (videoId: string) => void
  title?: string
  emptyMessage?: string
  className?: string
}

export function VideoGrid({ 
  videos, 
  onDeleteVideo, 
  title = "Generated Videos",
  emptyMessage = "No videos generated yet. Create your first AI video!",
  className = ""
}: VideoGridProps) {
  
  if (videos.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No videos yet</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {emptyMessage}
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
          <p className="text-muted-foreground">
            {videos.length} video{videos.length > 1 ? 's' : ''} generated
          </p>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <div className="flex gap-4" style={{ width: 'max-content' }}>
          {videos.map((video) => (
            <div
              key={video.id}
              style={{
                width: '220px',
                flexShrink: 0
              }}
            >
              <VideoCard 
                video={video} 
                onDelete={onDeleteVideo}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
