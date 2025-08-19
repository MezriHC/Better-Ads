"use client"

import React, { useState } from "react"
import Image from "next/image"
import { IconPlayerPlay, IconDownload, IconTrash, IconClock } from "@tabler/icons-react"

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

export function VideoCard({ video, onDelete }: VideoCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)

  const handleDownload = async () => {
    if (!video.url || video.isGenerating) return
    
    setIsLoading(true)
    
    try {
      // Utiliser l'API proxy pour télécharger la vidéo
      const response = await fetch('/api/minio/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          url: video.url,
          filename: `video-${video.id}.mp4`
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `video-${video.id}.mp4`
        link.click()
        window.URL.revokeObjectURL(url)
      } else {
        throw new Error('Download failed')
      }
    } catch (error) {
      }
