export type CreationType = "talking-actor" | "b-rolls"

export interface Avatar {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  imageUrl: string
  type: "image" | "video"
  gender?: "male" | "female"
  age?: "young" | "adult"
  theme?: string
}

export interface Voice {
  id: string
  name: string
  gender: "male" | "female" | "neutral"
  language: string
  country: string
  flag: string
}

export interface AudioSettings {
  speed: number
  stability: number
  similarity: number
  styleExaggeration: number
}

export interface CreationTypeOption {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export interface SpeechMode {
  id: string
  label: string
}

export interface VideoFormat {
  id: string
  label: string
  ratio: string
}
