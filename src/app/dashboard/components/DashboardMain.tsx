"use client"

import { 
  AvatarSlider, 
  FeatureCard, 
  SectionHeader,
  UGCShowcase
} from './'
import type { Avatar } from './AvatarSlider'
import type { UGCVideo } from './UGCShowcase'

interface DashboardMainProps {
  avatars: Avatar[]
  ugcVideos: UGCVideo[]
  featuredImages?: {
    talkingAvatars: string
    scenesAndBrolls: string
  }
}

export function DashboardMain({ 
  avatars, 
  ugcVideos, 
  featuredImages = {
    talkingAvatars: "/api/placeholder/400/300?type=avatars",
    scenesAndBrolls: "/api/placeholder/400/300?type=scenes"
  }
}: DashboardMainProps) {
  return (
    <div className="flex flex-col gap-8">
      
      <section className="flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FeatureCard 
            title="Talking Avatars"
            description="Create videos with AI avatars presenting your products or messages with natural speech."
            href="/dashboard/create"
            imageUrl={featuredImages.talkingAvatars}
          />
          <FeatureCard 
            title="Scenes & B-Rolls"
            description="Generate cinematic scenes and professional b-roll footage for your video projects."
            href="/dashboard/create"
            imageUrl={featuredImages.scenesAndBrolls}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeader 
          title="Discover our AI Avatars"
          description="Browse our collection of AI avatars and find the perfect one for your next video."
        />
        <AvatarSlider avatars={avatars} />
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeader 
          title="Trending UGC created with our tool"
          description="Discover inspiring videos created by our community using our AI avatars and tools."
        />
        <UGCShowcase videos={ugcVideos} />
      </section>
      
    </div>
  )
}