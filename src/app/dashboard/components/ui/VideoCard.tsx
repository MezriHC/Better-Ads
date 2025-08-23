"use client"

import { useState } from "react"
import { IconPlayerPlay, IconDownload, IconDots, IconTrash, IconEdit } from "@tabler/icons-react"

export interface VideoData {
  id: string
  title: string
  posterUrl: string
  videoUrl?: string
  status: "processing" | "ready" | "failed"
  progress?: number
  createdAt: string
  duration?: string
}

interface VideoCardProps {
  video: VideoData
  onPlay?: (video: VideoData) => void
  onDownload?: (video: VideoData) => void
  onDelete?: (video: VideoData) => void
  onRename?: (video: VideoData) => void
}

export function VideoCard({ video, onPlay, onDownload, onDelete, onRename }: VideoCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const isProcessing = video.status === "processing"
  const isReady = video.status === "ready"
  const isFailed = video.status === "failed"

  return (
    <div className="group relative bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-200 hover:shadow-lg">
      {/* Thumbnail Container */}
      <div className="relative aspect-video bg-muted">
        {/* Poster Image */}
        <img 
          src={video.posterUrl} 
          alt={video.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://picsum.photos/400/225?random=' + video.id
          }}
        />

        {/* Status Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm font-medium">Generating...</p>
              {video.progress && (
                <div className="mt-2 w-32 bg-white/20 rounded-full h-1.5">
                  <div 
                    className="bg-white rounded-full h-1.5 transition-all duration-300"
                    style={{ width: `${video.progress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        )}

        {isFailed && (
          <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
            <div className="text-center text-red-400">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <IconTrash className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium">Generation failed</p>
            </div>
          </div>
        )}

        {/* Play Button - Only for ready videos */}
        {isReady && (
          <button
            onClick={() => onPlay?.(video)}
            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
          >
            <div className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors">
              <IconPlayerPlay className="w-6 h-6 text-black ml-1" />
            </div>
          </button>
        )}

        {/* Actions Menu */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            >
              <IconDots className="w-4 h-4 text-white" />
            </button>

            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowMenu(false)}
                ></div>
                <div className="absolute top-full right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-xl z-20 overflow-hidden">
                  {isReady && (
                    <>
                      <button
                        onClick={() => {
                          onDownload?.(video)
                          setShowMenu(false)
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center gap-2 cursor-pointer"
                      >
                        <IconDownload className="w-4 h-4" />
                        Download
                      </button>
                      <button
                        onClick={() => {
                          onRename?.(video)
                          setShowMenu(false)
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted flex items-center gap-2 cursor-pointer"
                      >
                        <IconEdit className="w-4 h-4" />
                        Rename
                      </button>
                      <div className="h-px bg-border"></div>
                    </>
                  )}
                  <button
                    onClick={() => {
                      onDelete?.(video)
                      setShowMenu(false)
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2 cursor-pointer"
                  >
                    <IconTrash className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute bottom-3 left-3">
          {isProcessing && (
            <span className="px-2 py-1 bg-yellow-500/90 text-yellow-950 text-xs font-medium rounded-md">
              Processing
            </span>
          )}
          {isReady && video.duration && (
            <span className="px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md">
              {video.duration}
            </span>
          )}
          {isFailed && (
            <span className="px-2 py-1 bg-red-500/90 text-white text-xs font-medium rounded-md">
              Failed
            </span>
          )}
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date(video.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}