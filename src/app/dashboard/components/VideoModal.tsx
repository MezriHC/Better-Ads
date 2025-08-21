"use client"

import { useEffect, useRef } from "react"
import { IconX } from "@tabler/icons-react"
import { VideoData } from "./VideoCard"

interface VideoModalProps {
  video: VideoData | null
  isOpen: boolean
  onClose: () => void
}

export function VideoModal({ video, isOpen, onClose }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Auto-play quand la modal s'ouvre
  useEffect(() => {
    if (isOpen && video?.videoUrl && videoRef.current) {
      videoRef.current.play().catch(console.error)
    }
  }, [isOpen, video])

  if (!isOpen || !video) return null

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-card rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{video.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Created on {new Date(video.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors cursor-pointer"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="flex-1 bg-black flex items-center justify-center">
          {video.videoUrl ? (
            <video
              ref={videoRef}
              src={video.videoUrl}
              className="max-w-full max-h-full"
              controls
              poster={video.posterUrl}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="text-center text-white p-8">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-lg font-medium mb-2">Video not available</p>
              <p className="text-sm text-white/70">
                {video.status === 'processing' && 'Video is still processing...'}
                {video.status === 'failed' && 'Video generation failed'}
              </p>
            </div>
          )}
        </div>

        {/* Footer avec actions */}
        <div className="p-4 bg-muted/50 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
              video.status === 'ready' ? 'bg-green-100 text-green-700' :
              video.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
            </span>
            {video.duration && <span>Duration: {video.duration}</span>}
          </div>
          
          {video.status === 'ready' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  // TODO: Implémenter le partage
                  navigator.clipboard.writeText(window.location.href)
                  alert('Link copied to clipboard!')
                }}
                className="px-3 py-1.5 bg-muted hover:bg-accent text-sm font-medium rounded-md transition-colors cursor-pointer"
              >
                Share
              </button>
              <button
                onClick={() => {
                  // TODO: Implémenter le download depuis la modal
                  if (video.videoUrl) {
                    const a = document.createElement('a')
                    a.href = video.videoUrl
                    a.download = `${video.title}.mp4`
                    a.click()
                  }
                }}
                className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-md transition-colors cursor-pointer"
              >
                Download
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}