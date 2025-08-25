"use client"

import { VideoGridProps } from '../config/video-types'
import { VideoCard } from './video-card.component'

export function VideoGrid({ 
  videos, 
  onPlay, 
  onDownload, 
  onDelete, 
  onRename,
  emptyMessage = "No videos yet. Create your first video to get started!" 
}: VideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-16 flex flex-col items-center gap-4">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
          <svg 
            className="w-10 h-10 text-muted-foreground" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
            />
          </svg>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-medium text-foreground">No videos yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            {emptyMessage}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onPlay={onPlay}
          onDownload={onDownload}
          onDelete={onDelete}
          onRename={onRename}
        />
      ))}
    </div>
  )
}