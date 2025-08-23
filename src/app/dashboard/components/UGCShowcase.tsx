"use client"

import React, { useState } from "react"
import Image from "next/image"
import { IconPlayerPlay } from "@tabler/icons-react"

export interface UGCVideo {
  id: string
  title: string
  creator: string
  thumbnail: string
  videoUrl: string
  category: "Product" | "Avatar"
}

interface UGCShowcaseProps {
  videos: UGCVideo[]
  maxDisplayed?: number
}

export function UGCShowcase({ videos, maxDisplayed = 12 }: UGCShowcaseProps) {
  const [selectedVideo, setSelectedVideo] = useState<UGCVideo | null>(null)
  const displayedVideos = videos.slice(0, maxDisplayed)

  const openVideo = (video: UGCVideo) => {
    setSelectedVideo(video)
  }

  const closeVideo = () => {
    setSelectedVideo(null)
  }

  return (
    <>
      <div className="overflow-x-auto">
        <div className="flex gap-4" style={{ width: 'max-content' }}>
          {displayedVideos.map((video) => (
            <div 
              key={video.id}
              className="bg-card border border-border rounded-2xl overflow-hidden group cursor-pointer"
              style={{
                width: '220px',
                flexShrink: 0
              }}
              onClick={() => openVideo(video)}
            >
              <div className="relative h-72 overflow-hidden">
                <Image 
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <IconPlayerPlay className="w-6 h-6 text-white" fill="currentColor" />
                  </div>
                </div>
              </div>
              
              <div className="p-3 flex flex-col gap-1">
                <h3 className="font-semibold text-card-foreground text-sm line-clamp-2">{video.title}</h3>
                <p className="text-muted-foreground text-xs">by {video.creator}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeVideo}>
          <div className="bg-card rounded-2xl overflow-hidden max-w-sm w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <video 
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-auto aspect-[9/16]"
              >
                Your browser does not support the video tag.
              </video>
              <button 
                onClick={closeVideo}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors cursor-pointer"
              >
                ×
              </button>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <h2 className="text-lg font-bold text-card-foreground">{selectedVideo.title}</h2>
              <p className="text-muted-foreground text-sm">by {selectedVideo.creator}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}