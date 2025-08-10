export interface Avatar {
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

export interface Voice {
  id: string
  name: string
  gender: "male" | "female"
  age: "young" | "adult"
  language: string
  accent: string
  previewUrl: string
}

export interface AudioSettings {
  speed: number
  stability: number
  similarity: number
  styleExaggeration: number
}

export type SpeechMode = "text-to-speech" | "speech-to-speech";
