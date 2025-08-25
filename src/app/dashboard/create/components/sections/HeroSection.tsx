"use client"

import { useState, useRef, useImperativeHandle, forwardRef } from 'react'
import { VideoShowcase, type VideoShowcaseRef } from '@/_shared'
import { HeroSection as HeroComponent } from '../ui/HeroSection'
import { VideoModal } from '../ui/VideoModal'
import type { VideoData } from '../ui/VideoCard'

interface HeroSectionWrapperProps {
  currentProject: { id: string; name: string } | null
}

export interface HeroSectionWrapperRef {
  refreshAvatars: () => Promise<void>
}

export const HeroSectionWrapper = forwardRef<HeroSectionWrapperRef, HeroSectionWrapperProps>(function HeroSectionWrapper({ currentProject }, ref) {
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null)
  const videoShowcaseRef = useRef<VideoShowcaseRef>(null)

  const handleVideoPlay = (video: VideoData) => {
    setSelectedVideo(video)
  }

  useImperativeHandle(ref, () => ({
    refreshAvatars: async () => {
      if (videoShowcaseRef.current) {
        await videoShowcaseRef.current.refreshAvatars()
      }
    }
  }), [])

  return (
    <>
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="w-full py-8">
          <div className="max-w-6xl mx-auto px-4">
            <VideoShowcase 
              ref={videoShowcaseRef}
              projectId={currentProject?.id} 
              onVideoPlay={handleVideoPlay}
              heroSection={
                <div className="flex items-center justify-center min-h-[50vh]">
                  <HeroComponent currentProject={currentProject} />
                </div>
              }
            />
          </div>
        </div>
      </div>

      <VideoModal
        video={selectedVideo}
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </>
  )
})