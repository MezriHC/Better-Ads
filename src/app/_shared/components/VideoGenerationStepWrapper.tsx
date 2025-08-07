"use client"

import { GenerationStep } from "./VideoGenerationStep"

interface Avatar {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  imageUrl: string
  type: "image"
  gender?: "male" | "female"
  age?: "young" | "adult"
  theme?: string
}

interface VideoGenerationStepProps {
  selectedAvatar: Avatar | null
  onBack: () => void
}

export function VideoGenerationStep({ selectedAvatar, onBack }: VideoGenerationStepProps) {
  return <GenerationStep selectedAvatar={selectedAvatar} onBack={onBack} type="video" />
}

export function ProductGenerationStep({ selectedAvatar, onBack }: VideoGenerationStepProps) {
  return <GenerationStep selectedAvatar={selectedAvatar} onBack={onBack} type="product" />
}