/**
 * @purpose: Section héro avec logique de projet et showcase vidéos
 * @domain: create
 * @scope: feature-create  
 * @created: 2025-08-22
 */

"use client"

import { useState } from 'react'
import { VideoShowcase } from '@/_shared'
import { HeroSection as HeroComponent } from '../ui/HeroSection'
import { VideoModal } from '../ui/VideoModal'
import type { VideoData } from '../ui/VideoCard'

interface HeroSectionWrapperProps {
  currentProject: { id: string; name: string } | null
}

export function HeroSectionWrapper({ currentProject }: HeroSectionWrapperProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null)

  return (
    <>
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="w-full py-8">
          <div className="max-w-6xl mx-auto px-4">
            <VideoShowcase 
              projectId={currentProject?.id} 
              onVideoPlay={setSelectedVideo}
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
}