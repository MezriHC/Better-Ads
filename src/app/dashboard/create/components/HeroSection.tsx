"use client"

import { IconSparkles } from "@tabler/icons-react"

interface HeroSectionProps {
  currentProject: { name: string } | null
}

export function HeroSection({ currentProject }: HeroSectionProps) {
  return (
    <div className="text-center pt-8 pb-8">
      {currentProject && (
        <div className="mb-2">
          <span className="text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">
            Project: {currentProject.name}
          </span>
        </div>
      )}
      <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
        Create videos with AI
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        Transform your ideas into captivating videos. Virtual actors, cinematic scenes, 
        professional b-rolls - everything is possible with just a few words.
      </p>
    </div>
  )
}
