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

  useEffect(() => {
    if (isOpen && video?.videoUrl && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [isOpen, video])

  const getModalSize = () => {
    if (!video?.format) return "max-w-4xl" // Défaut
    
    switch (video.format) {
      case "9:16": return "max-w-md" // Vertical - plus étroit
      case "1:1": return "max-w-2xl" // Carré - taille moyenne
      case "16:9": 
      default: return "max-w-4xl" // Horizontal - large
    }
  }


  if (!isOpen || !video) return null

  return (
    <div 
      className="fixed inset-0 bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
      style={{ zIndex: 999999, position: 'fixed' }}
    >
      <div 
        className={`relative ${getModalSize()} w-full max-h-[95vh] rounded-2xl overflow-hidden bg-black shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Boutons en haut à droite */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {/* Bouton Download */}
          {video.status === 'ready' && video.videoUrl && (
            <button
              onClick={() => {
                if (video.videoUrl) {
                  const a = document.createElement('a')
                  a.href = video.videoUrl
                  a.download = `${video.title}.mp4`
                  a.click()
                }
              }}
              className="w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer backdrop-blur-sm"
              title="Download video"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v12m0 0l-4-4m4 4l4-4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 21h14" />
              </svg>
            </button>
          )}
          
          {/* Bouton fermer */}
          <button
            onClick={onClose}
            className="w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-all hover:scale-110 cursor-pointer backdrop-blur-sm"
            title="Close"
          >
            <IconX className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Video Player - Plein écran */}
        <div className="w-full h-full">
          {video.videoUrl ? (
            <video
              ref={videoRef}
              src={video.videoUrl}
              className="w-full h-full object-contain rounded-2xl"
              controls
              poster={video.posterUrl}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-center text-white">
              <div>
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}