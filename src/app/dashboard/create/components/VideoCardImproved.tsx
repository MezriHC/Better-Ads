"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { IconDownload, IconX, IconPlayerPlay } from "@tabler/icons-react"
import { logger } from "@/src/app/_shared/utils/logger"

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

export function VideoCardImproved({ video, onDelete }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [videoFormat, setVideoFormat] = useState<{ width: number; height: number; ratio: string } | null>(null)
  const previewVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (previewVideoRef.current) {
      if (isHovered && !video.isGenerating) {
        previewVideoRef.current.play()
      } else {
        previewVideoRef.current.pause()
        previewVideoRef.current.currentTime = 0
      }
    }
  }, [isHovered, video.isGenerating])

  // Détecter le format vidéo réel (seulement si pas déjà détecté)
  useEffect(() => {
    if (video.url && !video.isGenerating && !videoFormat) {
      logger.client.debug(`Détection format vidéo: ${video.id}`)
      
      const testVideo = document.createElement('video')
      testVideo.onloadedmetadata = () => {
        const width = testVideo.videoWidth
        const height = testVideo.videoHeight
        const ratio = (width / height).toFixed(2)
        
        setVideoFormat({ width, height, ratio })
        logger.client.info(`Format vidéo détecté: ${width}x${height} (ratio: ${ratio})`)
        logger.video.format.detected(video.url, width, height)
      }
      testVideo.onerror = (error) => {
        logger.client.error(`Erreur détection format vidéo: ${video.id}`, error)
      }
      testVideo.src = video.url
      
      // Cleanup
      return () => {
        testVideo.onloadedmetadata = null
        testVideo.onerror = null
      }
    }
  }, [video.url, video.isGenerating, videoFormat, video.id])

  const handleDownload = async () => {
    if (!video.url || video.isGenerating) return
    
    setIsDownloading(true)
    logger.client.info(`Début téléchargement vidéo: ${video.id}`)
    
    try {
      // Téléchargement direct depuis l'URL proxy
      const response = await fetch(video.url)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `video-${video.id}.mp4`
        link.click()
        window.URL.revokeObjectURL(url)
        logger.client.info(`Téléchargement vidéo réussi: ${video.id}`)
      } else {
        logger.client.error(`Erreur téléchargement vidéo: ${response.status}`)
      }
    } catch (error) {
      logger.client.error(`Erreur téléchargement vidéo: ${video.id}`, error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(video.id)
    }
  }

  // Calculer le ratio d'affichage optimal basé sur le format vidéo réel
  const displayAspectRatio = useMemo(() => {
    if (videoFormat) {
      const ratio = videoFormat.width / videoFormat.height
      
      // Portraits stricts (9:16 = 0.56, 3:4 = 0.75)
      if (ratio <= 0.65) return 'aspect-[9/16]'
      if (ratio <= 0.8) return 'aspect-[3/4]'
      // Carrés (1:1 = 1.0)
      if (ratio >= 0.9 && ratio <= 1.1) return 'aspect-square'
      // Paysages (4:3 = 1.33, 16:9 = 1.78)
      if (ratio <= 1.4) return 'aspect-[4/3]'
      return 'aspect-[16/9]'
    }
    // Défaut si format pas encore détecté
    return 'aspect-[4/3]'
  }, [videoFormat])
  
  // Log le format détecté une seule fois quand videoFormat change
  useEffect(() => {
    if (videoFormat) {
      const ratio = videoFormat.width / videoFormat.height
      if (ratio <= 0.65) {
        logger.client.info('Format détecté: Portrait 9:16')
      } else if (ratio <= 0.8) {
        logger.client.info('Format détecté: Portrait 3:4')
      } else if (ratio >= 0.9 && ratio <= 1.1) {
        logger.client.info('Format détecté: Carré 1:1')
      } else if (ratio <= 1.4) {
        logger.client.info('Format détecté: Paysage 4:3')
      } else {
        logger.client.info('Format détecté: Paysage 16:9')
      }
    }
  }, [videoFormat])

  if (video.isGenerating) {
    // Pour les vidéos en génération, utiliser un ratio portrait par défaut (9:16)
    // car les avatars sont généralement en portrait
    return (
      <div className={`relative w-full aspect-[9/16] max-w-[220px]`}>
        {/* Gradient border effect */}
        <div className="p-[1px] rounded-xl bg-gradient-to-b from-border/50 to-transparent h-full">
          <div className="bg-card border border-border/50 rounded-xl overflow-hidden h-full relative">
            <img
              src={video.thumbnailUrl}
              alt={video.prompt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="absolute bottom-2 left-2 right-2">
              <div className="bg-background/95 backdrop-blur-sm rounded-md px-2 py-1.5">
                <div className="text-xs text-muted-foreground">Generating...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={`relative w-full ${displayAspectRatio} max-w-[220px]`}>
        {/* Gradient border effect */}
        <div className="p-[1px] rounded-xl bg-gradient-to-b from-border/30 to-transparent hover:from-primary/20 transition-all duration-300 h-full">
          <div 
            className="bg-card border border-border/50 rounded-xl overflow-hidden h-full relative group cursor-pointer hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setShowPopup(true)}
          >
            {/* Video preview (invisible, for hover effect) */}
            <video
              ref={previewVideoRef}
              src={video.url}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
            />
            
            {/* Thumbnail overlay (visible by default, hidden on hover) */}
            <div className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
              <img
                src={video.thumbnailUrl}
                alt={video.prompt}
                className="w-full h-full object-cover"
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-black/30 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center">
                  <IconPlayerPlay className="w-4 h-4 text-white ml-0.5" />
                </div>
              </div>
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Content overlay */}
            <div className="absolute bottom-2 left-2 right-2">
              <div className="bg-background/95 backdrop-blur-sm rounded-md px-2 py-1.5">
                <div className="text-xs font-medium text-foreground truncate">{video.prompt}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-between mt-0.5">
                  <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-1">
                    {videoFormat && (
                      <span className="bg-primary/20 text-primary px-1 py-0.5 rounded text-xs">
                        {videoFormat.width}x{videoFormat.height}
                      </span>
                    )}
                    {video.projectName && <span className="truncate">{video.projectName}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Hover actions */}
            <div className={`absolute top-2 right-2 flex gap-1 transition-all duration-200 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownload()
                }}
                disabled={isDownloading}
                className="w-7 h-7 bg-background/95 backdrop-blur-sm border border-border/50 rounded-md flex items-center justify-center hover:bg-background hover:border-border transition-all disabled:opacity-50"
              >
                <IconDownload className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowPopup(false)}
          />
          
          {/* Modal content */}
          <div className="relative w-full max-w-2xl mx-4">
            <div className="p-[1px] rounded-2xl bg-gradient-to-b from-border/50 to-transparent">
              <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
                {/* Video player */}
                <div className="aspect-video relative">
                  <video
                    src={video.url}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  >
                    Your browser does not support video.
                  </video>
                </div>
                
                {/* Modal footer */}
                <div className="p-4 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{video.prompt}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(video.createdAt).toLocaleDateString()} 
                        {video.projectName && ` • ${video.projectName}`}
                      </p>
                    </div>
                    <button
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {isDownloading ? 'Downloading...' : 'Download'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Close button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors"
            >
              <IconX className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}