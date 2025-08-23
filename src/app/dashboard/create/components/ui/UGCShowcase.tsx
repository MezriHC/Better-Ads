"use client"

import React, { useState } from "react"
import Image from "next/image"
import { IconPlayerPlay } from "@tabler/icons-react"

interface UGCVideo {
  id: string
  title: string
  creator: string
  thumbnail: string
  videoUrl: string
  category: "Product" | "Avatar"
}

const ugcVideos: UGCVideo[] = [
  {
    id: "1",
    title: "iPhone 15 Pro Unboxing",
    creator: "TechReview",
    thumbnail: "https://picsum.photos/400/600?random=50",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    category: "Product"
  },
  {
    id: "2", 
    title: "Fashion Haul Review",
    creator: "StyleGuru",
    thumbnail: "https://picsum.photos/400/600?random=51",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    category: "Product"
  },
  {
    id: "3",
    title: "CEO Welcome Message",
    creator: "Business Leader",
    thumbnail: "https://picsum.photos/400/600?random=52", 
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    category: "Avatar"
  },
  {
    id: "4",
    title: "Skincare Tutorial", 
    creator: "BeautyExpert",
    thumbnail: "https://picsum.photos/400/600?random=53",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    category: "Product"
  },
  {
    id: "5",
    title: "Team Introduction",
    creator: "HR Manager",
    thumbnail: "https://picsum.photos/400/600?random=54",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4", 
    category: "Avatar"
  },
  {
    id: "6",
    title: "Fitness Gear Review",
    creator: "FitInfluencer",
    thumbnail: "https://picsum.photos/400/600?random=55",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    category: "Product"
  }
]

export function UGCShowcase() {
  const [selectedVideo, setSelectedVideo] = useState<UGCVideo | null>(null)
  const displayedVideos = ugcVideos.slice(0, 6)

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