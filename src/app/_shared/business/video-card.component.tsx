/**
 * @purpose: Composant card vidéo avec logique métier complète cross-features
 * @domain: video
 * @scope: global
 * @created: 2024-08-23
 */

"use client"

import { useState } from "react"
import { IconPlayerPlay, IconDownload, IconDots, IconTrash, IconEdit } from "@tabler/icons-react"
import { VideoCardProps } from '../config/video-types'

export function VideoCard({ video, onPlay, onDownload, onDelete, onRename }: VideoCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const isProcessing = video.status === "processing"
  const isReady = video.status === "ready"
  const isFailed = video.status === "failed"

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden group">
      <div className="relative aspect-square bg-muted overflow-hidden">
        <img 
          src={video.posterUrl} 
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.currentTarget.src = 'https://picsum.photos/400/400?random=' + video.id
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {isProcessing && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <div className="text-center text-white flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              <p className="text-sm font-medium drop-shadow-lg">Generating...</p>
            </div>
          </div>
        )}

        {isFailed && (
          <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center">
            <div className="text-center text-white flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <IconTrash className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium drop-shadow-lg">Generation failed</p>
            </div>
          </div>
        )}

        {isReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => onPlay?.(video)}
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors cursor-pointer"
            >
              <IconPlayerPlay className="w-6 h-6 text-white" fill="currentColor" />
            </button>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm"
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

        <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2">
          <h3 className="font-bold text-white text-sm drop-shadow-lg line-clamp-2">{video.title}</h3>
          
          {video.duration && (
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs bg-white/20 text-white rounded-md font-medium backdrop-blur-sm">
                {video.duration}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full font-medium">
            {new Date(video.createdAt).toLocaleDateString()}
          </span>
          {video.format && (
            <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full font-medium">
              {video.format}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}